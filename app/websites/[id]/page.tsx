"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { WebsiteDetails } from "@/components/websites/website-details"
import { WebsiteSettings } from "@/components/websites/website-settings"
import { useAuth } from "@/hooks/use-auth"

export default function WebsitePage() {
  const { user, loading } = useAuth()
  const { id } = useParams()
  const router = useRouter()
  const [website, setWebsite] = useState(null)

  useEffect(() => {
    if (user && id) {
      const foundWebsite = user.websites.find((w) => w._id === id)
      if (foundWebsite) {
        setWebsite(foundWebsite)
      } else {
        router.push("/websites")
      }
    }
  }, [user, id, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    router.push("/login")
    return null
  }

  if (!website) {
    return <div>Website not found</div>
  }

  console.log(user)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 overflow-y-auto h-full max-[560px]:px-3 max-[420px]:px-1">
        <WebsiteDetails _website={website} userId={user._id}/>
      </div>
    </DashboardLayout>
  )
}
