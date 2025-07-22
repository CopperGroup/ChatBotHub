'use client'

import { PostHogProvider as PHProvider } from 'posthog-js/react'
import posthog from '@/lib/posthogClient'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
