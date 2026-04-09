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
│   ├── (auth)/                        # Clerk auth routes
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (marketing)/                   # Public landing page
│   │   └── page.tsx
│   ├── (app)/                         # Protected app shell
│   │   ├── layout.tsx                 # Sidebar + topnav
│   │   ├── dashboard/page.tsx         # Stats: questions solved, accuracy, streak
│   │   ├── subjects/
│   │   │   ├── page.tsx               # Subject grid (Physics, Chemistry, Math)
│   │   │   └── [subject]/
│   │   │       ├── page.tsx           # Chapter list with PYQ counts
│   │   │       └── [chapter]/page.tsx # PYQ browser — filter by year/difficulty
│   │   ├── practice/
│   │   │   ├── page.tsx               # Test picker (chapter, full mock, year-wise)
│   │   │   └── [testId]/
│   │   │       ├── page.tsx           # Test runner (math+chemistry+image rendering)
│   │   │       └── results/page.tsx   # Results + AI solutions
│   │   ├── predictions/page.tsx       # AI topic predictions
│   │   ├── analytics/page.tsx         # Performance analytics
│   │   └── study-plan/page.tsx        # AI study plan
│   │   └── admin/
│   │       ├── pyq-import/page.tsx    # Bulk PYQ upload
│   │       └── questions/page.tsx     # CMS — edit questions, images, tags
│   ├── api/
│   │   ├── ai/
│   │   │   ├── solution/route.ts      # Gemini Flash: generate solution for question
│   │   │   ├── predict/route.ts       # Claude: topic prediction
│   │   │   ├── study-plan/route.ts    # Claude: study plan generation
│   │   │   └── adaptive/route.ts      # Adaptive test generation
│   │   ├── questions/route.ts         # Fetch PYQs with filters
│   │   ├── tests/route.ts             # Fetch/create test sessions
│   │   ├── tests/[testId]/submit/route.ts
│   │   ├── progress/route.ts
│   │   ├── admin/pyq-import/route.ts  # Bulk import endpoint
│   │   └── webhooks/clerk/route.ts
│   └── layout.tsx                     # Root layout
├── components/
│   ├── ui/                            # Glass UI primitives
│   ├── features/
│   │   ├── questions/
│   │   │   ├── QuestionRenderer.tsx   # KaTeX + mhchem + next/image
│   │   │   └── SolutionRenderer.tsx   # AI solution with math rendering
│   │   ├── practice/
│   │   ├── predictions/
│   │   └── analytics/
│   └── layout/
│       ├── Sidebar.tsx
│       └── TopNav.tsx
├── lib/
│   ├── utils.ts                       # cn() helper
│   ├── math.ts                        # KaTeX + mhchem render utilities
│   ├── db/
│   │   ├── index.ts                   # Drizzle + Neon client
│   │   ├── schema.ts                  # All table definitions
│   │   ├── seed.ts                    # Subjects + chapters seed
│   │   └── seed-pyq.ts               # PYQ bulk import
│   ├── ai/
│   │   ├── client.ts                  # OpenRouter client (Gemini + Claude)
│   │   ├── solution.ts                # Gemini solution prompt + LaTeX preservation
│   │   ├── predict.ts                 # Claude prediction prompts
│   │   └── study-plan.ts             # Claude study plan prompts
│   └── validations/
│       └── question.ts                # Zod schema for PYQ import
├── middleware.ts                      # Clerk auth middleware
├── drizzle.config.ts
└── .env.local
```

---

## Database Schema

### Users
```sql
users (id, clerk_id, email, name, target_year, level, created_at)
```

### PYQ Bank (no lessons)
```sql
subjects (id, name, slug, icon, color)
chapters (id, subject_id, name, slug, order)

questions (
  id, subject_id, chapter_id,
  topic,                          -- fine-grained topic tag
  content_latex,                  -- LaTeX string e.g. "Find $\int x^2 dx$"
  options_latex[],                -- array of LaTeX option strings
  correct_index,                  -- 0-3 for MCQ
  question_type,                  -- 'mcq_single' | 'mcq_multi' | 'numeric' | 'integer'
  images[],                       -- array of image URLs (stored in R2/CDN)
  difficulty,                     -- 'easy' | 'medium' | 'hard'
  year,                           -- e.g. 2023
  exam_type,                      -- 'jee_mains' | 'jee_advanced'
  paper,                          -- 'paper1' | 'paper2' | null
  shift,                          -- 'morning' | 'afternoon' | null (Mains)
  marks_correct,                  -- +4 Mains, varies Advanced
  marks_wrong,                    -- -1 Mains, varies Advanced
  tags[],
  created_at
)
```

### AI Solutions (cached, never regenerated)
```sql
solutions (
  id, question_id,
  solution_latex,                 -- Gemini output with LaTeX + \ce{} preserved
  model,                          -- 'google/gemini-flash-1.5'
  generated_at
)
```

### Tests & Attempts
```sql
tests (id, title, type, config_json, created_at)
  -- type: 'chapter' | 'full_mock' | 'year_wise' | 'adaptive'
  -- config_json: { subject, chapter, year, exam_type, question_ids[] }

test_attempts (
  id, user_id, test_id,
  answers_json,                   -- { question_id: selected_index | null }
  score, max_score,
  time_taken_ms,
  completed_at
)
```

### Progress
```sql
topic_progress (
  id, user_id, subject_id, chapter_id, topic,
  attempts, correct, avg_time_ms, last_practiced_at
)
```

### AI Features
```sql
predictions (id, exam_cycle, subject, topics_json, confidence, reasoning, created_at)
study_plans (id, user_id, exam_date, daily_hours, plan_json, created_at)
```

## Math & Chemistry Rendering Stack

| Library | Purpose | Package |
|---|---|---|
| **KaTeX** | Math rendering (fast, no canvas) | `katex` |
| **react-katex** | React component wrapper | `react-katex` |
| **mhchem** | Chemical equations (`\ce{}`) | `katex/contrib/mhchem` |
| **next/image** | Inline question images with zoom | built-in |
| **remark-math + rehype-katex** | Markdown math in solution text | `remark-math`, `rehype-katex` |

### Rendering Rules
- All question content stored as raw LaTeX strings in DB
- `QuestionRenderer` parses `$$...$$` blocks and `$...$` inline math → KaTeX
- `\ce{...}` detected and routed through mhchem plugin
- Images referenced as `[img:url]` tokens in content, replaced with `next/image`
- `SolutionRenderer` uses remark-math pipeline for markdown+math solutions from Gemini
- **AI prompt always instructs Gemini:** "Use `$$...$$` for display math, `$...$` for inline math, `\ce{}` for chemical equations. Never use plain text for formulas."

## AI Integration Design

### Solution Generation (`/api/ai/solution`)
```
1. Check solutions table — return cached if exists
2. Fetch question: content_latex, options_latex[], correct_index, images[]
3. Build Gemini prompt:
   System: "You are a JEE expert tutor. Generate a clear step-by-step solution.
            Rules:
            - Use $$...$$ for display math, $...$ for inline math
            - Use \ce{} for all chemical equations and formulas
            - Describe any diagrams textually if images are referenced
            - End with: 'Answer: [correct option letter]'"
   User: "[question_latex]\nOptions:\nA) [opt1]\nB) [opt2]...\nCorrect: [index]"
4. Call Gemini Flash 1.5 via OpenRouter
5. Validate LaTeX well-formedness
6. Store in solutions table
7. Return solution_latex → SolutionRenderer
```

### Question Prediction (`/api/ai/predict`)
- Aggregates question frequency by topic+year from DB
- Sends trend data to Claude Sonnet
- Returns ranked topic predictions with confidence %

### Adaptive Test (`/api/ai/adaptive`)
- Queries topic_progress for user weaknesses (accuracy < 60%)
- Fetches PYQs from those topics weighted by weakness
- No AI call needed — pure DB query logic

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
