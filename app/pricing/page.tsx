import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import PricingPageClient from '@/components/pricing/pricing-client-page';

interface PricingPageProps {
  searchParams: {
    websiteId?: string;
    currentPlanId?: string;
    [key: string]: string | string[] | undefined;
  };
}

export default function PricingServerPage({ searchParams }: PricingPageProps) {
  const websiteId = searchParams.websiteId;
  const currentPlanId = searchParams.currentPlanId;

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
        <p className="ml-4 text-lg text-slate-700">Loading pricing plans...</p>
      </div>
    }>
      <PricingPageClient websiteId={websiteId} currentPlanId={currentPlanId} />
    </Suspense>
)};