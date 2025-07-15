"use client"

import { WebsiteCard } from "./website-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Plus, Zap, Shield, Clock, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface WebsiteListProps {
  websites: any[]
}

export function WebsiteList({ websites }: WebsiteListProps) {
  const router = useRouter()

  if (websites.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-white to-slate-50/50 border-0 shadow-lg rounded-3xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-2xl" />

        <CardContent className="p-12 text-center relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Globe className="w-12 h-12 text-emerald-600" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to get started?</h3>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed text-base">
            Transform your website with AI-powered customer support. Add your first website and start engaging with
            customers in minutes.
          </p>

          <Button
            onClick={() => router.push("/websites/new")}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl px-8 py-4 text-base font-semibold transition-all duration-300 mb-10"
          >
            <Plus className="w-5 h-5 mr-3" />
            Add Your First Website
          </Button>

          {/* Enhanced Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Zap className="w-7 h-7 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Quick Setup</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get your chatbot running in under 2 minutes with our simple integration process
              </p>
              <div className="flex items-center justify-center space-x-1 mt-3 text-emerald-600">
                <Sparkles className="w-3 h-3" />
                <span className="text-xs font-semibold">Ready in 2 minutes</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">AI-Powered</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Advanced AI understands context and provides intelligent, helpful responses to customers
              </p>
              <div className="flex items-center justify-center space-x-1 mt-3 text-blue-600">
                <Sparkles className="w-3 h-3" />
                <span className="text-xs font-semibold">Smart responses</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Clock className="w-7 h-7 text-purple-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">24/7 Support</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Never miss a customer inquiry with round-the-clock automated support
              </p>
              <div className="flex items-center justify-center space-x-1 mt-3 text-purple-600">
                <Sparkles className="w-3 h-3" />
                <span className="text-xs font-semibold">Always available</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {websites.map((website) => (
        <WebsiteCard key={website._id} website={website} />
      ))}
    </div>
  )
}
