"use client"

import { Badge } from "@/components/ui/badge"
import { Zap, CheckCircle, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-width background image with tint */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/landing/hero.png')",
          }}
        />
        {/* Tint overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Dynamic Background Blobs - Increased size and blur for a grander aura */}
      <div className="absolute inset-0 z-10 opacity-20">
        <div className="absolute -top-1/3 -left-1/3 w-[1200px] h-[1200px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-0"></div>
        <div className="absolute -bottom-1/3 -right-1/3 w-[1000px] h-[1000px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 left-1/4 w-[1100px] h-[1100px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        {/* Added smaller, polishing elements */}
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-5 animate-blob animation-delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-5 animate-blob animation-delay-3000"></div>
        <div className="absolute top-1/3 right-1/2 w-24 h-24 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-5 animate-blob animation-delay-5000"></div>
      </div>

      {/* On-page open animation for the main content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center"
      >
        {/* Captivating Text Content */}
        <div className="pt-10 lg:pt-0">
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Badge className="mb-6 md:mb-8 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-emerald-300 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm animate-fade-in">
              <Zap className="w-4 h-4 mr-2 text-emerald-600" />
              Elevate Your Customer Experience
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white mb-6 md:mb-8 leading-tight tracking-tight"
          >
            Seamless Live Chat & AI Automation
          </motion.h1>

          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-white/90 mb-10 md:mb-14 leading-relaxed max-w-3xl mx-auto"
          >
            Empower your business with 24/7 real-time support, intelligent AI chatbots, and a no-code solution designed
            for effortless customer engagement.
          </motion.p>

          {/* Social Proof - Text based */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-white/80 text-sm md:text-base leading-relaxed mt-10 border-t border-white/20 pt-8 max-w-3xl mx-auto"
          >
            <p className="font-semibold mb-4">Join over 100+ businesses:</p>
            <ul className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Trusted by hundreds websites</strong>
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>100K+ conversations powered</strong>
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Guaranteed 99.9% uptime</strong>
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
