"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Sparkles, X } from "lucide-react" // Import X icon
import { motion, useScroll, useTransform } from "framer-motion" // Import motion, useScroll, useTransform
import { useRef } from "react" // Import useRef

const plans = [
  {
    name: "Basic",
    price: "$19",
    period: "per month",
    description: "Perfect for growing businesses to get started with powerful chat.",
    features: [
      { text: "3 Staff Members", included: true },
      { text: "AI Responses: Enabled", included: true }, // Re-enabled AI Responses for Basic
      { text: "500 AI Credits/month", included: true },
      { text: "24/7 Support", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Widget Customization", included: true },
      { text: "Telegram bot notifications", included: true },
      { text: "File Sharing", included: false }, // File Sharing explicitly not included
      { text: "Workflow Builder: Basic", included: true }, // Added Workflow Builder
    ],
    cta: "Start Free Trial",
    popular: false,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    name: "Pro",
    price: "$39",
    period: "per month",
    description: "Unlock advanced features for established businesses ready to scale.",
    features: [
      { text: "10 Staff Members", included: true },
      { text: "AI Responses: Enabled", included: true },
      { text: "2000 AI Credits/month", included: true },
      { text: "24/7 Support", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Widget Customization", included: true },
      { text: "Telegram bot live notifications", included: true },
      { text: "File Sharing: Unlimited", included: true }, // File Sharing included
      { text: "Workflow Builder: Advanced", included: true }, // Added Workflow Builder
    ],
    cta: "Start Free Trial",
    popular: true,
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "Comprehensive solutions for large organizations with demanding needs.",
    features: [
      { text: "100 Staff Members", included: true },
      { text: "AI Responses: Enabled", included: true },
      { text: "10000 AI Credits/month", included: true },
      { text: "24/7 Support", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Widget Customization", included: true },
      { text: "Telegram bot live notifications", included: true },
      { text: "File Sharing: Unlimited", included: true }, // File Sharing included
      { text: "Workflow Builder: Unlimited", included: true }, // Added Workflow Builder
      { text: "Dedicated Account Manager", included: true },
      { text: "Custom Integrations", included: true },
    ],
    cta: "Contact Sales", // Changed CTA for Enterprise
    popular: false,
    gradient: "from-purple-500 to-purple-600",
  },
]

export function PricingSection() {
  const router = useRouter()
  const sectionRef = useRef<HTMLDivElement>(null); // Create a ref for the section

  // Use Framer Motion's useScroll hook to track scroll progress within the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // Track from the moment the element enters the viewport to when it leaves
  });

  // Use useTransform to create the parallax effect for the background
  // This will move the background from -50px to 50px as the user scrolls
  const yBg = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);

  return (
    <motion.section // Make the section a motion component
      id="pricing"
      ref={sectionRef} // Attach the ref here
      className="relative py-16 md:py-20 bg-white overflow-hidden" // Added relative and overflow-hidden
      style={{ y: yBg }} // Apply the parallax motion to the section's background
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"> {/* Added relative and z-10 */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
            Flexible Plans,
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              Powerful Results
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan to elevate your customer engagement. Start with a free trial and seamlessly scale your operations as your business thrives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div // Wrap each card in motion.div for animation
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }} // Animate once when 30% of the element is in view
              transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered animation
              className="flex" // Ensure cards are same height
            >
              <Card
                className={`relative bg-white border-2 transition-all duration-300 hover:shadow-xl flex-1 ${ // Added flex-1
                  plan.popular
                    ? "border-emerald-500 shadow-xl scale-105 ring-4 ring-emerald-100"
                    : "border-slate-200 hover:border-emerald-200 shadow-sm hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg rounded-full px-4 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-6 px-4 md:px-6 pt-6 md:pt-8">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    {plan.name === "Basic" ? (
                      <Zap className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    ) : plan.name === "Pro" ? (
                      <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    ) : plan.name === "Enterprise" ? (
                      <Crown className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    ) : (
                      <Zap className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    )}
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-2xl md:text-3xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-600 ml-2 text-sm md:text-base">{plan.period}</span>}
                  </div>
                  <p className="text-slate-600 text-sm md:text-base">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6 px-4 md:px-6 pb-6 md:pb-8 flex flex-col h-full">
                  <ul className="space-y-3 md:space-y-4 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        {feature.included ? (
                          <Check className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-slate-700 text-sm md:text-base leading-relaxed">{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => router.push("/websites/new")}
                    className={`w-full py-3 md:py-4 text-sm md:text-base font-semibold rounded-xl transition-all duration-200 mt-auto ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-emerald-300 shadow-sm hover:shadow-md"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
