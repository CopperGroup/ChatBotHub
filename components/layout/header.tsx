// components/layout/header.tsx (Main navigation moved here, now top-bar)
"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, Settings, Wifi, WifiOff, Loader2, User2, Zap } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Define main navigation tabs
const TABS = ["Dashboard", "Websites", "Settings"]

interface HeaderProps {
  isConnected: boolean
  isLoading: boolean
  liveNotifications: any[]
  unreadCount: number
  onClearNotifications: () => void
  userEmail: string | undefined
  onLogout: () => void
}

export function Header({
  isConnected,
  isLoading,
  liveNotifications,
  unreadCount,
  onClearNotifications,
  userEmail,
  onLogout,
}: HeaderProps) {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)

  // Helper to get initials for the avatar
  const getInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Helper to determine if a navigation link is active
  const isActive = (path: string) => pathname === path || pathname.startsWith(path)

  // Handle notification bell click
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications && unreadCount > 0) {
      onClearNotifications()
    }
  }

  // Do not render header on the new website creation page
  if (pathname === "/websites/new") {
    return null;
  }

  return (
    <header className="w-full flex justify-between items-center py-4 px-5">
      {/* Brand/Logo */}
      <div className="h-fit flex items-center py-3 px-6 border border-[#303030] rounded-full text-2xl text-[#121211]">
        <Zap className="mr-1"/>
        <h2>Chat Bot Hub</h2>
      </div>

      {/* Navigation Tabs and Utility Buttons */}
      <div className="flex gap-1 items-center">
        {/* Main Navigation Tabs */}
        <div className="flex gap-2 bg-[#f6f6f6] rounded-full px-1 py-1 ">
          {TABS.map((tab) => {
            // Determine the correct path based on the tab name
            const path = `/${tab.toLowerCase().replace(" ", "") === "dashboard" ? "dashboard" : tab.toLowerCase().replace(" ", "") === "websites" ? "websites" : "settings"}`;
            const currentTab = isActive(path);

            return (
              <Link href={path} key={tab}>
                <Button 
                  className={`px-4 py-[22px] shadow-none rounded-full text-sm font-normal 
                  ${currentTab ? "bg-[#303030] text-[#f6f6f6]" : "bg-transparent text-[#121211]"} 
                  hover:bg-[#303030]/10 hover:text-[#303030] transition-colors`} // Adjusted hover for better visual
                >
                  {tab}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Connection Status Indicator */}
        <div className="hidden sm:flex items-center space-x-2 bg-[#f6f6f6] rounded-full py-3 px-3 text-sm text-[#121211]">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          ) : isConnected ? (
            <Wifi className="w-4 h-4 text-emerald-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}
          <span className="font-normal">
            {isLoading ? "Connecting..." : isConnected ? "Live" : "Offline"}
          </span>
        </div>

        {/* Live Notifications Button and Popover */}
        <div className="relative">
          <Button
            className="bg-[#f6f6f6] shadow-none rounded-full flex gap-1 py-5 px-3 text-sm"
            variant="outline"
            onClick={handleNotificationClick}
          >
            <Bell strokeWidth="2" size={20} color="#121211"/>
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

        {/* User Avatar / Logout Button */}
        <Button 
          className="bg-[#f6f6f6] shadow-none rounded-full flex gap-1 py-5 px-3 text-sm" 
          variant="outline" 
          onClick={onLogout} // This button now explicitly handles logout
        >
          {userEmail ? (
            <Avatar className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-emerald-600 ring-2 ring-emerald-100 shadow-sm">
              <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold">
                {getInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User2 strokeWidth="2" size={20} color="#121211"/>
          )}
        </Button>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />}
    </header>
  )
}