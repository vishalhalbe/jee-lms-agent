import "server-only"
import type { ChapterWithSubject } from "./types"

const USE_MOCK = process.env.USE_MOCK_DATA === "true"

export async function getChaptersBySubject(subjectSlug: string): Promise<ChapterWithSubject[]> {
  if (USE_MOCK) {
    const { MOCK_CHAPTERS } = await import("@/lib/mock/chapters.mock")
    return MOCK_CHAPTERS.filter((c) => c.subjectSlug === subjectSlug).sort(
      (a, b) => a.order - b.order
    )
  }

  const { db } = await import("@/lib/db")
  const { chapters, subjects } = await import("@/lib/db/schema")
  const { eq, sql } = await import("drizzle-orm")

  return db
    .select({
      id: chapters.id,
      subjectId: chapters.subjectId,
      name: chapters.name,
      slug: chapters.slug,
      order: chapters.order,
      questionCount: sql<number>`(SELECT COUNT(*) FROM questions WHERE questions.chapter_id = ${chapters.id})`,
      subjectName: subjects.name,
      subjectSlug: subjects.slug,
      subjectColor: subjects.color,
    })
    .from(chapters)
    .innerJoin(subjects, eq(chapters.subjectId, subjects.id))
    .where(eq(subjects.slug, subjectSlug))
    .orderBy(chapters.order)
}

export async function getChapter(
  subjectSlug: string,
  chapterSlug: string
): Promise<ChapterWithSubject | null> {
  if (USE_MOCK) {
    const { MOCK_CHAPTERS } = await import("@/lib/mock/chapters.mock")
    return (
      MOCK_CHAPTERS.find(
        (c) => c.subjectSlug === subjectSlug && c.slug === chapterSlug
      ) ?? null
    )
  }

  const { db } = await import("@/lib/db")
  const { chapters, subjects } = await import("@/lib/db/schema")
  const { eq, and, sql } = await import("drizzle-orm")

  const [row] = await db
    .select({
      id: chapters.id,
      subjectId: chapters.subjectId,
      name: chapters.name,
      slug: chapters.slug,
      order: chapters.order,
      questionCount: sql<number>`(SELECT COUNT(*) FROM questions WHERE questions.chapter_id = ${chapters.id})`,
      subjectName: subjects.name,
      subjectSlug: subjects.slug,
      subjectColor: subjects.color,
    })
    .from(chapters)
    .innerJoin(subjects, eq(chapters.subjectId, subjects.id))
    .where(and(eq(subjects.slug, subjectSlug), eq(chapters.slug, chapterSlug)))
    .limit(1)

  return row ?? null
}
