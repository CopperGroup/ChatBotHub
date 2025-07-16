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

interface PricingPageClientProps {
  websiteId?: string
  currentPlanId?: string
}

function PlanLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-2 border-slate-200">
          <CardHeader className="text-center pb-3 px-3 pt-4">
            <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-2" />
            <Skeleton className="h-4 w-16 mx-auto mb-1" />
            <Skeleton className="h-5 w-12 mx-auto mb-2" />
            <Skeleton className="h-3 w-20 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-3 px-3 pb-4">
            <div className="space-y-1.5">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-3 w-full" />
              ))}
            </div>
            <Skeleton className="h-8 w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function PricingPageClient({ websiteId, currentPlanId }: PricingPageClientProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

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
    if (!websiteId) {
      toast.error("Website ID is missing from the URL. Cannot upgrade plan.")
      return
    }
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
        return <Sparkles className="w-5 h-5 text-white" />
      case "enterprise":
        return <Crown className="w-5 h-5 text-white" />
      default:
        return <Zap className="w-5 h-5 text-white" />
    }
  }

  const isPopularPlan = (planName: string) => {
    return planName.toLowerCase() === "pro" || planName.toLowerCase() === "professional"
  }

  if (authLoading) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    )
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4 lg:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push(`/websites`)}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
          {/* Header Section */}
          <div className="text-center mb-4 lg:mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2 lg:mb-3">
              Simple,
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                transparent pricing
              </span>
            </h1>
            <p className="text-sm lg:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Choose the plan that fits your needs. Upgrade to unlock advanced features and grow your business.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-6">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                <span className="text-sm text-slate-700">Loading plans...</span>
              </div>
            </div>
          )}

          {loading && <PlanLoadingSkeleton />}

          {/* Empty State */}
          {!loading && plans.length === 0 && (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">No plans available</h3>
              <p className="text-sm text-slate-500">Please try again later or contact support.</p>
            </div>
          )}

          {/* Plans Grid */}
          {!loading && plans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {plans.map((plan) => {
                const isCurrentPlan = currentPlanId === plan._id
                const isPopular = isPopularPlan(plan.name)
                const gradient = getPlanGradient(plan.name)

                return (
                  <Card
                    key={plan._id}
                    className={`relative bg-white border-2 transition-all duration-300 hover:shadow-lg ${
                      isPopular
                        ? "border-emerald-500 shadow-lg scale-[1.02] ring-2 ring-emerald-100"
                        : isCurrentPlan
                          ? "border-emerald-500 shadow-md"
                          : "border-slate-200 hover:border-emerald-200 shadow-sm"
                    }`}
                  >
                    {isCurrentPlan && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md rounded-full px-2 py-0.5 text-xs">
                        Current Plan
                      </Badge>
                    )}
                    {isPopular && !isCurrentPlan && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md rounded-full px-2 py-0.5 text-xs">
                        <Crown className="w-2.5 h-2.5 mr-1" />
                        Most Popular
                      </Badge>
                    )}

                    <CardHeader className="text-center pb-3 px-3 lg:px-4 pt-4">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md`}
                      >
                        {getPlanIcon(plan.name)}
                      </div>
                      <CardTitle className="text-base lg:text-lg font-semibold text-slate-900 mb-1">
                        {plan.name}
                      </CardTitle>
                      <div className="mb-2">
                        <span className="text-xl lg:text-2xl font-bold text-slate-900">
                          {plan.priceMonthly === 0 ? "Free" : `$${plan.priceMonthly}`}
                        </span>
                        <span className="text-slate-600 ml-1 text-xs">
                          {plan.priceMonthly === 0 ? "forever" : "per month"}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs leading-tight">{plan.description}</p>
                    </CardHeader>

                    <CardContent className="space-y-3 px-3 lg:px-4 pb-4">
                      <ul className="space-y-1.5">
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-xs leading-tight">
                            {plan.maxStaffMembers} Staff Member{plan.maxStaffMembers !== 1 ? "s" : ""}
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-xs leading-tight">
                            AI Responses: {plan.allowAI ? "Enabled" : "Disabled"}
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-xs leading-tight">
                            {plan.creditBoostMonthly} AI Credits/month
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-xs leading-tight">24/7 Support</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-xs leading-tight">Advanced Analytics</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-xs leading-tight">Widget Customization</span>
                        </li>
                      </ul>

                      <Button
                        onClick={() => handleSelectPlan(plan._id)}
                        disabled={isCurrentPlan}
                        className={`w-full py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                          isPopular && !isCurrentPlan
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg"
                            : isCurrentPlan
                              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                              : "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-emerald-300 shadow-sm hover:shadow-md"
                        }`}
                        variant={isPopular && !isCurrentPlan ? "default" : "outline"}
                      >
                        {isCurrentPlan ? (
                          <div className="flex items-center justify-center">
                            <Check className="w-3 h-3 mr-1" />
                            Current Plan
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Crown className="w-3 h-3 mr-1" />
                            Select Plan
                          </div>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
