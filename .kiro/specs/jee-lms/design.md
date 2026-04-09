# Design: JEE LMS Architecture

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR, RSC, API routes |
| Auth | Clerk ^7 | Managed auth, JWTs, webhooks |
| Database | Neon PostgreSQL (serverless) | Scales to zero, branching |
| ORM | Drizzle ORM | Type-safe, fast, edge-compatible |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) | Question prediction, adaptive engine |
| UI | shadcn + Base UI + Tailwind v4 | Accessible, headless |
| Validation | Zod v4 | Schema-first validation |
| Testing | Vitest + Testing Library | Fast unit/integration tests |
| Hosting | Vercel | Edge functions, preview deploys |

---

## Directory Structure

```
jee-lms/
├── app/
│   ├── (auth)/                    # Clerk auth routes
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (marketing)/               # Public landing pages
│   │   └── page.tsx
│   ├── (app)/                     # Protected app shell
│   │   ├── layout.tsx             # Sidebar + topnav
│   │   ├── dashboard/page.tsx
│   │   ├── courses/
│   │   │   ├── page.tsx           # Subject list
│   │   │   └── [subject]/
│   │   │       ├── page.tsx       # Chapter list
│   │   │       └── [chapter]/page.tsx  # Lesson viewer
│   │   ├── practice/
│   │   │   ├── page.tsx           # Test picker
│   │   │   └── [testId]/
│   │   │       ├── page.tsx       # Test runner
│   │   │       └── results/page.tsx
│   │   ├── predictions/page.tsx   # AI question predictions
│   │   ├── analytics/page.tsx     # Progress analytics
│   │   └── study-plan/page.tsx    # AI study plan
│   ├── api/
│   │   ├── ai/
│   │   │   ├── predict/route.ts   # Question prediction endpoint
│   │   │   ├── study-plan/route.ts
│   │   │   └── adaptive/route.ts
│   │   ├── tests/route.ts
│   │   ├── progress/route.ts
│   │   └── webhooks/clerk/route.ts
│   └── layout.tsx                 # Root layout
├── components/
│   ├── ui/                        # Base UI primitives
│   ├── features/
│   │   ├── dashboard/
│   │   ├── practice/
│   │   ├── predictions/
│   │   └── analytics/
│   └── layout/
│       ├── Sidebar.tsx
│       └── TopNav.tsx
├── lib/
│   ├── utils.ts                   # cn() helper
│   ├── db/
│   │   ├── index.ts               # Drizzle client
│   │   └── schema.ts              # All table definitions
│   ├── ai/
│   │   ├── client.ts              # Anthropic SDK init
│   │   ├── predict.ts             # Prediction prompts
│   │   └── study-plan.ts          # Study plan prompts
│   └── validations/
│       └── test.ts
├── middleware.ts                  # Clerk auth middleware
├── drizzle.config.ts
└── .env.local
```

---

## Database Schema

### Users
```sql
users (id, clerk_id, email, name, target_year, level, created_at)
```

### Content
```sql
subjects (id, name, slug, icon)
chapters (id, subject_id, name, slug, order)
lessons (id, chapter_id, title, content, video_url, order)
questions (id, subject_id, chapter_id, topic, content, options[], correct_answer,
           explanation, difficulty, year, exam_type, tags[])
```

### Tests & Attempts
```sql
tests (id, title, type, subject_id, config_json, created_at)
test_attempts (id, user_id, test_id, answers_json, score, time_taken, completed_at)
```

### Progress
```sql
topic_progress (id, user_id, subject_id, chapter_id, topic,
                attempts, correct, avg_time_ms, last_practiced_at)
```

### AI Features
```sql
predictions (id, exam_cycle, subject, topics_json, confidence, reasoning, created_at)
study_plans (id, user_id, exam_date, daily_hours, plan_json, created_at)
```

---

## AI Integration Design

### Question Prediction (`/api/ai/predict`)
1. Fetch frequency data from `questions` table grouped by topic + year
2. Build structured prompt with trend data for Claude
3. Claude returns ranked predictions with confidence scores
4. Store in `predictions` table, serve to frontend

### Adaptive Test Generation (`/api/ai/adaptive`)
1. Query `topic_progress` for the user — find topics with accuracy < 60%
2. Fetch questions from those topics, weighted by weakness severity
3. Optionally ask Claude to mix in related strong topics for retention
4. Return personalized question set

### Study Plan (`/api/ai/study-plan`)
1. User inputs: exam date, daily hours, weak subjects (from onboarding)
2. Claude generates structured JSON schedule (day → topics → tasks)
3. Store in `study_plans`, render as calendar view

---

## Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Route grouping | `(auth)`, `(marketing)`, `(app)` | Clean separation, shared layouts |
| AI calls | Server-side only (API routes) | Keep API key off client |
| DB access | Server Components + API routes | Never expose DB to browser |
| Streaming | AI responses streamed via `ReadableStream` | Better UX for long AI outputs |
| Question bank | Seeded via Drizzle seed script | Reproducible, version-controlled |
