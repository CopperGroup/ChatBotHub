import { AppBridgeProvider } from "@/components/shopify/Provider";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppBridgeProvider>
        {children}
    </AppBridgeProvider>
  );
}
