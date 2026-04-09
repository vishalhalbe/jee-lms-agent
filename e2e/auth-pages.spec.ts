import { test, expect } from "@playwright/test"

/**
 * Auth pages — /sign-in and /sign-up
 *
 * These pages are public routes that render Clerk's hosted UI widget inside
 * our custom layout. Tests confirm the surrounding shell renders correctly.
 *
 * NOTE: We do NOT assert on the Clerk iframe internals because:
 *   1. Clerk renders inside a cross-origin iframe in dev/test mode.
 *   2. Stub publishable keys (`pk_test_stub`) produce an error state
 *      inside the widget, not the real sign-in form.
 *
 * What we CAN reliably assert:
 *   - Our custom heading and subtitle render.
 *   - The Clerk component mount point (the outer div/iframe) is present
 *     in the DOM — confirming the component was rendered by React.
 *   - The page does not return a 4xx/5xx status.
 */

test.describe("Sign-in page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in")
  })

  test("returns 200 and is not an error page", async ({ page }) => {
    // Playwright follows redirects by default; if the response were an
    // error we'd see a 4xx/5xx in the final response.
    const response = await page.goto("/sign-in")
    expect(response?.status()).toBeLessThan(400)
  })

  test("renders the Welcome back heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Welcome back/i })
    ).toBeVisible()
  })

  test("renders the sign-in subtitle", async ({ page }) => {
    await expect(
      page.getByText(/Sign in to continue your JEE prep/i)
    ).toBeVisible()
  })

  test("mounts the Clerk sign-in component", async ({ page }) => {
    // Clerk renders a div with data-clerk-component or a child iframe.
    // Either way the clerk-captcha or clerk-components-root div should exist.
    // We assert on the container the Next.js page puts around <SignIn />.
    // The outer <div> that wraps SignIn is always present even with stub keys.
    const clerkRoot = page.locator(
      "[data-clerk-component], .cl-rootBox, iframe[data-clerk-component]"
    )
    // The element might be hidden behind an error overlay with stub keys, so
    // we check it is attached to the DOM rather than visible.
    await expect(clerkRoot.first()).toBeAttached({ timeout: 15_000 })
  })
})

test.describe("Sign-up page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-up")
  })

  test("returns 200 and is not an error page", async ({ page }) => {
    const response = await page.goto("/sign-up")
    expect(response?.status()).toBeLessThan(400)
  })

  test("renders the Create your account heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Create your account/i })
    ).toBeVisible()
  })

  test("renders the sign-up subtitle", async ({ page }) => {
    await expect(
      page.getByText(/Start your JEE journey today/i)
    ).toBeVisible()
  })

  test("mounts the Clerk sign-up component", async ({ page }) => {
    const clerkRoot = page.locator(
      "[data-clerk-component], .cl-rootBox, iframe[data-clerk-component]"
    )
    await expect(clerkRoot.first()).toBeAttached({ timeout: 15_000 })
  })
})
