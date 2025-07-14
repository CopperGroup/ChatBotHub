"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { WebsiteDetails } from "@/components/websites/website-details"
import { WebsiteSettings } from "@/components/websites/website-settings"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/ui/loading"


export default function WebsitePage() {
  const { user, loading: authLoading } = useAuth()
  const { id } = useParams()
  const router = useRouter()
  const [website, setWebsite] = useState<any | null>(null)
  const [websiteLoading, setWebsiteLoading] = useState(true) // New state for website data loading

  useEffect(() => {
    // If auth is still loading, wait.
    if (authLoading) return;

    // If user is not authenticated, redirect to login
    if (!user) {
      router.push("/login")
      return;
    }

    // If user is authenticated and website ID is available
    if (user && id) {
      const foundWebsite = user.websites.find((w) => w._id === id) as Website | undefined;
      if (foundWebsite) {
        setWebsite(foundWebsite);
        setWebsiteLoading(false); // Website data found and set
      } else {
        // Website not found in user's list, redirect to /websites
        router.push("/websites");
      }
    } else if (user && !id) {
        // User is logged in but no ID in params, maybe redirect to websites list if this is not the root of website details
        router.push("/websites");
    } else {
        // User is null (not authenticated), and authLoading is false, so redirect to login handled above
        setWebsiteLoading(false); // No website to load
    }
  }, [user, id, router, authLoading])

  useEffect(() => {
    if (!websiteLoading && website) { // Only run this check once website data is loaded
      // Redirect condition: trial ended AND no active Stripe subscription
      if(website.freeTrialPlanId) {
        if (website.freeTrialEnded && !website.stripeSubscriptionId) {
          console.log(`[WebsitePage] Website ${website._id}: Free trial ended and no active subscription. Redirecting to pricing.`);
          router.push(`/pricing?websiteId=${website._id}`);
        }
      } else {
        if (!website.stripeSubscriptionId && !website.exlusiveCustomer) {
          console.log(`[WebsitePage] Website ${website._id}: Free trial ended and no active subscription. Redirecting to pricing.`);
          router.push(`/pricing?websiteId=${website._id}`);
        }
      }
    }
  }, [website, websiteLoading, router])


  if (authLoading || websiteLoading) {
    return <LoadingSpinner/>
  }

  // This condition is technically handled by the first useEffect
  // but keeping it explicit for clarity in render flow
  if (!user) {
    // router.push("/login") is already called in useEffect
    return null
  }

  if (!website) {
    return <div>Website not found</div> // Should ideally not be reached if redirects work
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 overflow-y-auto h-full max-[560px]:px-3 max-[420px]:px-1">
        <WebsiteDetails _website={website} userId={user._id}/>
        {/* You might also render WebsiteSettings here or on a sub-route */}
        {/* <WebsiteSettings website={website} onUpdate={setWebsite} userId={user._id} /> */}
      </div>
    </DashboardLayout>
  )
}