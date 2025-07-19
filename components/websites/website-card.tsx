"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { MessageSquare, Settings, Copy, ExternalLink, Zap, Crown, Globe, Sparkles } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface WebsiteCardProps {
  website: any
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  const router = useRouter()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const handleCardClick = () => {
    router.push(`/websites/${website._id}`)
  }

  return (
    <Card
      className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl h-full relative overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-2xl group-hover:scale-105 transition-transform duration-500" />

      <CardHeader className="pb-4 px-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate leading-tight">
                {website.name}
              </CardTitle>
              <CardDescription className="mt-2">
                <a
                  href={website.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 hover:underline flex items-center space-x-2 group/link text-sm font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="truncate">{website.link}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              </CardDescription>
            </div>
          </div>
        </div>

        {/* Website Description */}
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed min-h-[2.5rem] px-1">{website.description}</p>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-6 relative z-10">
        {/* Plan and Status Section */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/80 to-white/80 rounded-2xl border border-slate-200/60">
          <div className="flex items-center space-x-4">
            {website.plan && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center shadow-sm">
                  <Crown className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Plan</p>
                  <p className="text-sm font-bold text-slate-900">{website.plan.name}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Credits</p>
                <p className="text-sm font-bold text-slate-900">{website.creditCount || 0}</p>
              </div>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`text-xs font-semibold ${
              website.preferences?.allowAIResponses
                ? "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200/60"
                : "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border-slate-200/60"
            } rounded-xl px-4 py-2`}
          >
            {website.preferences?.allowAIResponses ? "AI Active" : "Manual Mode"}
          </Badge>
        </div>

        {/* Integration Code Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Integration Code</Label>
            <div className="flex items-center space-x-1 text-emerald-600">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-medium">Ready to use</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-slate-50/80 to-white/80 rounded-2xl border border-slate-200/60">
            <code className="flex-1 text-xs font-mono text-slate-700 truncate bg-white/60 px-3 py-2 rounded-xl border border-slate-200/60">
              {`<script src="...widget.js?code=${website.chatbotCode.slice(0, 8)}..."></script>`}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                copyToClipboard(
                  `<script async src="https://chatbothubserver.up.railway.app/widget/chatbot-widget.js?chatbotCode=${website.chatbotCode}"></script>`,
                )
              }}
              className="border-slate-200/60 text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 rounded-xl flex-shrink-0 transition-all duration-200 shadow-sm"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <Link href={`/websites/${website._id}/conversations`} className="flex-1" onClick={(e) => e.stopPropagation()}>
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl py-3 text-sm font-semibold transition-all duration-300">
              <MessageSquare className="w-4 h-4 mr-3" />
              View Conversations
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-slate-200/60 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 rounded-2xl px-4 py-3 transition-all duration-300 bg-white/60 shadow-sm hover:shadow-md"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/websites/${website._id}`)
            }}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
