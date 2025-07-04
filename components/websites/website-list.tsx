"use client"

import { WebsiteCard } from "./website-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Plus, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface WebsiteListProps {
  websites: any[]
}

export function WebsiteList({ websites }: WebsiteListProps) {
  const router = useRouter()

  if (websites.length === 0) {
    return (
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-8 md:p-12 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Globe className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">No websites yet</h3>
          <p className="text-slate-600 mb-6 md:mb-8 max-w-md mx-auto leading-relaxed text-sm md:text-base">
            Get started by adding your first website and enable AI-powered customer support for your business
          </p>
          <Button
            onClick={() => router.push("/websites/new")}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-sm px-6 py-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Website
          </Button>
          <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
            <div className="flex items-center justify-center space-x-2 text-slate-600">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium">Free setup • AI-powered • 24/7 support</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {websites.map((website) => (
        <WebsiteCard key={website._id} website={website} />
      ))}
    </div>
  )
}
