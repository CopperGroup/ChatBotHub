"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Settings, MessageSquare, BarChart3, Sparkles } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: Code,
    title: "Add One Line of Code",
    description:
      "Simply copy and paste our widget code into your website. It takes less than 2 minutes to get started with full customization options.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    step: "02",
    icon: Settings,
    title: "Configure & Customize",
    description:
      "Set up your chatbot's appearance, AI responses, staff workflows, and notification preferences to match your brand perfectly.",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    step: "03",
    icon: MessageSquare,
    title: "Start Real-time Conversations",
    description:
      "Your chatbot immediately begins helping visitors with AI responses, staff handoffs, and Telegram notifications working seamlessly.",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Monitor & Optimize",
    description:
      "Track performance with robust analytics, optimize workflows, and continuously improve your customer experience with data-driven insights.",
    gradient: "from-amber-500 to-amber-600",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Badge className="mb-4 md:mb-6 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-emerald-300 rounded-full px-4 py-2 shadow-sm">
            <Sparkles className="w-3 h-3 mr-2" />
            Simple Setup Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
            Get started in
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              4 easy steps
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            From setup to optimization, our streamlined process gets your advanced chatbot platform up and running in
            minutes, not hours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="p-6 md:p-8 text-center">
                <div className="relative mb-6 md:mb-8">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <Badge className="absolute -top-2 -right-2 bg-slate-900 text-white border-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                    {step.step}
                  </Badge>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3 md:mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
