"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UserSettings } from "@/components/settings/user-settings"
import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "@/components/auth/login-form"

export default function SettingsPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 md:p-6">
        <LoginForm />
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="h-full overflow-y-auto">
        <UserSettings user={user} />
      </div>
    </DashboardLayout>
  )
}
