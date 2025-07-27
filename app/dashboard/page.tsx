// app/(main)/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import { useRealTime } from "@/hooks/use-real-time"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Globe,
  MessageSquare,
  Plus,
  Eye,
  Settings,
  TrendingUp,
  Activity,
  MessageCircle,
  BarChart3,
  ChevronRight,
  Zap,
  Crown,
  Send,
  ExternalLink,
  Languages,
  Clock,
  Target,
  Sparkles,
} from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import { useEffect, useState } from "react"
import { authFetch } from "@/lib/authFetch"
import Link from "next/link"
import { motion } from "framer-motion"
import BlurText from "@/components/ui/blur-text"
import { marked } from "marked";
import DOMPurify from "dompurify";

// Import your new GroupWheel component
import GroupWheel from '@/components/groups/GroupWheel'; // <--- IMPORT GROUPWHEEL

// Dashboard Skeleton component for loading states
function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { isConnected, isLoading, liveNotifications, unreadCount, liveRecentActivity } = useRealTime(
    user ? { user, userType: "owner" } : { user: null, userType: "owner" },
  )

  // State for chat statistics
  const [openChatsCount, setOpenChatsCount] = useState(0)
  const [totalChatsCount, setTotalChatsCount] = useState(0)
  const [totalMessages, setTotalMessages] = useState(0)
  const [responseRate, setResponseRate] = useState(0)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Effect to fetch chat statistics
  useEffect(() => {
    const fetchChatStats = async () => {
      if (!user || !user.websites || user.websites.length === 0) {
        setIsLoadingStats(false)
        return
      }
      setIsLoadingStats(true)
      try {
        const allChatIds = user.websites.flatMap((website) =>
          website.chats ? website.chats.map((chat) => chat._id || chat) : [],
        )
        if (allChatIds.length === 0) {
          setOpenChatsCount(0)
          setTotalChatsCount(0)
          setTotalMessages(0)
          setResponseRate(100)
          setIsLoadingStats(false)
          return
        }

        const response = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chats/get-by-ids`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatIds: allChatIds }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const chats = await response.json()
        let currentOpenChats = 0
        let currentTotalMessages = 0
        let respondedChats = 0
        const totalChatConversations = chats.length

        chats.forEach((chat) => {
          if (chat.status === "open") {
            currentOpenChats++
          }
          try {
            const messages = JSON.parse(chat.messages || "[]")
            currentTotalMessages += messages.length
            if (chat.status === "closed" || (messages.length > 0 && chat.status !== "open")) {
              respondedChats++
            }
          } catch (e) {
            console.error("Error parsing messages for chat:", chat._id, e)
          }
        })

        setOpenChatsCount(currentOpenChats)
        setTotalChatsCount(totalChatConversations)
        setTotalMessages(currentTotalMessages)
        const calculatedResponseRate =
          totalChatConversations > 0 ? (respondedChats / totalChatConversations) * 100 : 100
        setResponseRate(calculatedResponseRate)
      } catch (error) {
        console.error("Failed to fetch chat statistics:", error)
        setOpenChatsCount(0)
        setTotalChatsCount(0)
        setTotalMessages(0)
        setResponseRate(0)
      } finally {
        setIsLoadingStats(false)
      }
    }

    if (user && user.websites) {
      fetchChatStats()
    }
  }, [user])

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
        <LoginForm />
      </div>
    )
  }

  // Function to extract username from email
  const getUsernameFromEmail = (email: string) => {
    return email.split("@")[0]
  }

  const handleAnimationComplete = () => {
    console.log("Welcome animation completed!")
  }

  const renderMarkdown = (markdownText: string) => {
    const rawMarkup = marked.parse(markdownText, { breaks: true, gfm: true }) as string;
    return DOMPurify.sanitize(rawMarkup);
  };

  return (
    <DashboardLayout>
      <div className="p-6 overflow-y-auto h-full bg-gradient-to-br from-slate-50/50 via-white to-slate-100/50">
        {/* Simplified Welcome Message */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <BlurText
              text={`Welcome back, ${getUsernameFromEmail(user.email)}`}
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-3xl font-bold text-slate-900"
            />
            <p className="text-slate-600 text-base font-medium mt-2">
              Here's what's happening with your chat platform today
            </p>
          </motion.div>
        )}

        {/* Enhanced Main Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {/* Enhanced Telegram Bot Integration Card */}
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="xl:col-span-2"
          >
            <Card className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 border-0 shadow-lg rounded-2xl h-full relative overflow-hidden group">
              {/* Enhanced background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10" />
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-indigo-400/15 to-blue-500/15 rounded-full blur-2xl" />

              <CardContent className="p-6 flex flex-col justify-between h-full min-h-[180px] relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-xl leading-tight">Telegram Bot Integration</h3>
                    <p className="text-slate-700 text-sm leading-relaxed max-w-md">
                      Get instant notifications for new conversations and messages directly in Telegram.
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-blue-700">
                      <Sparkles className="w-3 h-3" />
                      <span className="font-medium">Real-time notifications</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-auto">
                  <Button
                    onClick={() => window.open("https://t.me/chat_bot_hub_bot", "_blank")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg px-6 py-2 text-sm font-semibold transition-all duration-300"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Open Bot
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          
          {/* New GroupWheel Card - styled to match existing Bento Grid cards */}
          <motion.div
            className="xl:col-span-2" // This card will span 2 columns on xl screens
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/20" /> {/* Green/Emerald gradient */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full blur-2xl" />

              {/* GroupWheel component renders its own CardHeader and CardContent internally */}
              <GroupWheel /> {/* <--- RENDER GROUPWHEEL HERE */}

            </Card>
          </motion.div>
          
          {/* Enhanced Stats Cards */}
          <motion.div whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/30" />
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-2xl group-hover:scale-105 transition-transform duration-400" />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Total Websites</p>
                    <p className="text-3xl font-bold text-slate-900">{user.websites.length}</p>
                    <div className="flex items-center space-x-1 text-emerald-600 text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      <span>Active and ready</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <Globe className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-2xl group-hover:scale-105 transition-transform duration-400" />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Open Chats</p>
                    {isLoadingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-3xl font-bold text-slate-900">{openChatsCount}</p>
                    )}
                    <div className="flex items-center space-x-1 text-blue-600 text-xs font-medium">
                      <Activity className="w-3 h-3" />
                      <span>Currently active</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-violet-50/30" />
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-violet-500/10 rounded-full blur-2xl group-hover:scale-105 transition-transform duration-400" />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Total Messages</p>
                    {isLoadingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-3xl font-bold text-slate-900">{totalMessages.toLocaleString()}</p>
                    )}
                    <div className="flex items-center space-x-1 text-purple-600 text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      <span>Overall interactions</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-yellow-50/30" />
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-yellow-500/10 rounded-full blur-2xl group-hover:scale-105 transition-transform duration-400" />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Response Rate</p>
                    {isLoadingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="space-y-2">
                        <p className="text-3xl font-bold text-slate-900">{responseRate.toFixed(1)}%</p>
                        <Progress value={responseRate} className="h-1.5 bg-amber-100" />
                      </div>
                    )}
                    <div className="flex items-center space-x-1 text-amber-600 text-xs font-medium">
                      <Target className="w-3 h-3" />
                      <span>Performance efficiency</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <BarChart3 className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Quick Actions */}
          <motion.div whileHover={{ scale: 1.002 }} transition={{ duration: 0.2 }} className="xl:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-green-50/20" />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-2xl" />

              <CardHeader className="px-6 pb-4 relative z-10">
                <CardTitle className="text-slate-900 flex items-center space-x-3 text-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription className="text-slate-600 text-sm mt-1">Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6 relative z-10">
                <Button
                  onClick={() => router.push("/websites/new")}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white justify-start rounded-xl shadow-md hover:shadow-lg py-3 text-sm font-semibold transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Add New Website
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-200 bg-white/50 text-slate-700 hover:bg-white hover:text-slate-900 justify-start rounded-xl py-3 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => router.push("/websites")}
                >
                  <Eye className="w-4 h-4 mr-3" />
                  View All Websites
                </Button>
                <Link href="/settings">
                  <Button
                    variant="outline"
                    className="w-full border-slate-200 bg-white/50 text-slate-700 hover:bg-white hover:text-slate-900 justify-start rounded-xl py-3 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Dashboard Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Recent Activity */}
          <motion.div whileHover={{ scale: 1.002 }} transition={{ duration: 0.2 }} className="xl:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/20" />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-2xl" />

              <CardHeader className="px-6 pb-4 relative z-10">
                <CardTitle className="text-slate-900 flex items-center space-x-3 text-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription className="text-slate-600 text-sm mt-1">
                  Latest updates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 relative z-10">
                <div className="space-y-4">
                  {liveRecentActivity.slice(0, 4).map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className="bg-white/60 rounded-xl border border-slate-100 hover:bg-white/80 transition-all duration-200">
                        <CardContent className="p-3 flex items-start space-x-3">
                          <div
                            className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-sm ${
                              notification.type === "message" || notification.type === "bot_message"
                                ? "bg-blue-500"
                                : notification.type === "chat"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-sm text-slate-900 font-semibold line-clamp-2 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(notification.title) }}
                            />
                            <p
                              className="text-xs text-slate-700 mt-0.5"
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(notification.description) }}
                            />
                            <div className="flex items-center space-x-1 mt-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <p className="text-xs text-slate-500 font-medium">
                                {new Date(notification.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  {liveRecentActivity.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500 font-semibold">No recent activity</p>
                      <p className="text-xs text-slate-400 mt-1">Activity will appear here when you start chatting</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Version Banner */}
          <motion.div whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }} className="xl:col-span-2">
            <Card className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 border-0 shadow-lg relative overflow-hidden rounded-2xl h-full group">
              <div className="absolute -top-20 -left-20 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full blur-3xl group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-gradient-to-br from-indigo-400/15 to-purple-500/15 rounded-full blur-2xl" />

              <CardContent className="p-6 flex flex-col justify-between h-full min-h-[180px] relative z-10">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Languages className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-xl leading-tight">New v1.3 Version Available!</h3>
                    <p className="text-slate-700 text-sm leading-relaxed max-w-md">
                      Widget interface now supports 9+ languages for a global reach.
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-purple-700">
                      <Sparkles className="w-3 h-3" />
                      <span className="font-medium">Multi-language support</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-auto">
                  <Button
                    variant="outline"
                    className="border-purple-200 bg-white/60 text-purple-700 hover:bg-white hover:text-purple-900 rounded-xl shadow-md hover:shadow-lg px-6 py-2 text-sm font-semibold transition-all duration-300"
                    onClick={() => router.push(`/blog/multi-language-support`)}
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Websites Overview */}
          {user?.websites.length > 0 && (
            <motion.div whileHover={{ scale: 1.001 }} transition={{ duration: 0.2 }} className="xl:col-span-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl h-full">
                <CardHeader className="px-6 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="text-slate-900 flex items-center space-x-3 text-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <span>Your Websites</span>
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-sm">
                        Overview of your registered websites
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      className="border-slate-200 bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900 rounded-xl shadow-sm hover:shadow-md px-4 py-2 font-semibold transition-all duration-300"
                      onClick={() => router.push("/websites")}
                    >
                      View All
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.websites.slice(0, 3).map((website, index) => (
                      <motion.div
                        key={website._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <Card className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 hover:border-slate-300/60 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg rounded-2xl h-full relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-white/50" />
                          <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-xl group-hover:scale-105 transition-transform duration-400" />

                          <CardContent className="p-5 relative z-10">
                            <div className="flex items-start justify-between mb-4">
                              <h3 className="font-bold text-slate-900 truncate flex-1 text-base leading-tight">
                                {website.name}
                              </h3>
                              <div className="flex items-center space-x-1 ml-2">
                                <Crown className="w-3 h-3 text-amber-500" />
                                <span className="text-xs text-slate-600 font-medium">
                                  {website.plan?.name || "Free"}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                              {website.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="outline"
                                className="bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200/60 rounded-lg px-3 py-1 text-xs font-semibold"
                              >
                                Active
                              </Badge>
                              <Link href={`/websites/${website._id}/conversations`}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg px-3 py-1 text-xs font-semibold transition-all duration-200"
                                >
                                  View Chats
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}