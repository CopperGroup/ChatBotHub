"use client"

import { HeroSection } from "./hero-section"
import { FeaturesSection } from "./features-section"
import { HowItWorksSection } from "./how-it-works-section"
import { TestimonialsSection } from "./testimonials-section"
import { PricingSection } from "./pricing-section"
import { FAQSection } from "./faq-section"
import { CTASection } from "./cta-section"
import { Footer } from "./footer"
import { Header } from "./header"
import { WorkflowAutomationBanner } from "./new-feature"
import { WorksWithSection } from "./works-with"

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        {/* <WorkflowAutomationBanner/> */}
        <FeaturesSection />
        <WorksWithSection/>
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <a href="https://www.producthunt.com/products/chatbot-hub?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-chatbot&#0045;hub" target="_blank" style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: "1000" }}>
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1003122&theme=light&t=1754656367094" alt="ChatBot&#0032;Hub - Live&#0032;chat&#0032;software&#0032;for&#0032;websites | Product Hunt" style={{width: "250px", height: "54px"}} width="250" height="54" />
      </a>
      {/* <Footer /> */}
    </div>
  )
}