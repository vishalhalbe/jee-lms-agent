import "server-only"
import type { Question, QuestionFilters, PaginatedResult } from "./types"

const USE_MOCK = process.env.USE_MOCK_DATA === "true"
const DEFAULT_LIMIT = 20

export async function getQuestions(
  filters: QuestionFilters = {}
): Promise<PaginatedResult<Question>> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? DEFAULT_LIMIT

  if (USE_MOCK) {
    const { MOCK_QUESTIONS } = await import("@/lib/mock/questions.mock")

    let filtered = MOCK_QUESTIONS

    if (filters.subjectSlug) {
      const { MOCK_SUBJECTS } = await import("@/lib/mock/subjects.mock")
      const subject = MOCK_SUBJECTS.find((s) => s.slug === filters.subjectSlug)
      if (subject) filtered = filtered.filter((q) => q.subjectId === subject.id)
    }

    if (filters.chapterSlug) {
      const { MOCK_CHAPTERS } = await import("@/lib/mock/chapters.mock")
      const chapter = MOCK_CHAPTERS.find(
        (c) => c.slug === filters.chapterSlug && c.subjectSlug === filters.subjectSlug
      )
      if (chapter) filtered = filtered.filter((q) => q.chapterId === chapter.id)
    }

    if (filters.year) filtered = filtered.filter((q) => q.year === filters.year)
    if (filters.examType) filtered = filtered.filter((q) => q.examType === filters.examType)
    if (filters.difficulty) filtered = filtered.filter((q) => q.difficulty === filters.difficulty)
    if (filters.questionType) filtered = filtered.filter((q) => q.questionType === filters.questionType)

    const total = filtered.length
    const data = filtered.slice((page - 1) * limit, page * limit)

    return { data, total, page, limit, hasMore: page * limit < total }
  }

  // Real DB implementation — swap target
  const { db } = await import("@/lib/db")
  const { questions, chapters, subjects } = await import("@/lib/db/schema")
  const { eq, and, sql, count } = await import("drizzle-orm")

  const conditions = []

  if (filters.subjectSlug) {
    conditions.push(
      sql`${questions.subjectId} = (SELECT id FROM subjects WHERE slug = ${filters.subjectSlug})`
    )
  }
  if (filters.chapterSlug) {
    conditions.push(
      sql`${questions.chapterId} = (SELECT id FROM chapters WHERE slug = ${filters.chapterSlug})`
    )
  }
  if (filters.year) conditions.push(eq(questions.year, filters.year))
  if (filters.examType) conditions.push(eq(questions.examType, filters.examType))
  if (filters.difficulty) conditions.push(eq(questions.difficulty, filters.difficulty))
  if (filters.questionType) conditions.push(eq(questions.questionType, filters.questionType))

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [{ total }] = await db
    .select({ total: count() })
    .from(questions)
    .where(where)

  const rows = await db
    .select()
    .from(questions)
    .where(where)
    .orderBy(questions.year, questions.id)
    .limit(limit)
    .offset((page - 1) * limit)

  const data: Question[] = rows.map((r) => ({
    id: r.id,
    subjectId: r.subjectId,
    chapterId: r.chapterId,
    topic: r.topic,
    contentLatex: r.contentLatex,
    optionsLatex: (r.optionsLatex as string[]) ?? [],
    correctIndex: r.correctIndex as number | number[] | null,
    correctNumeric: r.correctNumeric,
    questionType: r.questionType,
    images: (r.images as string[]) ?? [],
    difficulty: r.difficulty,
    year: r.year,
    examType: r.examType,
    marksCorrect: r.marksCorrect,
    marksWrong: r.marksWrong,
    tags: (r.tags as string[]) ?? [],
  }))

  return { data, total, page, limit, hasMore: page * limit < total }
}

export async function getQuestionById(id: number): Promise<Question | null> {
  if (USE_MOCK) {
    const { MOCK_QUESTIONS } = await import("@/lib/mock/questions.mock")
    return MOCK_QUESTIONS.find((q) => q.id === id) ?? null
  }

  const { db } = await import("@/lib/db")
  const { questions } = await import("@/lib/db/schema")
  const { eq } = await import("drizzle-orm")

  const [row] = await db.select().from(questions).where(eq(questions.id, id)).limit(1)
  if (!row) return null

  return {
    id: row.id,
    subjectId: row.subjectId,
    chapterId: row.chapterId,
    topic: row.topic,
    contentLatex: row.contentLatex,
    optionsLatex: (row.optionsLatex as string[]) ?? [],
    correctIndex: row.correctIndex as number | number[] | null,
    correctNumeric: row.correctNumeric,
    questionType: row.questionType,
    images: (row.images as string[]) ?? [],
    difficulty: row.difficulty,
    year: row.year,
    examType: row.examType,
    marksCorrect: row.marksCorrect,
    marksWrong: row.marksWrong,
    tags: (row.tags as string[]) ?? [],
  }
}
