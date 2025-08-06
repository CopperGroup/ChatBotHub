"use client";

import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/ui/loading";
import { WebsiteLayout } from "@/components/layout/website-layout";
import Conversations from "@/components/conversations/conversations"; // Assuming this component exists
import { useParams, useSearchParams } from "next/navigation";

export default function ConversationsPage() {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chatId');

  if (authLoading || !user) {
    return <LoadingSpinner />;
  }

  if (!id) {
    // This case should ideally be handled by the layout, but as a fallback.
    return <div>Website ID not found.</div>;
  }

  return (
    <WebsiteLayout>
      <Conversations websiteId={id as string} chatId={chatId as string} />
    </WebsiteLayout>
  );
}