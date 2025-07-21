"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "E-commerce Manager",
    company: "TechStyle",
    content:
      "ChatBot Hub transformed our customer support completely. The real-time notifications and staff management features are game-changers. We're handling 3x more inquiries with better response times.",
    rating: 5,
    avatar: "SJ",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    name: "Michael Chen",
    role: "Founder",
    company: "StartupFlow",
    content:
      "The setup was incredibly easy and the AI responses are surprisingly intelligent. The Telegram notifications keep our team connected even when we're not at our desks. Conversion rate improved by 25%.",
    rating: 5,
    avatar: "MC",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthCorp",
    content:
      "The analytics and workflow automation features provide incredible insights. We can now optimize our support strategy based on real conversation data and predefined workflows save us hours daily.",
    rating: 5,
    avatar: "ER",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    name: "David Kim",
    role: "CTO",
    company: "InnovateLab",
    content:
      "As a technical person, I appreciate the robust platform architecture and comprehensive API. The widget customization options are extensive and the uptime has been flawless.",
    rating: 5,
    avatar: "DK",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    name: "Lisa Thompson",
    role: "Customer Success",
    company: "ServicePro",
    content:
      "Our customers love the instant responses and seamless handoffs to human agents. The AI understands context remarkably well and the staff management system keeps everyone organized.",
    rating: 5,
    avatar: "LT",
    gradient: "from-pink-500 to-pink-600",
  },
  {
    name: "Alex Martinez",
    role: "Operations Manager",
    company: "ScaleUp",
    content:
      "The real-time monitoring and notification system is fantastic. We can jump into conversations when needed and the workflow automation handles routine inquiries perfectly.",
    rating: 5,
    avatar: "AM",
    gradient: "from-amber-500 to-amber-600",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Quote className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
            Loved by
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              tens of businesses
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            See what our customers are saying about their experience with our advanced chatbot platform and
            comprehensive support features.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="p-6 md:p-8">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4 md:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <div className="relative mb-6 md:mb-8">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-slate-200" />
                  <p className="text-slate-700 leading-relaxed text-sm md:text-base pl-4">{testimonial.content}</p>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-3 md:space-x-4">
                  <Avatar className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${testimonial.gradient} shadow-lg`}>
                    <AvatarFallback
                      className={`bg-gradient-to-br ${testimonial.gradient} text-white text-sm md:text-base font-semibold`}
                    >
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm md:text-base">{testimonial.name}</p>
                    <p className="text-xs md:text-sm text-slate-600">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
