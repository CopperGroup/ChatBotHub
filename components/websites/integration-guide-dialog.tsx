// components/website/integration-guide-dialog.tsx
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"

interface IntegrationGuideDialogProps {
  platformName: string
  chatbotCode: string
  isOpen: boolean
  onClose: () => void
}

// Correctly type integrationGuides to accept functions that return strings
const integrationGuides: { [key: string]: (chatbotCode: string) => string } = {
  Shopify: (chatbotCode: string) => `
    To integrate Chatbot Hub with <strong>Shopify</strong>, follow these steps:
    1. Go to your <strong>Shopify admin panel</strong>.
    2. Navigate to "<strong>Online Store</strong>" > "<strong>Themes</strong>".
    3. Find your current theme and click "<strong>Actions</strong>" > "<strong>Edit code</strong>".
    4. In the "<strong>Layout</strong>" directory, click "<strong>theme.liquid</strong>".
    5. Paste the following script tag just before the closing <code>&lt;/head&gt;</code> tag:
        <code>&lt;script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"&gt;&lt;/script&gt;</code>
    6. Click "<strong>Save</strong>".
    Your chatbot should now appear on your Shopify store!
  `,
  WooCommerce: (chatbotCode: string) => `
    To integrate Chatbot Hub with <strong>WooCommerce</strong> (WordPress):
    1. Log in to your <strong>WordPress admin dashboard</strong>.
    2. Go to "<strong>Appearance</strong>" > "<strong>Theme File Editor</strong>".
    3. Select your active theme.
    4. Find and open the "<strong>header.php</strong>" file (or a similar file responsible for your site's <code>&lt;head&gt;</code> section).
    5. Paste the following script tag just before the closing <code>&lt;/head&gt;</code> tag:
        <code>&lt;script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"&gt;&lt;/script&gt;</code>
    6. Click "<strong>Update File</strong>".
    The chatbot will now be active on your WooCommerce store.
  `,
  Wix: (chatbotCode: string) => `
    To integrate Chatbot Hub with <strong>Wix</strong>:
    1. Go to your <strong>Wix dashboard</strong>.
    2. Navigate to "<strong>Settings</strong>" > "<strong>Custom Code</strong>".
    3. Click "<strong>+ Add Custom Code</strong>".
    4. Paste the following script tag into the "<strong>Paste code in head</strong>" section:
        <code>&lt;script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"&gt;&lt;/script&gt;</code>
    5. Select "<strong>All pages</strong>" under "<strong>Add Code to Pages</strong>" and set "<strong>Place Code in</strong>" to "<strong>Head</strong>".
    6. Click "<strong>Apply</strong>".
    Your chatbot is now installed on your Wix site.
  `,
  Squarespace: (chatbotCode: string) => `
    To integrate Chatbot Hub with <strong>Squarespace</strong>:
    1. From your <strong>Squarespace Home Menu</strong>, go to "<strong>Settings</strong>" > "<strong>Developer Tools</strong>" > "<strong>Code Injection</strong>".
    2. In the "<strong>Header</strong>" field, paste the following script tag:
        <code>&lt;script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"&gt;&lt;/script&gt;</code>
    3. Click "<strong>Save</strong>".
    Your chatbot should now be live on your Squarespace site.
  `,
  OpenCart: (chatbotCode: string) => `
    To integrate Chatbot Hub with <strong>OpenCart</strong>:
    1. Log in to your <strong>OpenCart admin panel</strong>.
    2. Go to "<strong>System</strong>" > "<strong>Design</strong>" > "<strong>Theme Editor</strong>".
    3. Select your store and the template file (e.g., <code>common/header.twig</code> or <code>common/header.tpl</code>).
    4. Locate the closing <code>&lt;/head&gt;</code> tag.
    5. Just before <code>&lt;/head&gt;</code>, paste the following script tag:
        <code>&lt;script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"&gt;&lt;/script&gt;</code>
    6. Save the changes.
    Your chatbot is now integrated with OpenCart.
  `,
  "Custom HTML/CMS": (chatbotCode: string) => `
    For any <strong>custom HTML website or other CMS</strong>:
    1. Open the main <strong>HTML file</strong> of your website (e.g., <code>index.html</code>, <code>layout.php</code>, <code>master.blade.php</code>).
    2. Locate the <code>&lt;head&gt;</code> section of your website.
    3. Paste the following script tag just before the closing <code>&lt;/head&gt;</code> tag:
        <code>&lt;script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"&gt;&lt;/script&gt;</code>
    4. Save the file and upload it to your web server.
    Your chatbot should now load on all pages where this script is included.
  `,
  BigCommerce: (chatbotCode: string) => `
    To integrate Chatbot Hub with <strong>BigCommerce</strong>:
    1. Go to <strong>Storefront</strong> &rarr; <strong>Script Manager</strong>.
    2. Click <strong>Create a Script</strong>.
    3. Set <strong>Location</strong> to "<strong>Footer</strong>".
    4. Set <strong>Pages</strong> to "<strong>All pages</strong>".
    5. Paste the following script into the "<strong>Script Contents</strong>" field:
        <code>&lt;script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"&gt;&lt;/script&gt;</code>
    6. Click "<strong>Save</strong>".
    Your chatbot is now integrated with BigCommerce.
  `,
  PrestaShop: (chatbotCode: string) => `
    To integrate Chatbot Hub with <strong>PrestaShop</strong>:
    1. Open <code>/themes/YOUR_THEME/footer.tpl</code> (replace <code>YOUR_THEME</code> with your active theme's directory name).
    2. Add the following script tag just before the closing <code>&lt;/body&gt;</code> tag:
        <code>&lt;script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"&gt;&lt;/script&gt;</code>
    3. Save the changes.
    Your chatbot is now integrated with PrestaShop.
  `,
  Magento: (chatbotCode: string) => `
    To integrate Chatbot Hub with <strong>Magento (Adobe Commerce)</strong> via the admin panel:
    1. Go to <strong>Content</strong> &rarr; <strong>Design</strong> &rarr; <strong>Configuration</strong>.
    2. Choose your theme and click "<strong>Edit</strong>".
    3. Under <strong>HTML Head</strong> &rarr; <strong>Scripts and Style Sheets</strong>, paste the following script:
        <code>&lt;script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"&gt;&lt;/script&gt;</code>
    4. Click "<strong>Save Configuration</strong>".
    Alternatively, for developers, you can add this via custom layout XML.
  `,
  Webflow: (chatbotCode: string) => `
    To integrate Chatbot Hub with <strong>Webflow</strong>:
    1. Go to <strong>Project Settings</strong> &rarr; <strong>Custom Code</strong>.
    2. In the <strong>Footer Code</strong> section, paste the following script:
        <code>&lt;script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"&gt;&lt;/script&gt;</code>
    3. <strong>Save</strong> changes and <strong>Publish</strong> your site.
    Your chatbot is now integrated with Webflow.
  `,
  WordPress: (chatbotCode: string) => `
    To integrate Chatbot Hub with <strong>WordPress</strong> (non-WooCommerce sites):
    1. Log in to your <strong>WordPress admin dashboard</strong>.
    2. Go to "<strong>Appearance</strong>" > "<strong>Theme File Editor</strong>".
    3. Select your active theme.
    4. Find and open the "<strong>header.php</strong>" file (or a similar file responsible for your site's <code>&lt;head&gt;</code> section).
    5. Paste the following script tag just before the closing <code>&lt;/head&gt;</code> tag:
        <code>&lt;script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"&gt;&lt;/script&gt;</code>
    6. Click "<strong>Update File</strong>".
    The chatbot will now be active on your WordPress site.
  `,
  Framer: (chatbotCode: string) => `
    To integrate Chatbot Hub with <strong>Framer</strong>:
    1. Open your project in <strong>Framer</strong>.
    2. Go to <strong>Project Settings</strong> (the gear icon) > <strong>General</strong>.
    3. Scroll down to the <strong>Custom Code</strong> section.
    4. Under "<strong>End of &lt;body&gt;</strong>" (or "Start of &lt;head&gt;"), paste the following script:
        <code>&lt;script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"&gt;&lt;/script&gt;</code>
    5. <strong>Publish</strong> your site to apply the changes.
    Your chatbot is now integrated with Framer.
  `,
}

export function IntegrationGuideDialog({ platformName, chatbotCode, isOpen, onClose }: IntegrationGuideDialogProps) {
  // Log the received platformName and available keys for debugging
  console.log("IntegrationGuideDialog received platformName:", platformName)
  console.log("Available integration guide keys:", Object.keys(integrationGuides))

  const [activeTab] = useState(platformName)
  const scriptToCopy = `<script src="${process.env.NEXT_PUBLIC_API_BASE_URL!.replace("/api", "")}/widget/chatbot-widget.js?chatbotCode=${chatbotCode}"></script>`
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
    const content = contentFunction(chatbotCode)
    return (
      <div className="prose prose-sm max-w-none text-slate-800">
        {content.split("\n").map((line, index) => {
          if (line.trim() === "") return <br key={index} />

          // Using dangerouslySetInnerHTML to render HTML from the guide strings
          return (
            <p
              key={index}
              className="text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: line.trim() }}
            />
          )
        })}
      </div>
    )
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
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="absolute top-2 right-2 h-8 w-8 p-0 text-slate-500 hover:bg-slate-200 hover:text-slate-900 rounded-lg"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Directly render the content for the activeTab */}
          {renderGuideContent(activeTab)}
        </div>
        <Button onClick={onClose} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3">
          Got It!
        </Button>
      </DialogContent>
    </Dialog>
  )
}