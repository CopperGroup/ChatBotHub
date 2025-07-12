"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, Zap, Clock, Save, RefreshCw, AlertTriangle, Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { authFetch } from "@/lib/authFetch"
import { TokenUsageChart } from "./token-usage-chart"
import Link from "next/link"

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

function AIManagementSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 shadow-sm">
        <CardHeader className="pb-4 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
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
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Call to Action Card - Only show buy tokens if not Enterprise and AI is enabled */}
      {!isEnterprisePlan && aiEnabledByPlan && (
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
                  Power Up Your AI
                </h3>
                <p className="text-purple-100 text-sm mb-4 lg:mb-0">
                  Get more AI credits to handle increased conversation volume and provide instant responses 24/7.
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
      )}

      {/* AI Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6">
            <CardTitle className="text-sm font-medium text-slate-700">Available Credits</CardTitle>
            <Zap className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="text-2xl font-bold text-slate-900">{currentCredits.toLocaleString()}</div>
            <p className="text-xs text-slate-500">+{website.plan.creditBoostMonthly} monthly boost</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6">
            <CardTitle className="text-sm font-medium text-slate-700">AI Status</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="text-2xl font-bold text-slate-900">
              {allowAIResponses && aiEnabledByPlan ? "Active" : "Inactive"}
            </div>
            <p className="text-xs text-slate-500">
              {aiEnabledByPlan ? "Default AI responses" : "Plan upgrade required"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6">
            <CardTitle className="text-sm font-medium text-slate-700">Daily Limit</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="text-2xl font-bold text-slate-900">
              {dailyTokenLimit ? Number.parseInt(dailyTokenLimit).toLocaleString() : "Unlimited"}
            </div>
            <p className="text-xs text-slate-500">Tokens per day</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Configuration Card */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <CardTitle className="text-xl text-slate-900 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>AI Configuration</span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                onClick={resetToDefaults}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl w-full sm:w-auto bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Reset to Defaults</span>
                <span className="sm:hidden">Reset</span>
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || !aiEnabledByPlan}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-sm w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 md:space-y-8 px-4 md:px-6">
          {/* Default AI Responses */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm space-y-3 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <Label htmlFor="allowAIResponses" className="text-slate-900 font-medium">
                    Default AI Responses
                  </Label>
                </div>
                <p className="text-sm text-slate-600">
                  Enable AI responses by default for new conversations. Individual chats can override this setting.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Switch
                  id="allowAIResponses"
                  checked={allowAIResponses}
                  onCheckedChange={setAllowAIResponses}
                  disabled={!aiEnabledByPlan}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Daily Token Limit */}
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <Label htmlFor="dailyTokenLimit" className="text-slate-900 font-medium">
                  Daily Token Limit
                </Label>
              </div>
              <div className="space-y-3">
                <Input
                  id="dailyTokenLimit"
                  type="number"
                  value={dailyTokenLimit}
                  onChange={(e) => setDailyTokenLimit(e.target.value)}
                  placeholder="e.g., 1000 (leave empty for no limit)"
                  min="0"
                  className="bg-white border-purple-200 text-slate-900 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
                  disabled={!aiEnabledByPlan}
                />
                <p className="text-sm text-slate-600">
                  Set a daily limit for AI token usage. When reached, AI responses will be disabled for the day. Leave
                  empty for no limit.
                </p>
                {dailyTokenLimit && (
                  <div className="flex items-center space-x-2 text-purple-700 bg-purple-100 px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Daily limit: {Number.parseInt(dailyTokenLimit).toLocaleString()} tokens
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alerts */}
          {!aiEnabledByPlan && (
            <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl shadow-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                AI features are not available on your current plan. Upgrade to access AI responses and token management.
              </AlertDescription>
            </Alert>
          )}

          {currentCredits < 50 && aiEnabledByPlan && (
            <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-sm">
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
      {aiEnabledByPlan && (
        <>
          <Separator className="bg-slate-100" />
          <TokenUsageChart websiteId={website._id} />
        </>
      )}
    </div>
  )
}
