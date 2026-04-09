import { test, expect } from "@playwright/test"

/**
 * Landing page — /
 *
 * Verifies the hero section renders correctly for unauthenticated visitors.
 * The page is public (no auth required) and purely static React.
 */

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("renders the hero heading with brand copy", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toContainText("Crack JEE")
  })

  test("renders the AI Intelligence highlight", async ({ page }) => {
    await expect(page.getByText("AI Intelligence")).toBeVisible()
  })

  test("renders the AI-Powered badge", async ({ page }) => {
    await expect(page.getByText("AI-Powered JEE Preparation")).toBeVisible()
  })

  test("renders Start Free CTA button", async ({ page }) => {
    const cta = page.getByRole("button", { name: /Start Free/i })
    await expect(cta).toBeVisible()
  })

  test("renders View Demo button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /View Demo/i })).toBeVisible()
  })

  test("renders PYQ Bank feature card", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "PYQ Bank" })).toBeVisible()
  })

  test("renders AI Predictions feature card", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "AI Predictions" })
    ).toBeVisible()
  })

  test("renders Adaptive Tests feature card", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Adaptive Tests" })
    ).toBeVisible()
  })

  test("page title contains JEE LMS", async ({ page }) => {
    await expect(page).toHaveTitle(/JEE LMS/)
  })
})
