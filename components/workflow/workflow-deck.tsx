"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  X,
  Plus,
  Save,
  Maximize2,
  Play,
  GitBranch,
  Diamond,
  MessageSquare,
  User,
  Square as EndIcon,
} from "lucide-react"

// Block type definitions are now co-located with the component that uses them.
export const BLOCK_DEFINITIONS = {
  start: {
    title: "Start Event",
    description: "Begins the workflow. This is the initial entry point for the user interaction.",
    icon: Play,
    color: "emerald",
  },
  message: {
    title: "Message Block",
    description: "Sends a message to the user. Can be a statement, question, or information.",
    icon: MessageSquare,
    color: "orange",
  },
  option: {
    title: "Option Block",
    description: "Presents the user with multiple choices, creating different paths in the workflow.",
    icon: GitBranch,
    color: "blue",
  },
  userResponse: {
    title: "User Response",
    description: "Waits for and captures a free-text response from the user to be used later.",
    icon: User,
    color: "cyan",
  },
  condition: {
    title: "Condition Block",
    description: "Creates a logic branch based on which option was previously selected by the user.",
    icon: Diamond,
    color: "purple",
  },
  end: {
    title: "End Event",
    description: "Finishes the workflow path. This can lead to qualifying the user or ending the chat.",
    icon: EndIcon,
    color: "red",
  },
}

export type BlockType = keyof typeof BLOCK_DEFINITIONS

// Props interface for the deck component
interface WorkflowDeckProps {
  isDeckMenuOpen: boolean
  setIsDeckMenuOpen: (isOpen: boolean) => void
  setHoveredBlockInfo: (info: { title: string; description: string } | null) => void
  onAddBlock: (type: BlockType) => void
  onFitToView: () => void
  onSave: () => void
}

export function WorkflowDeck({
  isDeckMenuOpen,
  setIsDeckMenuOpen,
  setHoveredBlockInfo,
  onAddBlock,
  onFitToView,
  onSave,
}: WorkflowDeckProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white/20 rounded-full p-2 shadow-2xl ring-1 ring-black/5 transition-all duration-300 ease-in-out">
        {isDeckMenuOpen ? (
          // --- Expanded Menu to Add Blocks ---
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeckMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200"
              title="Close Menu"
            >
              <X className="w-5 h-5 text-slate-600" />
            </Button>
            {Object.entries(BLOCK_DEFINITIONS).map(([key, { title, icon: Icon, color }]) => (
              <Button
                key={key}
                variant="ghost"
                size="icon"
                className={`w-11 h-11 rounded-full bg-${color}-100 hover:bg-${color}-200 text-${color}-600`}
                title={title}
                onClick={() => onAddBlock(key as BlockType)}
                onMouseEnter={() => setHoveredBlockInfo(BLOCK_DEFINITIONS[key as BlockType])}
                onMouseLeave={() => setHoveredBlockInfo(null)}
              >
                <Icon className="w-5 h-5" />
              </Button>
            ))}
          </>
        ) : (
          // --- Initial Collapsed Deck View ---
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onFitToView}
              className="w-11 h-11 p-0 rounded-full hover:bg-slate-100"
              title="Fit to View"
            >
              <Maximize2 className="w-5 h-5 text-slate-600" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={() => setIsDeckMenuOpen(true)}
              className="w-14 h-14 p-0 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
              title="Add Block"
            >
              <Plus className="w-7 h-7 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSave}
              className="w-11 h-11 p-0 rounded-full hover:bg-slate-100"
              title="Save Workflow"
            >
              <Save className="w-5 h-5 text-slate-600" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}