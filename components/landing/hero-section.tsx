"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, MessageSquare, Zap, Users, Brain, Bell } from "lucide-react"

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-emerald-50 pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
      {/* Background Pattern */}
    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2310b981%22%20fillOpacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Badge */}
          <Badge className="mb-6 md:mb-8 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-emerald-300 rounded-full px-4 py-2 shadow-sm">
            <Zap className="w-3 h-3 mr-2" />
            AI-Powered Customer Support Platform
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 md:mb-8 leading-tight">
            Transform Your Website with
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              {" "}Smart AI Chatbots
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
            Provide instant 24/7 customer support with real-time communications, advanced staff management, 
            Telegram notifications, and intelligent AI responses. No coding required.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:mb-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              <span className="text-xs md:text-sm font-medium text-slate-700">Real-time Chat</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-xs md:text-sm font-medium text-slate-700">Staff Management</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
              <Bell className="w-6 h-6 text-purple-600" />
              <span className="text-xs md:text-sm font-medium text-slate-700">Live Notifications</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
              <Brain className="w-6 h-6 text-violet-600" />
              <span className="text-xs md:text-sm font-medium text-slate-700">AI Responses</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-16">
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl w-full sm:w-auto"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl w-full sm:w-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
              <span className="font-medium">30+ websites powered</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
              <span className="font-medium">1K+ conversations handled</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
              <span className="font-medium">99.9% uptime guaranteed</span>
            </div>
          </div>
        </div>

        {/* Hero Demo */}
        <div className="mt-16 md:mt-20 relative">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-slate-200 p-4 md:p-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                <div className="flex-1 bg-white rounded-lg px-3 py-2 text-sm text-slate-600 font-mono">
                  yourwebsite.com
                </div>
              </div>
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl font-semibold text-slate-900">Welcome to our store!</h3>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <div className="bg-slate-100 rounded-xl p-3 md:p-4 max-w-xs">
                    <p className="text-sm md:text-base text-slate-700">Hi! How can I help you today? 👋</p>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl p-3 md:p-4 max-w-xs ml-auto">
                    <p className="text-sm md:text-base">I'm looking for running shoes</p>
                  </div>
                  <div className="bg-slate-100 rounded-xl p-3 md:p-4 max-w-sm">
                    <p className="text-sm md:text-base text-slate-700">
                      Great! I can help you find the perfect running shoes. What's your preferred style and budget? 🏃‍♂️
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
