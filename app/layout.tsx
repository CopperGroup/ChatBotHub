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
  title: 'Chat Bot Hub',
  description: 'Ready Chat Bot for your website in 5 minutes!',
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
        <script async src={process.env.CHAT_WIDJET_URL}></script>
      </body>
    </html>
  )
}
