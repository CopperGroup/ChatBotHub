"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "How quickly can I get my chatbot up and running?",
    answer:
      "You can have your chatbot live on your website in under 5 minutes. Simply sign up, customize your bot's appearance and responses, copy the provided code snippet, and paste it into your website's HTML. No technical expertise required!",
  },
  {
    question: "How does the staff management system work?",
    answer:
      "Our staff management system allows you to add team members, assign roles and permissions, distribute workloads automatically, and track performance. Staff can receive notifications via Telegram and manage conversations through our intuitive dashboard.",
  },
  {
    question: "What are Telegram live notifications?",
    answer:
      "Get instant notifications directly to your Telegram account when new messages arrive, chats are assigned to you, or urgent customer issues need attention. This ensures you never miss important customer interactions, even when away from your desk.",
  },
  {
    question: "Can I create custom workflows for my business?",
    answer:
      "Yes! Our predefined workflow system allows you to create automated routing rules, escalation procedures, and response templates. Set up workflows for different scenarios like sales inquiries, support tickets, or lead qualification.",
  },
  {
    question: "How intelligent are the AI responses?",
    answer:
      "Our AI uses advanced natural language processing and learns from your specific conversations. It understands context, maintains conversation history, and can handle complex inquiries. The AI continuously improves based on your feedback and successful interactions.",
  },
  {
    question: "Can I fully customize the chat widget?",
    answer:
      "Customize colors, fonts, position, size, welcome messages, and behavior. Upload your own avatar, set custom greetings, and configure when and where the widget appears. The widget can be styled to perfectly match your brand.",
  },
  {
    question: "What analytics and management tools are included?",
    answer:
      "Our robust management dashboard includes conversation analytics, response time metrics, customer satisfaction scores, staff performance tracking, and detailed reporting. Export data, set up automated reports, and gain insights to optimize your customer service.",
  },
  {
    question: "Is my data secure and compliant?",
    answer:
      "Security is our top priority. We use bank-level encryption, comply with GDPR and CCPA regulations, and store all data in secure, SOC 2 certified data centers. Your customer conversations are private, protected, and fully compliant with international standards.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <HelpCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
            Frequently
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              asked questions
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Everything you need to know about our platform. Can't find what you're looking for?{" "}
            <a
              href="#contact"
              className="text-emerald-600 hover:text-emerald-700 font-medium underline decoration-emerald-300"
            >
              Contact our support team
            </a>
            .
          </p>
        </div>

        <div className="space-y-4 md:space-y-6">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="bg-white border-slate-200 hover:border-emerald-200 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-4 md:p-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-semibold text-slate-900 pr-4 leading-relaxed">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
