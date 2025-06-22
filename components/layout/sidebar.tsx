"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Globe, Zap, Minimize2, Maximize2, Loader2, X, Settings, LogOut } from "lucide-react"
import Link from "next/link"

interface SidebarProps {
  collapsed: boolean
  open: boolean
  onToggleCollapse: () => void
  onToggleOpen: () => void
  onClose: () => void
  user: any
  isConnected: boolean
  isLoading: boolean
  onLogout: () => void
}

export function Sidebar({
  collapsed,
  open,
  onToggleCollapse,
  onToggleOpen,
  onClose,
  user,
  isConnected,
  isLoading,
  onLogout,
}: SidebarProps) {
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
      {/* Desktop Sidebar */}
      <div
        className={`${
          collapsed ? "w-[72px]" : "w-64"
        } bg-white border-r border-slate-200 transition-all duration-300 flex-col h-full shadow-sm hidden lg:flex`}
      >
        {/* Sidebar Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex-shrink-0 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">ChatBot Hub</h2>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-slate-500 font-medium">AI Dashboard</p>
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
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className={`text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full ${collapsed ? "-ml-1.5" : ""}`}
            >
              {collapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
          <Link href="/dashboard"> 
            <Button
              variant={isActive("/dashboard") ? "default" : "ghost"}
              className={`w-full justify-start rounded-xl transition-all ${
                isActive("/dashboard")
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-600 hover:to-emerald-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Home className="w-4 h-4" />
              {!collapsed && <span className="ml-3 font-medium">Dashboard</span>}
            </Button>
            </Link>
            <div></div>
            <Link href="/websites">
            <Button
              variant={isActive("/websites") ? "default" : "ghost"}
              className={`w-full justify-start rounded-xl transition-all ${
                isActive("/websites")
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-600 hover:to-emerald-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Globe className="w-4 h-4" />
              {!collapsed && <span className="ml-3 font-medium">Websites</span>}
            </Button>
            </Link>
            <div></div>
            <Link href="/settings">
            <Button
              variant={isActive("/settings") ? "default" : "ghost"}
              className={`w-full justify-start rounded-xl transition-all ${
                isActive("/settings")
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-600 hover:to-emerald-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Settings className="w-4 h-4" />
              {!collapsed && <span className="ml-3 font-medium">Settings</span>}
            </Button>
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100 flex-shrink-0 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-3">
            <Avatar className="w-9 h-9 bg-gradient-to-r from-emerald-500 to-emerald-600 ring-2 ring-emerald-100 shadow-sm">
              <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold">
                {user && getInitials(user.email)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
                <p className="text-xs text-slate-500 font-medium">Admin</p>
              </div>
            )}
            {!collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
            {collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full ml-auto"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-xl transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">ChatBot Hub</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-slate-500 font-medium">AI Dashboard</p>
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
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            <Link href="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                className={`w-full justify-start rounded-xl transition-all ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="ml-3 font-medium">Dashboard</span>
              </Button>
            </Link>
            <Link href="/websites">
              <Button
                variant={isActive("/websites") ? "default" : "ghost"}
                className={`w-full justify-start rounded-xl transition-all ${
                  isActive("/websites")
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="ml-3 font-medium">Websites</span>
              </Button>
            </Link>
            <Link href="/settings">
              <Button
                variant={isActive("/settings") ? "default" : "ghost"}
                className={`w-full justify-start rounded-xl transition-all ${
                  isActive("/settings")
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="ml-3 font-medium">Settings</span>
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile User Profile */}
        <div className="p-4 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-3">
            <Avatar className="w-9 h-9 bg-gradient-to-r from-emerald-500 to-emerald-600 ring-2 ring-emerald-100 shadow-sm">
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
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
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
