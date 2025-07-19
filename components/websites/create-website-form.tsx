"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Copy, CheckCircle, Globe, Loader2, Sparkles, Trophy, ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { authFetch } from "@/lib/authFetch" // Assuming authFetch is available for authenticated requests

interface CreateWebsiteFormProps {
  userId: string
  userWebsitesCount: number
}

export function CreateWebsiteForm({ userId, userWebsitesCount }: CreateWebsiteFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
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
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        let fetchedDuration = 14
        if (userWebsitesCount === 0) {
          try {
            const sharedVarRes = await authFetch("/api/shared-variables-config", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: "FREE_TRIAL_DURATION_DAYS" }),
            })
            if (sharedVarRes.ok) {
              const sharedVarData = await sharedVarRes.json()
              if (sharedVarData.status === "success" && sharedVarData.value) {
                fetchedDuration = Number.parseInt(sharedVarData.value, 10)
                setFreeTrialDuration(fetchedDuration)
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

        if (userWebsitesCount === 0) {
          toast.success(`Welcome! Your ${fetchedDuration}-day Pro Plan free trial has been activated! 🎉`)
          setTimeout(() => {
            router.push("/websites")
          }, 3000)
        } else {
          const snippet = `<script async src="${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${generatedChatbotCode}"></script>`
          setChatbotCodeSnippet(snippet)
          toast.success("Website created successfully! Please select a plan.")
          setTimeout(() => {
            router.push(`/pricing?websiteId=${websiteId}`)
          }, 3000)
        }
      }
    } catch (err: any) {
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

  const showSuccessCard = chatbotCodeSnippet !== null

  return (
    <div className="p-4 md:p-6 overflow-y-auto h-full bg-gradient-to-br from-slate-50/50 via-white to-slate-100/50">
      <div className="max-w-4xl mx-auto flex flex-col">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/websites")}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Websites
          </Button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Website</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base">
            Add your website to start using our AI-powered chatbot and customer support system
          </p>
        </div>

        {/* Conditional Rendering of Form or Success Card */}
        {!showSuccessCard ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-2xl" />
            <CardHeader className="pb-6 relative z-10">
              <CardTitle className="text-xl font-bold text-slate-900">Website Details</CardTitle>
              <p className="text-slate-600 text-sm font-medium">Provide basic information about your website</p>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-slate-700 font-semibold text-sm">
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
                    className="h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="link" className="text-slate-700 font-semibold text-sm">
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
                    className="h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-medium"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="description" className="text-slate-700 font-semibold text-sm">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of your website and what it offers..."
                  required
                  rows={4}
                  className="bg-slate-50/80 border-slate-200/60 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl resize-none font-medium"
                />
              </div>
              {error && (
                <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl shadow-sm">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 border-t border-slate-200/60 px-6 py-4 pb-0 rounded-b-3xl relative z-10">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/websites")}
                  className="flex-1 h-12 border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-semibold bg-white/60 shadow-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg font-semibold"
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
            </CardFooter>
          </Card>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-2xl" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-start space-x-6 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                  {userWebsitesCount === 0 ? (
                    <Trophy className="w-8 h-8 text-white" />
                  ) : (
                    <CheckCircle className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-emerald-800 text-2xl mb-2">
                    {userWebsitesCount === 0 ? "Free Trial Activated!" : "Website Created Successfully!"}
                  </h3>
                  <p className="text-emerald-700 text-base leading-relaxed">
                    {userWebsitesCount === 0
                      ? `Your ${freeTrialDuration}-day Pro Plan free trial has been activated! You'll be redirected to your websites.`
                      : "Your chatbot is ready to be deployed. Copy the snippet below and add it to your website."}
                  </p>
                </div>
              </div>

              {userWebsitesCount !== 0 && (
                <>
                  <div className="mb-6 p-6 bg-slate-50/80 rounded-2xl border border-slate-200/60 shadow-inner">
                    <Label htmlFor="code-snippet" className="text-slate-700 font-semibold text-sm mb-3 block">
                      Integration Code Snippet
                    </Label>
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-auto border border-slate-300 font-mono max-h-32">
                        <code id="code-snippet">{chatbotCodeSnippet}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-white/80 border-slate-300 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 rounded-lg shadow-sm"
                        onClick={() => copyToClipboard(chatbotCodeSnippet || "")}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 font-medium">
                      Paste this script tag before the closing{" "}
                      <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag on every page
                      where you want the chatbot to appear.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => router.push(`/pricing?websiteId=${formData.name}`)}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg font-semibold px-6 py-3"
                    >
                      Continue to Pricing
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
