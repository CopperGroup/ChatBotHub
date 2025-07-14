// components/layout/dashboard-layout.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "./header" // Header now contains the top navigation
import { useAuth } from "@/hooks/use-auth"
import { useRealTime } from "@/hooks/use-real-time"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()

  const { isConnected, isLoading, liveNotifications, unreadCount, clearNotifications } = useRealTime(
    user ? { user, userType: "owner" } : { user: null, userType: "owner" },
  )

  return (
    <div className="h-screen bg-gradient-to-br from-[#e3e5e6] to-emerald-100 text-[#121211] flex flex-col overflow-hidden">
      <Header
        isConnected={isConnected}
        isLoading={isLoading}
        liveNotifications={liveNotifications}
        unreadCount={unreadCount}
        onClearNotifications={clearNotifications}
        userEmail={user?.email} // Pass user email for avatar
        onLogout={logout} // Pass logout function
      />

      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}