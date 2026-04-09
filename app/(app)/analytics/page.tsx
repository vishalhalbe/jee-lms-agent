import type { Metadata } from "next"
import { currentUser } from "@clerk/nextjs/server"
import { Target, TrendingUp, Flame, Trophy } from "lucide-react"
import { getUserStats, getSubjectProgress } from "@/lib/dal/analytics"
import { StatCard } from "@/components/features/dashboard/StatCard"
import { GlassCard } from "@/components/ui/glass-card"

export const metadata: Metadata = {
  title: "Analytics",
}

export default async function AnalyticsPage() {
  const user = await currentUser()
  const clerkId = user?.id ?? ""

  const [stats, subjectProgress] = await Promise.all([
    getUserStats(clerkId),
    getSubjectProgress(clerkId),
  ])

  return (
    <div className="space-y-6 animate-glass-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-white/50 text-sm mt-1">
          Track your progress across all subjects
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Questions Solved"
          value={stats.questionsSolved}
          icon={Target}
          color="orange"
        />
        <StatCard
          label="Accuracy"
          value={`${stats.accuracy}%`}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          label="Day Streak"
          value={stats.dayStreak}
          icon={Flame}
          color="emerald"
        />
        <StatCard
          label="Rank"
          value={stats.rank !== null ? `#${stats.rank}` : "—"}
          icon={Trophy}
          color="pink"
        />
      </div>

      {/* Subject progress */}
      <GlassCard className="p-5">
        <h2 className="text-white font-semibold mb-5">Subject Progress</h2>
        <div className="space-y-5">
          {subjectProgress.map((sp) => (
            <div key={sp.subjectId} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: sp.subjectColor ?? "#f97316" }}
                    aria-hidden="true"
                  />
                  <span className="text-white/80 font-medium">
                    {sp.subjectName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/40 text-xs">
                  <span>
                    {sp.correct}/{sp.attempted} correct
                  </span>
                  <span className="text-white/60 font-semibold">
                    {sp.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${sp.percentage}%`,
                    backgroundColor: sp.subjectColor ?? "#f97316",
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent activity placeholder */}
      <GlassCard className="p-5">
        <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
        <div className="flex items-center justify-center py-10">
          <p className="text-white/30 text-sm">No recent activity yet</p>
        </div>
      </GlassCard>
    </div>
  )
}
