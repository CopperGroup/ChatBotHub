// components/website/integration-guide-dialog.tsx
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Check, MoreHorizontal, Settings } from "lucide-react" // Import icons you'll use
import { toast } from "sonner"
import React from "react" // Import React

interface IntegrationGuideDialogProps {
  platformName: string
  chatbotCode: string
  isOpen: boolean
  onClose: () => void
}

// Correctly type integrationGuides to accept functions that return React.ReactNode
const integrationGuides: { [key: string]: (chatbotCode: string) => React.ReactNode } = {
  Shopify: (chatbotCode: string) => (
    <>
      <p>
        To integrate Chatbot Hub with <strong>Shopify</strong>, follow these steps:
      </p>
      <ol>
        <li>Go to your <strong>Shopify admin panel</strong>.</li>
        <li>Navigate to "<strong>Online Store</strong>" &gt; "<strong>Themes</strong>".</li>
        <li>
          Find your current theme and click "<strong>Actions</strong>"{" "}
          <MoreHorizontal className="inline-block h-4 w-4 align-text-bottom" /> &gt; "<strong>Edit code</strong>".
        </li>
        <li>In the "<strong>Layout</strong>" directory, click "<strong>theme.liquid</strong>".</li>
        <li>
          Paste the following script tag just before the closing <code>&lt;/head&gt;</code> tag:
          <br />
          <code>&lt;script src="{process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode={chatbotCode}"&gt;&lt;/script&gt;</code>
        </li>
        <li>Click "<strong>Save</strong>".</li>
      </ol>
      <p>Your chatbot should now appear on your Shopify store!</p>
    </>
  ),
  WooCommerce: (chatbotCode: string) => (
    <>
      <p>
        To integrate Chatbot Hub with <strong>WooCommerce</strong> (WordPress):
      </p>
      <ol>
        <li>Log in to your <strong>WordPress admin dashboard</strong>.</li>
        <li>Go to "<strong>Appearance</strong>" &gt; "<strong>Theme File Editor</strong>".</li>
        <li>Select your active theme.</li>
        <li>Find and open the "<strong>header.php</strong>" file (or a similar file responsible for your site's <code>&lt;/head&gt;</code> section).</li>
        <li>
          Paste the following script tag just before the closing <code>&lt;/head&gt;</code> tag:
          <br />
          <code>&lt;script src="{process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode={chatbotCode}"&gt;&lt;/script&gt;</code>
        </li>
        <li>Click "<strong>Update File</strong>".</li>
      </ol>
      <p>The chatbot will now be active on your WooCommerce store.</p>
    </>
  ),
  Wix: (chatbotCode: string) => (
    <>
      <p>
        To integrate Chatbot Hub with <strong>Wix</strong>:
      </p>
      <ol>
        <li>Go to your <strong>Wix dashboard</strong>.</li>
        <li>
          Navigate to "<strong>Settings</strong>" <Settings className="inline-block h-4 w-4 align-text-bottom" /> &gt; "<strong>Custom Code</strong>".
        </li>
        <li>Click "<strong>+ Add Custom Code</strong>".</li>
        <li>
          Paste the following script tag into the "<strong>Paste code in head</strong>" section:
          <br />
          <code>&lt;script src="{process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode={chatbotCode}"&gt;&lt;/script&gt;</code>
        </li>
        <li>Select "<strong>All pages</strong>" under "<strong>Add Code to Pages</strong>" and set "<strong>Place Code in</strong>" to "<strong>Head</strong>".</li>
        <li>Click "<strong>Apply</strong>".</li>
      </ol>
      <p>Your chatbot is now installed on your Wix site.</p>
    </>
  ),
  Squarespace: (chatbotCode: string) => (
    <>
      <p>
        To integrate Chatbot Hub with <strong>Squarespace</strong>:
      </p>
      <ol>
        <li>
          From your <strong>Squarespace Home Menu</strong>, go to "<strong>Settings</strong>"{" "}
          <Settings className="inline-block h-4 w-4 align-text-bottom" /> &gt; "<strong>Developer Tools</strong>" &gt; "<strong>Code Injection</strong>".
        </li>
        <li>
          In the "<strong>Header</strong>" field, paste the following script tag:
          <br />
          <code>&lt;script src="{process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode={chatbotCode}"&gt;&lt;/script&gt;</code>
        </li>
        <li>Click "<strong>Save</strong>".</li>
      </ol>
      <p>Your chatbot should now be live on your Squarespace site.</p>
    </>
  ),
  OpenCart: (chatbotCode: string) => (
    <>
      <p>
        To integrate Chatbot Hub with <strong>OpenCart</strong>:
      </p>
      <ol>
        <li>Log in to your <strong>OpenCart admin panel</strong>.</li>
        <li>Go to "<strong>System</strong>" &gt; "<strong>Design</strong>" &gt; "<strong>Theme Editor</strong>".</li>
        <li>Select your store and the template file (e.g., <code>common/header.twig</code> or <code>common/header.tpl</code>).</li>
        <li>Locate the closing <code>&lt;/head&gt;</code> tag.</li>
        <li>
          Just before <code>&lt;/head&gt;</code>, paste the following script tag:
          <br />
          <code>&lt;script src="{process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode={chatbotCode}"&gt;&lt;/script&gt;</code>
        </li>
        <li>Save the changes.</li>
      </ol>
      <p>Your chatbot is now integrated with OpenCart.</p>
    </>
  ),
  "Custom HTML/CMS": (chatbotCode: string) => (
    <>
      <p>
        For any <strong>custom HTML website or other CMS</strong>:
      </p>
      <ol>
        <li>Open the main <strong>HTML file</strong> of your website (e.g., <code>index.html</code>, <code>layout.php</code>, <code>master.blade.php</code>).</li>
        <li>Locate the <code>&lt;head&gt;</code> section of your website.</li>
        <li>
          Paste the following script tag just before the closing <code>&lt;/head&gt;</code> tag:
          <br />
          <code>&lt;script src="{process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode={chatbotCode}"&gt;&lt;/script&gt;</code>
        </li>
        <li>Save the file and upload it to your web server.</li>
      </ol>
      <p>Your chatbot should now load on all pages where this script is included.</p>
    </>
  ),
  BigCommerce: (chatbotCode: string) => (
    <>
      <p>
        To integrate Chatbot Hub with <strong>BigCommerce</strong>:
      </p>
      <ol>
        <li>Go to <strong>Storefront</strong> &rarr; <strong>Script Manager</strong>.</li>
        <li>Click <strong>Create a Script</strong>.</li>
        <li>Set <strong>Location</strong> to "<strong>Footer</strong>".</li>
        <li>Set <strong>Pages</strong> to "<strong>All pages</strong>".</li>
        <li>
          Paste the following script into the "<strong>Script Contents</strong>" field:
          <br />
          <code>&lt;script src="{process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode={chatbotCode}"&gt;&lt;/script&gt;</code>
        </li>
        <li>Click "<strong>Save</strong>".</li>
      </ol>
      <p>Your chatbot is now integrated with BigCommerce.</p>
    </>
  ),
  PrestaShop: (chatbotCode: string) => (
    <>
      <p>
        To integrate Chatbot Hub with <strong>PrestaShop</strong>:
      </p>
      <ol>
        <li>Open <code>/themes/YOUR_THEME/footer.tpl</code> (replace <code>YOUR_THEME</code> with your active theme's directory name).</li>
        <li>
          Add the following script tag just before the closing <code>&lt;/body&gt;</code> tag:
          <br />
          <code>&lt;script src="{process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode={chatbotCode}"&gt;&lt;/script&gt;</code>
        </li>
        <li>Save the changes.</li>
      </ol>
      <p>Your chatbot is now integrated with PrestaShop.</p>
    </>
  ),
  Magento: (chatbotCode: string) => (
    <>
      <p>
        To integrate Chatbot Hub with <strong>Magento (Adobe Commerce)</strong> via the admin panel:
      </p>
      <ol>
        <li>Go to <strong>Content</strong> &rarr; <strong>Design</strong> &rarr; <strong>Configuration</strong>.</li>
        <li>Choose your theme and click "<strong>Edit</strong>".</li>
        <li>
          Under <strong>HTML Head</strong> &rarr; <strong>Scripts and Style Sheets</strong>, paste the following script:
          <br />
          <code>&lt;script src="{process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode={chatbotCode}"&gt;&lt;/script&gt;</code>
        </li>
        <li>Click "<strong>Save Configuration</strong>".</li>
      </ol>
      <p>Alternatively, for developers, you can add this via custom layout XML.</p>
    </>
  ),
  Webflow: (chatbotCode: string) => (
    <>
      <p>
        To integrate Chatbot Hub with <strong>Webflow</strong>:
      </p>
      <ol>
        <li>
          Go to <strong>Project Settings</strong> <Settings className="inline-block h-4 w-4 align-text-bottom" /> &rarr; <strong>Custom Code</strong>.
        </li>
        <li>
          In the <strong>Footer Code</strong> section, paste the following script:
          <br />
          <code>&lt;script src="{process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode={chatbotCode}"&gt;&lt;/script&gt;</code>
        </li>
        <li><strong>Save</strong> changes and <strong>Publish</strong> your site.</li>
      </ol>
      <p>Your chatbot is now integrated with Webflow.</p>
    </>
  ),
  WordPress: (chatbotCode: string) => (
    <>
      <p>
        To integrate Chatbot Hub with <strong>WordPress</strong> (non-WooCommerce sites):
      </p>
      <ol>
        <li>Log in to your <strong>WordPress admin dashboard</strong>.</li>
        <li>Go to "<strong>Appearance</strong>" &gt; "<strong>Theme File Editor</strong>".</li>
        <li>Select your active theme.</li>
        <li>Find and open the "<strong>header.php</strong>" file (or a similar file responsible for your site's <code>&lt;/head&gt;</code> section).</li>
        <li>
          Paste the following script tag just before the closing <code>&lt;/head&gt;</code> tag:
          <br />
          <code>&lt;script src="{process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode={chatbotCode}"&gt;&lt;/script&gt;</code>
        </li>
        <li>Click "<strong>Update File</strong>".</li>
      </ol>
      <p>The chatbot will now be active on your WordPress site.</p>
    </>
  ),
  Framer: (chatbotCode: string) => (
    <>
      <p>
        To integrate Chatbot Hub with <strong>Framer</strong>:
      </p>
      <ol>
        <li>Open your project in <strong>Framer</strong>.</li>
        <li>
          Go to <strong>Project Settings</strong>{" "}
          <Settings className="inline-block h-4 w-4 align-text-bottom" /> (the gear icon) &gt;{" "}
          <strong>General</strong>.
        </li>
        <li>Scroll down to the <strong>Custom Code</strong> section.</li>
        <li>
          Under "<strong>End of &lt;body&gt;</strong>" (or "Start of &lt;head&gt;"), paste the following script:
          <br />
          <code>&lt;script src="{process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode={chatbotCode}"&gt;&lt;/script&gt;</code>
        </li>
        <li><strong>Publish</strong> your site to apply the changes.</li>
      </ol>
      <p>Your chatbot is now integrated with Framer.</p>
    </>
  ),
}

export function IntegrationGuideDialog({ platformName, chatbotCode, isOpen, onClose }: IntegrationGuideDialogProps) {
  // Log the received platformName and available keys for debugging
  console.log("IntegrationGuideDialog received platformName:", platformName)
  console.log("Available integration guide keys:", Object.keys(integrationGuides))

  const [activeTab] = useState(platformName)
  const scriptToCopy = `<script async src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"></script>`
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // No need to set activeTab based on isOpen anymore, it's set once from props
  }, [isOpen, platformName])

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptToCopy)
    setCopied(true)
    toast.success("Script copied to clipboard!")
    setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
  }

  const renderGuideContent = (key: string) => {
    const contentFunction = integrationGuides[key]
    if (!contentFunction) {
      console.error(`Guide content function not found for key: "${key}"`)
      return "Guide not found for this platform."
    }
    // Now directly return the JSX from the function
    return contentFunction(chatbotCode)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border-slate-200/60">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Integration Guide for {platformName}</DialogTitle>
          <DialogDescription className="text-slate-600">
            Follow these steps to add the chatbot to your website.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Your Chatbot Script:</h4>
            <div className="relative bg-slate-100 text-slate-800 p-4 rounded-xl font-mono text-sm break-all">
              {scriptToCopy}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="absolute top-2 right-2 h-8 w-8 p-0 text-slate-500 hover:bg-slate-200 hover:text-slate-900 rounded-lg"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Directly render the content for the activeTab */}
          <div className="prose prose-sm max-w-none text-slate-800">
            {renderGuideContent(activeTab)}
          </div>
        </div>
        <Button onClick={onClose} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3">
          Got It!
        </Button>
      </DialogContent>
    </Dialog>
  )
}