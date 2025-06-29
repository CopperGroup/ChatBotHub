// components/ui/full-screen-loading-overlay.tsx
"use client"

import { Loader2, Zap } from "lucide-react";

export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 bg-opacity-90 backdrop-blur-sm transition-opacity duration-300 ease-out"
      // Using bg-slate-50 with opacity and backdrop-blur for a subtle effect
    >
        <div className="relative mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto animate-pulse">
            <Zap className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>

          {/* Animated Ring */}
          <div className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl border-4 border-emerald-200 animate-ping opacity-75"></div>
          <div className="absolute inset-2 w-12 h-12 md:w-16 md:h-16 mx-auto rounded-xl border-2 border-emerald-300 animate-ping opacity-50 animation-delay-150"></div>
        </div>
    </div>
  );
}