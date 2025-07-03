"use client"

import { useState, useEffect } from "react"
import { ConversationsList } from "../conversations/conversations-list"
import { ChatView } from "../conversations/chat-view"
import { toast } from "sonner"
import { useRealTime } from "@/hooks/use-real-time"
import { authFetch } from "@/lib/authFetch"

export function StaffDashboard({ websiteId, chatId }: { websiteId: string, chatId: string }) {
  const [chats, setChats] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [website, setWebsite] = useState<any>(null)
  const [staff, setStaff] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showChatView, setShowChatView] = useState(false) // Mobile state

  const { socket } = useRealTime({ user: staff, userType: "staff" })

  useEffect(() => {
    const token = localStorage.getItem("staffToken")
    const staffData = localStorage.getItem("staffData")

    if (!token || !staffData) {
      window.location.href = "/staff/login"
      return
    }

    const parsedStaff = JSON.parse(staffData)
    setStaff(parsedStaff)

    console.log("Staff Data Loaded:", parsedStaff)

    if (parsedStaff.websiteId) {
      loadWebsiteData(parsedStaff.websiteId)
      loadChats(parsedStaff.id, parsedStaff.websiteId, token)
    } else {
      console.error("Staff data is missing websiteId.")
      setLoading(false)
      toast.error("Staff account is missing website association.")
    }
  }, [])

  useEffect(() => {
    if (!socket || !staff) {
      console.log("StaffDashboard useEffect for socket listeners: Socket or staff not ready.")
      return
    }

    console.log("StaffDashboard useEffect: Attaching socket listeners.")

    const handleNewChat = (data: any) => {
      console.log("StaffDashboard: Received new_chat from socket:", data)
      setChats((prev) => {
        const newChats = [data.chat, ...prev.filter((c) => c._id !== data.chat._id)]
        return newChats.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
        )
      })
      toast.info(`💬 New conversation started: ${data.chat.name}`)
    }

    const handleNewMessage = (data: any) => {
      const { chatId, message, botResponse } = data
      console.log("StaffDashboard: Received new_message from socket:", data)

      setChats((prev) => {
        const updatedChats = prev.map((chat) => {
          if (chat._id === chatId) {
            const currentMessages = JSON.parse(chat.messages || "[]")
            const newMessages = [...currentMessages]

            if (
              message &&
              !newMessages.some(
                (m) => m.timestamp === message.timestamp && m.sender === message.sender && m.text === message.text,
              )
            ) {
              newMessages.push(message)
            }
            if (
              botResponse &&
              !newMessages.some(
                (m) =>
                  m.timestamp === botResponse.timestamp &&
                  m.sender === botResponse.sender &&
                  m.text === botResponse.text,
              )
            ) {
              newMessages.push(botResponse)
            }

            const updatedChat = {
              ...chat,
              messages: JSON.stringify(newMessages),
              updatedAt: new Date().toISOString(),
            }

            if (selectedChat && selectedChat._id === chatId) {
              console.log("StaffDashboard: Updating selectedChat due to new message.")
              setSelectedChat(updatedChat)
            }
            return updatedChat
          }
          return chat
        })

        return updatedChats.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
        )
      })

      if (message && message.sender === "user" && data.chatId !== selectedChat?._id) {
        toast.info(`💬 New message from ${data.chatName || data.chatId}`, {
          description: message.text.substring(0, 100),
        })
      }
    }

    const handleChatUpdate = (data: {
      chatId: string
      aiResponsesEnabled?: boolean
      message?: string
      sender?: string
      status?: string
      leadingStaff?: { _id: string; name: string } | null
    }) => {
      console.log("StaffDashboard: Received chat_update from socket:", data)
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id === data.chatId) {
            const newChat = {
              ...chat,
              ...(data.status && { status: data.status }),
              ...(data.leadingStaff !== undefined && { leadingStaff: data.leadingStaff }),
              ...(data.aiResponsesEnabled !== undefined && { aiResponsesEnabled: data.aiResponsesEnabled }),
              updatedAt: new Date().toISOString(),
            }

            if (data.message) {
              const currentMessages = JSON.parse(newChat.messages || "[]")
              const systemMessage = {
                sender: data.sender || "system",
                text: data.message,
                timestamp: new Date().toISOString(),
              }
              if (
                !currentMessages.some(
                  (m: any) => m.text === systemMessage.text && m.timestamp === systemMessage.timestamp,
                )
              ) {
                newChat.messages = JSON.stringify([...currentMessages, systemMessage])
              }
            }

            if (selectedChat && selectedChat._id === data.chatId) {
              console.log("StaffDashboard: Updating selectedChat due to chat_update.")
              setSelectedChat(newChat)
            }
            return newChat
          }
          return chat
        })
        return updatedChats.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
        )
      })

      if (data.message && (data.message.includes("assigned") || data.message.includes("unassigned"))) {
        toast.info(`🔔 Chat Update: ${data.message}`)
      }
    }

    socket.on("new_chat", handleNewChat)
    socket.on("new_message", handleNewMessage)
    socket.on("chat_update", handleChatUpdate)

    return () => {
      console.log("StaffDashboard useEffect: Cleaning up socket listeners.")
      socket.off("new_chat", handleNewChat)
      socket.off("new_message", handleNewMessage)
      socket.off("chat_update", handleChatUpdate)
    }
  }, [socket, staff, selectedChat])

  const loadWebsiteData = async (websiteId: string) => {
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/${websiteId}`)
      if (res.ok) {
        const websiteData = await res.json()
        setWebsite(websiteData)
      } else {
        console.error("Failed to fetch website data:", res.status, res.statusText)
        toast.error("Failed to load website details.")
      }
    } catch (err) {
      console.error("Failed to load website data:", err)
      toast.error("An error occurred while loading website details.")
    }
  }

  const loadChats = async (staffId: string, websiteId: string, token: string) => {
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chats/staff/${staffId}/${websiteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (res.ok) {
        const sortedChats = data.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
        )
        setChats(sortedChats)
        console.log("StaffDashboard: Loaded chats:", sortedChats.length)
        if (!selectedChat && sortedChats.length > 0) {
          setSelectedChat(sortedChats.find((c: { _id: { toString: () => string } }) => c._id.toString() === chatId))
        } else if (selectedChat) {
          const reselected = sortedChats.find((c) => c._id === selectedChat._id)
          if (reselected) {
            setSelectedChat(reselected)
          } else if (sortedChats.length > 0) {
            setSelectedChat(sortedChats[0])
          } else {
            setSelectedChat(null)
          }
        }
      } else {
        console.error("Failed to fetch chats:", data.message)
        toast.error(`Failed to fetch chats: ${data.message || "Unknown error"}`)
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err)
      toast.error("An error occurred while fetching chats.")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChat = (chat: any) => {
    console.log("StaffDashboard: Selecting chat:", chat._id, "Current chats count:", chats.length)
    setSelectedChat(chat)
    setShowChatView(true) // Show chat view on mobile
  }

  const handleBackToList = () => {
    setShowChatView(false) // Show conversations list on mobile
  }

  const handleUpdateChats = (updater: (chats: any[]) => any[]) => {
    setChats((prevChats) => {
      const newChats = updater(prevChats)
      console.log("StaffDashboard: Updating chats from", prevChats.length, "to", newChats.length)
      return newChats
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!website || !staff) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your dashboard.</p>
        </div>
      </div>
    )
  }

  console.log("StaffDashboard: Rendering with", chats.length, "chats, showChatView:", showChatView)

  return (
    <div className="h-screen bg-gray-50 flex">
      <ConversationsList
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        website={website}
        isStaff={true}
        staffInfo={staff}
        isVisible={!showChatView} // Hide on mobile when chat is selected
      />
      <ChatView
        chat={selectedChat}
        website={website}
        socket={socket}
        onUpdateChats={handleUpdateChats}
        isStaff={true}
        staffInfo={staff}
        onBackToList={handleBackToList}
        isVisible={showChatView || !selectedChat} // Show on mobile when chat is selected or no chat selected
      />
    </div>
  )
}
