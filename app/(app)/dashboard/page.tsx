import { currentUser } from "@clerk/nextjs/server"
import { StatCard } from "@/components/features/dashboard/StatCard"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import {
  BookOpen,
  Target,
  Flame,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export default async function DashboardPage() {
  const user = await currentUser()
  const firstName = user?.firstName ?? "Student"

  return (
    <div className="space-y-6 animate-glass-in">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Ready to crack JEE today?
          </p>
        </div>
        <GlassButton variant="primary" size="sm">
          Start Practice
          <ArrowRight className="size-4" />
        </GlassButton>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Questions Solved"
          value="0"
          sub="Start practicing!"
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          label="Accuracy"
          value="—"
          sub="No attempts yet"
          icon={Target}
          color="emerald"
        />
        <StatCard
          label="Day Streak"
          value="0"
          sub="Practice daily"
          icon={Flame}
          color="orange"
        />
        <StatCard
          label="Rank"
          value="—"
          sub="Complete tests to rank"
          icon={Trophy}
          color="pink"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard variant="accent" glow className="p-5 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-orange-500/15">
            <Sparkles className="size-5 text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold">AI Predictions</h3>
            <p className="text-white/50 text-sm mt-1">
              See which topics are most likely to appear in the next JEE exam.
            </p>
            <GlassButton variant="primary" size="sm" className="mt-3">
              View Predictions <ArrowRight className="size-3" />
            </GlassButton>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <BookOpen className="size-5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold">Browse PYQs</h3>
            <p className="text-white/50 text-sm mt-1">
              Practice with 15,000+ real JEE questions from 2010–2025.
            </p>
            <GlassButton variant="ghost" size="sm" className="mt-3">
              Browse Questions <ArrowRight className="size-3" />
            </GlassButton>
          </div>
        </GlassCard>
      </div>

      {/* Subject progress placeholder */}
      <GlassCard className="p-5">
        <h2 className="text-white font-semibold mb-4">Subject Progress</h2>
        <div className="space-y-4">
          {[
            { name: "Physics", color: "bg-blue-400", pct: 0 },
            { name: "Chemistry", color: "bg-emerald-400", pct: 0 },
            { name: "Mathematics", color: "bg-pink-400", pct: 0 },
          ].map(({ name, color, pct }) => (
            <div key={name} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">{name}</span>
                <span className="text-white/40">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06]">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
