// components/ui/full-screen-loading-overlay.tsx
"use client"

import { Loader2, Zap } from "lucide-react";

export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 bg-opacity-90 backdrop-blur-sm transition-opacity duration-300 ease-out"
      // Using bg-slate-50 with opacity and backdrop-blur for a subtle effect
    >
      <div className="w-52 flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl shadow-2xl animate-fade-in-up transform scale-95 md:scale-100 transition-transform duration-300 ease-out">
        {/* Themed Zap Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-xl">
          <Zap className="w-8 h-8 text-white" />
        </div>

        {/* Loading Spinner */}
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />

        {/* Loading Message */}
        <p className="text-xl font-bold text-slate-800 text-center">{message}</p>
      </div>
    </div>
  );
}