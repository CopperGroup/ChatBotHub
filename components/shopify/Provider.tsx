'use client'

import React, { useMemo } from 'react'
import { AppConfigV2, createApp } from '@shopify/app-bridge'
import { createContext, useContext } from 'react'

const AppBridgeContext = createContext<ReturnType<typeof createApp> | null>(null)

export const useAppBridge = () => {
  const ctx = useContext(AppBridgeContext)
  if (!ctx) throw new Error('useAppBridge must be used within <AppBridgeProvider>')
  return ctx
}

export const AppBridgeProvider = ({ children }: { children: React.ReactNode }) => {
  const host = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('host') : null

  // Build config with host
  const config: AppConfigV2 = useMemo(() => {
    if (!host) throw new Error('Shopify host is missing from URL params')
    return {
      apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || '',
      host,
      forceRedirect: true,
      // any other options you need
    }
  }, [host])

  const appBridge = useMemo(() => createApp(config), [config])

  return <AppBridgeContext.Provider value={appBridge}>{children}</AppBridgeContext.Provider>
}
