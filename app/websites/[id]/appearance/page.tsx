"use client";

import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { WebsiteLayout } from "@/components/layout/website-layout";
import { ChatbotAppearance } from "@/components/websites/chatbot-appearance"; // Assuming this component exists
import { LoadingSpinner } from "@/components/ui/loading";

export default function AppearancePage() {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();

  if (authLoading || !user) {
    return <LoadingSpinner />;
  }
  
  const website = user.websites.find((w: any) => w._id === id);

  if (!website) {
    return <LoadingSpinner />;
  }

  const handleUpdate = (updatedWebsite: any) => {
    console.log("Chatbot appearance updated:", updatedWebsite);
  };

  return (
    <WebsiteLayout>
      <ChatbotAppearance website={website} userId={user._id} onUpdate={handleUpdate} />
    </WebsiteLayout>
  );
}