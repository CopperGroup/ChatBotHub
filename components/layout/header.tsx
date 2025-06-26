"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, Settings, Wifi, WifiOff, Loader2, Menu } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface HeaderProps {
  onToggleSidebar: () => void
  isConnected: boolean
  isLoading: boolean
  liveNotifications: any[]
  unreadCount: number
  onClearNotifications: () => void
}

export function Header({
  onToggleSidebar,
  isConnected,
  isLoading,
  liveNotifications,
  unreadCount,
  onClearNotifications,
}: HeaderProps) {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/websites") return "Websites"
    if (pathname === "/websites/new") return "Add New Website"
    if (pathname.includes("/conversations")) return "Conversations"
    if (pathname.includes("/websites/")) return "Website Details"
    return "Dashboard"
  }

  const getPageDescription = () => {
    if (pathname === "/dashboard") return "Overview of your chatbot performance"
    if (pathname === "/websites") return "Manage your registered websites"
    if (pathname === "/websites/new") return "Register a new website for chatbot integration"
    if (pathname.includes("/conversations")) return "Customer conversations and support"
    if (pathname.includes("/websites/")) return "Website configuration and settings"
    return "Chatbot management dashboard"
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications && unreadCount > 0) {
      onClearNotifications()
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex-shrink-0 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">{getPageTitle()}</h1>
            <p className="text-slate-600 text-xs md:text-sm mt-1 hidden sm:block">{getPageDescription()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Connection Status */}
          <div className="hidden sm:flex items-center space-x-2">
            {isLoading ? (
              <div className="flex items-center space-x-1 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Connecting...</span>
              </div>
            ) : isConnected ? (
              <div className="flex items-center space-x-1 text-emerald-600">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Live</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Offline</span>
              </div>
            )}
          </div>

          {/* Mobile connection indicator */}
          <div className="sm:hidden">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : isConnected ? (
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            ) : (
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            )}
          </div>

          {/* Live Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 relative rounded-full"
              onClick={handleNotificationClick}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>

            {showNotifications && liveNotifications.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Live Updates</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onClearNotifications()
                        setShowNotifications(false)
                      }}
                      className="text-slate-500 hover:text-slate-700 rounded-lg"
                    >
                      Clear all
                    </Button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {liveNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.type === "message" ? "bg-blue-500" : "bg-emerald-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{notification.title}</p>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notification.description}</p>
                          <p className="text-xs text-slate-500 mt-2 font-medium">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/settings">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full"
            >
              <Settings className="w-4 h-4" />
            </Button>          
          </Link>
        </div>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />}
    </header>
  )
}
