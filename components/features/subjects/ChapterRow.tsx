import Link from "next/link"
import { ChevronRight, FileQuestion } from "lucide-react"
import type { ChapterWithSubject } from "@/lib/dal/types"

interface ChapterRowProps {
  chapter: ChapterWithSubject
}

export function ChapterRow({ chapter }: ChapterRowProps) {
  const color = chapter.subjectColor ?? "#f97316"
  const href = `/subjects/${chapter.subjectSlug}/${chapter.slug}`

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all duration-200"
    >
      {/* Order badge */}
      <span
        className="shrink-0 size-8 rounded-lg flex items-center justify-center text-xs font-bold tabular-nums"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {chapter.order}
      </span>

      {/* Name */}
      <span className="flex-1 text-sm font-medium text-white/80 group-hover:text-white transition-colors">
        {chapter.name}
      </span>

      {/* Question count */}
      <span className="flex items-center gap-1 text-xs text-white/30 shrink-0">
        <FileQuestion className="size-3.5" aria-hidden="true" />
        {chapter.questionCount}
      </span>

      <ChevronRight className="size-4 text-white/20 group-hover:text-white/40 transition-colors shrink-0" aria-hidden="true" />
    </Link>
  )
}
