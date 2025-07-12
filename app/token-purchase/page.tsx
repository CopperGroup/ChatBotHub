"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Zap, ArrowLeft, Shield, Loader2, UserIcon } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Website {
  _id: string
  name: string
  creditCount: number
  plan: {
    name: string
    allowAI: boolean
  }
}

function TokenPurchasePageSkeleton() {
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
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="flex justify-center mb-6">
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
            <Skeleton className="h-6 w-48 mb-6 mx-auto" />
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TokenPurchaseForm({ website, user }: { website: Website; user: any }) {
  const [tokensAmount, setTokensAmount] = useState(1000)
  const [cardholderName, setCardholderName] = useState("")
  const [loading, setLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  // Calculate price based on token coefficient multiplier
  const TOKEN_COEFFICIENT_MULTIPLIER = 20
  const priceInCents = Math.round((tokensAmount / TOKEN_COEFFICIENT_MULTIPLIER) * 100)
  const priceInDollars = (priceInCents / 100).toFixed(2)

  const showMessage = (text: string, type: "success" | "error" | "info" = "info") => {
    if (type === "success") {
      toast.success(text)
    } else if (type === "error") {
      toast.error(text)
    } else {
      toast.info(text)
    }
  }

  const handlePurchase = async () => {
    if (!stripe || !elements) {
      showMessage("Stripe is not loaded yet. Please try again.", "error")
      return
    }

    if (tokensAmount <= 0) {
      showMessage("Please enter a valid amount of tokens.", "error")
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

    try {
      // 1. Create PaymentIntent on your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_API_BASE_URL}/token-purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("userToken") || "",
        },
        body: JSON.stringify({
          userId: user._id,
          websiteId: website._id,
          tokensAmount: tokensAmount,
          currency: "usd",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to initiate payment.")
      }

      const { clientSecret, paymentId } = await response.json()

      if (!clientSecret) {
        throw new Error("Payment service did not return a client secret.")
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
        showMessage(error.message || "Payment failed. Please try again.", "error")
      } else if (paymentIntent.status === "succeeded") {
        showMessage("Payment successful! Tokens have been added to your account.", "success")

        // Redirect back to website details after successful payment
        setTimeout(() => {
          router.push(`/websites/${website._id}?tab=ai`)
        }, 2000)
      } else {
        showMessage(`Payment status: ${paymentIntent.status}`, "info")
      }
    } catch (error: any) {
      console.error("Payment process failed:", error)
      showMessage(error.message || "An unexpected error occurred.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen max-h-screen bg-white overflow-hidden">
      <div className="grid lg:grid-cols-2 h-full">
        {/* Left Side - Info */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 lg:p-10 flex flex-col justify-center relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-md relative z-10">
            {/* Back Button */}
            <Link
              href={`/websites/${website._id}?tab=ai`}
              className="inline-flex items-center text-emerald-100 hover:text-white mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to {website.name}
            </Link>

            {/* Main Content */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">Purchase AI Tokens</h1>
              <p className="text-emerald-100 text-base leading-relaxed">
                Add tokens to your account and unlock unlimited AI-powered conversations for your website.
              </p>
            </div>

            {/* Status Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <h3 className="text-white font-semibold mb-3 flex items-center justify-between">
                Current Balance
                <Badge className="bg-emerald-500 text-white border-0 px-2 py-1 text-xs">{website.plan.name}</Badge>
              </h3>
              <div className="flex items-center space-x-6">
                <div>
                  <div className="text-2xl font-bold text-white">{website.creditCount.toLocaleString()}</div>
                  <div className="text-emerald-200 text-xs">Available Tokens</div>
                </div>
                <div className="text-emerald-200">→</div>
                <div>
                  <div className="text-2xl font-bold text-emerald-200">
                    {(website.creditCount + tokensAmount).toLocaleString()}
                  </div>
                  <div className="text-emerald-200 text-xs">After Purchase</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-6 lg:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            {/* Header with Logo moved back to center */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Complete Purchase</h2>
            </div>

            <div className="space-y-4">
              {/* Token Selection - Made less tall */}
              <div className="space-y-3">
                <Label className="text-slate-900 font-semibold text-sm">Token Amount</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 2500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTokensAmount(amount)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        tokensAmount === amount
                          ? "border-emerald-500 bg-emerald-50 shadow-sm"
                          : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                      }`}
                    >
                      <div
                        className={`text-sm font-bold ${tokensAmount === amount ? "text-emerald-700" : "text-slate-900"}`}
                      >
                        {amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        ${(amount / TOKEN_COEFFICIENT_MULTIPLIER).toFixed(0)}
                      </div>
                    </button>
                  ))}
                </div>
                <Input
                  type="number"
                  value={tokensAmount}
                  onChange={(e) => setTokensAmount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  min="1"
                  className="h-10 text-center text-base font-semibold border-2 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                  placeholder="Custom amount"
                />
              </div>

              {/* Price Display */}
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">${priceInDollars}</div>
                <div className="text-xs text-slate-600">${(1 / TOKEN_COEFFICIENT_MULTIPLIER).toFixed(3)} per token</div>
              </div>

              {/* Payment Form */}
              <div className="space-y-3">
                <Label className="text-slate-900 font-semibold text-sm">Payment Details</Label>

                <div className="relative">
                  <Input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="Name on card"
                    className="pl-10 h-10 border-2 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                    required
                  />
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>

                <div className="p-3 border-2 border-slate-200 rounded-lg focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
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
                    }}
                  />
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                  <Shield className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span>Secured by Stripe</span>
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                disabled={loading || !stripe || !elements || !cardholderName.trim()}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg shadow-lg text-base font-semibold transition-all transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Purchase {tokensAmount.toLocaleString()} Tokens</>
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center">Secure payment • Instant delivery • No hidden fees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TokenPurchaseContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [website, setWebsite] = useState<Website | null>(null)
  const [error, setError] = useState<string | null>(null)

  const websiteId = searchParams.get("websiteId")

  useEffect(() => {
    if (!loading && user && websiteId) {
      const foundWebsite = user.websites?.find((w: any) => w._id === websiteId)

      if (foundWebsite) {
        if (!foundWebsite.plan.allowAI) {
          setError("AI features are not available on your current plan. Please upgrade your plan first.")
        } else {
          setWebsite(foundWebsite)
        }
      } else {
        setError("Website not found or you don't have access to this website.")
      }
    } else if (!loading && !user) {
      router.push("/login")
    } else if (!loading && !websiteId) {
      setError("Website ID is required")
    }
  }, [user, loading, websiteId, router])

  if (loading) {
    return <TokenPurchasePageSkeleton />
  }

  if (!user) {
    router.push("/login")
    return null
  }

  // Show error as toast and redirect
  if (error) {
    toast.error(error)
    router.push("/websites")
    return <TokenPurchasePageSkeleton />
  }

  if (!website) {
    return <TokenPurchasePageSkeleton />
  }

  return <TokenPurchaseForm website={website} user={user} />
}

export default function TokenPurchasePage() {
  return (
    <Elements stripe={stripePromise}>
      <Suspense fallback={<TokenPurchasePageSkeleton />}>
        <TokenPurchaseContent />
      </Suspense>
    </Elements>
  )
}
