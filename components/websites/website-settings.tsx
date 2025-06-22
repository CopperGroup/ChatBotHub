"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Palette, Zap, Brain, Crown, Save, RefreshCw, AlertTriangle, Waypoints, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { authFetch } from "@/lib/authFetch"
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
  }
  createdAt: string
  updatedAt: string
}

interface WebsiteSettingsProps {
  website: Website
  onUpdate: (website: Website) => void
  userId: string
}

function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 shadow-sm">
        <CardHeader className="pb-4 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <Skeleton className="h-6 w-40" />
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Skeleton className="h-10 w-full sm:w-40" />
              <Skeleton className="h-10 w-full sm:w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 md:space-y-8 px-4 md:px-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
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
  const [allowAIResponses, setAllowAIResponses] = useState(website?.preferences?.allowAIResponses || false)
  const [gradient1, setGradient1] = useState(website?.preferences?.colors?.gradient1 || "#10b981")
  const [gradient2, setGradient2] = useState(website?.preferences?.colors?.gradient2 || "#059669")

  // States for paths
  const [allowedPathsText, setAllowedPathsText] = useState(website.preferences?.allowedPaths?.join("\n") || "")
  const [disallowedPathsText, setDisallowedPathsText] = useState(website.preferences?.disallowedPaths?.join("\n") || "")

  const [loading, setLoading] = useState(false)
  const [isDataReady, setIsDataReady] = useState(false)

  // Derived values for current plan usage
  const currentStaffMembers = website.staffMembers.length
  const maxStaffMembers = website.plan.maxStaffMembers
  const aiEnabledByPlan = website.plan.allowAI
  const currentCredits = website.creditCount

  useEffect(() => {
    // Sync internal state with parent website prop changes
    setName(website.name)
    setLink(website.link)
    setDescription(website.description)
    setHeader(website.preferences?.header || "Chat Support")
    setAllowAIResponses(website.preferences?.allowAIResponses || false)
    setGradient1(website.preferences?.colors?.gradient1 || "#10b981")
    setGradient2(website.preferences?.colors?.gradient2 || "#059669")
    setAllowedPathsText(website.preferences?.allowedPaths?.join("\n") || "")
    setDisallowedPathsText(website.preferences?.disallowedPaths?.join("\n") || "")

    // Simulate data loading for Suspense demonstration
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
        allowAIResponses,
        colors: {
          gradient1,
          gradient2,
        },
        allowedPaths: parsePathsInput(allowedPathsText),
        disallowedPaths: parsePathsInput(disallowedPathsText),
      }

      const res = await authFetch(`http://192.168.32.1:3001/api/websites/${website._id}`, {
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
    setAllowAIResponses(false)
    setGradient1("#10b981")
    setGradient2("#059669")
    setAllowedPathsText("")
    setDisallowedPathsText("")
    toast.info("Chatbot settings reset to defaults")
  }

  if (!isDataReady) {
    return <SettingsLoadingSkeleton />
  }

  return (
    <>
      <div className="space-y-4 md:space-y-6 px-4 md:px-0">
        {/* Plan Status Card */}
        {website.plan && (
          <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 shadow-sm">
            <CardHeader className="pb-4 px-4 md:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg text-slate-900 truncate">{website.plan.name} Plan</CardTitle>
                    <p className="text-sm text-slate-600 line-clamp-2">{website.plan.description}</p>
                  </div>
                </div>
                <Link href={`/pricing?websiteId=${website._id.toString()}&currentPlanId=${website.plan._id.toString()}`}>
                    <Button
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-sm w-full sm:w-auto"
                    >
                    <Crown className="w-4 h-4 mr-2" />
                    Change Plan
                    </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Main Settings Card */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="px-4 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <CardTitle className="text-xl text-slate-900 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                <span>Website Settings</span>
              </CardTitle>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={resetToDefaults}
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl w-full sm:w-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Reset Chatbot Settings</span>
                  <span className="sm:hidden">Reset</span>
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-sm w-full sm:w-auto"
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
            {/* General Website Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-4 h-4 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900">General Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Website Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter website name"
                    className="bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link" className="text-slate-700 font-medium">
                    Website URL
                  </Label>
                  <Input
                    id="link"
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="e.g., https://yourwebsite.com"
                    className="bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of your website"
                  rows={3}
                  className="bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Chatbot Basic Configuration */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-4 h-4 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900">Chatbot Basic Configuration</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Chat Header Title</Label>
                  <Input
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                    placeholder="e.g., Chat Support, Help Center"
                    className="bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                  />
                  <p className="text-xs text-slate-500">This appears at the top of your chat widget</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Available Credits</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="number"
                      value={currentCredits}
                      className="bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                      readOnly={true}
                    />
                    <div className="flex items-center space-x-1 text-amber-600">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">Credits</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Credits are used for AI responses</p>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* AI Settings */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-4 h-4 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-900">AI Configuration</h3>
              </div>

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

                {currentCredits < 50 && aiEnabledByPlan && (
                  <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl shadow-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      Low AI credits remaining: {currentCredits}. Consider upgrading your plan for more credits.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Widget Display Paths */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Waypoints className="w-4 h-4 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-900">Widget Display Paths</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="allowedPaths" className="text-slate-700 font-medium">
                    Allowed Paths (one per line)
                  </Label>
                  <Textarea
                    id="allowedPaths"
                    value={allowedPathsText}
                    onChange={(e) => setAllowedPathsText(e.target.value)}
                    placeholder={`e.g.,\n/\n/contact\n/products`}
                    rows={6}
                    className="bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500">
                    Specify paths where the widget *should* appear. If left empty, it appears everywhere (unless
                    disallowed).
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disallowedPaths" className="text-slate-700 font-medium">
                    Disallowed Paths (one per line)
                  </Label>
                  <Textarea
                    id="disallowedPaths"
                    value={disallowedPathsText}
                    onChange={(e) => setDisallowedPathsText(e.target.value)}
                    placeholder={`e.g.,\n/admin\n/checkout\n/login`}
                    rows={6}
                    className="bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500">
                    Specify paths where the widget *should NOT* appear. Disallowed paths override allowed paths.
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Appearance Settings */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-4 h-4 text-pink-600" />
                <h3 className="text-lg font-semibold text-slate-900">Widget Appearance</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Primary Color</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="color"
                        value={gradient1}
                        onChange={(e) => setGradient1(e.target.value)}
                        className="h-12 w-16 sm:w-20 rounded-lg border-2 border-slate-200 p-1 flex-shrink-0"
                      />
                      <Input
                        type="text"
                        value={gradient1}
                        onChange={(e) => setGradient1(e.target.value)}
                        className="flex-1 bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Secondary Color</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="color"
                        value={gradient2}
                        onChange={(e) => setGradient2(e.target.value)}
                        className="h-12 w-16 sm:w-20 rounded-lg border-2 border-slate-200 p-1 flex-shrink-0"
                      />
                      <Input
                        type="text"
                        value={gradient2}
                        onChange={(e) => setGradient2(e.target.value)}
                        className="flex-1 bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Preview */}
                <div className="p-4 md:p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-sm">
                  <Label className="text-slate-700 font-medium mb-4 block">Preview</Label>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:gap-4">
                    <div
                      className="w-16 h-16 rounded-full shadow-lg mx-auto sm:mx-0 flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${gradient1}, ${gradient2})`,
                      }}
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <div
                        className="px-4 py-2 rounded-xl text-white text-sm font-medium inline-block shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${gradient1}, ${gradient2})`,
                        }}
                      >
                        {header}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">This is how your chat widget will appear</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
