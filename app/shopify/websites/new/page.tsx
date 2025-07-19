"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoadingSpinner } from "@/components/ui/loading"
import { CreateWebsiteForm } from "@/components/websites/create-website-form"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function NewWebsitePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <LoadingSpinner/>
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <DashboardLayout>

        <CreateWebsiteForm userId={user._id} userWebsitesCount={user.websites.length}/>
    </DashboardLayout>
  )
}
