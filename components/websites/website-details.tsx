"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, BarChart3, Crown, Loader2, Globe, Calendar, Zap, Brain, ArrowRight } from "lucide-react"
import { WebsiteSettings } from "./website-settings"
import { StaffManagement } from "./staff-management"
import { AIManagement } from "./ai-management"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
    <div className="space-y-4 md:space-y-6 px-4 md:px-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-6 md:h-8 w-48 md:w-64 mb-2" />
            <Skeleton className="h-4 w-full max-w-96 mb-2" />
            <Skeleton className="h-4 w-32 md:w-48" />
          </div>
          <div className="flex items-center gap-2 self-start">
            <Skeleton className="h-6 w-20 md:w-24" />
            <Skeleton className="h-6 w-16 md:w-20" />
          </div>
        </div>
      </div>
      <Skeleton className="h-32 md:h-40 w-full rounded-xl" />
      <div className="mt-6">
        <Skeleton className="h-10 w-full mb-4 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 md:h-32 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-48 md:h-64 w-full mt-4 rounded-xl" />
      </div>
    </div>
  )
}

export function WebsiteDetails({ _website, userId }: WebsiteDetailsProps) {
  const [website, setWebsite] = useState<Website>(_website)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return <WebsiteDetailsSkeleton />
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 break-words">{website.name}</h1>
            <p className="text-slate-600 mt-1 text-sm md:text-base">{website.description}</p>
            <div className="flex flex-col sm:flex-row sm:items-center mt-2 space-y-2 sm:space-y-0 sm:space-x-2">
              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-mono text-xs w-fit">
                {website.chatbotCode}
              </Badge>
              <span className="text-xs text-slate-500">Chatbot Code</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start">
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1.5 rounded-xl shadow-sm text-xs"
            >
              <Crown className="h-3 w-3" />
              <span className="truncate">{planInfo.plan.name} Plan</span>
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200 px-3 py-1.5 rounded-xl shadow-sm text-xs"
            >
              <Zap className="h-3 w-3" />
              {website.creditCount} Credits
            </Badge>
          </div>
        </div>
      </div>

      {/* Current Plan Info Card */}
      <Card className="mb-4 md:mb-6 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 shadow-sm">
        <CardHeader className="pb-2 px-4 md:px-6">
          <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
            <Crown className="h-5 w-5 text-emerald-600" />
            <span className="truncate">Current Plan: {planInfo.plan.name}</span>
          </CardTitle>
          <CardDescription className="text-slate-600 text-sm">{planInfo.plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-lg md:text-2xl font-bold text-slate-900">
                {planInfo.usage.staff.current}/{planInfo.plan.maxStaffMembers}
              </div>
              <div className="text-xs md:text-sm text-slate-600 flex items-center justify-center gap-1">
                <Users className="h-3 w-3" />
                <span className="hidden sm:inline">Staff Members</span>
                <span className="sm:hidden">Staff</span>
              </div>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-lg md:text-2xl font-bold text-slate-900">{website.creditCount}</div>
              <div className="text-xs md:text-sm text-slate-600 flex items-center justify-center gap-1">
                <Zap className="h-3 w-3" />
                <span className="hidden sm:inline">AI Credits</span>
                <span className="sm:hidden">Credits</span>
              </div>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-lg md:text-2xl font-bold text-slate-900">${website.plan.priceMonthly}</div>
              <div className="text-xs md:text-sm text-slate-600 flex items-center justify-center gap-1">
                <Crown className="h-3 w-3" />
                <span className="hidden sm:inline">Per Month</span>
                <span className="sm:hidden">Monthly</span>
              </div>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
              <div className="flex justify-center">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    planInfo.plan.allowAI
                      ? "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200"
                      : "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200"
                  } rounded-lg px-2 py-1`}
                >
                  {planInfo.plan.allowAI ? "AI Available" : "Human Only"}
                </Badge>
              </div>
              <div className="text-xs md:text-sm text-slate-600 flex items-center justify-center gap-1 mt-1">
                <Brain className="h-3 w-3" />
                AI Status
              </div>
            </div>
          </div>

          {/* Call to Action - Show upgrade if not Enterprise, else show buy tokens if AI enabled */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            {!isEnterprisePlan ? (
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        Upgrade Your Plan
                      </h3>
                      <p className="text-emerald-100 text-sm mb-4 lg:mb-0">
                        Unlock more features, increase limits, and get better value with our higher-tier plans.
                      </p>
                    </div>
                    <Link
                      href={`/pricing?websiteId=${website._id.toString()}&currentPlanId=${website.plan._id.toString()}`}
                      className="flex-shrink-0"
                    >
                      <Button className="bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl shadow-lg font-semibold px-6 py-3 h-auto transition-all transform hover:scale-105">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              planInfo.plan.allowAI && (
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                          <Zap className="w-5 h-5" />
                          Need More AI Credits?
                        </h3>
                        <p className="text-purple-100 text-sm mb-4 lg:mb-0">
                          Power up your AI conversations with additional credits. Get instant access to more AI
                          responses.
                        </p>
                      </div>
                      <Link href={`/token-purchase?websiteId=${website._id.toString()}`} className="flex-shrink-0">
                        <Button className="bg-white text-purple-600 hover:bg-purple-50 rounded-xl shadow-lg font-semibold px-6 py-3 h-auto transition-all transform hover:scale-105">
                          <Zap className="w-4 h-4 mr-2" />
                          Buy Credits
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-xl h-auto">
          <TabsTrigger
            value="overview"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm py-2 px-3 text-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm py-2 px-3 text-sm"
          >
            <div className="flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="staff"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm py-2 px-3 text-sm"
          >
            Staff
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm py-2 px-3 text-sm"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4 md:mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6">
                <CardTitle className="text-sm font-medium text-slate-700">Total Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                <div className="text-xl md:text-2xl font-bold text-slate-900">{website.chats.length}</div>
                <p className="text-xs text-slate-500">
                  {website.chats.length === 0 ? "No conversations yet" : `Total conversations`}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6">
                <CardTitle className="text-sm font-medium text-slate-700">Staff Members</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                <div className="text-xl md:text-2xl font-bold text-slate-900">{planInfo.usage.staff.current}</div>
                <p className="text-xs text-slate-500">of {planInfo.plan.maxStaffMembers} allowed</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6">
                <CardTitle className="text-sm font-medium text-slate-700">AI Credits</CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                <div className="text-xl md:text-2xl font-bold text-slate-900">{website.creditCount}</div>
                <p className="text-xs text-slate-500">+{planInfo.plan.creditBoostMonthly} monthly</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="px-4 md:px-6">
              <CardTitle className="text-slate-900">Website Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Website URL</label>
                  <div className="flex items-center space-x-2 min-w-0">
                    <Globe className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <a
                      href={website.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate min-w-0"
                    >
                      {website.link}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Created</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <p className="text-sm text-slate-600">
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
                <label className="text-sm font-medium text-slate-700 block mb-1">Last Updated</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <p className="text-sm text-slate-600">
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
            <CardFooter className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 text-xs text-slate-500 px-4 md:px-6">
              <span className="truncate">Website ID: {website._id}</span>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-4 md:mt-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8 md:p-12">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-purple-600" />
                  <p className="text-slate-600 text-sm md:text-base">Loading AI management...</p>
                </div>
              </div>
            }
          >
            <AIManagement website={website} userId={userId} onUpdate={handleWebsiteUpdate} />
          </Suspense>
        </TabsContent>

        <TabsContent value="staff" className="mt-4 md:mt-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8 md:p-12">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-emerald-600" />
                  <p className="text-slate-600 text-sm md:text-base">Loading staff management...</p>
                </div>
              </div>
            }
          >
            <StaffManagement websiteId={website._id} userId={userId} />
          </Suspense>
        </TabsContent>

        <TabsContent value="settings" className="mt-4 md:mt-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8 md:p-12">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-emerald-600" />
                  <p className="text-slate-600 text-sm md:text-base">Loading website settings...</p>
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
