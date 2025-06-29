"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  Code,
  Copy,
  Settings,
  CheckCircle,
  AlertCircle,
  Palette,
  Eye,
  EyeOff,
} from "lucide-react"

export function ChatbotIntegrationArticle() {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Badge className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 rounded-full px-4 py-2">
            <Code className="w-4 h-4 mr-2" />
            Integration
          </Badge>
          <Badge variant="outline" className="border-indigo-200 text-indigo-700">
            Simple Setup
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          <span className="bg-gradient-to-r from-indigo-500 to-indigo-700 bg-clip-text text-transparent">
            Simple Chatbot Integration
          </span>
          : One Script Tag, Endless Possibilities
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
          Add our chatbot to your website in under 2 minutes with just one line of code. No technical expertise required
          - simply copy, paste, and customize to match your brand.
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>November 5, 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>3 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Alex Rodriguez</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 mb-12 border border-indigo-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
            <Code className="w-6 h-6 text-indigo-600 mr-3" />
            Integration Made Simple
          </h2>
          <p className="text-lg text-slate-700 mb-6">
            Forget complex APIs and technical configurations. Our chatbot integration is designed for everyone - from
            small business owners to enterprise developers. Just one script tag and you're ready to go!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-indigo-200">
              <div className="text-2xl font-bold text-indigo-600">1 Line</div>
              <div className="text-sm text-slate-600">Simple script tag</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-indigo-200">
              <div className="text-2xl font-bold text-indigo-600">2 Min</div>
              <div className="text-sm text-slate-600">Setup time</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-indigo-200">
              <div className="text-2xl font-bold text-indigo-600">∞</div>
              <div className="text-sm text-slate-600">Customization options</div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Integration */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">3-Step Integration Process</h2>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Copy Your Script Tag</h3>
                <p className="text-slate-700 mb-4">
                  Go to your dashboard settings and copy the unique script tag generated for your chatbot.
                </p>
                <div className="bg-slate-900 rounded-lg p-4 mb-4 relative">
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    <code>{`<script src="https://chatbot.yoursite.com/widget.js" 
        data-chatbot-id="your-unique-id">
</script>`}</code>
                  </pre>
                  <Button size="sm" className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-800">
                    <strong>💡 Pro Tip:</strong> Each chatbot has a unique ID - make sure you're copying the right one
                    if you have multiple chatbots.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Paste Into Your Website</h3>
                <p className="text-slate-700 mb-4">
                  Add the script tag to your website's HTML, preferably just before the closing &lt;/body&gt; tag.
                </p>
                <div className="bg-slate-900 rounded-lg p-4 mb-4">
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    <code>{`<!DOCTYPE html>
<html>
<head>
  <title>Your Website</title>
</head>
<body>
  <!-- Your website content -->
  
  <!-- Chatbot Script - Add before closing body tag -->
  <script src="https://chatbot.yoursite.com/widget.js" 
          data-chatbot-id="your-unique-id">
  </script>
</body>
</html>`}</code>
                  </pre>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-800">
                    <strong>📍 Placement:</strong> For best performance, place the script at the bottom of your page,
                    just before &lt;/body&gt;.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Configure Domain Settings</h3>
                <p className="text-slate-700 mb-4">
                  Make sure your website domain in the settings matches your actual website URL exactly.
                </p>
                <div className="bg-gradient-to-br from-red-50 to-white rounded-lg p-4 border border-red-200 mb-4">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-semibold text-red-800">Important: Domain Matching</span>
                  </div>
                  <p className="text-sm text-red-700">
                    Your chatbot will only work if the domain in your settings exactly matches your website's domain.
                    For example: if your site is "www.example.com", make sure that's exactly what's in your settings.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>✅ Good news:</strong> You can edit your domain settings anytime from your dashboard!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Configuration */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Advanced Configuration Options</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Show on Specific Pages</h3>
              <p className="text-slate-700 mb-4">
                Control exactly where your chatbot appears by specifying page paths.
              </p>
              <div className="bg-slate-900 rounded-lg p-3 mb-3">
                <code className="text-green-400 text-sm">
                  /contact
                  <br />
                  /support
                  <br />
                  /pricing
                </code>
              </div>
              <p className="text-xs text-slate-600">Chatbot will only show on these pages</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <EyeOff className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Hide on Specific Pages</h3>
              <p className="text-slate-700 mb-4">Exclude your chatbot from certain pages where it's not needed.</p>
              <div className="bg-slate-900 rounded-lg p-3 mb-3">
                <code className="text-green-400 text-sm">
                  /admin
                  <br />
                  /checkout
                  <br />
                  /login
                </code>
              </div>
              <p className="text-xs text-slate-600">Chatbot will be hidden on these pages</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Custom Colors & Branding</h3>
              <p className="text-slate-700 mb-4">Match your brand with custom colors, fonts, and chatbot name.</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-slate-600">Primary Color</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-800 rounded"></div>
                  <span className="text-sm text-slate-600">Text Color</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">💬 Custom Name</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Path Priority Rules</h3>
              <p className="text-slate-700 mb-4">
                Include paths always override exclude paths for maximum flexibility.
              </p>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Rule:</strong> If a page matches both include and exclude lists, the chatbot will show
                  (include wins).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Issues */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Troubleshooting Common Issues</h2>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                Chatbot Not Appearing?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Check Domain Settings</span>
                    <p className="text-slate-700 text-sm">
                      Ensure your domain in settings exactly matches your website URL (including www if applicable).
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Verify Script Placement</span>
                    <p className="text-slate-700 text-sm">
                      Make sure the script tag is properly placed before the closing &lt;/body&gt; tag.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Check Page Paths</span>
                    <p className="text-slate-700 text-sm">
                      Review your include/exclude path settings to ensure the current page should show the chatbot.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">💡 Pro Tips for Success</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Test your chatbot on different pages after setup</li>
                <li>• Use browser developer tools to check for JavaScript errors</li>
                <li>• Clear your browser cache if changes don't appear immediately</li>
                <li>• Start with simple path rules and add complexity gradually</li>
                <li>• Keep your chatbot name short and memorable</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Add Your Chatbot?</h2>
            <p className="text-xl mb-6 text-indigo-100">
              Get your script tag and have your chatbot live on your website in under 2 minutes!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Code className="w-5 h-5 mr-2" />
                Get My Script Tag
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl bg-transparent"
              >
                <Settings className="w-5 h-5 mr-2" />
                Customize Appearance
              </Button>
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}
