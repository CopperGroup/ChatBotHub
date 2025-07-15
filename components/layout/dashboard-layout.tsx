"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useAuth } from "@/hooks/use-auth"
import { useRealTime } from "@/hooks/use-real-time"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile sidebar state
  const { user, logout } = useAuth()
  const { isConnected, isLoading } = useRealTime(user ? { user, userType: "owner" } : { user: null, userType: "owner" })

  return (
    <div className="h-screen text-slate-900 flex overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
        onClose={() => setSidebarOpen(false)}
        user={user}
        isConnected={isConnected}
        isLoading={isLoading}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(true)}
          isConnected={isConnected}
          isLoading={isLoading}
          user={user}
          onLogout={logout}
        />
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
