"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { WebsiteList } from "@/components/websites/website-list"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function WebsitesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 overflow-y-auto h-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Websites</h2>
            <p className="text-gray-600">Manage your registered websites and chatbot integrations</p>
          </div>
          <Button
            onClick={() => router.push("/websites/new")}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Website
          </Button>
        </div>

        <WebsiteList websites={user.websites} />
      </div>
    </DashboardLayout>
  )
}
