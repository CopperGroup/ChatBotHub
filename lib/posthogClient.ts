import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    person_profiles: 'identified_only',
    defaults: '2025-05-24',
    loaded: (ph) => {
      window.posthog = ph
    },
  })
}

export default posthog
