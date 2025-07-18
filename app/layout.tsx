import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat Bot Hub",
  description: "Ready Chat Bot for your website in 5 minutes! Turn on AI, add staff, open telegram bot to never miss a message, customize the look...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      <Toaster position="top-right" richColors expand={true} duration={4000} />
      <script src="https://chatbothubserver.up.railway.app/widget/chatbot-widget.js?chatbotCode=4fi4q9wesql48tnutk73p4"></script>
      </body>
    </html>
  );
}
