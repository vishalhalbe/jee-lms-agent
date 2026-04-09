import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getChapter } from "@/lib/dal/chapters"
import { getQuestions } from "@/lib/dal/questions"
import { QuestionCard } from "@/components/features/questions/QuestionCard"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>
}) {
  const { slug, chapter: chapterSlug } = await params
  const chapter = await getChapter(slug, chapterSlug)
  return { title: chapter?.name ?? "Chapter" }
}

export default async function ChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; chapter: string }>
  searchParams: Promise<{ year?: string; difficulty?: string; page?: string }>
}) {
  const { slug, chapter: chapterSlug } = await params
  const sp = await searchParams

  const [chapter, result] = await Promise.all([
    getChapter(slug, chapterSlug),
    getQuestions({
      subjectSlug: slug,
      chapterSlug,
      year: sp.year ? parseInt(sp.year) : undefined,
      difficulty: sp.difficulty as "easy" | "medium" | "hard" | undefined,
      page: sp.page ? parseInt(sp.page) : 1,
      limit: 15,
    }),
  ])

  if (!chapter) notFound()

  const color = chapter.subjectColor ?? "#f97316"

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/40">
        <Link href="/subjects" className="hover:text-white/70 transition-colors">Subjects</Link>
        <span>/</span>
        <Link href={`/subjects/${slug}`} className="hover:text-white/70 transition-colors">
          {chapter.subjectName}
        </Link>
        <span>/</span>
        <span className="text-white/60">{chapter.name}</span>
      </nav>

      {/* Chapter header */}
      <div className="relative rounded-2xl p-5 glass border border-white/[0.08] overflow-hidden">
        <div
          className="absolute -top-8 -right-8 size-36 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">{chapter.name}</h1>
              <p className="text-white/40 text-sm mt-1">
                {chapter.subjectName} · {result.total} questions
              </p>
            </div>
            <Link
              href={`/subjects/${slug}`}
              className="shrink-0 flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mt-1"
            >
              <ChevronLeft className="size-3.5" aria-hidden="true" />
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {(["easy", "medium", "hard"] as const).map((d) => (
          <Link
            key={d}
            href={`?difficulty=${d}`}
            className={
              sp.difficulty === d
                ? "text-xs px-3 py-1.5 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/25 font-medium"
                : "text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/40 border border-white/[0.08] hover:text-white/70 hover:bg-white/[0.07] transition-all"
            }
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </Link>
        ))}
        {sp.difficulty && (
          <Link
            href="?"
            className="text-xs px-3 py-1.5 rounded-lg text-white/30 hover:text-white/50 transition-colors"
          >
            Clear
          </Link>
        )}
      </div>

      {/* Question list */}
      {result.data.length === 0 ? (
        <div className="glass rounded-2xl border border-white/[0.08] p-12 text-center">
          <p className="text-white/30 text-sm">No questions match the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {result.data.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={(result.page - 1) * result.limit + i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {result.total > result.limit && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-white/30">
            Showing {(result.page - 1) * result.limit + 1}–
            {Math.min(result.page * result.limit, result.total)} of {result.total}
          </span>
          <div className="flex gap-2">
            {result.page > 1 && (
              <Link
                href={`?page=${result.page - 1}${sp.difficulty ? `&difficulty=${sp.difficulty}` : ""}`}
                className="px-4 py-2 text-sm glass rounded-xl border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                Previous
              </Link>
            )}
            {result.hasMore && (
              <Link
                href={`?page=${result.page + 1}${sp.difficulty ? `&difficulty=${sp.difficulty}` : ""}`}
                className="px-4 py-2 text-sm glass rounded-xl border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
