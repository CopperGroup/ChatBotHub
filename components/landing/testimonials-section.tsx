"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Image from 'next/image' // Import Next.js Image component

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "E-commerce Manager",
    company: "TechStyle",
    content:
      "ChatBot Hub transformed our customer support completely. The real-time notifications and staff management features are game-changers. We're handling 3x more inquiries with better response times.",
    rating: 5,
    avatar: "SJ",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    name: "Michael Chen",
    role: "Founder",
    company: "StartupFlow",
    content:
      "The setup was incredibly easy and the AI responses are surprisingly intelligent. The Telegram notifications keep our team connected even when we're not at our desks. Conversion rate improved by 25%.",
    rating: 5,
    avatar: "MC",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthCorp",
    content:
      "The analytics and workflow automation features provide incredible insights. We can now optimize our support strategy based on real conversation data and predefined workflows save us hours daily.",
    rating: 5,
    avatar: "ER",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    name: "David Kim",
    role: "CTO",
    company: "InnovateLab",
    content:
      "As a technical person, I appreciate the robust platform architecture and comprehensive API. The widget customization options are extensive and the uptime has been flawless.",
    rating: 5,
    avatar: "DK",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    name: "Lisa Thompson",
    role: "Customer Success",
    company: "ServicePro",
    content:
      "Our customers love the instant responses and seamless handoffs to human agents. The AI understands context remarkably well and the staff management system keeps everyone organized.",
    rating: 5,
    avatar: "LT",
    gradient: "from-pink-500 to-pink-600",
  },
  {
    name: "Alex Martinez",
    role: "Operations Manager",
    company: "ScaleUp",
    content:
      "The real-time monitoring and notification system is fantastic. We can jump into conversations when needed and the workflow automation handles routine inquiries perfectly.",
    rating: 5,
    avatar: "AM",
    gradient: "from-amber-500 to-amber-600",
  },
]

// Define the structure for the interstitial image card
const interstitialImageCard = {
  isInterstitialImage: true,
  imageUrl: "/assets/landing/testimonials.png", // Use the specified image
  altText: "Customer Success Story", // Alt text for accessibility
};

// Helper function to interleave testimonials with image cards
const createInterleavedContent = (testimonialsArray, imageCardItem, interval = 2) => {
  const interleaved = [];
  for (let i = 0; i < testimonialsArray.length; i++) {
    interleaved.push(testimonialsArray[i]);
    if ((i + 1) % interval === 0) {
      interleaved.push(imageCardItem);
    }
  }
  // Ensure the pattern is consistent for looping, adding an image card if the last segment needs one
  if (testimonialsArray.length % interval !== 0) {
    interleaved.push(imageCardItem);
  }
  return interleaved;
};

// Create one full cycle of content (testimonials + interleaved images)
const baseCycleContent = createInterleavedContent(testimonials, interstitialImageCard, 2);

// Repeat the base cycle content multiple times for a seamless infinite scroll
const repeatedContent = [...baseCycleContent, ...baseCycleContent, ...baseCycleContent]; // 3 repetitions for looping

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null); // Ref for the whole section for parallax
  const scrollRef1 = useRef<HTMLDivElement>(null); // Ref for the first scrolling row
  const scrollRef2 = useRef<HTMLDivElement>(null); // Ref for the second scrolling row
  const [rowWidth, setRowWidth] = useState(0); // State to store the calculated width of one full cycle

  // Parallax effect for the section background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);

  // Measure the width of one full cycle of content after render
  useEffect(() => {
    if (scrollRef1.current) {
      // Calculate the width of one full cycle of the interleaved content
      // We divide the total scrollWidth of the motion.div by the number of repetitions (3 in this case)
      const calculatedWidth = scrollRef1.current.scrollWidth / 3;
      setRowWidth(calculatedWidth);
    }
  }, [repeatedContent.length]); // Recalculate if the content array length changes

  // Animation for the first row (moves from right to left, i.e., x goes from 0 to -rowWidth)
  const scrollAnimation = {
    x: [0, -rowWidth],
    transition: {
      x: {
        repeat: Infinity, // Repeat animation indefinitely
        repeatType: "loop", // Loop from end to start
        duration: 35, // Duration of one loop (adjust for speed)
        ease: "linear", // Linear ease for constant speed
      },
    },
  };

  // Animation for the second row (moves from left to right, i.e., x goes from -rowWidth to 0)
  const scrollAnimationReversed = {
    x: [-rowWidth, 0],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 35, // Duration of one loop (adjust for speed)
        ease: "linear", // Linear ease for constant speed
      },
    },
  };

  return (
    <motion.section
      className="relative py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden"
      ref={sectionRef}
      style={{ y: yBg }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Quote className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
            Trusted by Leaders,
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              Loved by Customers
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear directly from businesses like yours who are achieving remarkable results and transforming their customer experience with our advanced chatbot platform.
          </p>
        </div>

        {/* Scrolling Testimonials Container */}
        <div className="flex flex-col space-y-8 md:space-y-12 overflow-hidden">
          {/* First Row: Scrolls Left */}
          <motion.div
            className="flex flex-nowrap gap-6 md:gap-8"
            animate={rowWidth > 0 ? scrollAnimation : {}} // Start animation only when rowWidth is calculated
            ref={scrollRef1}
          >
            {repeatedContent.map((item, index) => (
              <div key={index} className="flex-none w-[320px] sm:w-[350px] lg:w-[380px] flex"> {/* Added flex to make it a flex container */}
                {item.isInterstitialImage ? (
                  // Interstitial Image Card Layout
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg flex-1"> {/* Added flex-1 */}
                    <Image
                      src={item.imageUrl}
                      alt={item.altText}
                      fill // Use fill for responsive image sizing
                      className="object-cover" // object-cover to ensure image covers the area
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/380x250/6b7280/ffffff?text=Image+Error'; }}
                    />
                    {/* Removed the text overlay div */}
                  </div>
                ) : (
                  // Standard Testimonial Card Layout
                  <Card
                    className="bg-white border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group flex-1"
                  >
                    <CardContent className="p-6 md:p-8 flex flex-col h-full">
                      <div className="flex items-center space-x-1 mb-4 md:mb-6">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="relative mb-6 md:mb-8 flex-grow">
                        <Quote className="absolute -top-2 -left-2 w-6 h-6 text-slate-200" />
                        <p className="text-slate-700 leading-relaxed text-sm md:text-base pl-4">{item.content}</p>
                      </div>
                      <div className="flex items-center space-x-3 md:space-x-4 mt-auto">
                        <Avatar className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${item.gradient} shadow-lg`}>
                          <AvatarFallback
                            className={`bg-gradient-to-br ${item.gradient} text-white text-sm md:text-base font-semibold`}
                          >
                            {item.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm md:text-base">{item.name}</p>
                          <p className="text-xs md:text-sm text-slate-600">
                            {item.role} at {item.company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </motion.div>

          {/* Second Row: Scrolls Right (reversed content and direction) */}
          <motion.div
            className="flex flex-nowrap gap-6 md:gap-8"
            animate={rowWidth > 0 ? scrollAnimationReversed : {}} // Start animation only when rowWidth is calculated
            ref={scrollRef2}
          >
            {/* Reverse the order of content for the second row */}
            {repeatedContent.slice().reverse().map((item, index) => (
              <div key={index} className="flex-none w-[320px] sm:w-[350px] lg:w-[380px] flex"> {/* Added flex to make it a flex container */}
                {item.isInterstitialImage ? (
                  // Interstitial Image Card Layout
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg flex-1"> {/* Added flex-1 */}
                    <Image
                      src={item.imageUrl}
                      alt={item.altText}
                      fill // Use fill for responsive image sizing
                      className="object-cover" // object-cover to ensure image covers the area
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/380x250/6b7280/ffffff?text=Image+Error'; }}
                    />
                    {/* Removed the text overlay div */}
                  </div>
                ) : (
                  // Standard Testimonial Card Layout
                  <Card
                    className="bg-white border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group flex-1"
                  >
                    <CardContent className="p-6 md:p-8 flex flex-col h-full">
                      <div className="flex items-center space-x-1 mb-4 md:mb-6">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="relative mb-6 md:mb-8 flex-grow">
                        <Quote className="absolute -top-2 -left-2 w-6 h-6 text-slate-200" />
                        <p className="text-slate-700 leading-relaxed text-sm md:text-base pl-4">{item.content}</p>
                      </div>
                      <div className="flex items-center space-x-3 md:space-x-4 mt-auto">
                        <Avatar className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${item.gradient} shadow-lg`}>
                          <AvatarFallback
                            className={`bg-gradient-to-br ${item.gradient} text-white text-sm md:text-base font-semibold`}
                          >
                            {item.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm md:text-base">{item.name}</p>
                          <p className="text-xs md:text-sm text-slate-600">
                            {item.role} at {item.company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Removed the large static image card from the bottom */}
      </div>
    </motion.section>
  );
}
