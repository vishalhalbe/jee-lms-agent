import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Atom, FlaskConical, Sigma, BookOpen } from "lucide-react"
import { getSubjectBySlug } from "@/lib/dal/subjects"
import { getChaptersBySubject } from "@/lib/dal/chapters"
import { ChapterRow } from "@/components/features/subjects/ChapterRow"

const ICON_MAP: Record<string, React.ElementType> = {
  atom: Atom,
  "flask-conical": FlaskConical,
  sigma: Sigma,
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const subject = await getSubjectBySlug(slug)
  return { title: subject?.name ?? "Subject" }
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [subject, chapters] = await Promise.all([
    getSubjectBySlug(slug),
    getChaptersBySubject(slug),
  ])

  if (!subject) notFound()

  const Icon = ICON_MAP[subject.icon ?? ""] ?? BookOpen
  const color = subject.color ?? "#f97316"

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/subjects"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        All Subjects
      </Link>

      {/* Subject header card */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden glass border border-white/[0.08]"
      >
        <div
          className="absolute -top-12 -right-12 size-48 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-4">
          <div
            className="size-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}
          >
            <Icon className="size-7" style={{ color }} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{subject.name}</h1>
            <p className="text-white/40 text-sm mt-0.5">
              {subject.chapterCount} chapters · {subject.questionCount.toLocaleString()} PYQs
            </p>
          </div>
        </div>
      </div>

      {/* Chapter list */}
      <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            Chapters
          </h2>
        </div>
        <div className="p-2 flex flex-col gap-0.5">
          {chapters.map((chapter) => (
            <ChapterRow key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>
    </div>
  )
}
