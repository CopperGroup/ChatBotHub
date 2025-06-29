"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock, User, MessageSquare, Bell, Smartphone, CheckCircle, Zap } from "lucide-react"

export function TelegramBotArticle() {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 rounded-full px-4 py-2">
            <MessageSquare className="w-4 h-4 mr-2" />
            Integration
          </Badge>
          <Badge variant="outline" className="border-blue-200 text-blue-700">
            Telegram Bot
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Never Miss a Customer Message:{" "}
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Telegram Bot Notifications
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
          Get instant Telegram notifications whenever customers send messages to your chatbot. Stay connected and
          respond faster than ever with real-time alerts delivered straight to your phone.
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>December 20, 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>6 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Sarah Johnson</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 mb-12 border border-blue-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
            <Bell className="w-6 h-6 text-blue-600 mr-3" />
            Stay Connected with Your Customers 24/7
          </h2>
          <p className="text-lg text-slate-700 mb-6">
            In today's fast-paced business environment, responding quickly to customer inquiries can make the difference
            between closing a deal and losing a prospect. Our Telegram Bot integration ensures you never miss an
            important message by sending instant notifications directly to your phone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">Instant</div>
              <div className="text-sm text-slate-600">Real-time notifications</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-slate-600">Always connected</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">Mobile</div>
              <div className="text-sm text-slate-600">On-the-go alerts</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">How Telegram Notifications Work</h2>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Customer Sends Message</h3>
                <p className="text-slate-700">
                  When a customer sends a message to your chatbot on your website, our system immediately detects the
                  new conversation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Instant Telegram Alert</h3>
                <p className="text-slate-700">
                  Within seconds, you receive a notification on your Telegram app with the customer's message, their
                  contact information, and a direct link to respond.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Quick Response</h3>
                <p className="text-slate-700">
                  Click the notification to jump directly to your dashboard and respond to the customer while the
                  conversation is still fresh.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Mobile-First Notifications</h3>
              <p className="text-slate-700">
                Receive notifications directly on your phone, tablet, or desktop - wherever you have Telegram installed.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Filtering</h3>
              <p className="text-slate-700">
                Configure which types of messages trigger notifications - new conversations, urgent inquiries, or all
                messages.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Rich Message Preview</h3>
              <p className="text-slate-700">
                See the customer's message, contact details, and conversation context right in the notification.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">One-Click Response</h3>
              <p className="text-slate-700">
                Tap the notification to jump directly to your dashboard and start responding immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Setup Guide */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Quick Setup Guide</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-slate-700">Connect your Telegram account in Settings</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-slate-700">Configure notification preferences</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-slate-700">Test with a sample message</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-slate-700">Start receiving instant notifications!</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Stay Connected?</h2>
            <p className="text-xl mb-6 text-blue-100">
              Set up Telegram notifications in under 2 minutes and never miss another customer message.
            </p>

            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Setup Telegram Bot Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </article>
  )
}
