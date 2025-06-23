"use client"

import {
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Users,
  Brain,
  Bell,
  Workflow,
  Palette,
} from "lucide-react"
import SpotlightCard from "@/components/ui/spotlight" // Import the new SpotlightCard

const features = [
  {
    icon: MessageSquare,
    title: "Real-Time Communications",
    description:
      "Lightning-fast live chat with instant message delivery and real-time typing indicators for seamless conversations.",
    gradient: "from-emerald-500 to-emerald-600",
    color: "#10b981", // Base color for the spotlight
  },
  {
    icon: Users,
    title: "Advanced Staff Management",
    description:
      "Comprehensive team management with role-based permissions, workload distribution, and performance tracking.",
    gradient: "from-blue-500 to-blue-600",
    color: "#3b82f6",
  },
  {
    icon: Bell,
    title: "Telegram Live Notifications",
    description:
      "Get instant Telegram notifications for new messages, chat assignments, and important customer interactions.",
    gradient: "from-purple-500 to-purple-600",
    color: "#8b5cf6",
  },
  {
    icon: Workflow,
    title: "Predefined Workflows",
    description:
      "Create automated workflows for common scenarios, routing rules, and escalation procedures to streamline operations.",
    gradient: "from-indigo-500 to-indigo-600",
    color: "#6366f1",
  },
  {
    icon: Brain,
    title: "Smart AI Responses",
    description:
      "Advanced AI that learns from your conversations and provides contextually relevant, helpful responses automatically.",
    gradient: "from-violet-500 to-violet-600",
    color: "#7c3aed",
  },
  {
    icon: Palette,
    title: "Complete Widget Customization",
    description:
      "Fully customize your chat widget's appearance, behavior, and positioning to match your brand perfectly.",
    gradient: "from-pink-500 to-pink-600",
    color: "#ec4899",
  },
  {
    icon: BarChart3,
    title: "Robust Analytics & Management",
    description:
      "Comprehensive dashboard with detailed analytics, conversation insights, and performance metrics for data-driven decisions.",
    gradient: "from-amber-500 to-amber-600",
    color: "#f59e0b",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level encryption, GDPR compliance, and advanced security measures to protect all customer data and conversations.",
    gradient: "from-red-500 to-red-600",
    color: "#ef4444",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Round-the-clock customer support with automatic handoffs between AI and human agents based on complexity.",
    gradient: "from-teal-500 to-teal-600",
    color: "#14b8a6",
  },
]

// A simple utility to convert hex color to an rgba string
const hexToRgba = (hex, opacity) => {
  let c
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("")
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = "0x" + c.join("")
    return `rgba(${(c >> 16) & 255}, ${(c >> 8) & 255}, ${c & 255}, ${opacity})`
  }
  throw new Error("Bad Hex")
}

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
            Our comprehensive platform includes all the advanced tools and
            features you need to transform your customer experience and
            streamline operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <SpotlightCard
              key={index}
              className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group"
              spotlightColor={hexToRgba(feature.color, 0.35)} // Use the feature's color for the spotlight
            >
              <div className="relative z-10">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}