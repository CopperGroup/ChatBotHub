"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ConversationsList } from "@/components/conversations/conversations-list"
import { ChatView } from "@/components/conversations/chat-view"
import { useAuth } from "@/hooks/use-auth"
import { useRealTime } from "@/hooks/use-real-time"
import { toast } from "sonner"
import { authFetch } from "@/lib/authFetch"

export default function ConversationsPage() {
  console.log("User")
  const { user, loading } = useAuth()
  console.log(user, loading)
  const { id } = useParams()
  const router = useRouter()
  const [website, setWebsite] = useState<any>(null)
  const [chats, setChats] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [showChatView, setShowChatView] = useState(false) // Mobile state

  const { socket, isLoading, isConnected, liveNotifications, unreadCount, liveRecentActivity } = useRealTime({
    user,
    userType: "owner",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user && user.websites && id) {
      const foundWebsite = user.websites.find((w: any) => w._id === id)
      if (foundWebsite) {
        setWebsite(foundWebsite)
        loadChats(foundWebsite)
      } else {
        router.push("/websites")
        toast.error("Website not found or you do not have access.")
      }
    }
  }, [user, id, router, loading])

  const loadChats = async (website: any) => {
    if (!user) return

    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chats/owner/${user._id}/${website._id}`)
      const data = await res.json()
      if (res.ok) {
        const sortedChats = data.sort(
          (a: any, b: any) =>
            new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
        )
        setChats(sortedChats)
        console.log("ConversationsPage: Loaded chats:", sortedChats.length)
        if (selectedChat) {
          const reselected = sortedChats.find((c: any) => c._id === selectedChat._id)
          if (reselected) {
            setSelectedChat(reselected)
          } else if (sortedChats.length > 0) {
            setSelectedChat(sortedChats[0])
          } else {
            setSelectedChat(null)
          }
        } else if (sortedChats.length > 0) {
          setSelectedChat(sortedChats[0])
        }
      } else {
        toast.error(`Failed to fetch chats: ${data.message || "Unknown error"}`)
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err)
      toast.error("An error occurred while fetching chats.")
    }
  }

  useEffect(() => {
    if (!socket || !user) return

    const handleNewChat = (data: any) => {
      setChats((prevChats) => {
        const newChats = [data.chat, ...prevChats.filter((c: any) => c._id !== data.chat._id)]
        return newChats.sort(
          (a: any, b: any) =>
            new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
        )
      })
    }

    const handleNewMessage = (data: any) => {
      const { chatId, message, botResponse } = data

      setChats((prev) => {
        const updatedChats = prev.map((chat) => {
          if (chat._id === chatId) {
            const currentMessages = JSON.parse(chat.messages || "[]")
            const newMessages = [...currentMessages]

            if (
              message &&
              !newMessages.some(
                (m: any) => m.timestamp === message.timestamp && m.sender === message.sender && m.text === message.text,
              )
            ) {
              newMessages.push(message)
            }
            if (
              botResponse &&
              !newMessages.some(
                (m: any) =>
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
              setSelectedChat(updatedChat)
            }
            return updatedChat
          }
          return chat
        })

        return updatedChats.sort(
          (a: any, b: any) =>
            new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
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
      console.log("ConversationsPage (Owner): Received chat_update from socket:", data)
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
              console.log("ConversationsPage (Owner): Updating selectedChat due to chat_update.")
              setSelectedChat(newChat)
            }
            return newChat
          }
          return chat
        })
        return updatedChats.sort(
          (a: any, b: any) =>
            new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
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
      socket.off("new_chat", handleNewChat)
      socket.off("new_message", handleNewMessage)
      socket.off("chat_update", handleChatUpdate)
    }
  }, [socket, user, selectedChat])

  const handleSelectChat = (chat: any) => {
    console.log("ConversationsPage: Selecting chat:", chat._id, "Current chats count:", chats.length)
    setSelectedChat(chat)
    setShowChatView(true) // Show chat view on mobile
  }

  const handleBackToList = () => {
    setShowChatView(false) // Show conversations list on mobile
  }

  const handleUpdateChats = (updater: (chats: any[]) => any[]) => {
    setChats((prevChats) => {
      const newChats = updater(prevChats)
      console.log("ConversationsPage: Updating chats from", prevChats.length, "to", newChats.length)
      return newChats
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading user data...</div>
  }

  if (!user) {
    return null
  }

  if (!website) {
    return <div className="flex justify-center items-center h-screen">Loading website details...</div>
  }

  console.log("ConversationsPage: Rendering with", chats.length, "chats, showChatView:", showChatView)

  return (
    <DashboardLayout>
      <div className="flex h-full">
        <ConversationsList
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          website={website}
          isVisible={!showChatView} // Hide on mobile when chat is selected
        />
        <ChatView
          chat={selectedChat}
          website={website}
          socket={socket}
          onUpdateChats={handleUpdateChats}
          isStaff={false}
          dashboardUserId={user?._id}
          onBackToList={handleBackToList}
          isVisible={showChatView || !selectedChat} // Show on mobile when chat is selected or no chat selected
        />
      </div>
    </DashboardLayout>
  )
}
