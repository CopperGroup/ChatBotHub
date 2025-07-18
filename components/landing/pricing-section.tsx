"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Sparkles } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: "$19",
    period: "per month",
    description: "Perfect for growing businesses",
    features: [
      "3 Staff Members",
      "AI Responses: Enabled",
      "500 AI Credits/month",
      "24/7 Support",
      "Advanced Analytics",
      "Widget Customization",
      "Telegram bot notifications",
    ],
    cta: "Start Free Trial",
    popular: false,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    name: "Pro",
    price: "$39",
    period: "per month",
    description: "Advanced features for established businesses",
    features: [
      "10 Staff Members",
      "AI Responses: Enabled",
      "2000 AI Credits/month",
      "24/7 Support",
      "Advanced Analytics",
      "Widget Customization",
      "Telegram bot live notifications",
    ],
    cta: "Start Free Trial",
    popular: true,
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "Unlimited features for large organizations",
    features: [
      "100 Staff Members",
      "AI Responses: Enabled",
      "10000 AI Credits/month",
      "24/7 Support",
      "Advanced Analytics",
      "Widget Customization",
      "Telegram bot live notifications",
    ],
    cta: "Jump in",
    popular: false,
    gradient: "from-purple-500 to-purple-600",
  },
]

export function PricingSection() {
  const router = useRouter()

  return (
    <section id="pricing" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
            Simple,
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              transparent pricing
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that fits your needs. Start free and upgrade as you grow with advanced features like staff
            management and real-time Telegram notifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-white border-2 transition-all duration-300 hover:shadow-xl ${
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

              <CardContent className="space-y-6 px-4 md:px-6 pb-6 md:pb-8">
                <ul className="space-y-3 md:space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm md:text-base leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => router.push("/websites/new")}
                  className={`w-full py-3 md:py-4 text-sm md:text-base font-semibold rounded-xl transition-all duration-200 ${
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
          ))}
        </div>

        {/* <div className="text-center mt-12 md:mt-16">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200 max-w-2xl mx-auto">
            <p className="text-slate-700 mb-4 font-medium">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <p className="text-sm text-slate-600">
              Need a custom solution with advanced integrations?{" "}
              <a
                href="#contact"
                className="text-emerald-600 hover:text-emerald-700 font-medium underline decoration-emerald-300"
              >
                Contact our sales team
              </a>
            </p>
          </div>
        </div> */}
      </div>
    </section>
  )
}
