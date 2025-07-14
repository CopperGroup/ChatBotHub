import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google"; // Import Roboto
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// Define Roboto font as the primary one
const roboto = Roboto({
  weight: ["300", "400", "500", "700"], // Include common weights for main font
  subsets: ["latin"],
  variable: "--font-roboto", // Optional: define a CSS variable
});

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
        className={`${roboto.className} ${roboto.variable} antialiased`} // Roboto first, then other variables
      >
        {children}
        <Toaster position="top-right" richColors expand={true} duration={4000} />
        <script src="http://localhost:3001/widget/chatbot-widget.js?chatbotCode=73ctl78r4st6ccjg4o3e1o"></script>
      </body>
    </html>
  );
}