"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Settings, MessageSquare, BarChart3, Sparkles } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion" // Import motion, useScroll, useTransform
import { useRef } from "react" // Import useRef

const steps = [
  {
    step: "01",
    icon: Code,
    title: "Seamless Integration: Just One Line of Code",
    description:
      "Get your powerful chat widget live in minutes. Simply copy and paste a single line of code, and you're ready to transform your website's engagement – no complex setup required.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    step: "02",
    icon: Settings,
    title: "Tailor to Perfection: Configure & Personalize",
    description:
      "Effortlessly fine-tune your chatbot's look, craft intelligent AI responses, define seamless staff workflows, and set up instant notifications to perfectly align with your brand's unique voice and needs.",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    step: "03",
    icon: MessageSquare,
    title: "Engage Instantly: Powering Real-time Connections",
    description:
      "Watch your chatbot spring to life, immediately engaging visitors with smart AI, smooth handoffs to human agents, and real-time Telegram alerts, ensuring no customer interaction is ever missed.",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Drive Growth: Analyze & Elevate Performance",
    description:
      "Gain invaluable insights with our robust analytics dashboard. Track key metrics, identify trends, and continuously refine your strategies to optimize customer experience and accelerate business growth.",
    gradient: "from-amber-500 to-amber-600",
  },
]

export function HowItWorksSection() {
  const sectionRef = useRef(null); // Create a ref for the section

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
      id="how-it-works"
      ref={sectionRef} // Attach the ref here
      className="relative py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden" // Added relative and overflow-hidden
      style={{ y: yBg }} // Apply the parallax motion to the section's background
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"> {/* Added relative and z-10 */}
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
            <motion.div // Wrap each card in motion.div for animation
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }} // Animate once when 30% of the element is in view
              transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered animation
              className="flex" // Added flex to make motion.div a flex container
            >
              <Card
                className="bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex-1" // Added flex-1 to make Card fill available height
              >
                <CardContent className="p-6 md:p-8 text-center flex flex-col h-full"> {/* Added flex flex-col h-full */}
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
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base flex-grow flex items-center justify-center"> {/* Added flex-grow, flex, items-center, justify-center */}
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
