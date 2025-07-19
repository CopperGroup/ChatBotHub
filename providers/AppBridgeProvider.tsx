'use client'

import { createContext, useContext, useMemo } from 'react'
import createApp, { AppConfigV2 } from '@shopify/app-bridge'

const AppBridgeContext = createContext<ReturnType<typeof createApp> | null>(null)

export const useAppBridge = () => {
  const ctx = useContext(AppBridgeContext)
  if (!ctx) throw new Error('useAppBridge must be used within <AppBridgeProvider>')
  return ctx
}

export const AppBridgeProvider = ({
  children,
  config,
}: {
  children: React.ReactNode
  config: AppConfigV2
}) => {
  const appBridge = useMemo(() => createApp(config), [config])

  return (
    <AppBridgeContext.Provider value={appBridge}>
      {children}
    </AppBridgeContext.Provider>
  )
}
