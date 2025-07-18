"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock, User, Zap, MessageSquare, Target, CheckCircle, TrendingUp } from "lucide-react"
import Image from "next/image"

export function WorkflowArticle() {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 rounded-full px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Product Update
          </Badge>
          <Badge variant="outline" className="border-emerald-200 text-emerald-700">
            Version 1.2
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Introducing{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            Workflow Automation
          </span>
          : The Future of Intelligent Customer Service
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
          Transform your chatbot from a simple Q&A tool into a powerful conversion machine that guides customers through
          personalized journeys, qualifies leads automatically, and resolves support tickets without human intervention.
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>December 29, 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>5 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Product Team</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 mb-12 border border-emerald-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
            <MessageSquare className="w-6 h-6 text-emerald-600 mr-3" />
            Say Hello to Smarter Customer Service
          </h2>
          <p className="text-lg text-slate-700 mb-6">
            Today marks a significant milestone in our mission to revolutionize customer support. With the release of
            Workflow Automation v1.2, we're empowering businesses to create intelligent conversation paths that don't
            just answer questions—they drive results.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-600">70%</div>
              <div className="text-sm text-slate-600">Fewer support tickets</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-600">3x</div>
              <div className="text-sm text-slate-600">Higher conversion rates</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-600">24/7</div>
              <div className="text-sm text-slate-600">Automated assistance</div>
            </div>
          </div>
        </div>

        {/* What is Workflow Automation */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">What is Workflow Automation?</h2>
          <p className="text-lg text-slate-700 mb-6">
            Workflow Automation transforms your chatbot from a reactive tool into a proactive assistant. Instead of
            simply responding to questions, your bot can now guide users through structured conversation paths, collect
            information systematically, and take intelligent actions based on user responses.
          </p>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Visual Workflow Builder</h3>
            <img
              src="/assets/workflow-builder-article.webp"
              alt="Workflow Automation Builder Interface showing drag-and-drop conversation flow creation"
              className="w-full h-auto rounded-xl shadow-sm border border-slate-200 mb-4"
            />
            <p className="text-slate-600 text-center italic">
              Build complex conversation flows with our intuitive drag-and-drop interface
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Powerful Features That Drive Results</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Lead Qualification</h3>
              <p className="text-slate-700">
                Automatically collect contact information, understand customer needs, and qualify prospects before they
                reach your sales team.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Interactive Conversations</h3>
              <p className="text-slate-700">
                Create engaging dialogues with clickable options, conditional logic, and personalized responses that
                adapt to each user.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Automated Actions</h3>
              <p className="text-slate-700">
                Trigger notifications, create tickets, send emails, or escalate to human agents based on conversation
                outcomes.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Analytics & Insights</h3>
              <p className="text-slate-700">
                Track conversation flows, identify bottlenecks, and optimize your workflows with detailed performance
                metrics.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">How It Works: From Idea to Implementation</h2>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Design Your Flow</h3>
                <p className="text-slate-700">
                  Use our visual builder to create conversation paths. Drag and drop elements like user inputs,
                  messages, conditions, and actions to build your perfect customer journey.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Set Conditions & Actions</h3>
                <p className="text-slate-700">
                  Define when and how your bot should respond. Set up conditional logic, automated responses, and
                  trigger actions based on user behavior and preferences.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Deploy & Monitor</h3>
                <p className="text-slate-700">
                  Launch your workflow with one click and watch as your chatbot handles complex interactions
                  automatically. Monitor performance and optimize as needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Real Results */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Real Results from Real Businesses</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">85%</div>
                <div className="text-slate-700 font-medium mb-2">Reduction in Response Time</div>
                <div className="text-sm text-slate-600">"Our customers get instant answers to complex questions"</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">$50K</div>
                <div className="text-slate-700 font-medium mb-2">Monthly Savings in Support Costs</div>
                <div className="text-sm text-slate-600">"We've reduced our support team workload significantly"</div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Customer Service?</h2>
            <p className="text-xl mb-6 text-emerald-100">
              Join thousands of businesses already using Workflow Automation to deliver exceptional customer
              experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Building Your Workflow
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl bg-transparent"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Schedule a Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}
