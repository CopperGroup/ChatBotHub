"use client"

import { Zap } from "lucide-react"

export function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto animate-pulse">
            <Zap className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>

          {/* Animated Ring */}
          <div className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl border-4 border-emerald-200 animate-ping opacity-75"></div>
          <div className="absolute inset-2 w-12 h-12 md:w-16 md:h-16 mx-auto rounded-xl border-2 border-emerald-300 animate-ping opacity-50 animation-delay-150"></div>
        </div>

        {/* ChatBot Hub Branding */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">ChatBot Hub</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full mx-auto"></div>
        </div>

        {/* Loading Message */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl px-8 py-6 shadow-xl ring-1 ring-black/5 max-w-md mx-auto">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-3">Workflow canvas is loading</h2>
          <p className="text-sm text-slate-600 mb-4">Preparing your workflow builder environment...</p>

          {/* Loading Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  )
}
