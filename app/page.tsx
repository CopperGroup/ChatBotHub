import { LandingPage } from "@/components/landing/landing-page"
import { redirect } from "next/navigation";

export default function ({ searchParams }: { searchParams: Record<string, string> }) {
  const { shop, hmac, host, noRedirect} = searchParams;

  if (shop && hmac && host && noRedirect) {
    // Redirect to your Shopify OAuth initiation route
    redirect(`/api/shopify/auth?shop=${shop}&host=${host}&hmac=${hmac}`);
  }
  
  return <LandingPage />
}
