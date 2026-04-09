import type { Metadata } from "next"
import { getPredictions } from "@/lib/dal/predictions"
import { PredictionCard } from "@/components/features/predictions/PredictionCard"
import { GlassCard } from "@/components/ui/glass-card"
import { Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "AI Predictions",
}

export default async function PredictionsPage() {
  const predictions = await getPredictions()

  return (
    <div className="space-y-6 animate-glass-in">
      {/* Page header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white">AI Predictions</h1>
          {/* Disclaimer badge */}
          <GlassCard className="flex items-center gap-1.5 px-3 py-1 rounded-full border-orange-500/20">
            <Sparkles className="size-3 text-orange-400" aria-hidden="true" />
            <span className="text-orange-400 text-xs font-medium whitespace-nowrap">
              AI-powered · Based on 20 years of PYQ analysis
            </span>
          </GlassCard>
        </div>
        <p className="text-white/50 text-sm">
          Topics likely to appear in JEE Mains 2026 Jan · Updated Apr 2026
        </p>
      </div>

      {/* Prediction cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {predictions.map((prediction) => (
          <PredictionCard key={prediction.id} prediction={prediction} />
        ))}
      </div>
    </div>
  )
}
