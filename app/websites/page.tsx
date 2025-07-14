"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { WebsiteList } from "@/components/websites/website-list"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading" // Ensure this component matches your new spinner style

export default function WebsitesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    // Redirect to login if user is not authenticated
    router.push("/login")
    return null
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 overflow-y-auto h-full">
        <div className="flex items-center justify-between">
          <div>
            {/* Adjusted font styles for consistency */}
            <h2 className="text-3xl font-normal text-[#121211]">Your <span className="font-semibold">Websites</span></h2>
            <p className="text-gray-500 font-light mt-1">Manage your registered websites and chatbot integrations.</p>
          </div>
          <Button
            onClick={() => router.push("/websites/new")}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full shadow-sm font-normal px-5 py-3" // Added rounded-full, px-5 py-3 for consistency
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