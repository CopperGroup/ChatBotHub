"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CreateWebsiteForm } from "@/components/websites/create-website-form"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function NewWebsitePage() {
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
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Add New Website</h1>
          <p className="text-gray-600 mt-2">Register a new website to enable AI chatbot integration</p>
        </div>

        <CreateWebsiteForm userId={user._id} />
      </div>
    </DashboardLayout>
  )
}
