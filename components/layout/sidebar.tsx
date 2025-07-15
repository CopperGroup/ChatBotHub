"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Globe, Settings, LogOut, X, Zap, Loader2 } from "lucide-react"
import Link from "next/link"

interface SidebarProps {
  open: boolean
  onToggleOpen: () => void
  onClose: () => void
  user: any
  isConnected: boolean
  isLoading: boolean
  onLogout: () => void
}

export function Sidebar({ open, onToggleOpen, onClose, user, isConnected, isLoading, onLogout }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

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

  const handleNavigation = (path: string) => {
    router.push(path)
    onClose() // Close mobile sidebar after navigation
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm border-r border-slate-200/60 shadow-2xl transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-white/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">ChatBot Hub</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-slate-600 font-medium">AI Dashboard</p>
                  <div className="flex items-center space-x-1">
                    {isLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                    ) : isConnected ? (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-2">
            <Link href="/dashboard" onClick={() => handleNavigation("/dashboard")}>
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                className={`w-full justify-start rounded-2xl transition-all font-semibold ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="ml-3">Dashboard</span>
              </Button>
            </Link>
            <Link href="/websites" onClick={() => handleNavigation("/websites")}>
              <Button
                variant={isActive("/websites") ? "default" : "ghost"}
                className={`w-full justify-start rounded-2xl transition-all font-semibold ${
                  isActive("/websites")
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Globe className="w-5 h-5" />
                <span className="ml-3">Websites</span>
              </Button>
            </Link>
            <Link href="/settings" onClick={() => handleNavigation("/settings")}>
              <Button
                variant={isActive("/settings") ? "default" : "ghost"}
                className={`w-full justify-start rounded-2xl transition-all font-semibold ${
                  isActive("/settings")
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="ml-3">Settings</span>
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile User Profile */}
        <div className="p-6 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-white/80">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 ring-2 ring-emerald-100 shadow-lg">
              <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold">
                {user && getInitials(user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
              <p className="text-xs text-slate-500 font-medium">Admin</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
