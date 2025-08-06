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
  Globe,
  Image as ImageIcon, // Renamed to avoid conflict with HTML <img> tag
} from "lucide-react"
import SpotlightCard from "@/components/ui/spotlight"
import { motion } from "framer-motion"
import { useRef } from "react" // useRef is still needed for useScroll in HeroSection, but not directly used here anymore.

const features = [
  {
    icon: MessageSquare,
    title: "Instant Customer Connections",
    description:
      "Dazzle your customers with lightning-fast live chat, ensuring every query is met with instant, seamless, and satisfying responses that build lasting loyalty.",
    gradient: "from-emerald-500 to-emerald-600",
    color: "#10b981",
    gridClass: "lg:col-span-6 lg:row-span-1",
  },
  {
    icon: Users,
    title: "Empower Your Support Team",
    description:
      "Transform your team's efficiency with comprehensive management tools, enabling seamless collaboration, balanced workloads, and peak performance.",
    gradient: "from-blue-500 to-blue-600",
    color: "#3b82f6",
    gridClass: "lg:col-span-6 lg:row-span-1",
  },
  {
    // This is the new prominent Image Card
    icon: ImageIcon, // Using a generic image icon for this visual card
    title: "Visualize Your Success",
    description:
      "See the full impact of our platform with dynamic visuals and actionable insights, bringing your data to life for smarter decisions.",
    gradient: "from-gray-700 to-gray-900", // A neutral gradient for the image card text overlay
    color: "#4b5563", // A neutral color for the spotlight effect
    isImageCard: true,
    imageUrl: "/assets/landing/features.png", // Using the previous background image as the card image
    gridClass: "lg:col-span-12 lg:row-span-2", // Spans full width and 2 rows on large screens
  },
  {
    icon: Bell,
    title: "Never Miss a Beat with Notifications",
    description:
      "Stay instantly informed with real-time Telegram notifications for new messages, chat assignments, and critical customer interactions, keeping you always in the loop.",
    gradient: "from-purple-500 to-purple-600",
    color: "#8b5cf6",
    gridClass: "lg:col-span-4",
  },
  {
    icon: Workflow,
    title: "Automate for Peak Efficiency",
    description:
      "Streamline your operations by creating intelligent, automated workflows for common inquiries, smart routing, and seamless escalation, freeing up your team for complex tasks.",
    gradient: "from-indigo-500 to-indigo-600",
    color: "#6366f1",
    gridClass: "lg:col-span-4",
  },
  {
    icon: Brain,
    title: "AI That Understands & Responds",
    description:
      "Leverage advanced AI that continuously learns from your conversations, providing contextually relevant, highly accurate, and magically helpful responses automatically.",
    gradient: "from-violet-500 to-violet-600",
    color: "#7c3aed",
    gridClass: "lg:col-span-4",
  },
  {
    icon: Palette,
    title: "Tailored to Your Brand",
    description:
      "Achieve a perfectly cohesive brand experience by fully customizing your chat widget's appearance, behavior, and placement to seamlessly integrate with your website.",
    gradient: "from-pink-500 to-pink-600",
    color: "#ec4899",
    gridClass: "lg:col-span-6",
  },
  {
    icon: Globe,
    title: "Global Reach with Multi-Language Support",
    description:
      "Break down communication barriers and expand your market effortlessly. Our widget offers seamless multi-language support, ensuring every customer feels understood and valued, no matter where they are.",
    gradient: "from-orange-500 to-orange-600",
    color: "#f97316",
    gridClass: "lg:col-span-6",
  },
  {
    icon: Clock,
    title: "Uninterrupted 24/7 Customer Care",
    description:
      "Provide round-the-clock support with intelligent automation and seamless handoffs between AI and human agents, guaranteeing your customers always receive the help they need.",
    gradient: "from-teal-500 to-teal-600",
    color: "#14b8a6",
    gridClass: "lg:col-span-6",
  },
  {
    // Data-Driven Growth & Insights is now a standard card with its icon
    icon: BarChart3,
    title: "Data-Driven Growth & Insights",
    description:
      "Gain a competitive edge with a comprehensive dashboard offering detailed analytics, deep conversation insights, and performance metrics for truly informed, data-driven decisions.",
    gradient: "from-amber-500 to-amber-600",
    color: "#f59e0b",
    isImageCard: false, // Explicitly set to false
    gridClass: "lg:col-span-6", // Adjusted to fit the grid
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
    <section id="features" className="relative py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
            Unlock <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">Unmatched Efficiency</span> and <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Customer Delight</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover how our cutting-edge chat platform revolutionizes your customer interactions, boosts team productivity, and drives significant growth for your business.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-0 md:gap-0 auto-rows-[minmax(180px,auto)] border border-slate-200 shadow-lg rounded-xl overflow-hidden"> {/* Re-added rounded-xl and overflow-hidden */}
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${feature.gridClass} flex`}
            >
              {feature.isImageCard ? (
                // Image Card Layout
                <div className="relative w-full h-full group"> {/* No rounded-xl here, it's handled by parent */}
                  <img
                    src={feature.imageUrl}
                    alt={feature.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x800/6b7280/ffffff?text=Image+Error'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl md:text-2xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm md:text-base opacity-90">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Standard Spotlight Card Layout
                <SpotlightCard
                  className="bg-white border-r border-b border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group flex-1 rounded-none last:border-r-0 lg:[&:nth-last-child(2)]:border-r-0 lg:[&:nth-last-child(3)]:border-r-0 lg:[&:nth-last-child(4)]:border-r-0 lg:[&:nth-last-child(5)]:border-r-0 lg:[&:nth-last-child(6)]:border-r-0" // Explicitly rounded-none
                  spotlightColor={hexToRgba(feature.color, 0.35)}
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div
                      className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base flex-grow">
                      {feature.description}
                    </p>
                  </div>
                </SpotlightCard>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
