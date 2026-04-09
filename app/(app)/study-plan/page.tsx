import { CalendarDays } from "lucide-react"

export const metadata = { title: "Study Plan" }

export default function StudyPlanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Study Plan</h1>
        <p className="text-white/40 text-sm mt-1">AI-generated personalised study schedule</p>
      </div>

      <div className="glass rounded-2xl border border-white/[0.08] p-12 flex flex-col items-center gap-4 text-center">
        <div className="size-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
          <CalendarDays className="size-7 text-orange-400" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Coming soon</h2>
          <p className="text-white/40 text-sm mt-1 max-w-xs">
            Your personalised AI study plan — daily targets, revision schedules, and weak-area focus — will be available here.
          </p>
        </div>
      </div>
    </div>
  )
}
