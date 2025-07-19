// components/website/website-integration-tab.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FaShopify,
  FaWordpressSimple, // WooCommerce already uses this, so this is for generic WordPress
  FaWix,
  FaSquarespace,
  FaOpencart,
  FaCode,
  FaMagento,
  FaBoxes, // For BigCommerce
  FaGlobe, // For PrestaShop
  FaFigma, // Using Figma icon as a stand-in for Framer if FaFramer isn't available
} from "react-icons/fa"
import { IntegrationGuideDialog } from "./integration-guide-dialog"
import { motion } from "framer-motion"

interface WebsiteIntegrationTabProps {
  chatbotCode: string
}

export function WebsiteIntegrationTab({ chatbotCode }: WebsiteIntegrationTabProps) {
  const [isGuideDialogOpen, setIsGuideDialogOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  const platforms = [
    {
      name: "Shopify",
      icon: FaShopify,
      bgGradientClass: "from-emerald-500/10 to-green-500/10 hover:from-emerald-600/15 hover:to-green-600/15",
      hoverIconColorClass: "group-hover:text-emerald-600",
    },
    {
      name: "WooCommerce",
      icon: FaWordpressSimple,
      bgGradientClass: "from-blue-500/10 to-indigo-500/10 hover:from-blue-600/15 hover:to-indigo-600/15",
      hoverIconColorClass: "group-hover:text-blue-600",
    },
    {
      name: "Wix",
      icon: FaWix,
      bgGradientClass: "from-purple-500/10 to-violet-500/10 hover:from-purple-600/15 hover:to-violet-600/15",
      hoverIconColorClass: "group-hover:text-purple-600",
    },
    {
      name: "Squarespace",
      icon: FaSquarespace,
      bgGradientClass: "from-orange-500/10 to-amber-500/10 hover:from-orange-600/15 hover:to-amber-600/15",
      hoverIconColorClass: "group-hover:text-orange-600",
    },
    {
      name: "OpenCart",
      icon: FaOpencart,
      bgGradientClass: "from-red-500/10 to-rose-500/10 hover:from-red-600/15 hover:to-rose-600/15",
      hoverIconColorClass: "group-hover:text-red-600",
    },
    {
      name: "BigCommerce",
      icon: FaBoxes, // Using a generic box icon for BigCommerce
      bgGradientClass: "from-teal-500/10 to-cyan-500/10 hover:from-teal-600/15 hover:to-cyan-600/15",
      hoverIconColorClass: "group-hover:text-teal-600",
    },
    {
      name: "PrestaShop",
      icon: FaGlobe, // Using a generic globe icon for PrestaShop
      bgGradientClass: "from-pink-500/10 to-fuchsia-500/10 hover:from-pink-600/15 hover:to-fuchsia-600/15",
      hoverIconColorClass: "group-hover:text-pink-600",
    },
    {
      name: "Magento",
      icon: FaMagento, // Using Magento icon
      bgGradientClass: "from-orange-600/10 to-red-600/10 hover:from-orange-700/15 hover:to-red-700/15",
      hoverIconColorClass: "group-hover:text-orange-700",
    },
    {
      name: "Webflow",
      icon: FaCode, // Re-using FaCode for Webflow as a general web development icon
      bgGradientClass: "from-blue-400/10 to-cyan-400/10 hover:from-blue-500/15 hover:to-cyan-500/15",
      hoverIconColorClass: "group-hover:text-blue-500",
    },
    {
      name: "WordPress", // New platform
      icon: FaWordpressSimple, // Use FaWordpressSimple for generic WordPress
      bgGradientClass: "from-blue-600/10 to-sky-600/10 hover:from-blue-700/15 hover:to-sky-700/15",
      hoverIconColorClass: "group-hover:text-blue-700",
    },
    {
      name: "Framer", // New platform
      icon: FaFigma, // Using FaFigma as a common design/dev tool, you can change if you have a specific Framer icon
      bgGradientClass: "from-purple-600/10 to-indigo-600/10 hover:from-purple-700/15 hover:to-indigo-700/15",
      hoverIconColorClass: "group-hover:text-purple-700",
    },
    {
      name: "Custom HTML/CMS",
      icon: FaCode,
      bgGradientClass: "from-slate-500/10 to-gray-500/10 hover:from-slate-600/15 hover:to-gray-600/15",
      hoverIconColorClass: "group-hover:text-slate-600",
    },
  ]

  const handlePlatformClick = (platformName: string) => {
    setSelectedPlatform(platformName)
    setIsGuideDialogOpen(true)
  }

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-xl font-bold text-slate-900">Choose Your Platform</CardTitle>
          <CardDescription className="text-slate-600 text-sm font-medium">
            Select your e-commerce platform or CMS to get step-by-step integration instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform, index) => (
              <motion.button
                key={platform.name}
                onClick={() => handlePlatformClick(platform.name)}
                className={`group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white/80 to-slate-50/50 border border-slate-200 rounded-2xl
                                 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer text-center relative overflow-hidden`}
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  delay: index * 0.05 + 0.1,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${platform.bgGradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${platform.bgGradientClass.replace(
                    "hover:",
                    "",
                  )} blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                />
                <platform.icon
                  className={`h-12 w-12 mb-3 text-slate-500 ${platform.hoverIconColorClass} transition-all duration-300 relative z-10`}
                />
                <h4 className="text-base font-semibold text-slate-800 group-hover:text-slate-900 relative z-10">
                  {platform.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 group-hover:text-slate-600 relative z-10">Click for guide</p>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
      {selectedPlatform && (
        <IntegrationGuideDialog
          platformName={selectedPlatform}
          chatbotCode={chatbotCode}
          isOpen={isGuideDialogOpen}
          onClose={() => {
            setIsGuideDialogOpen(false);
            setSelectedPlatform(null);
          }}
        />
      )}
    </>
  )
}