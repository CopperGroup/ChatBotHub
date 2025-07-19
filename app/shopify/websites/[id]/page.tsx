"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { WebsiteDetails } from "@/components/websites/website-details"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/ui/loading"

export default function WebsitePage() {
  const { user, loading: authLoading } = useAuth()
  const { id } = useParams()
  const router = useRouter()
  const [website, setWebsite] = useState<any | null>(null)
  const [websiteLoading, setWebsiteLoading] = useState(true)

  useEffect(() => {
    // If auth is still loading, wait.
    if (authLoading) return

    // If user is not authenticated, redirect to login
    if (!user) {
      router.push("/login")
      return
    }

    // If user is authenticated and website ID is available
    if (user && id) {
      const foundWebsite = user.websites.find((w) => w._id === id)
      if (foundWebsite) {
        setWebsite(foundWebsite)
        setWebsiteLoading(false)
      } else {
        // Website not found in user's list, redirect to /websites
        router.push("/websites")
      }
    } else if (user && !id) {
      // User is logged in but no ID in params
      router.push("/websites")
    } else {
      setWebsiteLoading(false)
    }
  }, [user, id, router, authLoading])

  useEffect(() => {
    if (!websiteLoading && website) {
      // Redirect condition: trial ended AND no active Stripe subscription
      if (website.freeTrialPlanId) {
        if (website.freeTrialEnded && !website.stripeSubscriptionId) {
          console.log(
            `[WebsitePage] Website ${website._id}: Free trial ended and no active subscription. Redirecting to pricing.`,
          )
          router.push(`/pricing?websiteId=${website._id}`)
        }
      } else {
        if (!website.stripeSubscriptionId && !website.exlusiveCustomer) {
          console.log(
            `[WebsitePage] Website ${website._id}: Free trial ended and no active subscription. Redirecting to pricing.`,
          )
          router.push(`/pricing?websiteId=${website._id}`)
        }
      }
    }
  }, [website, websiteLoading, router])

  if (authLoading || websiteLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  if (!website) {
    return <div>Website not found</div>
  }

  return (
    <DashboardLayout>
      <div className="overflow-y-auto h-full">
        <WebsiteDetails _website={website} userId={user._id} />
      </div>
    </DashboardLayout>
  )
}
