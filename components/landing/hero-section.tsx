"use client"

import { Badge } from "@/components/ui/badge"
import { Zap, CheckCircle, MessageSquare } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function HeroSection() {
  // Use a ref to track the scroll position of the section
  const sectionRef = useRef(null)

  // Use Framer Motion's useScroll hook to track scroll progress within the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // Track from the moment the element enters the viewport to when it leaves
  })

  // Use useTransform to create the parallax effect for the background image
  // This will move the background from -100px to 100px as the user scrolls
  const yBg = useTransform(scrollYProgress, [0, 1], ["-100px", "100px"])

  // Use useTransform for a slightly faster parallax effect for the blobs
  // This adds a more dynamic layered effect.
  const yBlobs = useTransform(scrollYProgress, [0, 1], ["-150px", "150px"])

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
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background Image with Tint */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBg }} // Apply the parallax motion to the background container
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/landing/hero.png')",
          }}
        />
        {/* Tint overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Dynamic Background Blobs with Parallax Effect */}
      <motion.div
        className="absolute inset-0 z-10 opacity-20"
        style={{ y: yBlobs }} // Apply a slightly faster parallax motion to the blobs
      >
        <div className="absolute -top-1/3 -left-1/3 w-[1200px] h-[1200px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-0"></div>
        <div className="absolute -bottom-1/3 -right-1/3 w-[1000px] h-[1000px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 left-1/4 w-[1100px] h-[1100px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        {/* Added smaller, polishing elements */}
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-5 animate-blob animation-delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-5 animate-blob animation-delay-3000"></div>
        <div className="absolute top-1/3 right-1/2 w-24 h-24 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-5 animate-blob animation-delay-5000"></div>
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)
            `,
            backgroundSize: '128px 128px',
          }}
        />
      </motion.div>

      {/* On-page open animation for the main content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center"
      >
        {/* Captivating Text Content */}
        <div className="pt-10 lg:pt-0">
          <motion.div variants={itemVariants} initial="hidden" animate="visible" className="opacity-0">
            <Badge className="mb-6 md:mb-8 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-emerald-300 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm animate-fade-in opacity-0">
              <Zap className="w-4 h-4 mr-2 text-emerald-600" />
              Boost Sales with Smart Chat Automation
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 md:mb-8 leading-tight tracking-tight"
          >
            Engage Customers Instantly with Live Chat & AI
          </motion.h1>

          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-white/90 mb-10 md:mb-14 leading-relaxed max-w-3xl mx-auto"
          >
            Deliver instant support, automate common questions, and close more sales with our AI-powered chatbot platform.
            No code needed. Just plug it in and watch engagement grow.
          </motion.p>

          {/* Social Proof - Text based */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-white/80 text-sm md:text-base leading-relaxed mt-10 pt-8 max-w-3xl mx-auto"
          >
            <p className="font-semibold mb-4">Join over 100+ businesses:</p>
            <ul className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Trusted by 100+ businesses worldwide</strong>
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
                  <strong>Reliable 99.9% uptime guarantee</strong>
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}