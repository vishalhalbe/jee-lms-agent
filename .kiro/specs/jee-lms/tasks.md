# Tasks: JEE LMS Implementation

## Phase 0: Foundation (Unblock & Setup)
*Fix broken state, establish infrastructure. All subsequent phases depend on this.*

- [ ] **0.1** Create `lib/utils.ts` with `cn()` helper (unblocks Button component)
- [ ] **0.2** Create `.env.local` with env var placeholders (CLERK_*, DATABASE_URL, ANTHROPIC_API_KEY)
- [ ] **0.3** Create `lib/db/index.ts` — Drizzle + Neon client setup
- [ ] **0.4** Create `lib/db/schema.ts` — all table definitions (users, subjects, chapters, lessons, questions, tests, test_attempts, topic_progress, predictions, study_plans)
- [ ] **0.5** Create `drizzle.config.ts`
- [ ] **0.6** Create `middleware.ts` — Clerk auth middleware protecting `/(app)` routes
- [ ] **0.7** Create `lib/ai/client.ts` — Anthropic SDK singleton
- [ ] **0.8** Add `globals.css` with CSS variables for theming
- [ ] **0.9** Run `drizzle-kit generate` + `drizzle-kit migrate`

**Risks:** Neon DB URL and Clerk keys must be provisioned first.

---

## Phase 1: Auth + App Shell
*Students can sign in and see a basic dashboard.*

- [ ] **1.1** Create `app/(auth)/sign-in/[[...sign-in]]/page.tsx` — Clerk SignIn component
- [ ] **1.2** Create `app/(auth)/sign-up/[[...sign-up]]/page.tsx` — Clerk SignUp component
- [ ] **1.3** Create `app/(auth)/layout.tsx` — centered auth layout
- [ ] **1.4** Create `app/api/webhooks/clerk/route.ts` — sync Clerk user to DB on signup
- [ ] **1.5** Create `components/layout/Sidebar.tsx` — navigation (Dashboard, Courses, Practice, Predictions, Analytics, Study Plan)
- [ ] **1.6** Create `components/layout/TopNav.tsx` — user avatar, theme toggle
- [ ] **1.7** Create `app/(app)/layout.tsx` — sidebar + topnav shell
- [ ] **1.8** Create `app/(app)/dashboard/page.tsx` — stats summary cards (placeholder data)
- [ ] **1.9** Update `app/layout.tsx` — add ClerkProvider, ThemeProvider, Toaster
- [ ] **1.10** Create landing `app/(marketing)/page.tsx` — public home page

**Risks:** Clerk webhook requires public URL (use ngrok locally).

---

## Phase 2: Course & Content System
*Students can browse subjects, chapters, and read lessons.*

- [ ] **2.1** Create `app/(app)/courses/page.tsx` — subject grid (Physics, Chemistry, Math)
- [ ] **2.2** Create `app/(app)/courses/[subject]/page.tsx` — chapter list
- [ ] **2.3** Create `app/(app)/courses/[subject]/[chapter]/page.tsx` — lesson viewer
- [ ] **2.4** Create `app/api/courses/route.ts` — fetch subjects + chapters
- [ ] **2.5** Create `lib/db/seed.ts` — seed subjects, chapters (NCERT syllabus)
- [ ] **2.6** Seed initial question bank (sample questions per chapter)
- [ ] **2.7** Create admin CMS pages at `app/(app)/admin/` (content CRUD)

**Risks:** Question bank seeding is time-intensive; start with 50 questions per subject.

---

## Phase 3: Practice Tests
*Students can take chapter tests and full mock exams with auto-grading.*

- [ ] **3.1** Create `app/(app)/practice/page.tsx` — test type picker (chapter, full mock, previous year)
- [ ] **3.2** Create `app/(app)/practice/[testId]/page.tsx` — test runner UI (timer, question nav, submit)
- [ ] **3.3** Create `app/(app)/practice/[testId]/results/page.tsx` — score, explanations, topic breakdown
- [ ] **3.4** Create `app/api/tests/route.ts` — generate/fetch test
- [ ] **3.5** Create `app/api/tests/[testId]/submit/route.ts` — grade submission, write to test_attempts + topic_progress
- [ ] **3.6** Implement negative marking logic (+4/-1/0)
- [ ] **3.7** Write Vitest tests for grading logic

**Risks:** Test runner state (timer, answers) needs careful client-side management; use `useReducer`.

---

## Phase 4: AI Question Prediction
*Claude predicts high-probability topics for the next JEE exam.*

- [ ] **4.1** Create `lib/ai/predict.ts` — build prediction prompt from topic frequency data
- [ ] **4.2** Create `app/api/ai/predict/route.ts` — query DB trends, call Claude, store in predictions table
- [ ] **4.3** Create `app/(app)/predictions/page.tsx` — display ranked predictions with confidence scores and reasoning
- [ ] **4.4** Create `components/features/predictions/PredictionCard.tsx`
- [ ] **4.5** Add admin trigger to refresh predictions (POST endpoint)
- [ ] **4.6** Write integration test for prediction endpoint (mock Claude response)

**Risks:** Claude prompt quality is critical — iterate on system prompt with real past paper data.

---

## Phase 5: Adaptive Engine + Analytics
*Platform learns student weaknesses and adapts.*

- [ ] **5.1** Create `lib/ai/adaptive.ts` — query topic_progress, build adaptive question set
- [ ] **5.2** Create `app/api/ai/adaptive/route.ts` — generate personalized test
- [ ] **5.3** Create `app/(app)/analytics/page.tsx` — subject breakdown, time-series chart, percentile
- [ ] **5.4** Create `components/features/analytics/ScoreChart.tsx` (recharts or similar)
- [ ] **5.5** Create `components/features/analytics/TopicHeatmap.tsx`
- [ ] **5.6** Create `app/api/progress/route.ts` — aggregate topic_progress for dashboard
- [ ] **5.7** Add percentile calculation query (rank student vs all students)

---

## Phase 6: AI Study Plans
*Claude generates a personalized day-by-day study schedule.*

- [ ] **6.1** Create `lib/ai/study-plan.ts` — study plan prompt builder
- [ ] **6.2** Create `app/api/ai/study-plan/route.ts` — call Claude with streaming response
- [ ] **6.3** Create `app/(app)/study-plan/page.tsx` — input form + calendar/schedule view
- [ ] **6.4** Stream Claude response to UI using `ReadableStream`
- [ ] **6.5** Persist generated plan to `study_plans` table

---

## Phase 7: SaaS Billing & Polish
*Monetize the platform.*

- [ ] **7.1** Integrate Razorpay (or Stripe) for subscription plans
- [ ] **7.2** Define Free vs Pro feature gates
- [ ] **7.3** Add usage limits enforcement in API routes
- [ ] **7.4** Landing page SEO — metadata, OG tags, sitemap
- [ ] **7.5** Error boundaries and loading skeletons throughout
- [ ] **7.6** Accessibility audit (keyboard nav, screen reader)
- [ ] **7.7** E2E tests for critical flows (sign-up → take test → see results)

---

## Implementation Order

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7
   ↑ MUST complete before anything else
```

## Current Status

| Phase | Status |
|---|---|
| Phase 0 | Not started |
| Phase 1 | Not started |
| Phase 2 | Not started |
| Phase 3 | Not started |
| Phase 4 | Not started |
| Phase 5 | Not started |
| Phase 6 | Not started |
| Phase 7 | Not started |
