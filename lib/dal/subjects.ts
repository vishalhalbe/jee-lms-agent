import "server-only"
import type { Subject } from "./types"

const USE_MOCK = process.env.USE_MOCK_DATA === "true"

export async function getSubjects(): Promise<Subject[]> {
  if (USE_MOCK) {
    const { MOCK_SUBJECTS } = await import("@/lib/mock/subjects.mock")
    return MOCK_SUBJECTS
  }

  const { db } = await import("@/lib/db")
  const { subjects } = await import("@/lib/db/schema")
  const { sql } = await import("drizzle-orm")

  return db.select({
    id: subjects.id,
    name: subjects.name,
    slug: subjects.slug,
    icon: subjects.icon,
    color: subjects.color,
    chapterCount: sql<number>`(SELECT COUNT(*) FROM chapters WHERE chapters.subject_id = ${subjects.id})`,
    questionCount: sql<number>`(SELECT COUNT(*) FROM questions WHERE questions.subject_id = ${subjects.id})`,
  }).from(subjects)
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  if (USE_MOCK) {
    const { MOCK_SUBJECTS } = await import("@/lib/mock/subjects.mock")
    return MOCK_SUBJECTS.find((s) => s.slug === slug) ?? null
  }

  const { db } = await import("@/lib/db")
  const { subjects } = await import("@/lib/db/schema")
  const { eq, sql } = await import("drizzle-orm")

  const [row] = await db.select({
    id: subjects.id,
    name: subjects.name,
    slug: subjects.slug,
    icon: subjects.icon,
    color: subjects.color,
    chapterCount: sql<number>`(SELECT COUNT(*) FROM chapters WHERE chapters.subject_id = ${subjects.id})`,
    questionCount: sql<number>`(SELECT COUNT(*) FROM questions WHERE questions.subject_id = ${subjects.id})`,
  }).from(subjects).where(eq(subjects.slug, slug)).limit(1)

  return row ?? null
}
