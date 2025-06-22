"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Brain, UserCheck, UserX, XCircle, ArrowLeft, MoreVertical, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Message } from "./message"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authFetch } from "@/lib/authFetch"

interface ChatMessage {
  sender: string
  text: string
  timestamp: string
  url?: string
}

interface ChatViewProps {
  chat: {
    _id: string
    name: string
    email: string
    messages: string
    status: string
    aiResponsesEnabled: boolean
    createdAt: string
    updatedAt: string
    leadingStaff?: {
      _id: string
      name: string
    } | null
  } | null
  website: {
    _id: string
    name: string
    link: string
    description: string
  }
  socket: any
  onUpdateChats: (updater: (chats: any[]) => any[]) => void
  isStaff?: boolean
  staffInfo?: {
    id: string
    name: string
    email: string
    websiteId: string
  }
  dashboardUserId?: string
  onBackToList?: () => void
  isVisible?: boolean
}

export function ChatView({
  chat,
  website,
  socket,
  onUpdateChats,
  isStaff = false,
  staffInfo,
  dashboardUserId,
  onBackToList,
  isVisible = true,
}: ChatViewProps) {
  const [messageInput, setMessageInput] = useState("")
  const [aiResponsesEnabled, setAiResponsesEnabled] = useState(chat?.aiResponsesEnabled ?? true)
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([])
  const [isTogglingAI, setIsTogglingAI] = useState(false) // New state for loading
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [showCloseChatModal, setShowCloseChatModal] = useState(false)

  const currentUserId = isStaff ? staffInfo?.id : dashboardUserId
  const currentUserType = isStaff ? "staff" : "owner"
  const currentUserName = isStaff ? staffInfo?.name : "Owner"

  const getInitials = (name: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    if (chat) {
      try {
        const messages: ChatMessage[] = JSON.parse(chat.messages || "[]")
        setCurrentMessages(messages)
        setAiResponsesEnabled(chat.aiResponsesEnabled ?? true)
        setTimeout(scrollToBottom, 100)
      } catch (error) {
        console.error("Error parsing chat messages:", error)
        setCurrentMessages([])
      }
    } else {
      setCurrentMessages([])
    }
  }, [chat])

  useEffect(() => {
    if (!socket || !chat) return

    const handleChatUpdate = (data: {
      chatId: string
      aiResponsesEnabled?: boolean
      message?: string
      sender?: string
      status?: string
      leadingStaff?: { _id: string; name: string } | null
    }) => {
      if (data.chatId === chat._id) {
        console.log("Received chat_update:", data) // Debug log

        // Update AI responses state immediately when received from socket
        if (typeof data.aiResponsesEnabled === "boolean") {
          console.log("Updating AI responses enabled to:", data.aiResponsesEnabled) // Debug log
          setAiResponsesEnabled(data.aiResponsesEnabled)
          setIsTogglingAI(false) // Stop loading state
        }

        if (data.status || data.leadingStaff !== undefined) {
          onUpdateChats((prevChats) =>
            prevChats.map((c) => {
              if (c._id === data.chatId) {
                return {
                  ...c,
                  ...(data.status && { status: data.status }),
                  ...(data.leadingStaff !== undefined && { leadingStaff: data.leadingStaff }),
                  ...(data.aiResponsesEnabled !== undefined && { aiResponsesEnabled: data.aiResponsesEnabled }),
                  updatedAt: new Date().toISOString(),
                }
              }
              return c
            }),
          )
        }

        if (data.message) {
          setCurrentMessages((prevMessages) => {
            const systemMessage: ChatMessage = {
              sender: data.sender || "system",
              text: data.message,
              timestamp: new Date().toISOString(),
            }
            if (!prevMessages.some((m) => m.text === systemMessage.text && m.timestamp === systemMessage.timestamp)) {
              return [...prevMessages, systemMessage]
            }
            return prevMessages
          })
        }
        setTimeout(scrollToBottom, 100)
      }
    }

    // Enhanced socket event listener with better error handling
    const handleSocketError = (error: any) => {
      console.error("Socket error:", error)
      setIsTogglingAI(false) // Reset loading state on error
      toast.error("Connection error. Please try again.")
    }

    const handleSocketDisconnect = () => {
      console.log("Socket disconnected")
      setIsTogglingAI(false) // Reset loading state on disconnect
    }

    socket.on("chat_update", handleChatUpdate)
    socket.on("error", handleSocketError)
    socket.on("disconnect", handleSocketDisconnect)

    return () => {
      socket.off("chat_update", handleChatUpdate)
      socket.off("error", handleSocketError)
      socket.off("disconnect", handleSocketDisconnect)
    }
  }, [socket, chat, onUpdateChats])

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  // Enhanced AI toggle function with better error handling and loading states
  const toggleAiResponses = async () => {
    if (!chat || !socket || !currentUserId) {
      toast.error("Unable to toggle AI responses - missing required data")
      return
    }

    if (isTogglingAI) {
      toast.info("AI toggle already in progress...")
      return
    }

    try {
      setIsTogglingAI(true) // Start loading state
      const newAiState = !aiResponsesEnabled

      console.log("Toggling AI responses:", {
        chatId: chat._id,
        enable: newAiState,
        userId: currentUserId,
        isStaff: isStaff,
      }) // Debug log

      // Emit the toggle event to socket
      socket.emit("toggle_ai_responses", {
        chatId: chat._id,
        enable: newAiState,
        userId: currentUserId,
        isStaff: isStaff,
      })

      // Set a timeout to reset loading state if no response received
      const timeoutId = setTimeout(() => {
        if (isTogglingAI) {
          setIsTogglingAI(false)
          toast.error("AI toggle request timed out. Please try again.")
        }
      }, 10000) // 10 second timeout

      // Store timeout ID to clear it if response comes back
      socket.toggleTimeoutId = timeoutId

      toast.info(`${newAiState ? "Enabling" : "Disabling"} AI responses...`)
    } catch (err) {
      console.error("Error toggling AI responses:", err)
      setIsTogglingAI(false)
      toast.error("Failed to toggle AI responses")
    }
  }

  const handleMessageSend = async () => {
    if (!chat || !messageInput.trim()) return
    if (chat.status === "closed") {
      toast.error("Cannot send messages to a closed conversation")
      setMessageInput("")
      return
    }

    let senderType: string
    if (isStaff && staffInfo?.name) {
      senderType = `staff-${staffInfo.name}`
    } else if (dashboardUserId) {
      senderType = "owner"
    } else {
      senderType = "owner"
    }

    const newMessage: ChatMessage = {
      sender: senderType,
      text: messageInput,
      timestamp: new Date().toISOString(),
    }

    setCurrentMessages((prevMessages) => [...prevMessages, newMessage])
    setMessageInput("")
    setTimeout(scrollToBottom, 50)

    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chats/${chat._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: JSON.stringify([...JSON.parse(chat.messages || "[]"), newMessage]) }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        toast.error(`Failed to send message: ${errorData.message || "Unknown error"}`)
        setCurrentMessages((prevMessages) =>
          prevMessages.filter(
            (msg) =>
              !(
                msg.sender === newMessage.sender &&
                msg.text === newMessage.text &&
                msg.timestamp === newMessage.timestamp
              ),
          ),
        )
        return
      }

      if (socket) {
        socket.emit("dashboard_message", {
          chatId: chat._id,
          message: newMessage,
          websiteName: website?.name,
          chatName: chat.name,
        })
      }

      onUpdateChats((prevChats) =>
        prevChats
          .map((c) =>
            c._id === chat._id
              ? {
                  ...c,
                  messages: JSON.stringify([...JSON.parse(c.messages || "[]"), newMessage]),
                  updatedAt: new Date().toISOString(),
                }
              : c,
          )
          .sort(
            (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
          ),
      )

      toast.success("Message sent!")
    } catch (err) {
      console.error("Error sending message:", err)
      toast.error("Failed to send message")
      setCurrentMessages((prevMessages) =>
        prevMessages.filter(
          (msg) =>
            !(
              msg.sender === newMessage.sender &&
              msg.text === newMessage.text &&
              msg.timestamp === newMessage.timestamp
            ),
        ),
      )
    }
  }

  const handleCloseChatClick = () => {
    if (chat?.status === "closed") return
    setShowCloseChatModal(true)
  }

  const handleConfirmCloseChat = async () => {
    if (!chat || !socket) {
      toast.error("Unable to close chat")
      setShowCloseChatModal(false)
      return
    }

    try {
      const closerId = currentUserId
      const closerType = currentUserType
      const closerName = currentUserName

      if (!closerId) {
        toast.error("Error: Could not identify chat closer")
        setShowCloseChatModal(false)
        return
      }

      socket.emit("close_chat", {
        chatId: chat._id,
        closerId,
        closerType,
        closerName,
        websiteId: website._id,
      })

      onUpdateChats((prevChats) =>
        prevChats.map((c) =>
          c._id === chat._id ? { ...c, status: "closed", updatedAt: new Date().toISOString() } : c,
        ),
      )
      setAiResponsesEnabled(false)
      setMessageInput("")

      toast.success("Chat closed successfully")
      setShowCloseChatModal(false)
    } catch (error) {
      console.error("Error closing chat:", error)
      toast.error("Failed to close chat")
      setShowCloseChatModal(false)
    }
  }

  const handleJoinChat = async () => {
    if (!chat || chat.status === "closed" || !socket || !currentUserId) {
      toast.error("Unable to join chat")
      return
    }

    try {
      socket.emit("assign_chat_lead", {
        chatId: chat._id,
        assigneeId: currentUserId,
        assigneeName: currentUserName,
        assigneeType: currentUserType,
        websiteId: website._id,
      })
      toast.info("Join request sent")
    } catch (error) {
      console.error("Error joining chat:", error)
      toast.error("Failed to join chat")
    }
  }

  const handleLeaveChat = async () => {
    if (!chat || chat.status === "closed" || !socket || !currentUserId || chat.leadingStaff?._id !== currentUserId) {
      toast.error("Unable to leave chat")
      return
    }

    try {
      socket.emit("unassign_chat_lead", {
        chatId: chat._id,
        assigneeId: currentUserId,
        assigneeType: currentUserType,
        websiteId: website._id,
      })
      toast.info("Leave request sent")
    } catch (error) {
      console.error("Error leaving chat:", error)
      toast.error("Failed to leave chat")
    }
  }

  const handleRemoveStaff = async () => {
    if (!chat || chat.status === "closed" || !socket || !chat.leadingStaff || isStaff) {
      toast.error("Unable to remove staff")
      return
    }

    try {
      socket.emit("unassign_chat_lead", {
        chatId: chat._id,
        assigneeId: chat.leadingStaff._id,
        assigneeType: "staff",
        websiteId: website._id,
        actionBy: "owner",
      })
      toast.info("Remove staff request sent")
    } catch (error) {
      console.error("Error removing staff:", error)
      toast.error("Failed to remove staff")
    }
  }

  const isCurrentUserLeading = chat?.leadingStaff?._id === currentUserId
  const isSomeoneElseLeading = chat?.leadingStaff && chat.leadingStaff._id !== currentUserId
  const isInputDisabled = chat?.status === "closed" || (isStaff && isSomeoneElseLeading)

  const shouldShowJoinButtonForStaff = isStaff && chat?.status === "open" && !isCurrentUserLeading
  const shouldShowRemoveStaffButtonForOwner =
    !isStaff && chat?.leadingStaff && chat.leadingStaff.name !== "Owner" && chat.status === "open"

  if (!chat) {
    return (
      <Card
        className={`flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white m-6 border-slate-200 shadow-sm ${
          isVisible ? "flex" : "hidden md:flex"
        }`}
      >
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a conversation</h3>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            Choose a conversation from the sidebar to view messages and respond to your customers.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`flex-1 flex flex-col bg-white ${isVisible ? "flex" : "hidden md:flex"}`}>
      {/* Close Chat Modal */}
      {showCloseChatModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-0">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Close Conversation</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Are you sure you want to close this conversation? The customer will no longer be able to send messages.
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowCloseChatModal(false)} className="flex-1 rounded-xl">
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmCloseChat}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  Close Chat
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="p-4 md:p-6 border-b border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
            {/* Mobile back button */}
            {onBackToList && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToList}
                className="md:hidden p-2 hover:bg-slate-100 rounded-full flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Button>
            )}

            <div className="relative flex-shrink-0">
              <Avatar className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 ring-2 ring-emerald-100">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-sm md:text-base">
                  {getInitials(chat.name)}
                </AvatarFallback>
              </Avatar>
              {chat.status === "open" && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base md:text-lg font-semibold text-slate-900 truncate">{chat.name}</h3>
              <p className="text-xs md:text-sm text-slate-500 flex items-center space-x-2 truncate">
                <span className="font-medium truncate">{chat.email}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{formatTime(chat.updatedAt || chat.createdAt)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            {chat.status === "open" && (
              <>
                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAiResponses}
                    disabled={isTogglingAI}
                    className={`rounded-xl transition-all text-sm min-w-[80px] ${
                      aiResponsesEnabled
                        ? "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border-violet-200 hover:from-violet-100 hover:to-purple-100"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    } ${isTogglingAI ? "opacity-75 cursor-not-allowed" : ""}`}
                  >
                    {isTogglingAI ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4 mr-2" />
                    )}
                    AI {isTogglingAI ? "..." : aiResponsesEnabled ? "ON" : "OFF"}
                  </Button>

                  {shouldShowJoinButtonForStaff && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleJoinChat}
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 rounded-xl text-sm"
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  )}

                  {isCurrentUserLeading && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLeaveChat}
                      className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 rounded-xl text-sm"
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      Leave
                    </Button>
                  )}

                  {shouldShowRemoveStaffButtonForOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveStaff}
                      className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 rounded-xl text-sm"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>

                {/* Mobile Actions Dropdown */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full w-8 h-8 p-0 border-slate-200 hover:bg-slate-100"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-slate-200">
                      <DropdownMenuItem
                        onClick={toggleAiResponses}
                        disabled={isTogglingAI}
                        className="flex items-center space-x-2 rounded-lg"
                      >
                        {isTogglingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                        <span>
                          {isTogglingAI ? "Toggling AI..." : aiResponsesEnabled ? "Turn AI Off" : "Turn AI On"}
                        </span>
                      </DropdownMenuItem>

                      {shouldShowJoinButtonForStaff && (
                        <DropdownMenuItem
                          onClick={handleJoinChat}
                          className="flex items-center space-x-2 rounded-lg text-blue-700"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Join Chat</span>
                        </DropdownMenuItem>
                      )}

                      {isCurrentUserLeading && (
                        <DropdownMenuItem
                          onClick={handleLeaveChat}
                          className="flex items-center space-x-2 rounded-lg text-amber-700"
                        >
                          <UserX className="w-4 h-4" />
                          <span>Leave Chat</span>
                        </DropdownMenuItem>
                      )}

                      {shouldShowRemoveStaffButtonForOwner && (
                        <DropdownMenuItem
                          onClick={handleRemoveStaff}
                          className="flex items-center space-x-2 rounded-lg text-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Remove Staff</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleCloseChatClick}
                        className="flex items-center space-x-2 rounded-lg text-red-700"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Close Chat</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Status indicators for mobile */}
                {isSomeoneElseLeading && (
                  <Badge className="bg-slate-100 text-slate-600 border-slate-200 px-2 py-1 rounded-full text-xs md:hidden">
                    <UserCheck className="w-3 h-3 mr-1" />
                    <span className="truncate max-w-[60px]">{chat.leadingStaff?.name}</span>
                  </Badge>
                )}
              </>
            )}

            {/* Chat Status Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={chat.status === "open" ? handleCloseChatClick : undefined}
              disabled={chat.status === "closed"}
              className={`rounded-xl font-medium transition-all text-xs md:text-sm ${
                chat.status === "open"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
              }`}
            >
              {chat.status === "open" ? "Open" : "Closed"}
            </Button>
          </div>
        </div>
      </div>

      {shouldShowJoinButtonForStaff ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCheck className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Join this conversation</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              This chat is currently unassigned or handled by another staff member. Join to respond to the customer.
            </p>
            <Button
              onClick={handleJoinChat}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2"
              disabled={chat.status === "closed" || isSomeoneElseLeading}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Join Chat
            </Button>
            {isSomeoneElseLeading && (
              <p className="text-sm text-slate-400 mt-3">Currently handled by {chat.leadingStaff?.name}</p>
            )}
          </CardContent>
        </div>
      ) : (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 h-0 bg-gradient-to-b from-slate-50/30 to-white" ref={scrollAreaRef}>
            <div className="p-4 md:p-6 space-y-4">
              {currentMessages.map((msg, index) => (
                <Message
                  key={`${msg.timestamp}-${index}-${msg.sender}`}
                  message={msg}
                  chatName={chat.name}
                  chatEmail={chat.email}
                  isStaff={isStaff}
                  staffInfo={staffInfo}
                  dashboardUserId={dashboardUserId}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          {chat.status === "open" ? (
            <div className="p-4 md:p-6 border-t border-slate-100 bg-white flex-shrink-0">
              <div className="flex space-x-3 md:space-x-4">
                <Input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={
                    isInputDisabled
                      ? chat?.leadingStaff
                        ? `Chat handled by ${chat.leadingStaff.name}`
                        : "This chat is closed."
                      : "Type your message..."
                  }
                  className={`flex-1 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl py-3 text-sm md:text-base ${
                    isInputDisabled ? "cursor-not-allowed bg-slate-100" : ""
                  }`}
                  onKeyPress={(e) => e.key === "Enter" && !isInputDisabled && handleMessageSend()}
                  disabled={isInputDisabled}
                />
                <Button
                  onClick={handleMessageSend}
                  disabled={isInputDisabled || !messageInput.trim()}
                  className={`rounded-xl px-4 md:px-6 shadow-lg transition-all min-w-[44px] ${
                    isStaff
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                  } text-white disabled:opacity-50`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-t border-slate-100 p-6 md:p-8 text-center flex-shrink-0 bg-slate-50">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium text-sm md:text-base">This conversation has been closed</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
