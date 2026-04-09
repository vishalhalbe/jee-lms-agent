// Validate required environment variables at startup.
// Import this module in server-side code (layout, API routes) to catch
// misconfiguration early rather than at runtime deep in a request.

const REQUIRED_VARS = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "DATABASE_URL",
  "OPENROUTER_API_KEY",
  "OPENROUTER_BASE_URL",
] as const

type RequiredVar = (typeof REQUIRED_VARS)[number]

function validateEnv(): Record<RequiredVar, string> {
  const missing: string[] = []
  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\nCheck your .env.local file.`
    )
  }
  return Object.fromEntries(
    REQUIRED_VARS.map((k) => [k, process.env[k] as string])
  ) as Record<RequiredVar, string>
}

// Only validate on the server; NEXT_PUBLIC_ vars are available client-side too
// but other secrets are not — skip validation in browser bundles.
export const env = typeof window === "undefined" ? validateEnv() : ({} as Record<RequiredVar, string>)
