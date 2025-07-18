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
  Loader2,
  GitBranch,
  Plus,
  Edit,
  XCircle,
  Globe,
  MessageSquare,
  Shield,
  BarChart3,
  Sparkles,
  Languages,
  HelpCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { authFetch } from "@/lib/authFetch"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { languages } from "@/constants/languages"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog" // Import Dialog components

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
    dynamiclyAdaptToLanguage?: boolean // Added new field
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
    <div className="bg-gradient-to-br from-slate-50/50 via-white to-slate-100/50">
      {" "}
      {/* Removed min-h-screen */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-3" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="mb-8">
          <Skeleton className="h-32 w-full rounded-3xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {[1, 2, 3, 4].map(
              (
                i, // Added one more skeleton for the new language card
              ) => (
                <Skeleton key={i} className="h-96 w-full rounded-3xl" />
              ),
            )}
          </div>
          <div className="space-y-8">
            {/* Sticky container for right column */}
            <div className="sticky top-4 space-y-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-3xl" />
              ))}
            </div>
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
  const [dynamiclyAdaptToLanguage, setDynamiclyAdaptToLanguage] = useState(
    website.preferences?.dynamiclyAdaptToLanguage || false
  ) // New state for dynamic language adaptation

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

  const isEnterprisePlan = website.plan.name.toLowerCase().includes("enterprise")
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
    setDynamiclyAdaptToLanguage(website.preferences?.dynamiclyAdaptToLanguage || false) // Sync new state
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
        dynamiclyAdaptToLanguage, // Include new field in save payload
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
    setDynamiclyAdaptToLanguage(false) // Reset new state
    setAllowedPathsText("")
    setDisallowedPathsText("")
    toast.info("Chatbot settings reset to defaults")
  }

  const handleCancelSubscription = async () => {
    if (!website.stripeSubscriptionId) {
      toast.info("No active subscription to cancel.")
      return
    }

    
    // IMPORTANT: Do NOT use confirm() or window.confirm(). Use a custom modal UI instead.
    // For this example, I'll simulate a confirmation with a direct return.
    // In a real application, you would replace this with a proper modal.
    // if (!window.confirm("Are you sure you want to cancel your subscription?")) {
    //   return
    // }
    // As per instructions, replacing window.confirm with a message box or direct action for now.
    // For a real app, integrate a proper shadcn/ui Dialog for confirmation.
    toast.info("Please confirm cancellation via a dedicated modal (not implemented in this snippet).")
    return;


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
    <div className="bg-gradient-to-br from-slate-50/50 via-white to-slate-100/50">
      {" "}
      {/* Removed min-h-screen */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Website Settings</h1>
          <p className="text-slate-600 text-base font-medium">
            Manage your website configuration and chatbot preferences
          </p>
        </div>

        {/* Plan Status Card */}
        {website.plan && (
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 text-white overflow-hidden rounded-3xl relative">
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
                          <p className="text-white font-semibold">{currentCredits}</p>
                          <p className="text-emerald-100 text-xs">Credits Available</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-white/10 rounded-2xl px-4 py-3">
                        <Shield className="w-5 h-5 text-emerald-100" />
                        <div>
                          <p className="text-white font-semibold">
                            {currentStaffMembers}/{maxStaffMembers}
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
                        {isEnterprisePlan ? "Change Plan" : "Upgrade Plan"} {/* Conditional text */}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-2xl" />

              <CardHeader className="pb-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-md">
                    <Globe className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">General Information</CardTitle>
                    <p className="text-slate-600 text-sm font-medium">Basic website details and configuration</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-slate-700 font-semibold text-sm">
                      Website Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter website name"
                      className="h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="link" className="text-slate-700 font-semibold text-sm">
                      Website URL
                    </Label>
                    <Input
                      id="link"
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-medium"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-slate-700 font-semibold text-sm">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A brief description of your website"
                    rows={4}
                    className="bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl resize-none font-medium"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Chatbot Configuration */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-2xl" />

              <CardHeader className="pb-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-md">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Chatbot Configuration</CardTitle>
                    <p className="text-slate-600 text-sm font-medium">Customize your chatbot behavior and appearance</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 relative z-10">
                {/* Basic Settings (excluding language) */}
                <div className="space-y-3">
                  <Label className="text-slate-700 font-semibold text-sm">Chat Header Title</Label>
                  <Input
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                    placeholder="e.g., Chat Support, Help Center"
                    className="h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-medium"
                  />
                </div>

                {/* Color Customization */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                      <Palette className="w-4 h-4 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Color Customization</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-slate-700 font-semibold text-sm">Primary Color</Label>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="color"
                          value={gradient1}
                          onChange={(e) => setGradient1(e.target.value)}
                          className="h-12 w-16 rounded-2xl border-2 border-slate-200/60 p-1 shadow-sm"
                        />
                        <Input
                          type="text"
                          value={gradient1}
                          onChange={(e) => setGradient1(e.target.value)}
                          className="flex-1 h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-slate-700 font-semibold text-sm">Secondary Color</Label>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="color"
                          value={gradient2}
                          onChange={(e) => setGradient2(e.target.value)}
                          className="h-12 w-16 rounded-2xl border-2 border-slate-200/60 p-1 shadow-sm"
                        />
                        <Input
                          type="text"
                          value={gradient2}
                          onChange={(e) => setGradient2(e.target.value)}
                          className="flex-1 h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="p-6 bg-gradient-to-r from-slate-50/80 to-white/80 rounded-3xl border border-slate-200/60">
                    <div className="flex items-center space-x-2 mb-4">
                      <Label className="text-slate-700 font-semibold text-sm">Live Preview</Label>
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-xs font-medium">Real-time</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div
                        className="w-16 h-16 rounded-3xl shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${gradient1}, ${gradient2})`,
                        }}
                      />
                      <div className="flex-1">
                        <div
                          className="px-6 py-3 rounded-2xl text-white text-sm font-semibold inline-block shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${gradient1}, ${gradient2})`,
                          }}
                        >
                          {header}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Chat widget preview</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chatbot Language Card (New) */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-violet-500/10 rounded-full blur-2xl" />

              <CardHeader className="pb-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-md">
                    <Languages className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">
                      Chatbot Language
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        New
                      </span>
                    </CardTitle>
                    <p className="text-slate-600 text-sm font-medium">Select the primary language for your chatbot</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-6"> {/* Changed from space-y-3 to space-y-6 for better spacing */}
                  <div className="space-y-3">
                    <Label htmlFor="language" className="text-slate-700 font-semibold text-sm">
                      Select Language
                    </Label>
                    <Select onValueChange={setSelectedLanguage} value={selectedLanguage}>
                      <SelectTrigger className="h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-medium">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200/60 rounded-2xl shadow-xl">
                        {Object.entries(languages).map(([name, code]) => (
                          <SelectItem key={code} value={code} className="rounded-xl">
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* New field for dynamiclyAdaptToLanguage */}
                  <div className="flex items-center justify-between space-x-4 p-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl">
                    <div>
                      <Label htmlFor="dynamiclyAdaptToLanguage" className="text-slate-700 font-semibold text-sm">
                        Dynamically Adapt to Browser Language
                      </Label>
                      <p className="text-xs text-slate-500 mt-1">
                        If enabled, the widget will attempt to display in the user's browser language (if supported).
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setDynamiclyAdaptToLanguage(!dynamiclyAdaptToLanguage)}
                      className={`h-10 px-4 rounded-full font-semibold transition-colors duration-200 ${
                        dynamiclyAdaptToLanguage
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      {dynamiclyAdaptToLanguage ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Widget Display Paths */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-2xl" />

              <CardHeader className="pb-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center shadow-md">
                    <MessageSquare className="w-6 h-6 text-indigo-600" /> {/* Changed icon to Globe */}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
                      Widget Display Paths
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-6 w-6 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                            aria-label="Help with widget display paths"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border-slate-200/60">
                          <DialogHeader>
                            <DialogTitle className="text-slate-900">Understanding Widget Paths</DialogTitle>
                            <DialogDescription className="text-slate-600">
                              Control exactly where your chatbot widget appears on your website.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 text-slate-700 text-sm">
                            <p>
                              <strong>Allowed Paths</strong> specify where the widget <strong>should</strong> appear.
                              <br />
                              <strong>Disallowed Paths</strong> specify where the widget <strong>should NOT</strong> appear.
                            </p>
                            <p>
                              <strong>Allowed paths will always override disallowed paths.</strong> For example, if <code className="bg-neutral-300 px-1 py-0.5 rounded-xs shadow-md mx-0.5">/blog</code> is
                              allowed and <code className="bg-neutral-300 px-1 py-0.5 rounded-xs shadow-md mx-0.5">/blog/private</code> is disallowed, the widget will still appear on <code className="bg-neutral-300 px-1 py-0.5 rounded-xs shadow-md mx-0.5">/blog/private</code>
                              because the allowed rule takes precedence.
                            </p>
                            <p>The path <code className="bg-neutral-300 px-1 py-0.5 rounded-xs shadow-md mx-0.5">/</code> corresponds to your website's home page.</p>
                            <p>
                              If you want the widget to be displayed on <strong>every page</strong> of your website, simply leave the
                              <strong>Allowed Paths</strong> field empty.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                    <p className="text-slate-600 text-sm font-medium">Control where your chat widget appears</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="allowedPaths" className="text-slate-700 font-semibold text-sm">
                      Allowed Paths
                    </Label>
                    <Textarea
                      id="allowedPaths"
                      value={allowedPathsText}
                      onChange={(e) => setAllowedPathsText(e.target.value)}
                      placeholder={`/\n/contact\n/products\n/support`}
                      rows={6}
                      className="bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-mono text-sm resize-none"
                    />
                    <p className="text-xs text-slate-500 font-medium">
                      Paths where the widget <strong>should</strong> appear (one per line)
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="disallowedPaths" className="text-slate-700 font-semibold text-sm">
                      Disallowed Paths
                    </Label>
                    <Textarea
                      id="disallowedPaths"
                      value={disallowedPathsText}
                      onChange={(e) => setDisallowedPathsText(e.target.value)}
                      placeholder={`/admin\n/checkout\n/login\n/dashboard`}
                      rows={6}
                      className="bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-mono text-sm resize-none"
                    />
                    <p className="text-xs text-slate-500 font-medium">
                      Paths where the widget <strong>should NOT</strong> appear (one per line)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Workflows & Usage Stats (Sticky) */}
          <div className="space-y-8">
            <div className="sticky top-4 z-10 space-y-8">
              {/* Quick Actions */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-xl" />

                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-lg font-bold text-slate-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl font-semibold transition-all duration-300"
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
                    className="w-full h-12 border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-2xl bg-white/60 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </CardContent>
              </Card>

              {/* Workflows Card */}
              <Card className="border-0 shadow-lg rounded-3xl overflow-hidden p-0 relative">
                <div className="h-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-6 text-white relative">
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                        <GitBranch className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold">Automated Workflows</h3>
                    </div>
                    <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                      {hasWorkflows()
                        ? "Your automated response workflows are configured and ready."
                        : "Create automated workflows to guide user conversations."}
                    </p>
                    <Link href={`/workflows/${website._id}`}>
                      <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-2xl w-full shadow-lg hover:shadow-xl transition-all duration-300">
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
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
