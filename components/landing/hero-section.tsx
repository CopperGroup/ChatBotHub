"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, MessageSquare, Zap, Users, Brain, Bell, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import BlurText from "@/components/ui/blur-text"

// --- DigitalNexusSVG: The Simplified Icon Area ---
const DigitalNexusSVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 800 500" // Increased viewBox width and height to make SVG seem larger
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="relative z-0" // Z-index for SVG content itself
  >
    {/* Central Hub: Circle, Zap Icon, and "ChatBot Hub" Text */}
    <motion.circle
      cx="400" // Adjusted cx for new viewBox center
      cy="250" // Adjusted cy for new viewBox center
      r="160"
      className="fill-emerald-500 shadow-xl"
      // Removed filter: "url(#glow)" as defs are removed
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 150, damping: 12 }}
    />
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <Zap
        x="310" // Adjusted x for new viewBox center and increased icon size
        y="170" // Adjusted y for new viewBox center and increased icon size
        width="180" // Increased width
        height="180" // Increased height
        className="text-white"
      />
      {/* Animated Text: ChatBot Hub - Removed as per request to leave just icon area */}
    </motion.g>
  </svg>
);

// --- HeroSection Component ---
export function HeroSection() {
  const router = useRouter();

  const handleHeadlineAnimationComplete = () => {
    // console.log('Hero headline blur animation completed!');
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-slate-50 to-emerald-50 pt-20 pb-24 sm:pt-28 sm:pb-36 overflow-hidden">
      {/* Dynamic Background Blobs - Increased size and blur for a grander aura */}
      <div className="absolute inset-0 z-0 opacity-40">
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
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        {/* Left Side: Captivating Text Content */}
        <div className="text-center lg:text-left pt-10 lg:pt-0">
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Badge className="mb-6 md:mb-8 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-emerald-300 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm animate-fade-in">
              <Zap className="w-4 h-4 mr-2 text-emerald-600" />
              Elevate Your Customer Experience
            </Badge>
          </motion.div>

          <BlurText
            text="Seamless Live Chat & AI Automation"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 mb-6 md:mb-8 leading-tight tracking-tight lg:max-w-xl"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleHeadlineAnimationComplete}
          />

          <motion.p
            variants={itemVariants}
            initial="hidden" animate="visible"
            className="text-lg md:text-xl text-slate-600 mb-10 md:mb-14 leading-relaxed lg:max-w-xl"
          >
            Empower your business with 24/7 real-time support, intelligent AI chatbots, and a no-code solution designed for effortless customer engagement.
          </motion.p>

          <motion.div
            variants={itemVariants}
            initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-14 md:mb-20"
          >
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-7 md:px-9 py-3 md:py-4 text-base md:text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 ease-out rounded-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-opacity-50 w-full sm:w-auto"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 bg-white/70 text-slate-700 hover:bg-slate-100 hover:text-slate-900 px-7 md:px-9 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-slate-200 focus:ring-opacity-50 w-full sm:w-auto"
            >
              <Play className="w-5 h-5 mr-2.5" />
              See It In Action
            </Button>
          </motion.div>
          {/* Social Proof - Text based */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-slate-600 text-sm md:text-base leading-relaxed mt-10 border-t border-slate-200 pt-8 lg:max-w-xl"
          >
            <p className="font-semibold mb-4">Join over 100+ businesses:</p>
            <ul className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-6">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span><strong>Trusted by hundreds websites</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span><strong>100K+ conversations powered</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span><strong>Guaranteed 99.9% uptime</strong></span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Right Side: The Digital Nexus SVG */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
          className="relative flex justify-center items-center h-full w-full max-w-lg mx-auto lg:max-w-none lg:-mt-24 xl:-mt-32"
        >
          <DigitalNexusSVG />
        </motion.div>
      </motion.div>
    </section>
  )
}
