"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Bookmark, Twitter, Linkedin, Facebook } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { BlogArticle } from "../workflow-article"
import { TelegramBotArticle } from "../telegram-bot-article"
import { AIAgentArticle } from "../ai-agent-article"
import { StaffManagementArticle } from "../staff-management-article"
import { CustomerSupportAutomationArticle } from "../customer-support-automation-article"
import { ChatbotIntegrationArticle } from "../chatbot-integration-article"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug

  const getArticleComponent = () => {
    switch (slug) {
      case "workflow-automation-v12":
        return <BlogArticle />
      case "telegram-notifications":
        return <TelegramBotArticle />
      case "ai-agent-credits":
        return <AIAgentArticle />
      case "staff-management-system":
        return <StaffManagementArticle />
      case "customer-support-automation":
        return <CustomerSupportAutomationArticle />
      case "chatbot-integration-guide":
        return <ChatbotIntegrationArticle />
      default:
        return <BlogArticle />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header Navigation */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/blog">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Article Content */}
            <div className="lg:col-span-3">{getArticleComponent()}</div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Share Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Share this article</h3>
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" size="sm" className="justify-start bg-transparent">
                      <Twitter className="w-4 h-4 mr-2 text-blue-500" />
                      Share on Twitter
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start bg-transparent">
                      <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                      Share on LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start bg-transparent">
                      <Facebook className="w-4 h-4 mr-2 text-blue-700" />
                      Share on Facebook
                    </Button>
                  </div>
                </div>

                {/* Table of Contents */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    <a
                      href="#introduction"
                      className="block text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      Introduction
                    </a>
                    <a
                      href="#how-it-works"
                      className="block text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      How It Works
                    </a>
                    <a
                      href="#key-features"
                      className="block text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      Key Features
                    </a>
                    <a
                      href="#setup-guide"
                      className="block text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      Setup Guide
                    </a>
                    <a
                      href="#getting-started"
                      className="block text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      Getting Started
                    </a>
                  </nav>
                </div>

                {/* Related Articles */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    <Link
                      href="/blog/workflow-automation-v12"
                      className="block border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 hover:bg-slate-50 -mx-2 px-2 py-2 rounded"
                    >
                      <h4 className="text-sm font-medium text-slate-900 mb-1">Workflow Automation v1.2</h4>
                      <p className="text-xs text-slate-600">Build intelligent conversation paths</p>
                    </Link>
                    <Link
                      href="/blog/telegram-notifications"
                      className="block border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 hover:bg-slate-50 -mx-2 px-2 py-2 rounded"
                    >
                      <h4 className="text-sm font-medium text-slate-900 mb-1">Telegram Bot Notifications</h4>
                      <p className="text-xs text-slate-600">Never miss a customer message</p>
                    </Link>
                    <Link
                      href="/blog/ai-agent-credits"
                      className="block border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 hover:bg-slate-50 -mx-2 px-2 py-2 rounded"
                    >
                      <h4 className="text-sm font-medium text-slate-900 mb-1">Smart AI Agent</h4>
                      <p className="text-xs text-slate-600">Credit-based intelligent responses</p>
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-emerald-500 to-emerald-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of businesses transforming their customer service with our platform.
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-xl"
          >
            Start Your Free Trial Today
            <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
          </Button>
        </div>
      </section>
    </div>
  )
}

