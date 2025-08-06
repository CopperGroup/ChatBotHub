"use client";

import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { WebsiteLayout } from "@/components/layout/website-layout";
import { AIManagement } from "@/components/websites/ai-management"; // Assuming this component exists
import { LoadingSpinner } from "@/components/ui/loading";

export default function AIManagementPage() {
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
    console.log("AI management updated:", updatedWebsite);
  };

  return (
    <WebsiteLayout>
      <AIManagement website={website} userId={user._id} onUpdate={handleUpdate} />
    </WebsiteLayout>
  );
}