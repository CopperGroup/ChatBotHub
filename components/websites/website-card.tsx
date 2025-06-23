"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { MessageSquare, Settings, Copy, ExternalLink, Zap, MoreVertical, Crown } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

  const handleViewChats = () => {
    router.push(`/conversations/${website._id}`)
  }

  const handleViewSettings = () => {
    router.push(`/websites/${website._id}`)
  }

  return (
    <Card className="bg-white border-slate-200 hover:border-slate-300 transition-all duration-200 group shadow-sm hover:shadow-md">
      <CardHeader className="pb-3 px-4 md:px-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
              {website.name}
            </CardTitle>
            <CardDescription className="mt-2">
              <a
                href={website.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 hover:underline flex items-center space-x-1 group/link"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="truncate text-sm">{website.link}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </a>
            </CardDescription>
          </div>

          {/* Mobile Dropdown Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-900 rounded-full w-8 h-8 p-0"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-slate-200">
                  <DropdownMenuItem className="flex items-center space-x-2 rounded-lg">
                    <Link href={`/websites/${website._id}/conversations`}>
                      <MessageSquare className="w-4 h-4" />
                      <span>View Conversations</span>
                    </Link>
                  </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2 rounded-lg">
                  <Link href={`/websites/${website._id}`}>
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(website.chatbotCode)
                  }}
                  className="flex items-center space-x-2 rounded-lg"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Bot Code</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop More Button */}
          <Button variant="ghost" size="sm" className="hidden md:flex text-slate-500 hover:text-slate-900 rounded-full">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 md:px-6">
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed min-h-10 max-h-10">{website.description}</p>

        {/* Stats Row */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-slate-600 font-medium">{website.creditCount || 0}</span>
              <span className="text-xs text-slate-500">credits</span>
            </div>
            {website.plan && (
              <div className="flex items-center space-x-1">
                <Crown className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-slate-600 font-medium">{website.plan.name}</span>
              </div>
            )}
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${
              website.preferences?.allowAIResponses
                ? "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-600 border-slate-200"
            } rounded-lg px-2 py-1`}
          >
            {website.preferences?.allowAIResponses ? "AI Enabled" : "Manual Only"}
          </Badge>
        </div>

        {/* Chatbot Code Section */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Chatbot Code</Label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-slate-50 px-3 py-2 rounded-lg text-xs font-mono text-slate-700 border border-slate-200 truncate">
              {`<script src="https://chatbothubserver.up.railway.app/widget/chatbot-widget.js?chatbotCode=${website.chatbotCode}"></script>`}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                copyToClipboard(`<script src="https://chatbothubserver.up.railway.app/widget/chatbot-widget.js?chatbotCode=${website.chatbotCode}"></script>`)
              }}
              className="border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 rounded-lg flex-shrink-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
          <Link href={`/websites/${website._id}/conversations`}>
            <Button
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-sm"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">View Conversations</span>
              <span className="sm:hidden">Conversations</span>
            </Button>
          </Link>
          <Link href={`/websites/${website._id}`}>
            <Button
              variant="outline"
              className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl sm:w-auto"
            >
              <Settings className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
