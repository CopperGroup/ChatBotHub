"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Clock, LogOut, Users, Sparkles } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ConversationsListProps {
  chats: any[]
  selectedChat: any
  onSelectChat: (chat: any) => void
  website: any
  websiteId?: string
  userId?: string
  isStaff?: boolean
  staffInfo?: any
  isVisible?: boolean // New prop for mobile visibility
}

const TRUNCATE_LENGTH = 27
export function ConversationsList({
  chats,
  selectedChat,
  onSelectChat,
  website,
  websiteId,
  userId,
  isStaff = false,
  staffInfo,
  isVisible = true, // Default to visible
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showClosedChats, setShowClosedChats] = useState(false)
  const [activeTab, setActiveTab] = useState("my_chats")
  const [newChatsCount, setNewChatsCount] = useState(0)

  // Debug logging
  console.log("ConversationsList: Rendering with", chats.length, "chats, isVisible:", isVisible)

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

  const handleLogout = () => {
    if (isStaff) {
      localStorage.removeItem("staffToken")
      localStorage.removeItem("staffData")
      window.location.href = "/staff/login"
    }
  }

  useEffect(() => {
    if (isStaff && staffInfo?.id) {
      const unassignedOpenChats = chats.filter(
        (chat) => chat.status === "open" && (!chat.leadingStaff || chat.leadingStaff._id === null),
      )
      setNewChatsCount(unassignedOpenChats.length)
    }
  }, [chats, isStaff, staffInfo])

  const filterChatsByTab = (chat: any, currentStaffId?: string) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = showClosedChats || chat.status === "open"

    if (isStaff) {
      const isAssignedToSomeoneElse = chat.leadingStaff && chat.leadingStaff._id !== currentStaffId
      if (isAssignedToSomeoneElse && chat.status === "open") {
        return false
      }

      if (activeTab === "my_chats") {
        const isAssignedToMe = chat.leadingStaff && chat.leadingStaff._id === currentStaffId
        return matchesSearch && matchesStatus && isAssignedToMe
      } else if (activeTab === "new_chats") {
        return matchesSearch && chat.status === "open" && (!chat.leadingStaff || chat.leadingStaff._id === null)
      }
    }
    return matchesSearch && matchesStatus
  }

  const sortedAndFilteredChats = chats
    .filter((chat) => filterChatsByTab(chat, staffInfo?.id))
    .sort((a, b) => {
      if (a.status === "open" && b.status !== "open") {
        return -1
      }
      if (a.status !== "open" && b.status === "open") {
        return 1
      }

      const dateA = new Date(a.updatedAt || a.createdAt).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt).getTime()
      return dateB - dateA
    })

  console.log("ConversationsList: Filtered chats:", sortedAndFilteredChats.length, "from", chats.length, "total")

  return (
    <div
      className={`w-full md:w-80 border-r border-slate-200 bg-white flex flex-col shadow-sm ${
        isVisible ? "flex" : "hidden md:flex"
      }`}
    >
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        {isStaff && staffInfo ? (
          <div className="flex items-center justify-between">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <h2 className="text-lg font-semibold text-slate-900">Staff Dashboard</h2>
              </div>
              <p className="text-sm font-medium text-slate-700 truncate">{staffInfo.name}</p>
              <p className="text-xs text-slate-500 truncate">{staffInfo.websiteName || website?.name}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-900">Conversations</h2>
            </div>
            <p className="text-sm text-slate-600 truncate">{website?.name}</p>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
          />
        </div>
      </div>

      {/* Tabs for Staff */}
      {isStaff && (
        <div className="px-4 pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-xl p-1">
              <TabsTrigger
                value="my_chats"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Users className="w-4 h-4 mr-2" />
                My Chats
              </TabsTrigger>
              <TabsTrigger
                value="new_chats"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm relative"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                New Chats
                {newChatsCount > 0 && (
                  <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 text-white text-xs font-medium items-center justify-center">
                      {newChatsCount}
                    </span>
                  </div>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Chat List */}
      <ScrollArea className="flex-1 h-0">
        <div className="md:max-w-[320px]">
          {sortedAndFilteredChats.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {searchQuery
                  ? "No matching conversations"
                  : isStaff && activeTab === "new_chats" && newChatsCount === 0
                    ? "No new chats available"
                    : isStaff && activeTab === "my_chats"
                      ? "You haven't joined any chats yet"
                      : "No conversations yet"}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : isStaff && activeTab === "new_chats" && newChatsCount === 0
                    ? "All available chats are currently assigned or closed."
                    : isStaff && activeTab === "my_chats"
                      ? "Join a chat from the 'New Chats' tab to see it here."
                      : "When visitors start chatting, conversations will appear here."}
              </p>
              {/* Debug info */}
              {/* <p className="text-xs text-slate-400 mt-4">
                Debug: {chats.length} total chats, {sortedAndFilteredChats.length} filtered
                {isStaff && `, activeTab: ${activeTab}, staffId: ${staffInfo?.id}`}
              </p> */}
            </div>
          ) : (
            <div className="p-3 space-y-2 max-w-full">
              {sortedAndFilteredChats.map((chat) => {
                const messages = (() => {
                  try {
                    return JSON.parse(chat.messages || "[]")
                  } catch (error) {
                    console.error("Error parsing chat messages for list:", error)
                    return []
                  }
                })()

                const lastUserMessage = messages
                  .slice()
                  .reverse()
                  .find((msg) => msg.sender === "user")

                const isSelected = selectedChat?._id === chat._id

                return (
                  <div
                    key={chat._id}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-200 shadow-sm"
                        : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                    onClick={() => onSelectChat(chat)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-600 flex-shrink-0 ring-2 ring-white shadow-sm">
                          {chat.avatar ? ( 
                            <AvatarImage src={chat.avatar} alt={chat.name} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-sm font-semibold">
                              {getInitials(chat.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {chat.status === "open" && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{chat.name}</h3>
                          {/* Flag and Country Name */}
                          {chat.country && (
                            <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                              {chat.country.flag && (
                                <img
                                  src={chat.country.flag}
                                  alt={chat.country.countryCode}
                                  className="w-4 h-auto border"
                                  title={chat.country.country}
                                />
                              )}
                              {chat.country.country && (
                                <span className="text-xs text-slate-500">{chat.country.country}</span>
                              )}
                            </div>
                          )}
                          <Badge
                            variant={chat.status === "open" ? "default" : "secondary"}
                            className={`text-xs font-medium ${
                              chat.status === "open"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {chat.status}
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-500 mb-2 font-medium truncate">{chat.email}</p>

                        {lastUserMessage && (
                          <div className="mb-3">
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              <span className="font-medium text-slate-700">Latest:</span>{" "}
                              {lastUserMessage.text.slice(0, TRUNCATE_LENGTH)}
                              {lastUserMessage.text.length > TRUNCATE_LENGTH && "..."}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-3 h-3" />
                              <span className="font-medium">
                                {messages.filter((msg) => msg.sender === "user").length}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(chat.updatedAt || chat.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {chats.some((chat) => chat.status === "closed") && (
            <div className="p-3">
              <Button
                variant="ghost"
                className="w-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl"
                onClick={() => setShowClosedChats((prev) => !prev)}
              >
                {showClosedChats ? "Hide Closed Chats" : "Show Closed Chats"}
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}