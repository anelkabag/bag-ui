import posthog from "posthog-js"

const token = process.env.NEXT_PUBLIC_POSTHOG_KEY
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (token && host) {
  posthog.init(token, {
    api_host: host,
    defaults: "2026-08-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  })
} else if (process.env.NODE_ENV === "development") {
  const missingVariable = !token
    ? "NEXT_PUBLIC_POSTHOG_KEY"
    : "NEXT_PUBLIC_POSTHOG_HOST"

  console.error(
    new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    ),
  )
}
