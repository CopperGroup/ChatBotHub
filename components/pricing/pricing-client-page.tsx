"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Crown, Zap, Loader2, Sparkles, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { authFetch } from "@/lib/authFetch"

interface Plan {
  _id: string
  name: string
  description: string
  priceMonthly: number
  maxStaffMembers: number
  allowAI: boolean
  creditBoostMonthly: number
}

// Define props for the client component
interface PricingPageClientProps {
  websiteId?: string // Optional, as it might not always be in the URL
  currentPlanId?: string // Optional, as it might not always be in the URL
}

function PlanLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-2 border-slate-200">
          <CardHeader className="text-center pb-6 px-6 md:px-8 pt-6 md:pt-8">
            <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-2xl mx-auto mb-4" />
            <Skeleton className="h-6 w-24 mx-auto mb-2" />
            <Skeleton className="h-8 w-20 mx-auto mb-4" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-6 px-6 md:px-8 pb-6 md:pb-8">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Update the component to accept props instead of using useSearchParams
export default function PricingPageClient({ websiteId, currentPlanId }: PricingPageClientProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/plans`, {
          method: "GET",
        })
        if (response.ok) {
          const plansData = await response.json()
          setPlans(plansData)
        } else {
          toast.error("Failed to load pricing plans")
        }
      } catch (error) {
        console.error("Error fetching plans:", error)
        toast.error("Failed to load pricing plans")
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      toast.error("Please log in to upgrade your plan")
      return
    }

    // Ensure websiteId is available from props
    if (!websiteId) {
      toast.error("Website ID is missing from the URL. Cannot upgrade plan.")
      return
    }

    // Navigate to subscription payment page
    router.push(`/subscription-payment?websiteId=${websiteId}&planId=${planId}&currentPlanId=${currentPlanId || ""}`)
  }

  const getPlanGradient = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "starter":
      case "free":
        return "from-slate-500 to-slate-600"
      case "pro":
      case "professional":
        return "from-emerald-500 to-emerald-600"
      case "business":
      case "enterprise":
        return "from-blue-500 to-blue-600"
      default:
        return "from-emerald-500 to-emerald-600"
    }
  }

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "pro":
      case "professional":
        return <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
      case "enterprise":
        return <Crown className="w-6 h-6 md:w-8 md:h-8 text-white" />
      default:
        return <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
    }
  }

  const isPopularPlan = (planName: string) => {
    return planName.toLowerCase() === "pro" || planName.toLowerCase() === "professional"
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
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
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Simple,
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
            {" "}
            transparent pricing
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Choose the plan that fits your needs. Upgrade to unlock advanced features and grow your business.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8 md:py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-emerald-600" />
            <span className="text-sm md:text-base text-slate-700">Loading plans...</span>
          </div>
        </div>
      )}

      {loading && <PlanLoadingSkeleton />}

      {!loading && plans.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No plans available</h3>
          <p className="text-slate-500">Please try again later or contact support.</p>
        </div>
      )}

      {!loading && plans.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => {
              // Use currentPlanId (from props) to determine if it's the current plan
              const isCurrentPlan = currentPlanId === plan._id
              const isPopular = isPopularPlan(plan.name)
              const gradient = getPlanGradient(plan.name)

              return (
                <Card
                  key={plan._id}
                  className={`relative bg-white border-2 transition-all duration-300 hover:shadow-xl ${
                    isPopular
                      ? "border-emerald-500 shadow-xl scale-105 ring-4 ring-emerald-100"
                      : isCurrentPlan
                        ? "border-emerald-500 shadow-lg"
                        : "border-slate-200 hover:border-emerald-200 shadow-sm hover:shadow-lg"
                  }`}
                >
                  {isCurrentPlan && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg rounded-full px-4 py-1">
                      Current Plan
                    </Badge>
                  )}
                  {isPopular && !isCurrentPlan && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg rounded-full px-4 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}

                  <CardHeader className="text-center pb-6 px-6 md:px-8 pt-6 md:pt-8">
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      {getPlanIcon(plan.name)}
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-3xl md:text-4xl font-bold text-slate-900">
                        {plan.priceMonthly === 0 ? "Free" : `$${plan.priceMonthly}`}
                      </span>
                      <span className="text-slate-600 ml-2 text-sm md:text-base">
                        {plan.priceMonthly === 0 ? "forever" : "per month"}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm md:text-base">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-6 px-6 md:px-8 pb-6 md:pb-8">
                    <ul className="space-y-3 md:space-y-4">
                      <li className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm md:text-base leading-relaxed">
                          {plan.maxStaffMembers} Staff Member{plan.maxStaffMembers !== 1 ? "s" : ""}
                        </span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm md:text-base leading-relaxed">
                          AI Responses: {plan.allowAI ? "Enabled" : "Disabled"}
                        </span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm md:text-base leading-relaxed">
                          {plan.creditBoostMonthly} AI Credits/month
                        </span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm md:text-base leading-relaxed">24/7 Support</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm md:text-base leading-relaxed">Advanced Analytics</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm md:text-base leading-relaxed">
                          Widget Customization
                        </span>
                      </li>
                    </ul>

                    <Button
                      onClick={() => handleSelectPlan(plan._id)}
                      disabled={isCurrentPlan}
                      className={`w-full py-3 md:py-4 text-sm md:text-base font-semibold rounded-xl transition-all duration-200 ${
                        isPopular && !isCurrentPlan
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
                          : isCurrentPlan
                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                            : "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-emerald-300 shadow-sm hover:shadow-md"
                      }`}
                      variant={isPopular && !isCurrentPlan ? "default" : "outline"}
                    >
                      {isCurrentPlan ? (
                        <div className="flex items-center justify-center">
                          <Check className="w-4 h-4 mr-2" />
                          Current Plan
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Crown className="w-4 h-4 mr-2" />
                          Select Plan
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
