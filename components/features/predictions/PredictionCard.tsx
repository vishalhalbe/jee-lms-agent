import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import type { Prediction } from "@/lib/dal/types"

interface PredictionCardProps {
  prediction: Prediction
}

const SUBJECT_COLORS: Record<string, string> = {
  Physics: "#3b82f6",
  Chemistry: "#10b981",
  Mathematics: "#ec4899",
}

function getSubjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] ?? "#f97316"
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const color = getSubjectColor(prediction.subject)

  return (
    <GlassCard
      className="flex flex-col overflow-hidden"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      {/* Card header */}
      <div className="px-5 pt-5 pb-3 border-b border-white/[0.06]">
        <h2 className="text-lg font-bold text-white">{prediction.subject}</h2>
        <p className="text-white/40 text-xs mt-0.5">{prediction.examCycle}</p>
      </div>

      {/* Topics list */}
      <div className="flex-1 px-5 py-4 space-y-5">
        {prediction.topics.map((t) => (
          <div key={t.topic} className="space-y-1.5">
            {/* Topic name + confidence badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white/80 leading-snug">
                {t.topic}
              </span>
              <span
                className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  color,
                  backgroundColor: `${color}18`,
                }}
              >
                {t.confidence}%
              </span>
            </div>

            {/* Confidence bar */}
            <div className="h-1.5 rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${t.confidence}%`,
                  backgroundColor: color,
                  opacity: 0.8,
                }}
              />
            </div>

            {/* Reasoning */}
            <p className="text-white/40 text-xs italic leading-relaxed">
              {t.reasoning}
            </p>
          </div>
        ))}
      </div>

      {/* Card footer */}
      <div
        className={cn(
          "px-5 py-3 border-t border-white/[0.06]",
          "flex items-center gap-1.5"
        )}
      >
        <span className="text-white/30 text-xs">
          {prediction.topics.length} predicted topics
        </span>
      </div>
    </GlassCard>
  )
}
