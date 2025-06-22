"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, BarChart3, Shield, Clock, Users, Brain, Bell, Workflow, Palette } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Real-Time Communications",
    description:
      "Lightning-fast live chat with instant message delivery and real-time typing indicators for seamless conversations.",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Users,
    title: "Advanced Staff Management",
    description:
      "Comprehensive team management with role-based permissions, workload distribution, and performance tracking.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Bell,
    title: "Telegram Live Notifications",
    description:
      "Get instant Telegram notifications for new messages, chat assignments, and important customer interactions.",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: Workflow,
    title: "Predefined Workflows",
    description:
      "Create automated workflows for common scenarios, routing rules, and escalation procedures to streamline operations.",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Brain,
    title: "Smart AI Responses",
    description:
      "Advanced AI that learns from your conversations and provides contextually relevant, helpful responses automatically.",
    gradient: "from-violet-500 to-violet-600",
  },
  {
    icon: Palette,
    title: "Complete Widget Customization",
    description:
      "Fully customize your chat widget's appearance, behavior, and positioning to match your brand perfectly.",
    gradient: "from-pink-500 to-pink-600",
  },
  {
    icon: BarChart3,
    title: "Robust Analytics & Management",
    description:
      "Comprehensive dashboard with detailed analytics, conversation insights, and performance metrics for data-driven decisions.",
    gradient: "from-amber-500 to-amber-600",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level encryption, GDPR compliance, and advanced security measures to protect all customer data and conversations.",
    gradient: "from-red-500 to-red-600",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Round-the-clock customer support with automatic handoffs between AI and human agents based on complexity.",
    gradient: "from-teal-500 to-teal-600",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
            Everything you need for
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              exceptional support
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform includes all the advanced tools and features you need to transform your customer
            experience and streamline operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="p-6 md:p-8">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
