"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock, User, Brain, CreditCard, Globe, CheckCircle, Zap, Target } from "lucide-react"

export function AIAgentArticle() {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 rounded-full px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            AI Features
          </Badge>
          <Badge variant="outline" className="border-purple-200 text-purple-700">
            Credit System
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Advanced{" "}
          <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">AI Agent</span>
          : Credit-Based Responses
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
          Deploy an AI agent that pulls information from your website and provides tailored, high-quality responses using a
          credit-based system for cost control and optimal performance.
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>December 10, 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>8 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Mike Chen</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 mb-12 border border-purple-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
            <Brain className="w-6 h-6 text-purple-600 mr-3" />
            Business-Savvy AI That Knows Your Business
          </h2>
          <p className="text-lg text-slate-700 mb-6">
            Our AI Agent doesn't just provide generic responses - it learns from your website content, product
            descriptions, and business information to deliver personalized, accurate answers that reflect your brand and
            expertise.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">Smart</div>
              <div className="text-sm text-slate-600">Context-aware responses</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">Cost-Effective</div>
              <div className="text-sm text-slate-600">Credit-based pricing</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">Accurate</div>
              <div className="text-sm text-slate-600">Website-trained AI</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">How the AI Agent Works</h2>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Website Analysis</h3>
                <p className="text-slate-700">
                  The AI agent crawls your website, analyzing your content, product descriptions, FAQs, and business
                  information to build a comprehensive knowledge base.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Intelligent Processing</h3>
                <p className="text-slate-700">
                  When customers ask questions, the AI processes their query against your website's knowledge base to
                  provide accurate, contextual responses.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Credit-Based Usage</h3>
                <p className="text-slate-700">
                  Each AI response uses credits from your account, giving you full control over costs while ensuring
                  high-quality interactions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Powerful AI Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Website Knowledge Base</h3>
              <p className="text-slate-700">
                Automatically pulls information from your website content, ensuring responses are always up-to-date and
                accurate.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Flexible Credit System</h3>
              <p className="text-slate-700">
                Pay only for what you use with our transparent credit system. Set limits and monitor usage in real-time.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Context-Aware Responses</h3>
              <p className="text-slate-700">
                Understands conversation context and provides relevant follow-up questions and suggestions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Real-Time Learning</h3>
              <p className="text-slate-700">
                Continuously improves responses based on customer interactions and website updates.
              </p>
            </div>
          </div>
        </section>

        {/* Credit System */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Understanding the Credit System</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-purple-600 mb-2">1 Credit</div>
                <div className="text-sm text-slate-600">Simple question</div>
                <div className="text-xs text-slate-500 mt-1">Basic product info, pricing</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-purple-600 mb-2">2-3 Credits</div>
                <div className="text-sm text-slate-600">Complex inquiry</div>
                <div className="text-xs text-slate-500 mt-1">Detailed comparisons, recommendations</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-purple-600 mb-2">5+ Credits</div>
                <div className="text-sm text-slate-600">Advanced analysis</div>
                <div className="text-xs text-slate-500 mt-1">Custom solutions, technical support</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span className="text-slate-700">Set monthly credit limits to control costs</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span className="text-slate-700">Real-time usage monitoring and alerts</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span className="text-slate-700">Automatic fallback to basic responses when credits run low</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Deploy Your AI Agent?</h2>
            <p className="text-xl mb-6 text-purple-100">
              Start with 100 free credits and experience seamless, AI-powered support in action.
            </p>

            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Brain className="w-5 h-5 mr-2" />
              Activate AI Agent
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </article>
  )
}
