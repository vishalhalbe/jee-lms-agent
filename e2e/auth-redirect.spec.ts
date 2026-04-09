import { test, expect } from "@playwright/test"

/**
 * Authentication redirect guard
 *
 * Verifies that unauthenticated visitors who attempt to access protected
 * routes are redirected to /sign-in.
 *
 * The protection is implemented in middleware.ts via Clerk's `auth.protect()`.
 * These tests exercise the full middleware stack through the production build.
 *
 * We test a representative sample of protected routes rather than every
 * possible URL — the middleware pattern covers them uniformly.
 */

const PROTECTED_ROUTES = [
  "/dashboard",
  "/subjects",
  "/practice",
] as const

for (const route of PROTECTED_ROUTES) {
  test(`unauthenticated GET ${route} redirects to /sign-in`, async ({
    page,
  }) => {
    // Navigate without any auth cookies/session.
    await page.goto(route)

    // After redirect(s), the URL must be /sign-in (with optional query params
    // added by Clerk such as ?redirect_url=...).
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 10_000 })
  })
}

test("unauthenticated GET /dashboard shows sign-in content", async ({
  page,
}) => {
  await page.goto("/dashboard")

  // After the redirect we should land on the sign-in page which contains
  // our custom heading.
  await expect(
    page.getByRole("heading", { name: /Welcome back/i })
  ).toBeVisible({ timeout: 10_000 })
})
