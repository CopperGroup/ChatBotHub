"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Crown, ArrowLeft, Shield, Loader2, UserIcon, Check, Zap, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { authFetch } from "@/lib/authFetch"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Plan {
  _id: string
  name: string
  description: string
  priceMonthly: number
  maxStaffMembers: number
  allowAI: boolean
  creditBoostMonthly: number
}

interface Website {
  _id: string
  name: string
  plan: {
    _id: string
    name: string
    priceMonthly: number
  }
  stripeSubscriptionId?: string; // ADDED: To determine if it's an initial sub or plan change
}

function SubscriptionPaymentPageSkeleton() {
  return (
    <div className="h-screen max-h-screen bg-white overflow-hidden">
      <div className="grid lg:grid-cols-2 h-full">
        {/* Left Side Skeleton */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-md">
            <Skeleton className="h-8 w-3/4 mb-5 bg-emerald-500/20" />
            <Skeleton className="h-4 w-full mb-2 bg-emerald-500/20" />
            <Skeleton className="h-4 w-4/5 mb-6 bg-emerald-500/20" />
            <div className="bg-white/10 rounded-xl p-5">
              <Skeleton className="h-5 w-32 mb-3 bg-emerald-500/20" />
              <div className="flex space-x-6">
                <div>
                  <Skeleton className="h-7 w-16 mb-1 bg-emerald-500/20" />
                  <Skeleton className="h-3 w-20 bg-emerald-500/20" />
                </div>
                <div>
                  <Skeleton className="h-7 w-16 mb-1 bg-emerald-500/20" />
                  <Skeleton className="h-3 w-20 bg-emerald-500/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Skeleton */}
        <div className="p-8 lg:p-10 flex flex-col justify-center bg-slate-100">
          <div className="max-w-sm mx-auto w-full">
            <div className="flex justify-center mb-6">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Progress Circle Component
function ProgressCircle({
  progress,
  isProcessing,
  isSuccess,
  isError,
  children,
}: {
  progress: number
  isProcessing: boolean
  isSuccess: boolean
  isError: boolean
  children: React.ReactNode
}) {
  const circumference = 2 * Math.PI * 60 // radius = 60
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Background Circle */}
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-300" />
        {/* Progress Circle */}
        <circle
          cx="64"
          cy="64"
          r="60"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-500 ease-out ${
            isError
              ? "text-red-500"
              : isSuccess
                ? "text-emerald-500"
                : progress > 0
                  ? "text-emerald-500"
                  : "text-slate-300"
          }`}
          style={{
            strokeLinecap: "round",
            animation: isError ? "progressError 1s ease-out" : undefined,
          }}
        />
      </svg>

      {/* Center Content */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500`}>
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 ${
            isSuccess
              ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg"
              : isError
                ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg"
                : "bg-slate-400 grayscale"
          }`}
        >
          {children}
        </div>
      </div>

      {/* Success Animation */}
      {isSuccess && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-emerald-500/20"></div>
        </div>
      )}
    </div>
  )
}

function SubscriptionPaymentForm({
  website,
  selectedPlan,
  currentPlan,
  user,
}: {
  website: Website
  selectedPlan: Plan
  currentPlan: Plan | null
  user: any
}) {
  const [cardholderName, setCardholderName] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  // Calculate progress based on form completion
  useEffect(() => {
    let newProgress = 0

    if (cardholderName.trim()) newProgress += 25

    const cardElement = elements?.getElement(CardElement)
    if (cardElement) {
      // We'll assume card is valid if name is filled (simplified for demo)
      if (cardholderName.trim()) newProgress += 75
    }

    setProgress(newProgress)
  }, [cardholderName, elements])

  const showMessage = (text: string, type: "success" | "error" | "info" = "info") => {
    if (type === "success") {
      toast.success(text)
    } else if (type === "error") {
      toast.error(text)
    } else {
      toast.info(text)
    }
  }

  const handleSubscribe = async () => {
    if (!stripe || !elements) {
      showMessage("Stripe is not loaded yet. Please try again.", "error")
      return
    }

    if (!cardholderName.trim()) {
      showMessage("Please enter the name on the card.", "error")
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      showMessage("Card element not found. Please refresh the page.", "error")
      return
    }

    setLoading(true)
    setIsProcessing(true)
    setIsError(false)
    setIsSuccess(false)

    try {
      let response;
      let clientSecret;
      let subscriptionId; // This will be newSubscriptionId from change-plan route if applicable

      if (website.stripeSubscriptionId) {
        // SCENARIO 1: Changing an existing plan (website already has a Stripe subscription)
        console.log("Initiating plan change for existing subscription...");
        response = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/${website._id}/change-plan`, {
          method: "PUT", // Use PUT for updating resources
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            planId: selectedPlan._id,
            // oldStripeSubscriptionId is sent by the main service based on website.stripeSubscriptionId
            // The main service will handle passing this to the payment service
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || "Failed to initiate plan change.");
        }

        const responseData = await response.json();
        clientSecret = responseData.clientSecret;
        subscriptionId = responseData.newStripeSubscriptionId; // Get the new subscription ID

      } else {
        // SCENARIO 2: Initial subscription (website does not have a Stripe subscription yet)
        console.log("Initiating initial subscription...");
        response = await authFetch(`${process.env.NEXT_PUBLIC_PAYMENT_API_BASE_URL}/subscriptions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            websiteId: website._id,
            planId: selectedPlan._id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || "Failed to initiate subscription.");
        }

        const responseData = await response.json();
        clientSecret = responseData.clientSecret;
        subscriptionId = responseData.subscriptionId; // Get the new subscription ID
      }


      // If no clientSecret, it means no payment is required (e.g., free plan, or plan with no immediate charge)
      if (!clientSecret) {
        setIsSuccess(true)
        setIsProcessing(false)
        showMessage("Plan updated successfully! No payment required.", "success")

        setTimeout(() => {
          router.push(`/websites/${website._id}`)
        }, 3000)
        return
      }

      // 2. Confirm the card payment with Stripe
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName.trim(),
            email: user.email,
          },
        },
      })

      if (error) {
        setIsError(true)
        setIsProcessing(false)
        showMessage(error.message || "Payment failed. Please try again.", "error")

        setTimeout(() => {
          setIsError(false)
          setProgress(0)
        }, 2000)
      } else if (paymentIntent.status === "succeeded") {
        setIsSuccess(true)
        setIsProcessing(false)
        showMessage("Subscription successful! Your plan has been updated.", "success")

        setTimeout(() => {
          router.push(`/websites/${website._id}`)
        }, 3000)
      } else {
        setIsProcessing(false)
        showMessage(`Payment status: ${paymentIntent.status}`, "info")
      }
    } catch (error: any) {
      console.error("Subscription process failed:", error)
      setIsError(true)
      setIsProcessing(false)
      showMessage(error.message || "An unexpected error occurred.", "error")

      setTimeout(() => {
        setIsError(false)
        setProgress(0)
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const getPlanFeatures = (plan: Plan) => [
    `${plan.maxStaffMembers} Staff Member${plan.maxStaffMembers !== 1 ? "s" : ""}`,
    `AI Responses: ${plan.allowAI ? "Enabled" : "Disabled"}`,
    `${plan.creditBoostMonthly} AI Credits/month`,
    "24/7 Support",
    "Advanced Analytics",
    "Widget Customization",
  ]

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "pro":
      case "professional":
        return <Sparkles className="w-8 h-8 text-white" />
      case "enterprise":
        return <Crown className="w-8 h-8 text-white" />
      default:
        return <Zap className="w-8 h-8 text-white" />
    }
  }

  return (
    <div className="h-screen max-h-screen bg-white overflow-hidden">
      <div className="grid lg:grid-cols-2 h-full">
        {/* Left Side - Plan Info */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 lg:p-10 flex flex-col justify-center relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-md relative z-10">
            {/* Back Button */}
            <Link
              href={`/pricing?websiteId=${website._id}&currentPlanId=${currentPlan?._id}`}
              className="inline-flex items-center text-emerald-100 hover:text-white mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Plans
            </Link>

            {/* Main Content */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                Upgrade to {selectedPlan.name}
              </h1>
              <p className="text-emerald-100 text-base leading-relaxed">{selectedPlan.description}</p>
            </div>

            {/* Plan Comparison */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center justify-between">
                Plan Upgrade
                <Badge className="bg-emerald-500 text-white border-0 px-2 py-1 text-xs">{website.name}</Badge>
              </h3>
              <div className="flex items-center space-x-6">
                <div>
                  <div className="text-lg text-emerald-200 line-through">
                    {currentPlan ? `$${currentPlan.priceMonthly}` : "$0"}
                  </div>
                  <div className="text-emerald-200 text-xs">Current Plan</div>
                </div>
                <div className="text-emerald-200">→</div>
                <div>
                  <div className="text-2xl font-bold text-white">${selectedPlan.priceMonthly}</div>
                  <div className="text-emerald-200 text-xs">New Plan</div>
                </div>
              </div>
            </div>

            {/* Plan Features */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <h4 className="text-white font-semibold mb-3">What's included:</h4>
              <ul className="space-y-2">
                {getPlanFeatures(selectedPlan).map((feature, index) => (
                  <li key={index} className="flex items-center text-emerald-100 text-sm">
                    <Check className="w-4 h-4 mr-2 text-emerald-300 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - Payment Form with Cool Progress Circle */}
        <div className={`p-6 lg:p-10 flex flex-col justify-center bg-slate-100`}>
          <div className="max-w-sm mx-auto w-full">
            {/* Progress Circle with Logo */}
            <div className="mb-8">
              <ProgressCircle progress={progress} isProcessing={isProcessing} isSuccess={isSuccess} isError={isError}>
                {getPlanIcon(selectedPlan.name)}
              </ProgressCircle>

              <div className="text-center mt-4">
                <h2 className={`text-xl font-bold text-slate-700 transition-colors duration-500`}>
                  {isSuccess ? "Welcome to " + selectedPlan.name + "!" : "Complete Subscription"}
                </h2>
                {isSuccess && (
                  <p className="text-slate-600 text-sm mt-1 animate-fade-in">
                    🎉 Your plan has been upgraded successfully!
                  </p>
                )}
              </div>
            </div>

            {!isSuccess && (
              <div className="space-y-4">
                {/* Plan Summary */}
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-slate-900">${selectedPlan.priceMonthly}</div>
                  <div className="text-xs text-slate-600">per month</div>
                  <div className="text-sm font-medium text-slate-700 mt-1">{selectedPlan.name} Plan</div>
                </div>

                {/* Payment Form */}
                <div className="space-y-3">
                  <Label className="text-slate-700 font-semibold text-sm">Payment Details</Label>

                  <div className="relative">
                    <Input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="Name on card"
                      className="pl-10 h-10 border-2 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg bg-white"
                      required
                      disabled={loading}
                    />
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>

                  <div className="p-3 border-2 border-slate-300 rounded-lg focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all bg-white">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "14px",
                            color: "#1e293b",
                            fontFamily: "Inter, system-ui, sans-serif",
                            "::placeholder": {
                              color: "#64748b",
                            },
                          },
                        },
                        disabled: loading,
                      }}
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-600 bg-white p-2 rounded-lg">
                    <Shield className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span>Secured by Stripe • Cancel anytime</span>
                  </div>
                </div>

                {/* Subscribe Button */}
                <Button
                  onClick={handleSubscribe}
                  disabled={loading || !stripe || !elements || !cardholderName.trim() || progress < 100}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg shadow-lg text-base font-semibold transition-all transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Subscribe to {selectedPlan.name}
                    </>
                  )}
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  Secure payment • Instant activation • 30-day money-back guarantee
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressError {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: ${2 * Math.PI * 60}; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

function SubscriptionPaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [website, setWebsite] = useState<Website | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
  const [error, setError] = useState<string | null>(null)

  const websiteId = searchParams.get("websiteId")
  const planId = searchParams.get("planId")
  const currentPlanId = searchParams.get("currentPlanId")

  useEffect(() => {
    if (!loading && user && websiteId && planId) {
      // Find the website from the user's websites list
      // Ensure the user object has a 'websites' array and it's populated with full website objects
      // including the 'stripeSubscriptionId' if it exists.
      const foundWebsite = user.websites?.find((w: Website) => w._id === websiteId) as Website | undefined;


      if (foundWebsite) {
        setWebsite(foundWebsite)

        // Fetch the selected plan and current plan details
        const fetchPlanDetails = async () => {
          try {
            // Fetch all plans
            const plansResponse = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/plans`)
            if (plansResponse.ok) {
              const plans = await plansResponse.json()

              const selected = plans.find((p: Plan) => p._id === planId)
              const current = currentPlanId ? plans.find((p: Plan) => p._id === currentPlanId) : null

              if (selected) {
                setSelectedPlan(selected)
                setCurrentPlan(current)
              } else {
                setError("Selected plan not found.")
              }
            } else {
              setError("Failed to load plan details.")
            }
          } catch (err) {
            setError("Failed to load plan details.")
          }
        }

        fetchPlanDetails()
      } else {
        setError("Website not found or you don't have access to this website.")
      }
    } else if (!loading && !user) {
      router.push("/login")
    } else if (!loading && (!websiteId || !planId)) {
      setError("Missing required parameters")
    }
  }, [user, loading, websiteId, planId, currentPlanId, router])

  if (loading) {
    return <SubscriptionPaymentPageSkeleton />
  }

  if (!user) {
    router.push("/login")
    return null
  }

  // Show error as toast and redirect
  if (error) {
    toast.error(error)
    router.push("/websites")
    return <SubscriptionPaymentPageSkeleton />
  }

  if (!website || !selectedPlan) {
    return <SubscriptionPaymentPageSkeleton />
  }

  return <SubscriptionPaymentForm website={website} selectedPlan={selectedPlan} currentPlan={currentPlan} user={user} />
}

export default function SubscriptionPaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <Suspense fallback={<SubscriptionPaymentPageSkeleton />}>
        <SubscriptionPaymentContent />
      </Suspense>
    </Elements>
  )
}