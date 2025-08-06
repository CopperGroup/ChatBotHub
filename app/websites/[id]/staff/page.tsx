"use client";

import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { WebsiteLayout } from "@/components/layout/website-layout";
import { StaffManagement } from "@/components/websites/staff-management"; // Assuming this component exists
import { LoadingSpinner } from "@/components/ui/loading";

export default function StaffManagementPage() {
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
      <StaffManagement websiteId={website._id} userId={user._id} />
    </WebsiteLayout>
  );
}