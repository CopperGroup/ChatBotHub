import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import PricingPageClient from "@/components/pricing/pricing-client-page"

interface PricingPageProps {
  searchParams: {
    websiteId?: string
    currentPlanId?: string
    [key: string]: string | string[] | undefined
  }
}

export default function PricingServerPage({ searchParams }: PricingPageProps) {
  const websiteId = searchParams.websiteId
  const currentPlanId = searchParams.currentPlanId

  return (
    <div className="h-screen bg-slate-50">
      <Suspense
        fallback={
          <div className="h-screen flex justify-center items-center">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
              <p className="text-lg text-slate-700">Loading pricing plans...</p>
            </div>
          </div>
        }
      >
        <PricingPageClient websiteId={websiteId} currentPlanId={currentPlanId} />
      </Suspense>
    </div>
  )
}
