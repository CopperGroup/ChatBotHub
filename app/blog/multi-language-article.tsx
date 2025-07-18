"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock, User, Globe, Languages, Settings, CheckCircle, TrendingUp } from "lucide-react"
import Image from "next/image" // Assuming next/image is available in the user's environment

export default function MultiLanguageArticle() {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Article Header */}
      <header id="introduction" className="mb-12"> {/* Added id="introduction" */}
        <div className="flex items-center gap-4 mb-6">
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 rounded-full px-4 py-2">
            <Globe className="w-4 h-4 mr-2" />
            Product Update
          </Badge>
          <Badge variant="outline" className="border-purple-200 text-purple-700">
            Version 1.3
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Introducing{" "}
          <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
            Multi-Language Support
          </span>
          : Expanding Your Global Reach
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
          The Widget interface now supports 9+ languages, empowering you to connect with a global audience and provide
          seamless experiences to users worldwide, directly from your website settings.
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>July 16, 2025</span> {/* Updated date */}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>4 min read</span> {/* Adjusted read time */}
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
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 mb-12 border border-purple-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
            <Languages className="w-6 h-6 text-purple-600 mr-3" />
            Breaking Down Language Barriers
          </h2>
          <p className="text-lg text-slate-700 mb-6">
            Today marks a significant step in our commitment to global accessibility. With the release of
            Multi-Language Support v1.3, your widget can now dynamically adapt to your users' preferred languages,
            ensuring a truly localized and engaging experience for everyone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">9+</div>
              <div className="text-sm text-slate-600">Supported Languages</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">50%</div>
              <div className="text-sm text-slate-600">Increase in Global Engagement</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">Seamless</div>
              <div className="text-sm text-slate-600">User Experience Worldwide</div>
            </div>
          </div>
        </div>

        {/* What is Multi-Language Support */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">What is Multi-Language Support?</h2>
          <p className="text-lg text-slate-700 mb-6">
            Multi-Language Support allows your widget to display content in various languages, catering to users from
            different linguistic backgrounds. This means your global customers can interact with your widget in their
            native tongue, enhancing clarity and satisfaction.
          </p>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Easy Language Configuration</h3>
            {/* Using a placeholder image for multi-language settings */}
            <Image
              src="/assets/mutli-language-block.webp"
              alt="Widget Language Settings Interface showing language selection options"
              width={1200} // Specify width for Image component
              height={600} // Specify height for Image component
              className="w-full h-auto rounded-xl shadow-sm border border-slate-200 mb-4"
            />
            <p className="text-slate-600 text-center italic">
              Select and manage your supported languages directly from website settings.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section id="key-features" className="mb-12"> {/* Added id="key-features" */}
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Powerful Features for a Global Audience</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Languages className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">User-Controlled Language Selection</h3>
              <p className="text-slate-700">
                You can easily switch the widget's display language from your website settings, ensuring a comfortable and intuitive experience for your website visitors.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Automatic Language Detection</h3>
              <p className="text-slate-700">
                The widget can automatically detect the user's browser language and default to it, providing a
                personalized experience from the start.
              </p>
            </div>

            {/* <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Centralized Content Management</h3>
              <p className="text-slate-700">
                Manage all your widget content translations in one place through your website settings, simplifying
                updates and maintenance.
              </p>
            </div> */}

            {/* <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Localization Analytics</h3>
              <p className="text-slate-700">
                Gain insights into which languages are most used and how users interact with your localized content to
                further optimize your global strategy.
              </p>
            </div> */}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mb-12"> {/* Added id="how-it-works" */}
          <h2 className="text-3xl font-bold text-slate-900 mb-8">How It Works: Enabling Multi-Language Support</h2>

          <div className="space-y-8">
            <div id="setup-guide" className="flex items-start gap-6"> {/* Added id="setup-guide" */}
              <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Select Your Languages</h3>
                <p className="text-slate-700">
                  Navigate to your website settings, find the "Language" section, and choose from over 9 supported
                  languages to enable for your widget.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Configure Widget Language</h3>
                <p className="text-slate-700">
                  The widget comes with existing translations for its interface. In your dashboard, go to the website settings,
                  under the specific language section, you can select one of the 9+ available languages as the primary language for your widget.
                  You may also enable automatic detection of the user's browser language. If enabled and the user's browser
                  language is among the supported list, the widget interface will automatically display in that language.
                  Please note that currently, automatic translations do not work with custom workflows, but we are actively working on this feature.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Deploy & Expand</h3>
                <p className="text-slate-700">
                  Once configured, your widget will automatically display in the selected languages, instantly expanding
                  your reach to a global audience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Real Results */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Real Impact from Global Businesses</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">2x</div>
                <div className="text-slate-700 font-medium mb-2">Higher International User Satisfaction</div>
                <div className="text-sm text-slate-600">"Our non-English speaking customers feel truly valued now."</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">30%</div>
                <div className="text-slate-700 font-medium mb-2">Increase in Global Conversion Rates</div>
                <div className="text-sm text-slate-600">"Localizing our widget significantly boosted our international sales."</div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section id="getting-started" className="mb-12"> {/* Added id="getting-started" */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Connect with the World?</h2>
            <p className="text-xl mb-6 text-purple-100">
              Enable multi-language support today and unlock new opportunities by speaking your customers' language.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Globe className="w-5 h-5 mr-2" />
                Start Expanding Your Global Reach
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-purple-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Supports 9+ languages</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Easy setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Enhanced user experience</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}
