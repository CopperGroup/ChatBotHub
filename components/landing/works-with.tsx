"use client"

import {
  FaShopify,
  FaWix,
  FaSquarespace,
  FaOpencart,
  FaCode,
  FaMagento,
  FaWordpress,
} from 'react-icons/fa';
import { FiFramer } from "react-icons/fi";
import {
  SiPrestashop,
  SiBigcommerce,
  SiWoocommerce,
  SiWebflow
} from "react-icons/si";
import { Zap } from "lucide-react"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

const platforms = [
  { name: "Shopify", icon: FaShopify, gradient: "from-green-500 to-green-600" },
  { name: "WooCommerce", icon: SiWoocommerce, gradient: "from-purple-500 to-purple-600" },
  { name: "Wix", icon: FaWix, gradient: "from-blue-500 to-blue-600" },
  { name: "Squarespace", icon: FaSquarespace, gradient: "from-yellow-500 to-yellow-600" },
  { name: "OpenCart", icon: FaOpencart, gradient: "from-red-500 to-red-600" },
  { name: "Custom HTML/CMS", icon: FaCode, gradient: "from-gray-500 to-gray-600" },
  { name: "BigCommerce", icon: SiBigcommerce, gradient: "from-orange-500 to-orange-600" },
  { name: "PrestaShop", icon: SiPrestashop, gradient: "from-pink-500 to-pink-600" },
  { name: "Magento", icon: FaMagento, gradient: "from-purple-700 to-purple-800" },
  { name: "Webflow", icon: SiWebflow, gradient: "from-cyan-500 to-cyan-600" },
  { name: "WordPress", icon: FaWordpress, gradient: "from-blue-700 to-blue-800" },
  { name: "Framer", icon: FiFramer, gradient: "from-orange-700 to-orange-800" },
]

export function WorksWithSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleContainerRef = useRef<HTMLDivElement>(null);
  const [currentRadius, setCurrentRadius] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], ["0deg", "360deg"]);
  
  // New: Counter-rotate the individual icons to keep them from rotating with the circle
  const counterRotateZ = useTransform(scrollYProgress, [0, 1], ["360deg", "0deg"]);

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  useEffect(() => {
    const updateRadius = () => {
      if (circleContainerRef.current) {
        // Decrease the multiplier to make the circle smaller
        const newRadius = (circleContainerRef.current.offsetWidth / 2) * 0.65;
        setCurrentRadius(newRadius);
      }
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);

    return () => window.removeEventListener('resize', updateRadius);
  }, [circleContainerRef]);

  const calculatePosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`
    };
  };

  return (
    <motion.section
      id="works-with"
      ref={sectionRef}
      className="relative py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden"
      style={{ y: yBg }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
            Integrates Seamlessly With
            <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              Your Existing Stack
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our chatbot widget is designed for universal compatibility, easily integrating with popular platforms and any custom website with just a few clicks.
          </p>
        </div>

        {/* Circular Layout Container - now a regular div */}
        <div
          ref={circleContainerRef}
          className="relative w-full aspect-square max-w-2xl mx-auto"
        >
          {/* Central Zap Logo - remains stationary */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg z-10">
            <Zap className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </div>

          {/* New motion.div to contain and rotate the platform icons only */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{ rotate: rotateZ }}
          >
            {/* Platform Icons around the circle */}
            {currentRadius > 0 && platforms.map((platform, index) => {
              const pos = calculatePosition(index, platforms.length, currentRadius);
              return (
                <motion.div
                  key={index}
                  variants={iconVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="absolute w-16 h-16 md:w-20 md:h-20 flex items-center justify-center translate-[-50%]"
                  style={{ ...pos, rotate: counterRotateZ }} // Apply counter-rotation here
                >
                  <div
                    className={`w-full h-full bg-white border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 group rounded-full flex items-center justify-center`}
                  >
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${platform.gradient} rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      <platform.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}