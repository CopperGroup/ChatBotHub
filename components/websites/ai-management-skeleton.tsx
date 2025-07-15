"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function AIManagementSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      {/* CTA Card Skeleton */}
      <Skeleton className="h-40 w-full rounded-3xl mb-8" />
      {/* Main Content Skeleton - Updated to flex layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {" "}
          {/* Left column */}
          <Skeleton className="h-96 w-full rounded-3xl" /> {/* AI Configuration Card */}
          <Skeleton className="h-80 w-full rounded-3xl" /> {/* Token Usage Chart */}
        </div>
        <div className="lg:w-1/3 space-y-8">
          {" "}
          {/* Right column */}
          <Skeleton className="h-32 w-full rounded-3xl" /> {/* Placeholder for first stat card */}
          <Skeleton className="h-32 w-full rounded-3xl" /> {/* Placeholder for second stat card */}
          <Skeleton className="h-32 w-full rounded-3xl" /> {/* Placeholder for third stat card */}
          <Skeleton className="h-48 w-full rounded-3xl" /> {/* Quick Actions Card */}
        </div>
      </div>
    </div>
  )
}
