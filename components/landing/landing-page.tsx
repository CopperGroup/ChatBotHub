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

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        {/* <WorkflowAutomationBanner/> */}
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      {/* <Footer /> */}
    </div>
  )
}
