"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Copy, CheckCircle, Globe, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { authFetch } from "@/lib/authFetch"

interface CreateWebsiteFormProps {
  userId: string
}

export function CreateWebsiteForm({ userId }: CreateWebsiteFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [chatbotCodeSnippet, setChatbotCodeSnippet] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    description: "",
  })
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setChatbotCodeSnippet("")

    const generatedChatbotCode =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    try {
      const res = await authFetch("http://192.168.32.1:3001/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          creditCount: 100,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Failed to create website.")
        toast.error("Failed to create website. Please try again.")
      } else {
        const snippet = `<script src="http://192.168.32.1:3001/widget/chatbot-widget.js?chatbotCode=${generatedChatbotCode}"></script>`
        setChatbotCodeSnippet(snippet)
        toast.success("Website created successfully! Your chatbot is ready to go.")

        // Redirect after a delay to show the success message
        setTimeout(() => {
          router.push("/websites")
        }, 3000)
      }
    } catch (err) {
      setError("Failed to connect to server.")
      toast.error("Connection failed. Please check your internet connection.")
    }
    setLoading(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-xl md:text-2xl text-slate-900 flex items-center space-x-2">
            <Globe className="w-6 h-6 text-emerald-600" />
            <span>Create New Website</span>
          </CardTitle>
          <p className="text-slate-600 mt-2">
            Add your website to start using our AI-powered chatbot and customer support system.
          </p>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">
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
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link" className="text-slate-700 font-medium">
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
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700 font-medium">
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
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl resize-none"
              />
            </div>

            {error && (
              <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-sm">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/websites")}
                className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-sm"
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
          </form>
        </CardContent>
      </Card>

      {chatbotCodeSnippet && (
        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-800 text-lg">Website Created Successfully!</h3>
                <p className="text-emerald-700 text-sm">Your chatbot is ready to be deployed</p>
              </div>
            </div>
            <p className="text-emerald-700 mb-4 text-sm md:text-base">
              Copy and paste this code snippet into your website's HTML to enable the chatbot:
            </p>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs md:text-sm overflow-auto border border-slate-300 font-mono">
                <code>{chatbotCodeSnippet}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-3 right-3 bg-white border-slate-300 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 rounded-lg shadow-sm"
                onClick={() => copyToClipboard(chatbotCodeSnippet)}
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-emerald-200">
              <p className="text-xs md:text-sm text-slate-600">
                <strong>Next steps:</strong> Add this script tag to your website's HTML, preferably before the closing{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag. The chatbot will
                automatically appear on your website.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
