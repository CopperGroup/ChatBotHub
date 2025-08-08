// app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AppBridgeProvider } from '@/providers/AppBridgeProvider'
import { PostHogProvider } from '@/components/providers/PostHog'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Live Chat Software for Websites | Chatboth.com',
  description: 'Add live chat software to your website in just 5 minutes. Boost customer support, generate sales leads, and improve user engagement. Get started with a free trial today!',
  openGraph: {
    title: 'Live Chat Software for Websites | Chatboth.com',
    description: 'Add live chat software to your website in just 5 minutes. Boost customer support, generate sales leads, and improve user engagement.',
    url: 'https://www.chatboth.com',
    siteName: 'Chatboth',
    images: [
      {
        url: 'https://www.chatboth.com/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Chatboth - Live Chat Software Solution',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Chat Software for Websites | Chatboth.com',
    description: 'Add live chat software to your website in just 5 minutes. Boost customer support, generate sales leads, and improve user engagement.',
    creator: '@chat_bot_hub',
    images: ['https://www.chatboth.com/opengraph-image.png'],
  },
}

export default function RootLayout({
  children,
  searchParams,
}: Readonly<{
  children: React.ReactNode
  searchParams?: { host?: string; shop?: string } // <-- optional now
}>) {
  const host = searchParams?.host
  const shop = searchParams?.shop

  const isEmbedded = Boolean(host && shop)

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PostHogProvider>
            {isEmbedded ? (
              <AppBridgeProvider
                config={{
                  apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
                  host: host!,
                  forceRedirect: true,
                }}
              >
                {children}
              </AppBridgeProvider>
            ) : (
              children
            )}

            <Toaster position="top-right" richColors expand duration={4000} />
        </PostHogProvider>
        <script async src="https://chatbothubserver.up.railway.app/widget/chatbot-widget.js?chatbotCode=c80b9looy8aux8phse4zsj"></script>
      </body>
    </html>
  )
}
