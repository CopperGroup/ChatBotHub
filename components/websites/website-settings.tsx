"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Palette,
  Zap,
  Crown,
  Save,
  RefreshCw,
  Waypoints,
  Loader2,
  GitBranch,
  Plus,
  Edit,
  XCircle,
  Globe,
  MessageSquare,
  Shield,
  BarChart3,
} from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { authFetch } from "@/lib/authFetch"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { languages } from "@/constants/languages"

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
  stripeSubscriptionId?: string
}

interface WebsiteSettingsProps {
  website: Website
  onUpdate: (website: Website) => void
  userId: string
}

function SettingsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Plan Card Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>

        {/* Settings Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-2xl" />
            ))}
          </div>
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function WebsiteSettings({ website, onUpdate, userId }: WebsiteSettingsProps) {
  const router = useRouter()

  // States for general website info
  const [name, setName] = useState(website.name)
  const [link, setLink] = useState(website.link)
  const [description, setDescription] = useState(website.description)

  // States for chatbot preferences
  const [header, setHeader] = useState(website?.preferences?.header || "Chat Support")
  const [gradient1, setGradient1] = useState(website?.preferences?.colors?.gradient1 || "#10b981")
  const [gradient2, setGradient2] = useState(website?.preferences?.colors?.gradient2 || "#059669")
  const [selectedLanguage, setSelectedLanguage] = useState(website.preferences?.language || "en")

  // States for paths
  const [allowedPathsText, setAllowedPathsText] = useState(website.preferences?.allowedPaths?.join("\n") || "")
  const [disallowedPathsText, setDisallowedPathsText] = useState(website.preferences?.disallowedPaths?.join("\n") || "")

  const [loading, setLoading] = useState(false)
  const [isDataReady, setIsDataReady] = useState(false)
  const [cancellingSubscription, setCancellingSubscription] = useState(false)

  // Derived values for current plan usage
  const currentStaffMembers = website.staffMembers.length
  const maxStaffMembers = website.plan.maxStaffMembers
  const aiEnabledByPlan = website.plan.allowAI
  const currentCredits = website.creditCount

  // Check if predefined workflows exist
  const hasWorkflows = () => {
    try {
      return website.predefinedAnswers.length > 0
    } catch {
      return false
    }
  }

  useEffect(() => {
    // Sync internal state with parent website prop changes
    setName(website.name)
    setLink(website.link)
    setDescription(website.description)
    setHeader(website.preferences?.header || "Chat Support")
    setGradient1(website.preferences?.colors?.gradient1 || "#10b981")
    setGradient2(website.preferences?.colors?.gradient2 || "#059669")
    setSelectedLanguage(website.preferences?.language || "en")
    setAllowedPathsText(website.preferences?.allowedPaths?.join("\n") || "")
    setDisallowedPathsText(website.preferences?.disallowedPaths?.join("\n") || "")

    // Simulate data loading
    setTimeout(() => {
      setIsDataReady(true)
    }, 500)
  }, [website])

  // Helper to parse textarea input into an array of clean paths
  const parsePathsInput = (text: string): string[] => {
    return text
      .split("\n")
      .map((path) => path.trim())
      .filter((path) => path.length > 0)
  }

  // Handle Website Settings Save
  const handleSave = async () => {
    setLoading(true)
    try {
      const updatedPreferences = {
        header,
        colors: {
          gradient1,
          gradient2,
        },
        allowedPaths: parsePathsInput(allowedPathsText),
        disallowedPaths: parsePathsInput(disallowedPathsText),
        language: selectedLanguage,
      }

      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/${website._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          link,
          description,
          preferences: updatedPreferences,
          userId: userId,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update website settings.")
      }

      const responseData = await res.json()
      if (onUpdate) {
        onUpdate(responseData.website)
      }
      toast.success("Settings saved successfully!")
    } catch (error: any) {
      console.error("Error saving website settings:", error)
      toast.error(error.message || "Failed to update website settings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetToDefaults = () => {
    setHeader("Chat Support")
    setGradient1("#10b981")
    setGradient2("#059669")
    setSelectedLanguage("en")
    setAllowedPathsText("")
    setDisallowedPathsText("")
    toast.info("Chatbot settings reset to defaults")
  }

  const handleCancelSubscription = async () => {
    if (!website.stripeSubscriptionId) {
      toast.info("No active subscription to cancel.")
      return
    }

    if (
      !window.confirm(
        "Are you sure you want to cancel your subscription?",
      )
    ) {
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

      toast.success("Subscription cancellation initiated! Your plan will revert to Free.")

      const updatedWebsiteRes = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/${website._id}`)
      if (updatedWebsiteRes.ok) {
        const updatedWebsiteData = await updatedWebsiteRes.json()
        onUpdate(updatedWebsiteData)
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

  if (!isDataReady) {
    return <SettingsLoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Settings</h1>
          <p className="text-gray-600">Manage your website configuration and chatbot preferences</p>
        </div>

        {/* Plan Status Card */}
        {website.plan && (
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white overflow-hidden">
            <CardHeader className="pb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white mb-1">{website.plan.name} Plan</CardTitle>
                    <p className="text-emerald-100 text-lg">{website.plan.description}</p>
                    <div className="flex items-center space-x-6 mt-3 text-sm text-emerald-100">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>{currentCredits} Credits Available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>
                          {currentStaffMembers}/{maxStaffMembers} Staff Members
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <Link
                    href={`/pricing?websiteId=${website._id.toString()}&currentPlanId=${website.plan._id.toString()}`}
                  >
                    <Button className="bg-white text-emerald-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl shadow-lg w-full sm:w-auto">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </Link>
                  {website.stripeSubscriptionId && website.plan.name !== "Free" && (
                    <Button
                      variant="ghost"
                      onClick={handleCancelSubscription}
                      disabled={cancellingSubscription}
                      className="text-white hover:bg-white/10 border border-white/20 rounded-xl px-4 py-3 w-full sm:w-auto"
                    >
                      {cancellingSubscription ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Information */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">General Information</CardTitle>
                      <p className="text-gray-500 text-sm">Basic website details and configuration</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium text-sm">
                      Website Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter website name"
                      className="h-12 bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link" className="text-gray-700 font-medium text-sm">
                      Website URL
                    </Label>
                    <Input
                      id="link"
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="h-12 bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 font-medium text-sm">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A brief description of your website"
                    rows={4}
                    className="bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Chatbot Configuration */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">Chatbot Configuration</CardTitle>
                    <p className="text-gray-500 text-sm">Customize your chatbot behavior and appearance</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">Chat Header Title</Label>
                    <Input
                      value={header}
                      onChange={(e) => setHeader(e.target.value)}
                      placeholder="e.g., Chat Support, Help Center"
                      className="h-12 bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-gray-700 font-medium text-sm">
                      Chatbot Language
                    </Label>
                    <Select onValueChange={setSelectedLanguage} value={selectedLanguage}>
                      <SelectTrigger className="h-12 bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg">
                        {Object.entries(languages).map(([name, code]) => (
                          <SelectItem key={code} value={code}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Color Customization */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-purple-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Color Customization</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium text-sm">Primary Color</Label>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="color"
                          value={gradient1}
                          onChange={(e) => setGradient1(e.target.value)}
                          className="h-12 w-16 rounded-xl border-2 border-gray-200 p-1"
                        />
                        <Input
                          type="text"
                          value={gradient1}
                          onChange={(e) => setGradient1(e.target.value)}
                          className="flex-1 h-12 bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium text-sm">Secondary Color</Label>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="color"
                          value={gradient2}
                          onChange={(e) => setGradient2(e.target.value)}
                          className="h-12 w-16 rounded-xl border-2 border-gray-200 p-1"
                        />
                        <Input
                          type="text"
                          value={gradient2}
                          onChange={(e) => setGradient2(e.target.value)}
                          className="flex-1 h-12 bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <Label className="text-gray-700 font-medium text-sm mb-4 block">Live Preview</Label>
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-16 rounded-2xl shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${gradient1}, ${gradient2})`,
                        }}
                      />
                      <div className="flex-1">
                        <div
                          className="px-6 py-3 rounded-xl text-white text-sm font-semibold inline-block shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${gradient1}, ${gradient2})`,
                          }}
                        >
                          {header}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Chat widget preview</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Widget Display Paths */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Waypoints className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">Widget Display Paths</CardTitle>
                    <p className="text-gray-500 text-sm">Control where your chat widget appears</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="allowedPaths" className="text-gray-700 font-medium text-sm">
                      Allowed Paths
                    </Label>
                    <Textarea
                      id="allowedPaths"
                      value={allowedPathsText}
                      onChange={(e) => setAllowedPathsText(e.target.value)}
                      placeholder={`/\n/contact\n/products\n/support`}
                      rows={6}
                      className="bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl font-mono text-sm resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      Paths where the widget <strong>should</strong> appear (one per line)
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="disallowedPaths" className="text-gray-700 font-medium text-sm">
                      Disallowed Paths
                    </Label>
                    <Textarea
                      id="disallowedPaths"
                      value={disallowedPathsText}
                      onChange={(e) => setDisallowedPathsText(e.target.value)}
                      placeholder={`/admin\n/checkout\n/login\n/dashboard`}
                      rows={6}
                      className="bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl font-mono text-sm resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      Paths where the widget <strong>should NOT</strong> appear (one per line)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save All Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetToDefaults}
                  className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>

            {/* Workflows Card */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden p-0">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-center space-x-3 mb-3">
                  <GitBranch className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Automated Workflows</h3>
                </div>
                <p className="text-blue-100 text-sm mb-4">
                  {hasWorkflows()
                    ? "Your automated response workflows are configured and ready."
                    : "Create automated workflows to guide user conversations."}
                </p>
                <Link href={`/workflows/${website._id}`}>
                  <Button className="bg-white text-blue-600 hover:bg-gray-50 font-semibold rounded-xl w-full">
                    {hasWorkflows() ? (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Manage Workflows
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Workflow
                      </>
                    )}
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Usage Stats */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Available Credits</p>
                        <p className="text-xs text-gray-500">AI responses remaining</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">{currentCredits}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Staff Members</p>
                        <p className="text-xs text-gray-500">Team access</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {currentStaffMembers}/{maxStaffMembers}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
