"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, Loader2, Menu, Zap, LogOut } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface HeaderProps {
  onToggleSidebar: () => void
  isConnected: boolean
  isLoading: boolean
  user: any
  onLogout: () => void
}

export function Header({ onToggleSidebar, isConnected, isLoading, user, onLogout }: HeaderProps) {
  const pathname = usePathname()

  const getInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path)

  const getPageDescription = () => {
    if (pathname === "/dashboard") return "Overview of your chatbot performance"
    if (pathname === "/websites") return "Manage your registered websites"
    if (pathname === "/websites/new") return "Register a new website for chatbot integration"
    if (pathname.includes("/conversations")) return "Customer conversations and support"
    if (pathname.includes("/websites/")) return "Website configuration and settings"
    return "Chatbot management dashboard"
  }

  if (pathname === "/websites/new") {
    return null
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-4 md:px-6 py-4 flex-shrink-0 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Mobile menu button and page title/description */}
        <div className="flex items-center space-x-4 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">{getPageDescription()}</h1>
          </div>
        </div>

        {/* Desktop Header Layout */}
        <div className="hidden lg:flex items-center justify-between w-full">
          {/* Logo and Page Description */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">ChatBot Hub</h2>
                <p className="text-sm text-slate-600 font-medium">{getPageDescription()}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs, Connection Indicator, and User Actions */}
          <div className="flex items-center space-x-6">
            {/* Navigation Tabs with Emerald Style */}
            <nav className="flex space-x-1">
              <Link href="/dashboard">
                <Button
                  variant={isActive("/dashboard") ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-xl transition-all font-semibold ${
                    isActive("/dashboard")
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-600 hover:to-emerald-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/websites">
                <Button
                  variant={isActive("/websites") ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-xl transition-all font-semibold ${
                    isActive("/websites")
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-600 hover:to-emerald-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Websites
                </Button>
              </Link>
              <Link href="/settings">
                <Button
                  variant={isActive("/settings") ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-xl transition-all font-semibold ${
                    isActive("/settings")
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-600 hover:to-emerald-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Settings
                </Button>
              </Link>
            </nav>

            {/* Connection Status */}
            <div className="flex items-center space-x-2 bg-white/60 rounded-full px-3 py-2 border border-slate-200/60">
              {isLoading ? (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : isConnected ? (
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Wifi className="w-4 h-4" />
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-600">
                  <WifiOff className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* User Avatar and Logout */}
            <div className="flex items-center space-x-3 bg-white/60 rounded-full px-3 py-2 border border-slate-200/60">
              <Avatar className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 ring-2 ring-white shadow-sm">
                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold">
                  {user && getInitials(user.email)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
