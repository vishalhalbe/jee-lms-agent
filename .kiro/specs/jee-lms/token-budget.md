# Token & Model Budget Plan

## Model Selection Strategy

| Model | Use Case | Cost Profile |
|---|---|---|
| **claude-sonnet-4-6** (via OpenRouter) | Main coding, orchestration, complex logic | Mid |
| **claude-haiku-4-5** (via OpenRouter) | Simple tasks, boilerplate, repetitive code | Low |
| **deepseek/deepseek-coder** (via OpenRouter) | Bulk code generation, seed data, SQL | Very Low |
| **google/gemini-flash-1.5** (via OpenRouter) | Long context reads, doc analysis | Very Low |

---

## Per-Phase Token Budget

### Phase 0 — Foundation
**Complexity:** Low — config files, boilerplate
**Tasks:** 9 tasks (utils, db client, schema, drizzle config, middleware, AI client, CSS)
**Strategy:** Single session, Sonnet for schema design, Haiku for boilerplate

| Task | Model | Est. Tokens (in+out) |
|---|---|---|
| lib/utils.ts | Haiku | ~500 |
| lib/db/index.ts | Haiku | ~800 |
| lib/db/schema.ts | Sonnet | ~4,000 |
| drizzle.config.ts | Haiku | ~500 |
| middleware.ts | Sonnet | ~1,500 |
| lib/ai/client.ts | Haiku | ~800 |
| globals.css | Sonnet | ~3,000 |
| drizzle migrate | Haiku | ~500 |
| **Phase 0 Total** | | **~11,600** |

---

### Phase 1 — Auth + App Shell
**Complexity:** Medium — 10 files, glassmorphism UI, Clerk integration
**Strategy:** Sonnet for layout/UI components, Haiku for simple page shells

| Task | Model | Est. Tokens |
|---|---|---|
| Auth pages (sign-in, sign-up) | Haiku | ~2,000 |
| Auth layout | Haiku | ~1,000 |
| Clerk webhook route | Sonnet | ~2,500 |
| Sidebar (glass, nav) | Sonnet | ~5,000 |
| TopNav (glass, avatar) | Sonnet | ~3,000 |
| App layout shell | Sonnet | ~2,000 |
| Dashboard page | Sonnet | ~4,000 |
| Root layout update | Haiku | ~1,500 |
| Landing page (marketing) | Sonnet | ~6,000 |
| **Phase 1 Total** | | **~27,000** |

---

### Phase 2 — Course & Content System
**Complexity:** Medium-High — DB queries, seed data, CMS
**Strategy:** Sonnet for UI+queries, DeepSeek for bulk seed data generation

| Task | Model | Est. Tokens |
|---|---|---|
| Courses page (subject grid) | Sonnet | ~4,000 |
| Subject page (chapter list) | Sonnet | ~3,000 |
| Chapter page (lesson viewer) | Sonnet | ~4,000 |
| API route courses | Haiku | ~1,500 |
| Seed script (subjects+chapters) | DeepSeek | ~8,000 |
| Question bank seed (150 Qs) | DeepSeek | ~20,000 |
| Admin CMS pages | Sonnet | ~8,000 |
| **Phase 2 Total** | | **~48,500** |

---

### Phase 3 — Practice Tests
**Complexity:** High — complex state machine, grading logic, timer UI
**Strategy:** Sonnet throughout, Haiku for results page, Vitest via Sonnet

| Task | Model | Est. Tokens |
|---|---|---|
| Test picker page | Haiku | ~2,000 |
| Test runner UI (timer, nav) | Sonnet | ~8,000 |
| Results page | Sonnet | ~5,000 |
| API: generate test | Sonnet | ~4,000 |
| API: submit + grade | Sonnet | ~5,000 |
| Negative marking logic | Sonnet | ~2,000 |
| Vitest grading tests | Sonnet | ~4,000 |
| **Phase 3 Total** | | **~30,000** |

---

### Phase 4 — AI Question Prediction
**Complexity:** High — prompt engineering, DB aggregation, streaming
**Strategy:** Sonnet for prompt design + API route, Haiku for UI components

| Task | Model | Est. Tokens |
|---|---|---|
| lib/ai/predict.ts (prompt) | Sonnet | ~6,000 |
| API: /ai/predict route | Sonnet | ~4,000 |
| Predictions page | Sonnet | ~5,000 |
| PredictionCard component | Haiku | ~2,500 |
| Admin refresh endpoint | Haiku | ~1,500 |
| Integration tests | Sonnet | ~4,000 |
| **Phase 4 Total** | | **~23,000** |

---

### Phase 5 — Adaptive Engine + Analytics
**Complexity:** High — SQL aggregations, charts, percentile math
**Strategy:** Sonnet for analytics queries + charts, Gemini Flash for long context SQL analysis

| Task | Model | Est. Tokens |
|---|---|---|
| lib/ai/adaptive.ts | Sonnet | ~5,000 |
| API: /ai/adaptive route | Sonnet | ~3,000 |
| Analytics page | Sonnet | ~6,000 |
| ScoreChart component | Sonnet | ~4,000 |
| TopicHeatmap component | Sonnet | ~4,000 |
| API: /progress route | Haiku | ~2,000 |
| Percentile SQL query | Sonnet | ~3,000 |
| **Phase 5 Total** | | **~27,000** |

---

### Phase 6 — AI Study Plans
**Complexity:** Medium — streaming, calendar UI, prompt engineering
**Strategy:** Sonnet for streaming + prompt, Haiku for form/calendar UI

| Task | Model | Est. Tokens |
|---|---|---|
| lib/ai/study-plan.ts | Sonnet | ~5,000 |
| API: /ai/study-plan (streaming) | Sonnet | ~4,000 |
| Study plan page + form | Sonnet | ~5,000 |
| Calendar/schedule view | Sonnet | ~4,000 |
| DB persist plan | Haiku | ~1,500 |
| **Phase 6 Total** | | **~19,500** |

---

### Phase 7 — Billing & Polish
**Complexity:** Medium — Razorpay integration, E2E tests, SEO
**Strategy:** Sonnet for billing logic, Haiku for SEO/metadata, Sonnet for E2E

| Task | Model | Est. Tokens |
|---|---|---|
| Razorpay integration | Sonnet | ~6,000 |
| Feature gates | Sonnet | ~3,000 |
| Usage limits in APIs | Haiku | ~3,000 |
| SEO metadata + sitemap | Haiku | ~2,000 |
| Error boundaries + skeletons | Sonnet | ~5,000 |
| Accessibility fixes | Sonnet | ~3,000 |
| E2E tests (Playwright) | Sonnet | ~8,000 |
| **Phase 7 Total** | | **~30,000** |

---

## Summary

| Phase | Tasks | Model Mix | Est. Tokens | Priority |
|---|---|---|---|---|
| Phase 0 | 9 | 60% Haiku / 40% Sonnet | ~11,600 | CRITICAL |
| Phase 1 | 10 | 30% Haiku / 70% Sonnet | ~27,000 | HIGH |
| Phase 2 | 7 | 20% Haiku / 40% Sonnet / 40% DeepSeek | ~48,500 | HIGH |
| Phase 3 | 7 | 20% Haiku / 80% Sonnet | ~30,000 | HIGH |
| Phase 4 | 6 | 30% Haiku / 70% Sonnet | ~23,000 | HIGH |
| Phase 5 | 7 | 30% Haiku / 60% Sonnet / 10% Gemini | ~27,000 | MEDIUM |
| Phase 6 | 5 | 30% Haiku / 70% Sonnet | ~19,500 | MEDIUM |
| Phase 7 | 7 | 40% Haiku / 60% Sonnet | ~30,000 | LOW |
| **TOTAL** | **58** | | **~216,600** | |

---

## OpenRouter Model IDs

```env
# Use in lib/ai/client.ts
SONNET_MODEL=anthropic/claude-sonnet-4-5
HAIKU_MODEL=anthropic/claude-haiku-4-5
DEEPSEEK_MODEL=deepseek/deepseek-coder
GEMINI_MODEL=google/gemini-flash-1.5
```

## Rules

1. **Never use Sonnet for boilerplate** — use Haiku for simple files (<50 lines)
2. **Batch seed generation** — use DeepSeek for question bank (cheapest for long output)
3. **Context window discipline** — start new session per phase to avoid context bleed
4. **Streaming responses** — always stream AI responses to users (better UX + lower timeout risk)
5. **Cache aggressively** — DB-driven predictions cached in `predictions` table, not re-called per user
