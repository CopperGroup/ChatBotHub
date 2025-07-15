"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, BarChart3, Crown, Loader2, Globe, Calendar, Brain, XCircle } from "lucide-react"
import { WebsiteSettings } from "./website-settings"
import { StaffManagement } from "./staff-management"
import { AIManagement } from "./ai-management"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { authFetch } from "@/lib/authFetch" // Import authFetch

interface Website {
  _id: string
  name: string
  link: string
  description: string
  chatbotCode: string
  predefinedAnswers: string
  chats: string[]
  plan: {
    _id: string
    name: string
    description: string
    priceMonthly: number
    maxStaffMembers: number
    allowAI: boolean
    creditBoostMonthly: number
  }
  creditCount: number
  staffMembers: string[]
  preferences: {
    colors: {
      gradient1: string
      gradient2: string
    }
    header: string
    allowAIResponses: boolean
    allowedPaths?: string[]
    disallowedPaths?: string[]
    language?: string
    dailyTokenLimit?: number | null
  }
  createdAt: string
  updatedAt: string
  stripeSubscriptionId?: string
  freeTrialPlanId?: string
  freeTrialEnded?: boolean
  exlusiveCustomer?: boolean
}

interface PlanInfo {
  plan: {
    name: string
    description: string
    priceMonthly: number
    maxStaffMembers: number
    allowAI: boolean
    creditBoostMonthly: number
  }
  usage: {
    staff: {
      current: number
      max: number
      canAddMore: boolean
    }
    ai: {
      enabled: boolean
      credits: number
      canUse: boolean
    }
  }
}

interface WebsiteDetailsProps {
  _website: Website
  userId: string
}

function WebsiteDetailsSkeleton() {
  return (
    <div className="space-y-6 px-6 py-8">
      {/* Website Header Section Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-4" />
        <Skeleton className="h-6 w-48 rounded-lg" />
      </div>

      {/* Tabs List Skeleton */}
      <Skeleton className="h-12 w-full rounded-2xl mb-6" />

      {/* Overview Tab Content Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-3xl" /> {/* Plan Info Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-3xl" /> {/* Website Information Card */}
      </div>
    </div>
  )
}

export function WebsiteDetails({ _website, userId }: WebsiteDetailsProps) {
  const [website, setWebsite] = useState<Website>(_website)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [cancellingSubscription, setCancellingSubscription] = useState(false) // State for cancellation loading

  // Derive planInfo directly from the website prop
  const planInfo: PlanInfo = {
    plan: website.plan,
    usage: {
      staff: {
        current: website.staffMembers.length,
        max: website.plan.maxStaffMembers,
        canAddMore: website.staffMembers.length < website.plan.maxStaffMembers,
      },
      ai: {
        enabled: website.preferences.allowAIResponses,
        credits: website.creditCount,
        canUse: website.creditCount > 0 && website.preferences.allowAIResponses,
      },
    },
  }

  // Check if plan is Enterprise
  const isEnterprisePlan = website.plan.name.toLowerCase().includes("enterprise")

  useEffect(() => {
    // Simulate loading for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleWebsiteUpdate = (updatedWebsite: Website) => {
    setWebsite(updatedWebsite)
    toast.success("Website updated successfully")
  }

  const handleCancelSubscription = async () => {
    if (!website.stripeSubscriptionId) {
      toast.info("No active subscription to cancel.")
      return
    }

    if (!window.confirm("Are you sure you want to cancel your subscription? This action cannot be undone.")) {
      return
    }

    setCancellingSubscription(true)
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/${website._id}/cancel-subscription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
          }),
        },
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to cancel subscription.")
      }

      toast.success(
        "Subscription cancellation initiated! Your plan will revert to Free at the end of the current billing period.",
      )

      // Refetch website data to reflect the updated plan status
      const updatedWebsiteRes = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/${website._id}`)
      if (updatedWebsiteRes.ok) {
        const updatedWebsiteData = await updatedWebsiteRes.json()
        setWebsite(updatedWebsiteData)
      } else {
        console.error("Failed to refetch website after cancellation:", await updatedWebsiteRes.json())
      }
    } catch (error: any) {
      console.error("Error canceling subscription:", error)
      toast.error(error.message || "Failed to cancel subscription. Please try again.")
    } finally {
      setCancellingSubscription(false)
    }
  }

  if (isLoading) {
    return <WebsiteDetailsSkeleton />
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      {/* Website Header Section (Concise) */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 break-words">{website.name}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center mt-2 space-y-2 sm:space-y-0 sm:space-x-2">
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 border-slate-200 font-mono text-xs w-fit rounded-lg"
          >
            {website.chatbotCode}
          </Badge>
          <span className="text-xs text-slate-500 font-medium">Chatbot Code</span>
        </div>
      </div>

      {/* Tabs Section (Immediately visible) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-2xl h-auto shadow-sm">
          <TabsTrigger
            value="overview"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md py-2.5 px-3 text-sm font-semibold transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md py-2.5 px-3 text-sm font-semibold transition-all duration-200"
          >
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="staff"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md py-2.5 px-3 text-sm font-semibold transition-all duration-200"
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Staff</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md py-2.5 px-3 text-sm font-semibold transition-all duration-200"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Tab Content for Overview */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Current Plan Info Card (moved here) */}
          {website.plan && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 text-white overflow-hidden rounded-3xl relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

              <CardHeader className="pb-6 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white mb-2">{website.plan.name} Plan</CardTitle>
                      <p className="text-emerald-100 text-base leading-relaxed mb-4">{website.plan.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-3 bg-white/10 rounded-2xl px-4 py-3">
                          <BarChart3 className="w-5 h-5 text-emerald-100" />
                          <div>
                            <p className="text-white font-semibold">{website.creditCount}</p>
                            <p className="text-emerald-100 text-xs">Credits Available</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 bg-white/10 rounded-2xl px-4 py-3">
                          <Users className="w-5 h-5 text-emerald-100" />
                          <div>
                            <p className="text-white font-semibold">
                              {planInfo.usage.staff.current}/{planInfo.plan.maxStaffMembers}
                            </p>
                            <p className="text-emerald-100 text-xs">Staff Members</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <Link
                      href={`/pricing?websiteId=${website._id.toString()}&currentPlanId=${website.plan._id.toString()}`}
                    >
                      <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </Link>
                    {website.stripeSubscriptionId && website.plan.name !== "Free" && (
                      <Button
                        variant="ghost"
                        onClick={handleCancelSubscription}
                        disabled={cancellingSubscription}
                        className="text-white hover:bg-white/10 border border-white/20 rounded-2xl px-4 py-3 w-full sm:w-auto transition-all duration-300"
                      >
                        {cancellingSubscription ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel Plan
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* Usage Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-xl" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 relative z-10">
                <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Total Conversations
                </CardTitle>
                <MessageSquare className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent className="px-6 relative z-10">
                <div className="text-2xl font-bold text-slate-900">{website.chats.length}</div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {website.chats.length === 0 ? "No conversations yet" : `Total conversations`}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-xl" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 relative z-10">
                <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Staff Members
                </CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent className="px-6 relative z-10">
                <div className="text-2xl font-bold text-slate-900">{planInfo.usage.staff.current}</div>
                <p className="text-xs text-slate-500 font-medium mt-1">of {planInfo.plan.maxStaffMembers} allowed</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden sm:col-span-2 lg:col-span-1">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-violet-500/10 rounded-full blur-xl" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 relative z-10">
                <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">AI Credits</CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent className="px-6 relative z-10">
                <div className="text-2xl font-bold text-slate-900">{website.creditCount}</div>
                <p className="text-xs text-slate-500 font-medium mt-1">+{planInfo.plan.creditBoostMonthly} monthly</p>
              </CardContent>
            </Card>
          </div>

          {/* Website Information Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-slate-200/30 rounded-full blur-2xl" />
            <CardHeader className="px-6 relative z-10">
              <CardTitle className="text-xl font-bold text-slate-900">Website Information</CardTitle>
              <CardDescription className="text-slate-600 text-sm font-medium">
                General details about your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Website URL</label>
                  <div className="flex items-center space-x-2 min-w-0">
                    <Globe className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <a
                      href={website.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate min-w-0 font-medium"
                    >
                      {website.link}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Created</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <p className="text-sm text-slate-600 font-medium">
                      {new Date(website.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Last Updated</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <p className="text-sm text-slate-600 font-medium">
                    {new Date(website.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 border-t border-slate-200/60 text-xs text-slate-500 px-6 py-3 rounded-b-3xl relative z-10">
              <span className="truncate font-medium">Website ID: {website._id}</span>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab Content for AI Management */}
        <TabsContent value="ai" className="mt-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8 md:p-12 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-lg">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <p className="text-slate-600 text-base font-medium">Loading AI management...</p>
                </div>
              </div>
            }
          >
            <AIManagement website={website} userId={userId} onUpdate={handleWebsiteUpdate} />
          </Suspense>
        </TabsContent>

        {/* Tab Content for Staff Management */}
        <TabsContent value="staff" className="mt-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8 md:p-12 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-lg">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  <p className="text-slate-600 text-base font-medium">Loading staff management...</p>
                </div>
              </div>
            }
          >
            <StaffManagement websiteId={website._id} userId={userId} />
          </Suspense>
        </TabsContent>

        {/* Tab Content for Website Settings */}
        <TabsContent value="settings" className="mt-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8 md:p-12 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-lg">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  <p className="text-slate-600 text-base font-medium">Loading website settings...</p>
                </div>
              </div>
            }
          >
            <WebsiteSettings website={website} userId={userId} onUpdate={handleWebsiteUpdate} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
