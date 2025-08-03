"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Crown, Zap, Loader2, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Plan {
  _id: string
  name: string
  description: string
  priceMonthly: number
  maxStaffMembers: number
  allowAI: boolean
  creditBoostMonthly: number
}

interface PlanUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: Plan
  plans: Plan[]
  onSelectPlan: (planId: string) => void
  loading?: boolean
}

function PlanLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-2 border-slate-200">
          <CardHeader className="text-center pb-6 px-6 md:px-8 pt-6 md:pt-8">
            <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-2xl mx-auto mb-4" />
            <Skeleton className="h-6 w-24 mx-auto mb-2" />
            <Skeleton className="h-8 w-20 mx-auto mb-4" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-6 px-6 md:px-8 pb-6 md:pb-8">
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
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

export function PlanUpgradeModal({
  isOpen,
  onClose,
  currentPlan,
  plans,
  onSelectPlan,
  loading,
}: PlanUpgradeModalProps) {
  const handleSelectPlan = (planId: string) => {
    onSelectPlan(planId)
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
        return "from-blue-500 to-blue-600"
      case "enterprise":
        return "from-purple-500 to-purple-600"
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-6xl xl:max-w-7xl min-w-[320px] sm:min-w-[600px] md:min-w-[800px] lg:min-w-[1000px] xl:min-w-[1200px] max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader className="text-center mb-6 md:mb-8">
          <DialogTitle className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Simple,
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              transparent pricing
            </span>
          </DialogTitle>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Choose the plan that fits your needs. Upgrade to unlock advanced features and grow your business.
          </p>
        </DialogHeader>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const isCurrentPlan = currentPlan?._id === plan._id
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
                      <CardTitle className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
                        {plan.name}
                      </CardTitle>
                      <div className="mb-4">
                        <span className="text-3xl md:text-4xl font-bold text-slate-900">${plan.priceMonthly}</span>
                        <span className="text-slate-600 ml-2 text-sm md:text-base">per month</span>
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
                          <span className="text-slate-700 text-sm md:text-base leading-relaxed">
                            Advanced Analytics
                          </span>
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
                        disabled={isCurrentPlan || loading}
                        className={`w-full py-3 md:py-4 text-sm md:text-base font-semibold rounded-xl transition-all duration-200 ${
                          isPopular && !isCurrentPlan
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
                            : isCurrentPlan
                              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                              : "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-emerald-300 shadow-sm hover:shadow-md"
                        }`}
                        variant={isPopular && !isCurrentPlan ? "default" : "outline"}
                      >
                        {loading && !isCurrentPlan ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Upgrading...
                          </div>
                        ) : isCurrentPlan ? (
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

            <div className="text-center mt-8 md:mt-12">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200 max-w-2xl mx-auto">
                <p className="text-slate-700 mb-4 font-medium">
                  All plans include a 3-day free trial. No credit card required.
                </p>
                <p className="text-sm text-slate-600">
                  Need a custom solution with advanced integrations?{" "}
                  <span className="text-emerald-600 hover:text-emerald-700 font-medium underline decoration-emerald-300 cursor-pointer">
                    Contact our sales team
                  </span>
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
