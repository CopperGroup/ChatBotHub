"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, BarChart3, Crown, Loader2, Globe, Calendar, Zap, Brain, ArrowRight, Link as LinkIcon } from "lucide-react"
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
  freeTrialPlanId?: string
  freeTrialEnded?: boolean
  stripeSubscriptionId?: string
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
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Skeleton className="h-40 md:h-48 col-span-1 md:col-span-2 lg:col-span-3 rounded-xl" />
        <Skeleton className="h-64 md:h-80 col-span-1 md:col-span-1 lg:col-span-2 rounded-xl" /> {/* For actions/tabs column */}
        <Skeleton className="h-24 col-span-1 rounded-xl" />
        <Skeleton className="h-24 col-span-1 rounded-xl" />
        <Skeleton className="h-24 col-span-1 rounded-xl" />
        <Skeleton className="h-24 col-span-1 rounded-xl" />
        <Skeleton className="h-40 md:h-48 col-span-1 md:col-span-2 lg:col-span-3 rounded-xl" />
        <Skeleton className="h-40 md:h-48 col-span-1 md:col-span-1 lg:col-span-2 rounded-xl" />
      </div>
    </div>
  )
}

export function WebsiteDetails({ _website, userId }: WebsiteDetailsProps) {
  const [website, setWebsite] = useState<Website>(_website)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)

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

  const isEnterprisePlan = website.plan.name.toLowerCase().includes("enterprise")

  useEffect(() => {
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
    <div className="container mx-auto">
      {/* Main Tabs Component - This will handle the layout using its children's classes */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6"> {/* Parent grid for the entire layout */}

          {/* Left Column for Vertical TabsList and Call to Action */}
          <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6"> {/* Spans 2 columns on large screens */}

            {/* Vertical Tabs Navigation (TabsList) */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-2 flex-grow-0">
              <TabsList className="flex flex-col w-full bg-[#f6f6f6] p-1 rounded-xl h-auto gap-1">
                {/* Styled TabsTrigger buttons */}
                <TabsTrigger
                  value="overview"
                  className="w-full justify-start px-4 py-3 text-sm font-normal rounded-full transition-colors
                             data-[state=active]:bg-[#303030] data-[state=active]:text-[#f6f6f6] data-[state=active]:shadow-sm
                             hover:bg-[#303030]/10 hover:text-[#303030]"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="w-full justify-start px-4 py-3 text-sm font-normal rounded-full transition-colors
                             data-[state=active]:bg-[#303030] data-[state=active]:text-[#f6f6f6] data-[state=active]:shadow-sm
                             hover:bg-[#303030]/10 hover:text-[#303030]"
                >
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4" />
                    <span>AI</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="staff"
                  className="w-full justify-start px-4 py-3 text-sm font-normal rounded-full transition-colors
                             data-[state=active]:bg-[#303030] data-[state=active]:text-[#f6f6f6] data-[state=active]:shadow-sm
                             hover:bg-[#303030]/10 hover:text-[#303030]"
                >
                  Staff
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="w-full justify-start px-4 py-3 text-sm font-normal rounded-full transition-colors
                             data-[state=active]:bg-[#303030] data-[state=active]:text-[#f6f6f6] data-[state=active]:shadow-sm
                             hover:bg-[#303030]/10 hover:text-[#303030]"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
            </Card> {/* End of Card wrapper for TabsList */}

            {/* Upgrade / Buy Credits Call to Action Card */}
            <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white relative overflow-hidden flex-1 max-h-48"> {/* Added h-48 */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
              </div>

              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex-1">
                  {!isEnterprisePlan ? (
                    <>
                      <h3 className="text-xl font-normal mb-2 flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        Upgrade Your Plan
                      </h3>
                      <p className="text-emerald-100 text-sm font-light">
                        Unlock more features, increase limits, and get better value with our higher-tier plans.
                      </p>
                    </>
                  ) : (
                    planInfo.plan.allowAI && (
                      <>
                        <h3 className="text-xl font-normal mb-2 flex items-center gap-2">
                          <Zap className="w-5 h-5" />
                          Need More AI Credits?
                        </h3>
                        <p className="text-purple-100 text-sm font-light">
                          Power up your AI conversations with additional credits.
                        </p>
                      </>
                    )
                  )}
                </div>
                <Link
                  href={!isEnterprisePlan ? `/pricing?websiteId=${website._id.toString()}&currentPlanId=${website.plan._id.toString()}` : `/token-purchase?websiteId=${website._id.toString()}`}
                  className="flex-shrink-0"
                >
                  <Button className="bg-white text-emerald-600 hover:bg-emerald-50 rounded-full shadow-lg font-normal px-6 py-3 h-auto transition-all transform hover:scale-105 w-full">
                    {!isEnterprisePlan ? (
                      <>
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Now
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Buy Credits
                      </>
                    )}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>

          </div> {/* End of Left Column */}

          {/* Right Column for Tabs Content (Main display area) */}
          <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6"> {/* Spans 3 columns on large screens */}
            {/* Conditional Rendering for TabsContent - The actual content changes based on the active tab */}

            {/* Overview Tab Content (Bento Grid) */}
            {activeTab === 'overview' && (
              <TabsContent value="overview" className="mt-0"> {/* mt-0 to remove default margin, use parent flex gap */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"> {/* Bento Grid for Overview Cards */}

                  {/* Website Header/Summary Card (Larger) */}
                  <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-6 md:col-span-2 lg:col-span-2 flex flex-col justify-between">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-normal text-[#121211] break-words mb-2">
                        {website.name}
                      </h1>
                      <p className="text-gray-500 text-sm md:text-base font-light mb-4">{website.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-auto">
                      <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-mono text-xs w-fit rounded-lg px-2 py-1">
                        {website.chatbotCode}
                      </Badge>
                      <span className="text-xs text-gray-500 font-light">Chatbot Code</span>
                    </div>
                  </Card>

                  {/* Current Plan Badges Card */}
                  <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-6 md:col-span-2 lg:col-span-2 flex flex-col justify-between items-start">
                    <CardTitle className="text-[#121211] text-lg font-normal mb-3">Your Current Plan</CardTitle>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1.5 rounded-full shadow-sm text-xs font-normal"
                      >
                        <Crown className="h-3 w-3" />
                        <span className="truncate">{planInfo.plan.name} Plan</span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200 px-3 py-1.5 rounded-full shadow-sm text-xs font-normal"
                      >
                        <Zap className="h-3 w-3" />
                        {website.creditCount} Credits
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm font-light mt-4">{planInfo.plan.description}</p>
                  </Card>

                  {/* Individual Stat Cards */}
                  <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-4 text-center">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
                      <CardTitle className="text-sm font-normal text-[#121211]">Total Chats</CardTitle>
                      <MessageSquare className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent className="px-0 py-0">
                      <div className="text-xl md:text-2xl font-normal text-[#121211]">{website.chats.length}</div>
                      <p className="text-xs text-gray-500 font-light">
                        conversations
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-4 text-center">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
                      <CardTitle className="text-sm font-normal text-[#121211]">Staff Members</CardTitle>
                      <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent className="px-0 py-0">
                      <div className="text-xl md:text-2xl font-normal text-[#121211]">{planInfo.usage.staff.current}</div>
                      <p className="text-xs text-gray-500 font-light">of {planInfo.plan.maxStaffMembers} allowed</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-4 text-center">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
                      <CardTitle className="text-sm font-normal text-[#121211]">AI Credits</CardTitle>
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent className="px-0 py-0">
                      <div className="text-xl md:text-2xl font-normal text-[#121211]">{website.creditCount}</div>
                      <p className="text-xs text-gray-500 font-light">+{planInfo.plan.creditBoostMonthly} monthly</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-4 text-center">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
                      <CardTitle className="text-sm font-normal text-[#121211]">Price</CardTitle>
                      <Crown className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent className="px-0 py-0">
                      <div className="text-xl md:text-2xl font-normal text-[#121211]">${website.plan.priceMonthly}</div>
                      <p className="text-xs text-gray-500 font-light">per month</p>
                    </CardContent>
                  </Card>

                  {/* Website Information Card */}
                  <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-6 md:col-span-2 lg:col-span-4">
                    <CardHeader className="px-0 pt-0 pb-4">
                      <CardTitle className="text-[#121211] font-normal">Website Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-0 py-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-normal text-gray-500 block mb-1">Website URL</label>
                          <div className="flex items-center space-x-2 min-w-0">
                            <LinkIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <a
                              href={website.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline truncate min-w-0 font-light"
                            >
                              {website.link}
                            </a>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-normal text-gray-500 block mb-1">Created</label>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <p className="text-sm text-gray-600 font-light">
                              {new Date(website.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-sm font-normal text-gray-500 block mb-1">Last Updated</label>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <p className="text-sm text-gray-600 font-light">
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
                    <CardFooter className="bg-slate-50 border-t border-slate-200 text-xs text-gray-500 px-4 py-3 font-light rounded-b-xl mt-6">
                      <span className="truncate">Website ID: {website._id}</span>
                    </CardFooter>
                  </Card>

                </div> {/* End of Bento Grid for Overview Cards */}
              </TabsContent>
            )}

            {activeTab === 'ai' && (
              <TabsContent value="ai" className="mt-0">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center p-8 md:p-12">
                      <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-purple-600" />
                        <p className="text-gray-600 text-sm md:text-base font-light">Loading AI management...</p>
                      </div>
                    </div>
                  }
                >
                  <AIManagement website={website} userId={userId} onUpdate={handleWebsiteUpdate} />
                </Suspense>
              </TabsContent>
            )}

            {activeTab === 'staff' && (
              <TabsContent value="staff" className="mt-0">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center p-8 md:p-12">
                      <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-emerald-600" />
                        <p className="text-gray-600 text-sm md:text-base font-light">Loading staff management...</p>
                      </div>
                    </div>
                  }
                >
                  <StaffManagement websiteId={website._id} userId={userId} />
                </Suspense>
              </TabsContent>
            )}

            {activeTab === 'settings' && (
              <TabsContent value="settings" className="mt-0">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center p-8 md:p-12">
                      <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-emerald-600" />
                        <p className="text-gray-600 text-sm md:text-base font-light">Loading website settings...</p>
                      </div>
                    </div>
                  }
                >
                  <WebsiteSettings website={website} userId={userId} onUpdate={handleWebsiteUpdate} />
                </Suspense>
              </TabsContent>
            )}
          </div> {/* End of Main Content Column (Right) */}

        </div> {/* End of Parent grid for the entire layout */}
      </Tabs> {/* End of Main Tabs Component */}
    </div>
  )
}