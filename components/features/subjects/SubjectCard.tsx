import Link from "next/link"
import { Atom, FlaskConical, Sigma, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Subject } from "@/lib/dal/types"

const ICON_MAP: Record<string, React.ElementType> = {
  atom: Atom,
  "flask-conical": FlaskConical,
  sigma: Sigma,
}

interface SubjectCardProps {
  subject: Subject
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const Icon = ICON_MAP[subject.icon ?? ""] ?? BookOpen
  const color = subject.color ?? "#f97316"

  return (
    <Link
      href={`/subjects/${subject.slug}`}
      className="group relative flex flex-col gap-5 p-6 rounded-2xl glass border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.06] transition-all duration-300 overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-8 -right-8 size-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className="relative size-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}
      >
        <Icon className="size-6" style={{ color }} aria-hidden="true" />
      </div>

      {/* Name */}
      <div className="relative space-y-1">
        <h2 className="text-lg font-bold text-white group-hover:text-white/90 transition-colors">
          {subject.name}
        </h2>
        <p className="text-sm text-white/40">
          {subject.chapterCount} chapters
        </p>
      </div>

      {/* Stats row */}
      <div className="relative flex items-center gap-3 mt-auto">
        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: "28%",
              backgroundColor: color,
            }}
          />
        </div>
        <span className="text-xs text-white/30 tabular-nums shrink-0">
          {subject.questionCount.toLocaleString()} PYQs
        </span>
      </div>
    </Link>
  )
}
