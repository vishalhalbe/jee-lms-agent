import {
  pgTable,
  text,
  integer,
  smallint,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  serial,
  real,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ─── Enums ────────────────────────────────────────────────────────────────────

export const examTypeEnum = pgEnum("exam_type", ["jee_mains", "jee_advanced"])
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"])
export const questionTypeEnum = pgEnum("question_type", [
  "mcq_single",
  "mcq_multi",
  "numeric",
  "integer",
])
export const testTypeEnum = pgEnum("test_type", [
  "chapter",
  "full_mock",
  "year_wise",
  "adaptive",
])
export const paperEnum = pgEnum("paper", ["paper1", "paper2"])
export const shiftEnum = pgEnum("shift", ["morning", "afternoon"])
export const userLevelEnum = pgEnum("user_level", ["beginner", "intermediate", "advanced"])

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  targetYear: smallint("target_year"),
  level: userLevelEnum("level").default("beginner"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Subjects ────────────────────────────────────────────────────────────────

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  color: text("color"), // hex or tailwind token
})

// ─── Chapters ────────────────────────────────────────────────────────────────

export const chapters = pgTable(
  "chapters",
  {
    id: serial("id").primaryKey(),
    subjectId: integer("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    order: smallint("order").notNull(),
  },
  (t) => [
    index("chapters_subject_order_idx").on(t.subjectId, t.order),
    uniqueIndex("chapters_subject_slug_idx").on(t.subjectId, t.slug),
  ]
)

// ─── Questions (PYQ Bank) ────────────────────────────────────────────────────

export const questions = pgTable(
  "questions",
  {
    id: serial("id").primaryKey(),
    subjectId: integer("subject_id")
      .notNull()
      .references(() => subjects.id),
    chapterId: integer("chapter_id")
      .notNull()
      .references(() => chapters.id),
    topic: text("topic"),
    // LaTeX content — e.g. "Find $\\int x^2 dx$"
    contentLatex: text("content_latex").notNull(),
    // Array of LaTeX option strings
    optionsLatex: jsonb("options_latex").$type<string[]>().default([]),
    // 0-indexed correct answer (for MCQ single); array for MCQ multi
    correctIndex: jsonb("correct_index").$type<number | number[]>(),
    // Numeric answer for integer/numeric type
    correctNumeric: real("correct_numeric"),
    questionType: questionTypeEnum("question_type").notNull().default("mcq_single"),
    // Array of image URLs
    images: jsonb("images").$type<string[]>().default([]),
    difficulty: difficultyEnum("difficulty").notNull().default("medium"),
    year: smallint("year").notNull(),
    examType: examTypeEnum("exam_type").notNull(),
    paper: paperEnum("paper"),
    shift: shiftEnum("shift"),
    marksCorrect: real("marks_correct").notNull().default(4),
    marksWrong: real("marks_wrong").notNull().default(-1),
    tags: jsonb("tags").$type<string[]>().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("questions_subject_idx").on(t.subjectId),
    index("questions_chapter_idx").on(t.chapterId),
    index("questions_year_exam_idx").on(t.year, t.examType),
  ]
)

// ─── AI Solutions (cached per question) ──────────────────────────────────────

export const solutions = pgTable("solutions", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .notNull()
    .unique()
    .references(() => questions.id, { onDelete: "cascade" }),
  // Gemini output — LaTeX + \ce{} preserved
  solutionLatex: text("solution_latex").notNull(),
  model: text("model").notNull().default("google/gemini-flash-1.5"),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
})

// ─── Tests ───────────────────────────────────────────────────────────────────

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: testTypeEnum("type").notNull(),
  // { subject?, chapter?, year?, examType?, questionIds: number[] }
  configJson: jsonb("config_json").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Test Attempts ───────────────────────────────────────────────────────────

export const testAttempts = pgTable(
  "test_attempts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    testId: integer("test_id")
      .notNull()
      .references(() => tests.id),
    // { [questionId]: selectedIndex | number | null }
    answersJson: jsonb("answers_json").notNull().default({}),
    score: real("score"),
    maxScore: real("max_score"),
    timeTakenMs: integer("time_taken_ms"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("attempts_user_idx").on(t.userId),
    index("attempts_test_idx").on(t.testId),
  ]
)

// ─── Topic Progress ───────────────────────────────────────────────────────────

export const topicProgress = pgTable(
  "topic_progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: integer("subject_id")
      .notNull()
      .references(() => subjects.id),
    chapterId: integer("chapter_id")
      .notNull()
      .references(() => chapters.id),
    topic: text("topic").notNull(),
    attempts: integer("attempts").notNull().default(0),
    correct: integer("correct").notNull().default(0),
    avgTimeMs: integer("avg_time_ms"),
    lastPracticedAt: timestamp("last_practiced_at"),
  },
  (t) => [
    uniqueIndex("progress_user_topic_idx").on(t.userId, t.chapterId, t.topic),
    index("progress_user_idx").on(t.userId),
  ]
)

// ─── AI Predictions ───────────────────────────────────────────────────────────

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  examCycle: text("exam_cycle").notNull(), // e.g. "JEE Mains 2026 Jan"
  subject: text("subject").notNull(),
  // [{ topic, confidence, reasoning }]
  topicsJson: jsonb("topics_json").$type<
    { topic: string; confidence: number; reasoning: string }[]
  >(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Study Plans ──────────────────────────────────────────────────────────────

export const studyPlans = pgTable("study_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  examDate: timestamp("exam_date").notNull(),
  dailyHours: smallint("daily_hours").notNull(),
  // { days: [{ date, tasks: [{ subject, chapter, topic, type }] }] }
  planJson: jsonb("plan_json").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Relations ────────────────────────────────────────────────────────────────

export const subjectsRelations = relations(subjects, ({ many }) => ({
  chapters: many(chapters),
  questions: many(questions),
}))

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  subject: one(subjects, { fields: [chapters.subjectId], references: [subjects.id] }),
  questions: many(questions),
}))

export const questionsRelations = relations(questions, ({ one }) => ({
  subject: one(subjects, { fields: [questions.subjectId], references: [subjects.id] }),
  chapter: one(chapters, { fields: [questions.chapterId], references: [chapters.id] }),
  solution: one(solutions, { fields: [questions.id], references: [solutions.questionId] }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  attempts: many(testAttempts),
  progress: many(topicProgress),
  studyPlans: many(studyPlans),
}))

export const testAttemptsRelations = relations(testAttempts, ({ one }) => ({
  user: one(users, { fields: [testAttempts.userId], references: [users.id] }),
  test: one(tests, { fields: [testAttempts.testId], references: [tests.id] }),
}))
