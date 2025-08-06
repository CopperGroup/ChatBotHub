"use client";

import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { WebsiteLayout } from "@/components/layout/website-layout";
import { WebsiteIntegrationTab } from "@/components/websites/integration-tab"; // Assuming this component exists
import { LoadingSpinner } from "@/components/ui/loading";

export default function IntegrationPage() {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();

  if (authLoading || !user) {
    return <LoadingSpinner />;
  }
  
  const website = user.websites.find((w: any) => w._id === id);

  if (!website) {
    return <LoadingSpinner />;
  }

  return (
    <WebsiteLayout>
      <WebsiteIntegrationTab chatbotCode={website.chatbotCode} />
    </WebsiteLayout>
  );
}