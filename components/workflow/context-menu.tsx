"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Play, GitBranch, Diamond, Square, MessageSquare, Save, Sparkles, User } from "lucide-react" // Import User icon

interface ContextMenuProps {
  x: number
  y: number
  onAddBlock: (type: "start" | "option" | "condition" | "message" | "end" | "userResponse") => void // Added userResponse
  onClose: () => void
  onSave: () => void
}

export function ContextMenu({ x, y, onAddBlock, onClose, onSave }: ContextMenuProps) {
  return (
    <Card className="p-4 bg-white/85 backdrop-blur-xl border border-white/30 shadow-2xl min-w-72 rounded-3xl ring-1 ring-black/5">
      <div className="space-y-3">
        <div className="px-2 py-1 flex items-center space-x-3">
          <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Add Block</p>
        </div>

        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddBlock("start")}
            className="w-full justify-start hover:bg-white/60 backdrop-blur-sm rounded-2xl py-3 px-3 transition-all duration-200 hover:scale-[1.01] border border-transparent hover:border-white/40 text-emerald-700 hover:text-emerald-800"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-500/10 backdrop-blur-sm flex items-center justify-center mr-3 shadow-lg border border-emerald-300/30">
              <Play className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Start Event</div>
              <div className="text-xs text-emerald-600/80 font-medium">Begin workflow</div>
            </div>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddBlock("option")}
            className="w-full justify-start hover:bg-white/60 backdrop-blur-sm rounded-2xl py-3 px-3 transition-all duration-200 hover:scale-[1.01] border border-transparent hover:border-white/40 text-blue-700 hover:text-blue-800"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-400/20 to-blue-500/10 backdrop-blur-sm flex items-center justify-center mr-3 shadow-lg border border-blue-300/30">
              <GitBranch className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Option Block</div>
              <div className="text-xs text-blue-600/80 font-medium">Multiple choices</div>
            </div>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddBlock("condition")}
            className="w-full justify-start hover:bg-white/60 backdrop-blur-sm rounded-2xl py-3 px-3 transition-all duration-200 hover:scale-[1.01] border border-transparent hover:border-white/40 text-purple-700 hover:text-purple-800"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-400/20 to-purple-500/10 backdrop-blur-sm flex items-center justify-center mr-3 shadow-lg border border-purple-300/30">
              <Diamond className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Condition Block</div>
              <div className="text-xs text-purple-600/80 font-medium">Logic branching</div>
            </div>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddBlock("message")}
            className="w-full justify-start hover:bg-white/60 backdrop-blur-sm rounded-2xl py-3 px-3 transition-all duration-200 hover:scale-[1.01] border border-transparent hover:border-white/40 text-amber-700 hover:text-amber-800"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 backdrop-blur-sm flex items-center justify-center mr-3 shadow-lg border border-amber-300/30">
              <MessageSquare className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Message Block</div>
              <div className="text-xs text-amber-600/80 font-medium">Send message</div>
            </div>
          </Button>

          {/* New User Response Block */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddBlock("userResponse")}
            className="w-full justify-start hover:bg-white/60 backdrop-blur-sm rounded-2xl py-3 px-3 transition-all duration-200 hover:scale-[1.01] border border-transparent hover:border-white/40 text-cyan-700 hover:text-cyan-800"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-cyan-500/10 backdrop-blur-sm flex items-center justify-center mr-3 shadow-lg border border-cyan-300/30">
              <User className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">User Response</div>
              <div className="text-xs text-cyan-600/80 font-medium">Receive user response</div>
            </div>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddBlock("end")}
            className="w-full justify-start hover:bg-white/60 backdrop-blur-sm rounded-2xl py-3 px-3 transition-all duration-200 hover:scale-[1.01] border border-transparent hover:border-white/40 text-rose-700 hover:text-rose-800"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-400/20 to-rose-500/10 backdrop-blur-sm flex items-center justify-center mr-3 shadow-lg border border-rose-300/30">
              <Square className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">End Event</div>
              <div className="text-xs text-rose-600/80 font-medium">Finish workflow</div>
            </div>
          </Button>
        </div>

        <Separator className="my-3 bg-slate-200/60" />

        <div className="px-2 py-1">
          <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Actions</p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onSave()
            onClose()
          }}
          className="w-full justify-start hover:bg-white/60 backdrop-blur-sm rounded-2xl py-3 px-3 transition-all duration-200 hover:scale-[1.01] border border-transparent hover:border-white/40 text-slate-700 hover:text-slate-900"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-400/20 to-slate-500/10 backdrop-blur-sm flex items-center justify-center mr-3 shadow-lg border border-slate-300/30">
            <Save className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm">Save Workflow</div>
            <div className="text-xs text-slate-600/80 font-medium">Save changes</div>
          </div>
        </Button>
      </div>
    </Card>
  )
}