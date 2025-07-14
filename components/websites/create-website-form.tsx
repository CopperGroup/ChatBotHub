"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Copy, CheckCircle, Globe, Loader2, Sparkles, Trophy, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface CreateWebsiteFormProps {
  userId: string
  userWebsitesCount: number
}

export function CreateWebsiteForm({ userId, userWebsitesCount }: CreateWebsiteFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  // Set to null initially to differentiate between "not yet created" and "created but no snippet"
  const [chatbotCodeSnippet, setChatbotCodeSnippet] = useState<string | null>(null) 
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    description: "",
  })
  const [freeTrialDuration, setFreeTrialDuration] = useState(14)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setChatbotCodeSnippet(null) // Clear snippet on new submission attempt

    const generatedChatbotCode =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header if your main service's /websites endpoint requires it
        },
        body: JSON.stringify({
          ...formData,
          chatbotCode: generatedChatbotCode,
          userId,
          preferences: {
            colors: {
              gradient1: "#10b981",
              gradient2: "#059669",
            },
            header: "Chat Support",
            allowAIResponses: false,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to create website.") 
      } else {
        const websiteId = data._id

        // Fetch free trial duration using the new proxy API route
        let fetchedDuration = 14
        if (userWebsitesCount === 0) { // Only fetch if it's potentially a free trial
          try {
            const sharedVarRes = await fetch("/api/shared-variables-config", {
              method: "POST",
              headers: { 
                  "Content-Type": "application/json",
                  Cookie: `auth_token=${document.cookie.split("; ").find((row) => row.startsWith("auth_token="))?.split("=")[1] || ""}`,
              },
              body: JSON.stringify({ name: "FREE_TRIAL_DURATION_DAYS" }),
            })

            if (sharedVarRes.ok) {
              const sharedVarData = await sharedVarRes.json()
              if (sharedVarData.status === "success" && sharedVarData.value) {
                fetchedDuration = Number.parseInt(sharedVarData.value, 10)
                setFreeTrialDuration(fetchedDuration) // Update state for rendering
              } else {
                  console.warn("Shared variable FREE_TRIAL_DURATION_DAYS not found or invalid response:", sharedVarData)
              }
            } else {
              const errorData = await sharedVarRes.json()
              console.error("Failed to fetch FREE_TRIAL_DURATION_DAYS from proxy API:", errorData)
              toast.error("Could not fetch free trial duration. Using default 14 days.") 
            }
          } catch (fetchErr) {
            console.error("Network error fetching FREE_TRIAL_DURATION_DAYS:", fetchErr)
            toast.error("Network error fetching free trial duration. Using default 14 days.")
          }
        }

        // Handle redirection and success messages based on whether it's a free trial
        if (userWebsitesCount === 0) {
          // If it's the first website (free trial), ONLY show the trial card
          // The snippet is NOT set for this case, triggering conditional render
          toast.success(`Welcome! Your ${fetchedDuration}-day Pro Plan free trial has been activated! 🎉`)
          setTimeout(() => {
            router.push("/websites") // Redirect to websites overview
          }, 3000)
        } else {
          // If NOT the first website, show the snippet and redirect to pricing
          const snippet = `<script src="${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${generatedChatbotCode}"></script>`
          setChatbotCodeSnippet(snippet) // Set snippet to display the card with code

          toast.success("Website created successfully! Please select a plan.")
          setTimeout(() => {
            router.push(`/pricing?websiteId=${websiteId}`) // Redirect to pricing
          }, 3000)
        }
      }
    } catch (err: any) {
      // If an error occurs during website creation, only show toast, do not display success card
      setError(err.message || "Failed to create website.") 
      toast.error(err.message || "Connection failed. Please check your internet connection.") 
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  // Determine if success card should be shown (i.e., if website creation was successful)
  const showSuccessCard = chatbotCodeSnippet !== null;

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* Back Button - Fixed height and padding */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-slate-100 bg-white">
        <Button
          variant="ghost"
          onClick={() => router.push("/websites")}
          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Websites
        </Button>
      </div>

      {/* Main Content Area - Flexible height and scrollable */}
      <div className="flex-1 px-6 pb-6 pt-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
          {/* Header Section */}
          <div className="text-center mb-6 flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create New Website</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Add your website to start using our AI-powered chatbot and customer support system
            </p>
          </div>

          {/* Conditional Rendering of Form or Success Card */}
          {!showSuccessCard ? ( // Show form if success card should NOT be shown
            <Card className="border-0 shadow-xl rounded-2xl bg-white flex-1 flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                  {/* Form Fields */}
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700 font-semibold">
                          Website Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="My Awesome Website"
                          required
                          className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="link" className="text-slate-700 font-semibold">
                          Website URL
                        </Label>
                        <Input
                          id="link"
                          type="url"
                          name="link"
                          value={formData.link}
                          onChange={handleChange}
                          placeholder="https://example.com"
                          required
                          className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-slate-700 font-semibold">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Brief description of your website and what it offers..."
                        required
                        rows={3}
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl resize-none"
                      />
                    </div>

                    {/* Error Alert */}
                    {error && (
                      <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-sm">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 mt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/websites")}
                        className="flex-1 h-12 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-lg font-semibold"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Creating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Sparkles className="w-4 h-4" />
                            <span>Create Website</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            // Success Card - Only show when showSuccessCard is true
            <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    {userWebsitesCount === 0 ? (
                      <Trophy className="w-6 h-6 text-white" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-emerald-800 text-lg mb-1">
                      {userWebsitesCount === 0 ? "Free Trial Activated!" : "Website Created Successfully!"}
                    </h3>
                    <p className="text-emerald-700 text-sm">
                      {userWebsitesCount === 0
                        ? `Your ${freeTrialDuration}-day Pro Plan free trial has been activated!`
                        : "Your chatbot is ready to be deployed."}
                    </p>
                  </div>
                </div>

                {/* Only show snippet and next steps if NOT a free trial (userWebsitesCount !== 0) */}
                {userWebsitesCount !== 0 && (
                  <>
                    <div className="mb-4">
                      <p className="text-emerald-700 mb-3 text-sm">
                        Copy and paste this code snippet into your website's HTML:
                      </p>
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-auto border border-slate-300 font-mono max-h-20">
                          <code>{chatbotCodeSnippet}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 bg-white border-slate-300 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 rounded-lg shadow-sm"
                          onClick={() => copyToClipboard(chatbotCodeSnippet)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-sm">
                      <p className="text-slate-600 text-sm">
                        <strong>Next Steps:</strong> Add this script tag before the closing{" "}
                        <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}