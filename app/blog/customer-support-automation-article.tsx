"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  Heart,
  Bot,
  Users,
  CheckCircle,
  Zap,
  Target,
  MessageSquare,
} from "lucide-react"

export function CustomerSupportAutomationArticle() {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Badge className="bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0 rounded-full px-4 py-2">
            <Target className="w-4 h-4 mr-2" />
            Strategy
          </Badge>
          <Badge variant="outline" className="border-pink-200 text-pink-700">
            Automation Balance
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          How to Automate{" "}
          <span className="bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">80%</span> of Your
          Customer Support Without Losing the Human Touch
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
          Discover the perfect balance between automation and human interaction that keeps customers happy while
          reducing costs. Learn proven strategies to automate routine tasks while preserving the personal connection
          your customers value.
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>November 15, 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>7 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>David Wilson</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 mb-12 border border-pink-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
            <Heart className="w-6 h-6 text-pink-600 mr-3" />
            The Human Touch in an Automated World
          </h2>
          <p className="text-lg text-slate-700 mb-6">
            The key to successful customer support automation isn't replacing humans—it's empowering them. By automating
            routine, repetitive tasks, your team can focus on complex problems that require empathy, creativity, and
            genuine human connection.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-pink-200">
              <div className="text-2xl font-bold text-pink-600">80%</div>
              <div className="text-sm text-slate-600">Tasks automated</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-pink-200">
              <div className="text-2xl font-bold text-pink-600">50%</div>
              <div className="text-sm text-slate-600">Cost reduction</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-pink-200">
              <div className="text-2xl font-bold text-pink-600">95%</div>
              <div className="text-sm text-slate-600">Customer satisfaction</div>
            </div>
          </div>
        </div>

        {/* The 80/20 Rule */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">The 80/20 Rule of Customer Support</h2>

          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">What Should Be Automated (80%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">FAQ responses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Order status inquiries</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Basic product information</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Account password resets</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Appointment scheduling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Simple troubleshooting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Lead qualification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Initial contact routing</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 border border-pink-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">What Needs Human Touch (20%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Complex technical issues</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Emotional or frustrated customers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Billing disputes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Custom solution requests</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Sales negotiations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Complaint resolution</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">Strategic partnerships</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-slate-700">VIP customer requests</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Strategy */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">5-Step Implementation Strategy</h2>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Audit Your Current Support</h3>
                <p className="text-slate-700 mb-3">
                  Analyze your support tickets from the last 3 months. Categorize them by complexity, frequency, and
                  resolution time to identify automation opportunities.
                </p>
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <p className="text-sm text-pink-800">
                    <strong>Pro Tip:</strong> Look for tickets that follow the same pattern or require the same
                    information repeatedly.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Start with Low-Hanging Fruit</h3>
                <p className="text-slate-700 mb-3">
                  Begin by automating the most common, straightforward inquiries. These typically include FAQs, order
                  status checks, and basic product information.
                </p>
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <p className="text-sm text-pink-800">
                    <strong>Quick Win:</strong> Automate your top 10 most frequent questions first for immediate impact.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Create Smart Escalation Rules</h3>
                <p className="text-slate-700 mb-3">
                  Define clear triggers for when conversations should be transferred to human agents. Include keywords,
                  sentiment analysis, and complexity indicators.
                </p>
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <p className="text-sm text-pink-800">
                    <strong>Key Triggers:</strong> Negative sentiment, multiple failed attempts, specific keywords like
                    "cancel" or "refund".
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Train Your Team</h3>
                <p className="text-slate-700 mb-3">
                  Educate your support team on the new automated processes and how to handle escalated cases more
                  effectively with the context provided by automation.
                </p>
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <p className="text-sm text-pink-800">
                    <strong>Focus Areas:</strong> Emotional intelligence, complex problem-solving, and using automation
                    insights.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Monitor and Optimize</h3>
                <p className="text-slate-700 mb-3">
                  Continuously track automation performance, customer satisfaction, and escalation rates. Use this data
                  to refine your automation rules and improve the human handoff process.
                </p>
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <p className="text-sm text-pink-800">
                    <strong>Key Metrics:</strong> Resolution time, customer satisfaction, escalation rate, and cost per
                    ticket.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Best Practices for Balanced Automation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl border border-pink-200">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Automation</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Use natural language processing for better understanding</li>
                <li>• Implement sentiment analysis to detect frustration</li>
                <li>• Provide multiple choice options when possible</li>
                <li>• Always offer an easy path to human support</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl border border-pink-200">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Human Excellence</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Provide context from automated interactions</li>
                <li>• Focus on empathy and emotional intelligence</li>
                <li>• Empower agents with decision-making authority</li>
                <li>• Celebrate human problem-solving wins</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Real Results from Balanced Automation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">65%</div>
                <div className="text-slate-700 font-medium mb-1">Faster Resolution</div>
                <div className="text-xs text-slate-600">Average response time improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">40%</div>
                <div className="text-slate-700 font-medium mb-1">Cost Reduction</div>
                <div className="text-xs text-slate-600">Lower support operational costs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">92%</div>
                <div className="text-slate-700 font-medium mb-1">Customer Satisfaction</div>
                <div className="text-xs text-slate-600">Maintained high satisfaction scores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">24/7</div>
                <div className="text-slate-700 font-medium mb-1">Availability</div>
                <div className="text-xs text-slate-600">Round-the-clock support coverage</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Customer Support?</h2>
            <p className="text-xl mb-6 text-pink-100">
              Start automating routine tasks while preserving the human touch that makes your customers feel valued.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Automation Strategy
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl bg-transparent"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}
