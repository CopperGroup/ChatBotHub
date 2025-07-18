"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import {
  Brain,
  Zap,
  Clock,
  Save,
  RefreshCw,
  AlertTriangle,
  Loader2,
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
  Target,
} from "lucide-react"
import { toast } from "sonner"
import { authFetch } from "@/lib/authFetch"
import { TokenUsageChart } from "./token-usage-chart"
import Link from "next/link"
import { AIManagementSkeleton } from "./ai-management-skeleton" // Import the new skeleton

interface Website {
  _id: string
  name: string
  link: string
  description: string
  chatbotCode: string
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
  predefinedAnswers: string
  createdAt: string
  updatedAt: string
}

interface AIManagementProps {
  website: Website
  onUpdate: (website: Website) => void
  userId: string
}

export function AIManagement({ website, onUpdate, userId }: AIManagementProps) {
  const [allowAIResponses, setAllowAIResponses] = useState(website?.preferences?.allowAIResponses || false)
  const [dailyTokenLimit, setDailyTokenLimit] = useState<string>(website.preferences?.dailyTokenLimit?.toString() || "")
  const [loading, setLoading] = useState(false)
  const [isDataReady, setIsDataReady] = useState(false)

  // Derived values
  const aiEnabledByPlan = website.plan.allowAI
  const currentCredits = website.creditCount
  const isEnterprisePlan = website.plan.name.toLowerCase().includes("enterprise")

  useEffect(() => {
    // Sync internal state with parent website prop changes
    setAllowAIResponses(website.preferences?.allowAIResponses || false)
    setDailyTokenLimit(website.preferences?.dailyTokenLimit?.toString() || "")
    // Simulate data loading
    setTimeout(() => {
      setIsDataReady(true)
    }, 500)
  }, [website])

  // Handle AI Settings Save
  const handleSave = async () => {
    setLoading(true)
    try {
      const updatedPreferences = {
        ...website.preferences,
        allowAIResponses,
        dailyTokenLimit: dailyTokenLimit ? Number.parseInt(dailyTokenLimit) : null,
      }

      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/${website._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: website.name,
          link: website.link,
          description: website.description,
          preferences: updatedPreferences,
          userId: userId,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update AI settings.")
      }

      const responseData = await res.json()
      if (onUpdate) {
        onUpdate(responseData.website)
      }
      toast.success("AI settings saved successfully!")
    } catch (error: any) {
      console.error("Error saving AI settings:", error)
      toast.error(error.message || "Failed to update AI settings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetToDefaults = () => {
    setAllowAIResponses(false)
    setDailyTokenLimit("")
    toast.info("AI settings reset to defaults")
  }

  if (!isDataReady) {
    return <AIManagementSkeleton />
  }

  return (
    <div className="bg-gradient-to-br from-slate-50/50 via-white to-slate-100/50 p-4 md:p-6 rounded-3xl shadow-inner">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Management</h1>
          <p className="text-slate-600">Configure AI responses, manage credits, and monitor usage analytics</p>
        </div>

        {/* Call to Action Card - Only show buy tokens if not Enterprise and AI is enabled */}
        {!isEnterprisePlan && aiEnabledByPlan && (
          <Card className="relative mb-8 border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white overflow-hidden rounded-3xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
            </div>
            <CardContent className="relative z-10 p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Power Up Your AI</h3>
                  </div>
                  <p className="text-purple-100 text-lg mb-4 lg:mb-0">
                    Get more AI credits to handle increased conversation volume and provide instant responses 24/7.
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-purple-100">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4" />
                      <span>24/7 Availability</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Instant Responses</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link href={`/token-purchase?websiteId=${website._id.toString()}`}>
                    <Button className="bg-white text-purple-600 hover:bg-purple-50 rounded-2xl shadow-lg font-semibold px-8 py-4 h-auto transition-all transform hover:scale-105">
                      <Zap className="w-5 h-5 mr-2" />
                      Buy Credits
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Available Credits */}
          <Card className="border-0 shadow-lg rounded-3xl overflow-hidden p-0">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Available Credits</p>
                  <p className="text-3xl font-bold">{currentCredits.toLocaleString()}</p>
                  <p className="text-emerald-100 text-xs mt-1">+{website.plan.creditBoostMonthly} monthly</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
          {/* AI Status */}
          <Card className="border-0 shadow-lg rounded-3xl overflow-hidden p-0">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">AI Status</p>
                  <p className="text-2xl font-bold">{allowAIResponses && aiEnabledByPlan ? "Active" : "Inactive"}</p>
                  <p className="text-blue-100 text-xs mt-1">
                    {aiEnabledByPlan ? "Ready to respond" : "Plan upgrade required"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
          {/* Daily Limit */}
          <Card className="border-0 shadow-lg rounded-3xl overflow-hidden p-0">
            <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Daily Limit</p>
                  <p className="text-2xl font-bold">
                    {dailyTokenLimit ? Number.parseInt(dailyTokenLimit).toLocaleString() : "Unlimited"}
                  </p>
                  <p className="text-purple-100 text-xs mt-1">Tokens per day</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Area - Flex container for left and right columns */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - AI Configuration & Token Usage Chart */}
          <div className="flex-1 space-y-8">
            {/* AI Configuration Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-violet-500/10 rounded-full blur-2xl" />
              <CardHeader className="pb-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900">AI Configuration</CardTitle>
                      <p className="text-slate-600 text-sm">Configure AI behavior and response settings</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 relative z-10">
                {/* Default AI Responses */}
                <div className="p-6 bg-purple-50 rounded-3xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Brain className="w-4 h-4 text-purple-600" />
                        </div>
                        <Label htmlFor="allowAIResponses" className="text-slate-900 font-semibold text-lg">
                          Default AI Responses
                        </Label>
                      </div>
                      <p className="text-slate-600 mb-4">
                        Enable AI responses by default for new conversations. Individual chats can override this
                        setting.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Activity className="w-3 h-3" />
                          <span>Instant responses</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>24/7 availability</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-6">
                      <Switch
                        id="allowAIResponses"
                        checked={allowAIResponses}
                        onCheckedChange={setAllowAIResponses}
                        disabled={!aiEnabledByPlan}
                        className="data-[state=checked]:bg-purple-600 scale-125"
                      />
                    </div>
                  </div>
                </div>
                {/* Daily Token Limit */}
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-slate-600" />
                    </div>
                    <Label htmlFor="dailyTokenLimit" className="text-slate-900 font-semibold text-lg">
                      Daily Token Limit
                    </Label>
                  </div>
                  <div className="space-y-4">
                    <Input
                      id="dailyTokenLimit"
                      type="number"
                      value={dailyTokenLimit}
                      onChange={(e) => setDailyTokenLimit(e.target.value)}
                      placeholder="e.g., 1000 (leave empty for no limit)"
                      min="0"
                      className="h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-purple-500 focus:ring-purple-500/20 rounded-2xl font-medium"
                      disabled={!aiEnabledByPlan}
                    />
                    <p className="text-slate-600 text-sm">
                      Set a daily limit for AI token usage. When reached, AI responses will be disabled for the day.
                      Leave empty for no limit.
                    </p>
                    {dailyTokenLimit && (
                      <div className="flex items-center space-x-2 text-purple-700 bg-purple-100 px-4 py-3 rounded-2xl">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Daily limit: {Number.parseInt(dailyTokenLimit).toLocaleString()} tokens
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Alerts */}
                {!aiEnabledByPlan && (
                  <Alert className="border-amber-200 bg-amber-50 rounded-2xl">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      AI features are not available on your current plan. Upgrade to access AI responses and token
                      management.
                    </AlertDescription>
                  </Alert>
                )}
                {currentCredits < 50 && aiEnabledByPlan && (
                  <Alert className="border-red-200 bg-red-50 rounded-2xl">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Low AI credits remaining: {currentCredits}. Consider purchasing more credits to continue using AI
                      features.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
            {/* Token Usage Analytics */}
            {aiEnabledByPlan && <TokenUsageChart websiteId={website._id} />}
          </div>
          {/* Right Column - Quick Actions (Sticky) */}
          <div className="lg:w-1/3 space-y-8">
            <div className="sticky top-4 z-10">
              {" "}
              {/* Sticky applied here */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-violet-500/10 rounded-full blur-xl" />
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-lg text-slate-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <Button
                    onClick={handleSave}
                    disabled={loading || !aiEnabledByPlan}
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl font-semibold transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save AI Settings
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetToDefaults}
                    className="w-full h-12 border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-2xl bg-white/60 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  {aiEnabledByPlan && (
                    <Link href={`/token-purchase?websiteId=${website._id.toString()}`}>
                      <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl font-semibold">
                        <Zap className="w-4 h-4 mr-2" />
                        Buy More Credits
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
