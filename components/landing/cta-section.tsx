"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Sparkles, MessageSquare, Users, Bell } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion" // Import motion, useScroll, useTransform
import { useRef } from "react" // Import useRef

export function CTASection() {
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

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section // Make the section a motion component
      ref={sectionRef} // Attach the ref here
      className="relative py-16 md:py-20 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 overflow-hidden" // Added overflow-hidden
      style={{ y: yBg }} // Apply the parallax motion to the section's background
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"> {/* Added z-10 */}
        <motion.div // Animate the main content box
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-12 border border-white/20 shadow-2xl"
        >
          <motion.div variants={itemVariants} className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Zap className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            Ready to Revolutionize Your Customer Engagement?
          </motion.h2>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-emerald-100 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of thriving businesses leveraging our <strong>AI-powered platform</strong> for instant communications, seamless staff management, and <strong>24/7 exceptional customer support</strong>.
          </motion.p>

          {/* Feature Highlights */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 md:mb-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-emerald-100">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Real-time Chat</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-emerald-100">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Staff Management</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-emerald-100">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">Live Notifications</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 md:mb-8">
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="bg-white text-emerald-600 hover:bg-slate-50 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl w-full sm:w-auto"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-emerald-100 text-sm">
            <span>✓ No credit card required</span>
            <span>✓ 3-day free trial</span>
            <span>✓ Cancel anytime</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
