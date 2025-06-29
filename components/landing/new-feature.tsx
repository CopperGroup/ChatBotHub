"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, MessageSquare, Zap, Brain, CheckCircle, Clock, TrendingUp } from "lucide-react"

export function WorkflowAutomationBanner() {
  return (
    <section className="relative bg-gradient-to-bl from-emerald-50 via-white to-emerald-100 py-16 sm:py-20 overflow-hidden">
      {/* Geometric Background */}
      <div className="absolute inset-0">

        {/* Subtle geometric lines */}
        {/* <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 600">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <path d="M0,100 Q250,50 500,100 T1000,100" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
          <path d="M0,200 Q250,150 500,200 T1000,200" stroke="url(#lineGradient)" strokeWidth="1" fill="none" />
          <path d="M0,300 Q250,250 500,300 T1000,300" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" />
        </svg> */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left Column - Content (3/5 width) */}
          <div className="lg:col-span-3 text-center lg:text-left">
            {/* New Badge */}
            <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 rounded-full px-5 py-2 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              NEW! Workflow Automation v1.2
            </Badge>

            {/* Main Headline - Shorter */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                Smart Workflows
              </span>
              <br />
              for Your Chatbot
            </h1>

            {/* Subheadline - Concise */}
            <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed">
              Build conversation paths that convert visitors and reduce support tickets by{" "}
              <span className="text-emerald-600 font-semibold">70%</span>.
            </p>

            {/* Simplified Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="font-medium text-slate-700">Auto-qualify leads</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="font-medium text-slate-700">Handle support 24/7</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="font-medium text-slate-700">Personalized journeys</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="font-medium text-slate-700">No coding required</span>
              </div>
            </div>

            {/* Simplified CTA Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl group"
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Start Building Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-xl bg-white/80 backdrop-blur-sm"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  View Demo
                </Button>
              </div>

              {/* Minimal Trust Elements */}
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-emerald-700">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>5-min setup</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Silent mode</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4" />
                  <span>No technical skills needed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Workflow Builder (2/5 width) */}
          <div className="lg:col-span-2 relative">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Visual Builder</h3>
              <p className="text-slate-600">Drag, drop & connect</p>
            </div>

            {/* Simple Image Container */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-2xl border border-emerald-200 p-2">
                <img
                  src="/workflow-builder.png"
                  alt="Visual Workflow Builder Interface"
                  className="w-full h-auto rounded-xl shadow-sm"
                />
              </div>

              {/* Simple floating indicator */}
              <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Ready!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
