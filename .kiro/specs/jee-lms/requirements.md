# Requirements: JEE LMS — AI-Powered SaaS Platform

## Overview

A SaaS Learning Management System for JEE Mains and JEE Advanced preparation, powered by Claude AI. Students get AI-driven question prediction, adaptive practice tests, and personalized study plans.

---

## User Roles

| Role | Description |
|---|---|
| Student | Primary user — learns, practices, tracks progress |
| Admin | Manages content, users, subscriptions |

---

## Functional Requirements

### FR-1: Authentication & Onboarding
- FR-1.1: Sign up / sign in via Clerk (email, Google, phone OTP)
- FR-1.2: Onboarding wizard — collect target year, current level, weak subjects
- FR-1.3: Role-based access (student vs admin)
- FR-1.4: Protected routes via Clerk middleware

### FR-2: Course & Content System
- FR-2.1: Subjects: Physics, Chemistry, Mathematics
- FR-2.2: Chapters per subject (NCERT-aligned)
- FR-2.3: Lessons (text + video embed)
- FR-2.4: Question bank — tagged by subject, chapter, topic, difficulty, year
- FR-2.5: Admin CMS to manage content

### FR-3: Practice Tests
- FR-3.1: Chapter-wise tests
- FR-3.2: Full-length mock exams (JEE Mains pattern: 90 questions, 3 hours)
- FR-3.3: JEE Advanced mock (Paper 1 + Paper 2 pattern)
- FR-3.4: Auto-grading with detailed solution explanations
- FR-3.5: Negative marking (-1 for wrong, +4 for correct, 0 for skipped)

### FR-4: AI Question Prediction
- FR-4.1: Analyze past papers (2010–2025) for topic frequency trends
- FR-4.2: Predict high-probability topics/questions for next exam
- FR-4.3: Confidence score per prediction (%)
- FR-4.4: Explain reasoning behind each prediction
- FR-4.5: Refresh predictions after each new exam cycle

### FR-5: Adaptive Learning Engine
- FR-5.1: Track per-topic accuracy, speed, attempts
- FR-5.2: Identify weak areas automatically
- FR-5.3: Generate personalized practice sets targeting weak areas
- FR-5.4: Adjust difficulty dynamically based on performance

### FR-6: Progress Analytics
- FR-6.1: Dashboard — overall score, time spent, tests taken
- FR-6.2: Subject-wise and chapter-wise performance breakdown
- FR-6.3: Percentile ranking among all students
- FR-6.4: Time-series chart of score improvement
- FR-6.5: Comparative analysis: student vs JEE topper benchmark

### FR-7: AI Study Plans
- FR-7.1: Input: exam date, daily study hours, weak topics
- FR-7.2: Output: day-by-day study schedule
- FR-7.3: Dynamically revise plan based on progress
- FR-7.4: Reminders and milestone tracking

### FR-8: SaaS Billing
- FR-8.1: Free tier — limited tests, basic analytics
- FR-8.2: Pro tier — unlimited tests, AI features, full analytics
- FR-8.3: Subscription management (Razorpay or Stripe)

---

## Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Page load < 2s, API response < 500ms p95 |
| Security | No secrets in client bundle, parameterized DB queries, Clerk JWT validation |
| Scalability | Stateless API routes, connection pooling (Neon serverless) |
| Accessibility | WCAG 2.1 AA for all UI |
| Testing | 80%+ coverage on business logic |
| SEO | Static landing page, metadata per subject/chapter |
