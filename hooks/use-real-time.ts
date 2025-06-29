"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { io, type Socket } from "socket.io-client"
import { toast } from "sonner"
import { useSound } from "./use-sound";

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  chatId: string;
  websiteName: string;
}

interface UseRealTimeProps {
  user: any;
  userType: 'owner' | 'staff';
}

const SESSION_STORAGE_LIVE_ACTIVITY_KEY = "liveActivityNotifications";
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL_MS = 3000; // 3 seconds for retries

export function useRealTime({ user, userType }: UseRealTimeProps = { user: null, userType: 'owner' }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isCurrentlyConnected, setIsCurrentlyConnected] = useState(false);
  const [isAttemptingConnection, setIsAttemptingConnection] = useState(false); // True while actively trying to connect/reconnect
  const [hasShownInitialConnectToast, setHasShownInitialConnectToast] = useState(false);
  const [staffListUpdated, setStaffListUpdated] = useState(null); 
  const playNotificationSound = useSound('/sounds/notification.wav');
  const playNewChatSound = useSound('/sounds/new_chat.wav');

  const [liveNotifications, setLiveNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const storedNotifications = sessionStorage.getItem(SESSION_STORAGE_LIVE_ACTIVITY_KEY);
      if (storedNotifications) {
        try {
          const parsed = JSON.parse(storedNotifications) as NotificationItem[];
          return parsed.map(n => ({ ...n, timestamp: new Date(n.timestamp) }));
        } catch (e) {
          console.error("Failed to parse live notifications from session storage", e);
          return [];
        }
      }
    }
    return [];
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(false); // To prevent state updates on unmounted component

  // Effect to track component mount status
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Effect to save liveNotifications to sessionStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_STORAGE_LIVE_ACTIVITY_KEY, JSON.stringify(liveNotifications));
    }
  }, [liveNotifications]);

  // Callback to clear all pending reconnect timers and reset attempts
  const clearReconnectMechanisms = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    reconnectAttemptsRef.current = 0;
  }, []); // No dependencies, so this useCallback is stable

  // Main Effect: Responsible for creating the socket instance and attaching ALL its listeners
  // This effect runs only when user or userType changes significantly.
  useEffect(() => {
    // Check if connection criteria are met (user and relevant IDs exist)
    let connectionCriteriaMet = false;
    let queryParams: { [key: string]: string } = {};

    if (userType === 'owner' && user && Array.isArray(user.websites) && user.websites.length > 0) {
      connectionCriteriaMet = true;
      queryParams = { dashboardUser: user._id, userEmail: user.email };
      console.log("useRealTime: Owner criteria met.");
    } else if (userType === 'staff' && user && user.id && user.websiteId) {
      connectionCriteriaMet = true;
      queryParams = { staffId: user.id, websiteId: user.websiteId, isStaff: 'true', staffName: user.name || 'Unknown Staff' };
      console.log("useRealTime: Staff criteria met.");
    } else {
      console.log("useRealTime: Connection criteria NOT met for user type:", userType, "User data:", user);
    }

    if (!connectionCriteriaMet) {
      // If criteria are not met, ensure no socket is active from previous states
      if (socketRef.current) {
        console.log("useRealTime: Criteria unmet, ensuring socket disconnect.");
        socketRef.current.disconnect(); // This will trigger 'disconnect' handler and cleanup
        socketRef.current = null;
      }
      if (isMounted.current) {
        setSocket(null);
        setIsCurrentlyConnected(false);
        setIsAttemptingConnection(false);
      }
      clearReconnectMechanisms(); // Clear any existing retry timers
      return; // Exit early if no connection is desired
    }

    // --- Create and manage the socket instance ---
    // Only create a new socket if one doesn't exist or if it's explicitly disconnected and needs re-init
    // The `forceNew: false` by default is important to reuse existing connections if possible.
    // However, if the user object changes (e.g. login/logout), we might need a fresh instance.
    let currentSocketInstance = socketRef.current;

    if (!currentSocketInstance || !currentSocketInstance.connected || currentSocketInstance.io.opts.query.dashboardUser !== queryParams.dashboardUser || currentSocketInstance.io.opts.query.staffId !== queryParams.staffId) {
        // If no socket, or if current socket's query params are different (e.g., user changed), or if it's explicitly disconnected, create new
        if (currentSocketInstance) {
            console.log("useRealTime: User/type changed or existing socket stale, disconnecting old socket before new one.");
            currentSocketInstance.disconnect(); // Clean up old socket explicitly
            currentSocketInstance = null;
        }
        console.log("useRealTime: Creating new Socket.IO instance for connection.");
        currentSocketInstance = io(`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "")}`, {
            query: queryParams,
            reconnection: false, // We handle reconnection logic manually
        });
        if (isMounted.current) setSocket(currentSocketInstance);
        socketRef.current = currentSocketInstance;
    } else if (currentSocketInstance && !currentSocketInstance.connected && !isAttemptingConnection) {
        // If socket instance exists but is disconnected and we're not already trying to connect, connect it.
        console.log("useRealTime: Existing socket instance found but disconnected, attempting to connect.");
        currentSocketInstance.connect(); // This will trigger the 'connect' event listener if successful
        if (isMounted.current) setIsAttemptingConnection(true);
    } else {
        console.log("useRealTime: Socket instance already in desired state (connected or attempting).");
    }

    // --- Attach Event Listeners (Only attach once per socket instance) ---
    // Use a flag or check if listeners are already attached to this specific socket instance.
    // We'll rely on the fact that these 'on' calls happen once per new `currentSocketInstance`.
    const setupSocketListeners = (sock: Socket) => {
        sock.off(); // Remove all old listeners to prevent duplicates for this socket instance
        
        sock.on("connect", () => {
            console.log(`useRealTime: ${userType} connected to real-time server`);
            if (isMounted.current) {
                setIsCurrentlyConnected(true);
                setIsAttemptingConnection(false);
            }
            clearReconnectMechanisms(); // Clear retries on success
            if (!hasShownInitialConnectToast) {
                // toast.success("🔴 Live updates enabled");
                if (isMounted.current) setHasShownInitialConnectToast(true);
            }
        });

        sock.on("disconnect", (reason) => {
            console.log(`useRealTime: ${userType} disconnected from real-time server:`, reason);
            if (isMounted.current) setIsCurrentlyConnected(false); // Immediately reflect disconnected state

            // Only attempt reconnect if it's an unexpected disconnect
            if (reason !== 'io client disconnect' && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                console.log(`useRealTime: Disconnect reason: ${reason}. Retrying connection... Attempt #${reconnectAttemptsRef.current + 1}`);
                if (isMounted.current) setIsAttemptingConnection(true); // Indicate we are retrying
                reconnectAttemptsRef.current++;
                reconnectTimerRef.current = setTimeout(() => {
                    sock.connect(); // Try to connect the existing socket instance
                }, RECONNECT_INTERVAL_MS * reconnectAttemptsRef.current); // Backoff strategy
            } else {
                console.log(`useRealTime: Deliberate disconnect (${reason}) or max attempts reached.`);
                if (isMounted.current) {
                    setIsAttemptingConnection(false); // Stop showing connecting
                    setIsCurrentlyConnected(false); // Ensure disconnected state
                    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
                         toast.error(`❌ Connection failed after ${MAX_RECONNECT_ATTEMPTS} attempts.`);
                    } else if (reason !== 'io client disconnect') {
                        // Show generic disconnect toast only for unexpected disconnects not followed by successful reconnect
                        toast.error(`❌ Disconnected from live chat system.`);
                    }
                }
                clearReconnectMechanisms(); // Ensure timers are clear
            }
        });

        sock.on("connect_error", (error) => {
            console.error(`useRealTime: Socket connect error:`, error);
            if (isMounted.current) setIsCurrentlyConnected(false); // Immediately reflect disconnected state

            if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                console.log(`useRealTime: Connect error. Retrying connection... Attempt #${reconnectAttemptsRef.current + 1}`);
                if (isMounted.current) setIsAttemptingConnection(true); // Indicate retrying
                reconnectAttemptsRef.current++;
                reconnectTimerRef.current = setTimeout(() => {
                    sock.connect(); // Try to connect the existing socket instance
                }, RECONNECT_INTERVAL_MS * reconnectAttemptsRef.current); // Backoff strategy
            } else {
                console.log(`useRealTime: Max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached for connect_error.`);
                if (isMounted.current) {
                    setIsAttemptingConnection(false);
                    toast.error(`❌ Connection failed after multiple attempts.`);
                }
                clearReconnectMechanisms();
            }
        });

        sock.on("new_message", (data) => {
            const { chatId, message, websiteName, chatName, botResponse, staffId } = data;
            let newNotification: NotificationItem | null = null;
            if (message && message.sender === "user") {
                newNotification = { id: Date.now(), type: "message", title: `New message in ${chatName}`, description: `${websiteName}: ${message.text.substring(0, 50)}...`, timestamp: new Date(), chatId, websiteName, };

                console.log("Message", message)
                if(!message.silent) {
                  if(user.preferences) {
                    console.log(user.preferences)
                    if(user.preferences.sound) {
                      playNotificationSound()
                    }
                  } else {
                    // If there is no preferances, than check if the current chta message leading staff is current staff
                    if(user.id === staffId) { 
                      playNotificationSound()
                    }
                  }
                  if(user.preferences) {
                    if(user.preferences.toasts) {
                      toast.info(`💬 New message from ${chatName}`, { description: message.text.substring(0, 100), });
                    }
                  } else {
                    // If there is no preferances, than check if the current chta message leading staff is current staff
                    if(user.id === staffId) {
                      toast.info(`💬 New message from ${chatName}`, { description: message.text.substring(0, 100), });
                    }
                  }

                }
            } else if (botResponse && (botResponse.sender === "bot" || botResponse.sender === "ai")) {
                newNotification = { id: Date.now(), type: "bot_message", title: `New bot response in ${chatName}`, description: `${websiteName}: ${botResponse.text.substring(0, 50)}...`, timestamp: new Date(), chatId, websiteName, };
                // toast.info(`🤖 Bot replied in ${chatName}`, { description: botResponse.text.substring(0, 100), });
            }
            if (newNotification) {
                if (isMounted.current) setLiveNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);
                if (isMounted.current) setUnreadCount((prev) => prev + 1);
            }
        });

        sock.on("new_chat", (data) => {
            const { chat, websiteName } = data;
            const newNotification: NotificationItem = { id: Date.now(), type: "chat", title: "New conversation started", description: `${websiteName}: ${chat.name} (${chat.email})`, timestamp: new Date(), chatId: chat._id, websiteName, };
            if (isMounted.current) setLiveNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);
            if (isMounted.current) setUnreadCount((prev) => prev + 1);

            if(user.preferences) {
              if(user.preferences.sound) {
                playNewChatSound()
              }
            } else {
              playNewChatSound()
            }
            if(user.preferences) {
              if(user.preferences.toasts) {
                toast.success(`🆕 New conversation started`, { description: `${chat.name} on ${websiteName}`, });
              }
            } else {
              toast.success(`🆕 New conversation started`, { description: `${chat.name} on ${websiteName}`, });
            }
        });

        sock.on("staff_added", (data) => {
          const { message, staff } = data;
          if (isMounted.current) {
            // Show a notification
            toast.success("✅ Staff Updated", {
              description: message,
            });
            setStaffListUpdated(staff);
          }
        });
    };

    if (currentSocketInstance) {
        setupSocketListeners(currentSocketInstance); // Setup listeners for the current instance
        // Initiate connection if not already connected (e.g., initial load or after a manual disconnect/cleanup)
        if (!currentSocketInstance.connected && !isAttemptingConnection) {
            console.log("useRealTime: Initializing connection attempt for the socket instance.");
            currentSocketInstance.connect(); // Trigger connect
            if (isMounted.current) setIsAttemptingConnection(true);
        }
    }


    // Cleanup function for this useEffect: runs on unmount or when dependencies change significantly
    return () => {
      console.log("useRealTime: Main useEffect cleanup function triggered.");
      clearReconnectMechanisms(); // Always clear any pending timers on cleanup

      if (socketRef.current) {
        // Disconnect with 'io client disconnect' reason which signals no auto-retry
        console.log("useRealTime: Disconnecting socket on cleanup.");
        socketRef.current.disconnect();
        socketRef.current = null; // Clear ref
      }
      // Reset all states related to connection status
      if (isMounted.current) {
        setSocket(null);
        setIsCurrentlyConnected(false);
        setIsAttemptingConnection(false);
      }
    };
  }, [user, userType, clearReconnectMechanisms, hasShownInitialConnectToast]); // Dependencies: only re-run if user/userType changes

  const clearNotifications = () => {
    setLiveNotifications([]);
    setUnreadCount(0);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_STORAGE_LIVE_ACTIVITY_KEY);
    }
  };

  // isConnected for UI: True if socket is connected OR actively attempting reconnection.
  const isConnectedForUI = isCurrentlyConnected || isAttemptingConnection; // Simpler check for UI
  // isLoading for UI: True during the initial connection handshake or active retry backoff, before actual connection.
  const isLoadingForUI = isAttemptingConnection && !isCurrentlyConnected;

  console.log("useRealTime: Rendering. isConnectedForUI:", isConnectedForUI, "isLoadingForUI:", isLoadingForUI, "isCurrentlyConnected:", isCurrentlyConnected, "isAttemptingConnection:", isAttemptingConnection, "Attempts:", reconnectAttemptsRef.current);

  return {
    socket,
    isConnected: isConnectedForUI,
    isLoading: isLoadingForUI,
    liveNotifications,
    unreadCount,
    clearNotifications,
    liveRecentActivity: liveNotifications,
    staffListUpdated,
  };
}