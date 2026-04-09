import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright E2E configuration for JEE LMS.
 *
 * Tests run against the production build (`next build && next start`)
 * so they exercise the real middleware, routing, and Clerk integration
 * without needing to mock the framework layer.
 *
 * Authenticated flows are intentionally excluded — they require live
 * Clerk test-mode keys that are not available in this CI environment.
 */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000"

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",

  /* Run test files in parallel; tests within a file run serially by default */
  fullyParallel: true,

  /* Fail the build on CI if test.only is accidentally left in source */
  forbidOnly: !!process.env.CI,

  /* No retries locally; 1 retry on CI to absorb transient flakes */
  retries: process.env.CI ? 1 : 0,

  /* One worker locally for faster cold start; parallelise on CI */
  workers: process.env.CI ? 2 : 1,

  reporter: process.env.CI
    ? [["github"], ["html", { outputFolder: "playwright-report", open: "never" }], ["junit", { outputFile: "playwright-results.xml" }]]
    : [["list"], ["html", { outputFolder: "playwright-report", open: "on-failure" }]],

  /* Shared settings for every test */
  use: {
    baseURL: BASE_URL,

    /* Capture trace on first retry so failures are debuggable in CI */
    trace: "on-first-retry",

    /* Screenshot only on failure */
    screenshot: "only-on-failure",

    /* Video only on first retry to keep artifact size manageable */
    video: "on-first-retry",

    /* Generous but finite timeout for page actions */
    actionTimeout: 10_000,
  },

  /* Artifact output directory */
  outputDir: "test-results",

  /* Global navigation timeout */
  timeout: 30_000,

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  /*
   * Start the production server before the test suite runs.
   * `next build` is expected to have already been run (either locally
   * or by the CI step that precedes `playwright test`).
   */
  webServer: {
    command: "npm run start",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      /* Stub keys prevent Clerk SDK from throwing at startup */
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "pk_test_stub",
      CLERK_SECRET_KEY:
        process.env.CLERK_SECRET_KEY ?? "sk_test_stub",
      DATABASE_URL:
        process.env.DATABASE_URL ?? "postgresql://stub",
      OPENROUTER_API_KEY:
        process.env.OPENROUTER_API_KEY ?? "sk-or-stub",
      OPENROUTER_BASE_URL:
        process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
    },
  },
})
