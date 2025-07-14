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

  // Removed handleViewChats and handleViewSettings as they were directly handled by Link components
  // and are no longer used.

  return (
    <Card className="bg-white border-slate-200 hover:border-slate-300 transition-all duration-200 group shadow-sm hover:shadow-md rounded-xl"> {/* Added rounded-xl */}
      <CardHeader className="pb-3 px-4 md:px-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Adjusted font styles for consistency */}
            <CardTitle className="text-lg font-normal text-[#121211] group-hover:text-emerald-600 transition-colors truncate">
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
                <span className="truncate text-sm font-light">{website.link}</span> {/* Adjusted font-light */}
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
                  className="text-slate-500 hover:text-slate-900 rounded-full w-8 h-8 p-0" // Already rounded-full
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-slate-200">
                <DropdownMenuItem className="flex items-center space-x-2 rounded-lg">
                  <Link href={`/websites/${website._id}/conversations`} className="flex items-center w-full"> {/* Added flex and w-full to Link */}
                    <MessageSquare className="w-4 h-4 mr-2" /> {/* Added mr-2 for icon spacing */}
                    <span>View Conversations</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2 rounded-lg">
                  <Link href={`/websites/${website._id}`} className="flex items-center w-full"> {/* Added flex and w-full to Link */}
                    <Settings className="w-4 h-4 mr-2" /> {/* Added mr-2 for icon spacing */}
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
                  <Copy className="w-4 h-4 mr-2" /> {/* Added mr-2 for icon spacing */}
                  <span>Copy Bot Code</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop More Button - still rounded-full */}
          <Button variant="ghost" size="sm" className="hidden md:flex text-slate-500 hover:text-slate-900 rounded-full">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 md:px-6">
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed min-h-10 max-h-10 font-light">{website.description}</p> {/* Adjusted text-slate-600 to text-gray-500, added font-light */}

        {/* Stats Row */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-[#121211] font-normal">{website.creditCount || 0}</span> {/* Adjusted text color and font-normal */}
              <span className="text-xs text-gray-500 font-light">credits</span> {/* Adjusted text color and font-light */}
            </div>
            {website.plan && (
              <div className="flex items-center space-x-1">
                <Crown className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-[#121211] font-normal">{website.plan.name}</span> {/* Adjusted text color and font-normal */}
              </div>
            )}
          </div>
          <Badge
            variant="outline"
            className={`text-xs rounded-full px-3 py-1 font-normal ${ // Added rounded-full, px-3 py-1 for consistency
              website.preferences?.allowAIResponses
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" // Simplified gradient to solid color
                : "bg-slate-50 text-slate-600 border-slate-200" // Simplified gradient to solid color
            }`}
          >
            {website.preferences?.allowAIResponses ? "AI Enabled" : "Manual Only"}
          </Badge>
        </div>

        {/* Chatbot Code Section */}
        <div className="space-y-2">
          <Label className="text-xs font-normal text-gray-500 uppercase tracking-wide">Chatbot Code</Label> {/* Adjusted text-slate-500 to text-gray-500, font-normal */}
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
              className="border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 rounded-full flex-shrink-0" // Added rounded-full
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
          <Link href={`/websites/${website._id}/conversations`} className="w-full"> {/* Added w-full */}
            <Button
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full shadow-sm font-normal" // Added w-full, rounded-full
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">View Conversations</span>
              <span className="sm:hidden">Chats</span> {/* Changed for brevity on small screens */}
            </Button>
          </Link>
          <Link href={`/websites/${website._id}`} className="w-full"> {/* Added w-full */}
            <Button
              variant="outline"
              className="w-full border-slate-200 text-gray-600 hover:bg-slate-50 hover:text-[#121211] rounded-full font-normal" // Adjusted text color, hover, added rounded-full, font-normal
            >
              <Settings className="w-4 h-4 mr-2" /> {/* Added mr-2 */}
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Settings</span> {/* Ensure consistency for small screens */}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}