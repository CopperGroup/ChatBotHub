// app/dashboard/page.tsx (Main dashboard content)
"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import { useRealTime } from "@/hooks/use-real-time"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  Wifi,
  WifiOff,
  Loader2,
  Zap,
  Crown,
  Send,
  ExternalLink,
  Users2,
  UserPlus2,
  Laptop
} from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import { useEffect, useState } from "react"
import { authFetch } from "@/lib/authFetch"
import Link from "next/link"

// Dashboard Skeleton component for loading states
function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  )
}

// Stats from the inspiration image, now dynamic with user data
const getNumStats = (userWebsitesLength: number, totalChats: number, totalMessages: number) => [
  { stat_name: "Websites", num: userWebsitesLength, icon: <Globe strokeWidth={1.5} size={14} /> },
  { stat_name: "Total Chats", num: totalChats, icon: <MessageSquare strokeWidth={1.5} size={14} /> },
  { stat_name: "Total Msgs", num: totalMessages, icon: <MessageCircle strokeWidth={1.5} size={14} /> }
];


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
        const allChatIds = user.websites.flatMap(website =>
          website.chats ? website.chats.map(chat => chat._id || chat) : []
        );

        if (allChatIds.length === 0) {
          setOpenChatsCount(0);
          setTotalChatsCount(0);
          setTotalMessages(0);
          setResponseRate(100);
          setIsLoadingStats(false);
          return;
        }

        const response = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chats/get-by-ids`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatIds: allChatIds }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const chats = await response.json();

        let currentOpenChats = 0;
        let currentTotalMessages = 0;
        let respondedChats = 0;
        let totalChatConversations = chats.length;

        chats.forEach(chat => {
          if (chat.status === 'open') {
            currentOpenChats++;
          }
          try {
            const messages = JSON.parse(chat.messages || '[]');
            currentTotalMessages += messages.length;
            if (chat.status === 'closed' || (messages.length > 0 && chat.status !== 'open')) {
              respondedChats++;
            }
          } catch (e) {
            console.error("Error parsing messages for chat:", chat._id, e);
          }
        });

        setOpenChatsCount(currentOpenChats);
        setTotalChatsCount(totalChatConversations);
        setTotalMessages(currentTotalMessages);

        const calculatedResponseRate = totalChatConversations > 0
          ? (respondedChats / totalChatConversations) * 100
          : 100;
        setResponseRate(calculatedResponseRate);

      } catch (error) {
        console.error("Failed to fetch chat statistics:", error);
        setOpenChatsCount(0);
        setTotalChatsCount(0);
        setTotalMessages(0);
        setResponseRate(0);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (user && user.websites) {
      fetchChatStats();
    }
  }, [user]);

  // Determine numerical stats for the header based on fetched data
  const dynamicNumStats = getNumStats(user?.websites.length || 0, totalChatsCount, totalMessages);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e3e5e6] to-[#A7DBD8] flex items-center justify-center p-4 md:p-6">
        <LoginForm />
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto h-full">
        {/* Welcome message and numerical stats (inspired by the original header) */}
        <div className="w-full flex justify-between items-end mt-4">
          <h1 className="text-[#121211] text-[42px] font-normal">Welcome in, <span className="font-semibold">{user.username || user.email.split('@')[0]}</span></h1>
          <div className="flex gap-2 justify-end items-center">
            {dynamicNumStats.map((stat, index) => {
              return (
                <div key={index}>
                  <div className="flex items-end">
                    <div className="bg-[#A7DBD8] p-1 rounded-md max-h-fit">
                      {stat.icon}
                    </div>
                    <p className="ml-1 text-5xl font-thin">{stat.num}</p>
                  </div>
                  <p className="text-sm font-normal text-[#121211]">{stat.stat_name}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-white border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[#121211] text-sm font-normal">Total Websites</p>
                  <p className="text-2xl md:text-3xl font-light text-[#121211] mt-2">{user.websites.length}</p>
                  <p className="text-emerald-600 text-xs md:text-sm mt-1 flex items-center font-light">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Active and ready
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                  <Globe className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[#121211] text-sm font-normal">Open Chats</p>
                  {isLoadingStats ? (
                    <Skeleton className="h-8 w-20 mt-2" />
                  ) : (
                    <p className="text-2xl md:text-3xl font-light text-[#121211] mt-2">{openChatsCount}</p>
                  )}
                  <p className="text-blue-600 text-xs md:text-sm mt-1 flex items-center font-light">
                    <Activity className="w-3 h-3 mr-1" />
                    Currently active
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[#121211] text-sm font-normal">Total Messages</p>
                  {isLoadingStats ? (
                    <Skeleton className="h-8 w-20 mt-2" />
                  ) : (
                    <p className="text-2xl md:text-3xl font-light text-[#121211] mt-2">{totalMessages}</p>
                  )}
                  <p className="text-purple-600 text-xs md:text-sm mt-1 flex items-center font-light">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Overall interactions
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[#121211] text-sm font-normal">Response Rate</p>
                  {isLoadingStats ? (
                    <Skeleton className="h-8 w-20 mt-2" />
                  ) : (
                    <p className="text-2xl md:text-3xl font-light text-[#121211] mt-2">{responseRate.toFixed(1)}%</p>
                  )}
                  <p className="text-amber-600 text-xs md:text-sm mt-1 flex items-center font-light">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Performance efficiency
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center shadow-sm">
                  <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Card - now full width */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-[#121211] flex items-center space-x-2 text-lg font-normal">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="text-gray-500 font-light">Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="space-y-4">
              {liveRecentActivity.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.type === "message" || notification.type === "bot_message"
                        ? "bg-blue-500"
                        : notification.type === "chat"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#121211] line-clamp-2 font-normal">{notification.title}</p>
                    <p className="text-xs text-gray-500 mt-1 font-light">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {liveRecentActivity.length === 0 && (
                <div className="text-center py-6 md:py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-light">No recent activity</p>
                  <p className="text-xs text-gray-400 mt-1 font-light">Activity will appear here when you start chatting</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* New Bento Grid for Telegram Bot and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Telegram Bot Integration Card */}
          <Card className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-sm">
            <CardContent className="p-4 md:p-6 flex flex-col justify-between h-full">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-normal text-blue-900 text-lg">Telegram Bot Integration</h3>
                  <p className="text-blue-700 text-sm font-light">
                    Get instant notifications for new conversations and messages directly in Telegram
                  </p>
                </div>
              </div>
              <Button
                onClick={() => window.open("https://t.me/chat_bot_hub_bot", "_blank")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm w-full sm:w-auto font-normal self-end rounded-full" // Added rounded-full
              >
                <Send className="w-4 h-4 mr-2" />
                Open Telegram Bot
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
            <CardHeader className="px-4 md:px-6">
              <CardTitle className="text-[#121211] flex items-center space-x-2 text-lg font-normal">
                <Zap className="w-5 h-5 text-emerald-600" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription className="text-gray-500 font-light">Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6">
              <Button
                onClick={() => router.push("/websites/new")}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white justify-start shadow-sm font-normal rounded-full" // Added rounded-full
              >
                <Plus className="w-4 h-4 mr-3" />
                Add New Website
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-200 text-[#121211] hover:bg-slate-50 hover:text-[#121211] justify-start font-normal rounded-full" // Added rounded-full
                onClick={() => router.push("/websites")}
              >
                <Eye className="w-4 h-4 mr-3" />
                View All Websites
              </Button>
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-900 justify-start font-normal rounded-full" // Added rounded-full
                onClick={() => window.open("https://t.me/chat_bot_hub_bot", "_blank")}
              >
                <Send className="w-4 h-4 mr-3" />
                Setup Telegram Bot
              </Button>
              <Link href="/settings">
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-[#121211] hover:bg-slate-50 hover:text-[#121211] justify-start font-normal rounded-full" // Added rounded-full
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Dashboard Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Websites Overview */}
        {user?.websites.length > 0 && (
          <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
            <CardHeader className="px-4 md:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                  <CardTitle className="text-[#121211] flex items-center space-x-2 text-lg font-normal">
                    <Globe className="w-5 h-5 text-emerald-600" />
                    <span>Your Websites</span>
                  </CardTitle>
                  <CardDescription className="text-gray-500 font-light">Overview of your registered websites</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-200 text-[#121211] hover:bg-slate-50 rounded-full w-full sm:w-auto font-normal" // Added rounded-full
                  onClick={() => router.push("/websites")}
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.websites.slice(0, 3).map((website) => (
                  <Card
                    key={website._id}
                    className="bg-white border-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md rounded-xl"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-normal text-[#121211] truncate flex-1">{website.name}</h3>
                        <div className="flex items-center space-x-1 ml-2">
                          <Crown className="w-3 h-3 text-amber-500" />
                          <span className="text-xs text-gray-500 font-light">{website.plan?.name || "Free"}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed font-light">{website.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-lg font-normal"
                        >
                          Active
                        </Badge>
                        <Link href={`/websites/${website._id}/conversations`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full font-normal" // Added rounded-full
                          >
                            View Chats
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}