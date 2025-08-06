"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Zap, Menu, X } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

// Make the Button component a motion component
const MotionButton = motion(Button);

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const headerRef = useRef(null);
  const { scrollY } = useScroll();

  const scrollThreshold = 50;

  // Transform for backdrop blur
  const backdropBlur = useTransform(
    scrollY,
    [0, scrollThreshold],
    ["blur(0px)", "blur(8px)"]
  );

  // Transform for background color - now less transparent (0.9 alpha) when scrolled
  const backgroundColor = useTransform(
    scrollY,
    [0, scrollThreshold],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.9)"] // Changed from 0.7 to 0.9
  );

  // Transform for logo text color (ChatBot Hub)
  const logoTextColor = useTransform(
    scrollY,
    [0, scrollThreshold],
    ["#FFFFFF", "#1e293b"] // White to slate-900
  );

  // Transform for navigation link colors
  const navLinkColor = useTransform(
    scrollY,
    [0, scrollThreshold],
    ["#FFFFFF", "#475569"] // White to slate-600
  );

  // Transform for Sign In button text color
  const signInButtonColor = useTransform(
    scrollY,
    [0, scrollThreshold],
    ["#FFFFFF", "#475569"] // White to slate-600
  );

  // Transform for mobile menu text color (when opened)
  const mobileMenuLinkColor = useTransform(
    scrollY,
    [0, scrollThreshold],
    ["#FFFFFF", "#475569"] // White to slate-600
  );

  // New transform for mobile menu icon color
  const mobileIconColor = useTransform(
    scrollY,
    [0, scrollThreshold],
    ["#FFFFFF", "#475569"] // White to slate-600
  );


  return (
    <motion.header
      ref={headerRef}
      className={`fixed top-0 w-full z-50 shadow-sm ${isMenuOpen ? 'bg-white backdrop-blur-none' : ''}`} // Apply white background and no blur when menu is open
      style={{
        backdropFilter: isMenuOpen ? 'none' : backdropBlur, // Override blur to none when menu is open
        backgroundColor: isMenuOpen ? 'rgb(255, 255, 255)' : backgroundColor, // Override background to solid white when menu is open
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            {/* Apply transformed color to logo text, or black if menu is open */}
            <motion.span
              style={{ color: isMenuOpen ? '#000000' : logoTextColor }}
              className="text-xl md:text-2xl font-bold"
            >
              ChatBot Hub
            </motion.span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Apply transformed color to nav links, or black if menu is open */}
            <motion.a
              style={{ color: isMenuOpen ? '#000000' : navLinkColor }}
              href="#features"
              className="hover:text-slate-900 transition-colors font-medium"
            >
              Features
            </motion.a>
            <motion.a
              style={{ color: isMenuOpen ? '#000000' : navLinkColor }}
              href="#how-it-works"
              className="hover:text-slate-900 transition-colors font-medium"
            >
              How it Works
            </motion.a>
            <motion.a
              style={{ color: isMenuOpen ? '#000000' : navLinkColor }}
              href="#pricing"
              className="hover:text-slate-900 transition-colors font-medium"
            >
              Pricing
            </motion.a>
            <motion.a
              style={{ color: isMenuOpen ? '#000000' : navLinkColor }}
              href="#faq"
              className="hover:text-slate-900 transition-colors font-medium"
            >
              FAQ
            </motion.a>
            <motion.a
              style={{ color: isMenuOpen ? '#000000' : navLinkColor }}
              href="/blog"
              className="hover:text-slate-900 transition-colors font-medium"
            >
              Blog
            </motion.a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Apply transformed color to Sign In button text, or black if menu is open */}
            <MotionButton
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="hover:text-slate-900 hover:bg-slate-900 rounded-xl"
              style={{ color: isMenuOpen ? '#000000' : signInButtonColor }}
            >
              Sign In
            </MotionButton>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-sm"
            >
              Get Started Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: isMenuOpen ? '#000000' : mobileIconColor }} // Apply black color if menu is open
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          // This mobile menu div already has bg-white. Ensure its text is black.
          <div className="md:hidden py-4 border-t border-slate-200 bg-white">
            <nav className="flex flex-col space-y-4">
              {/* Apply black color to mobile nav links */}
              <a
                href="#features"
                className="text-black hover:text-slate-900 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-black hover:text-slate-900 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-100"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="text-black hover:text-slate-900 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a >
              <a
                href="#faq"
                className="text-black hover:text-slate-900 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-100"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a >
              <div className="pt-4 space-y-3 border-t border-slate-200">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/dashboard")}
                  className="w-full justify-start text-black hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-sm"
                >
                  Get Started Free
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </motion.header>
  )
}
