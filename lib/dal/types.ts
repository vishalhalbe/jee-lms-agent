// DAL contract types — the single source of truth for what the UI receives.
// DB schema types and these types are intentionally decoupled.

// ─── Subject ─────────────────────────────────────────────────────────────────

export interface Subject {
  id: number
  name: string
  slug: string
  icon: string | null
  color: string | null
  chapterCount: number
  questionCount: number
}

// ─── Chapter ─────────────────────────────────────────────────────────────────

export interface Chapter {
  id: number
  subjectId: number
  name: string
  slug: string
  order: number
  questionCount: number
}

export interface ChapterWithSubject extends Chapter {
  subjectName: string
  subjectSlug: string
  subjectColor: string | null
}

// ─── Question ────────────────────────────────────────────────────────────────

export type QuestionType = "mcq_single" | "mcq_multi" | "numeric" | "integer"
export type Difficulty = "easy" | "medium" | "hard"
export type ExamType = "jee_mains" | "jee_advanced"

export interface Question {
  id: number
  subjectId: number
  chapterId: number
  topic: string | null
  contentLatex: string
  optionsLatex: string[]
  correctIndex: number | number[] | null
  correctNumeric: number | null
  questionType: QuestionType
  images: string[]
  difficulty: Difficulty
  year: number
  examType: ExamType
  marksCorrect: number
  marksWrong: number
  tags: string[]
}

export interface QuestionFilters {
  subjectSlug?: string
  chapterSlug?: string
  year?: number
  examType?: ExamType
  difficulty?: Difficulty
  questionType?: QuestionType
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface UserStats {
  questionsSolved: number
  accuracy: number
  dayStreak: number
  rank: number | null
}

export interface SubjectProgress {
  subjectId: number
  subjectName: string
  subjectSlug: string
  subjectColor: string | null
  attempted: number
  correct: number
  total: number
  percentage: number
}

// ─── Predictions ─────────────────────────────────────────────────────────────

export interface PredictionTopic {
  topic: string
  confidence: number
  reasoning: string
}

export interface Prediction {
  id: number
  examCycle: string
  subject: string
  topics: PredictionTopic[]
  createdAt: string
}
