import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] bg-mesh flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8 animate-glass-in">
        {/* Hero card */}
        <GlassCard variant="elevated" className="p-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-orange-500/30 text-orange-400 text-sm mb-2">
            <span className="size-2 rounded-full bg-orange-400 animate-pulse" />
            AI-Powered JEE Preparation
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Crack JEE with{" "}
            <span className="text-orange-400">AI Intelligence</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Practice with real PYQs, get AI-generated solutions, predict high-probability topics, and ace JEE Mains &amp; Advanced.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <GlassButton variant="primary" size="lg">
              Start Free →
            </GlassButton>
            <GlassButton variant="ghost" size="lg">
              View Demo
            </GlassButton>
          </div>
        </GlassCard>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="p-6 space-y-2">
            <div className="text-2xl">🎯</div>
            <h3 className="text-white font-semibold">PYQ Bank</h3>
            <p className="text-white/50 text-sm">15,000+ real JEE questions from 2010–2025 with AI solutions</p>
          </GlassCard>
          <GlassCard variant="accent" className="p-6 space-y-2" glow>
            <div className="text-2xl">🤖</div>
            <h3 className="text-white font-semibold">AI Predictions</h3>
            <p className="text-white/50 text-sm">Claude analyzes trends to predict high-probability topics</p>
          </GlassCard>
          <GlassCard className="p-6 space-y-2">
            <div className="text-2xl">📊</div>
            <h3 className="text-white font-semibold">Adaptive Tests</h3>
            <p className="text-white/50 text-sm">Tests that target your weak areas and adapt to your progress</p>
          </GlassCard>
        </div>
      </div>
    </main>
  )
}
