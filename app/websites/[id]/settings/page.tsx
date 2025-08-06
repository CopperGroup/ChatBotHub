"use client";

import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { WebsiteLayout } from "@/components/layout/website-layout";
import { WebsiteSettings } from "@/components/websites/website-settings"; // Assuming this component exists
import { LoadingSpinner } from "@/components/ui/loading";

export default function SettingsPage() {
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
    console.log("Website settings updated:", updatedWebsite);
  };

  return (
    <WebsiteLayout>
      <WebsiteSettings website={website} userId={user._id} onUpdate={handleUpdate} />
    </WebsiteLayout>
  );
}