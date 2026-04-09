import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  color?: "orange" | "blue" | "emerald" | "pink"
  trend?: { value: number; label: string }
}

const colorMap = {
  orange: {
    icon: "text-orange-400",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.08)]",
    border: "border-orange-500/15",
    bg: "bg-orange-500/10",
  },
  blue: {
    icon: "text-blue-400",
    glow: "shadow-[0_0_30px_rgba(96,165,250,0.08)]",
    border: "border-blue-500/15",
    bg: "bg-blue-500/10",
  },
  emerald: {
    icon: "text-emerald-400",
    glow: "shadow-[0_0_30px_rgba(52,211,153,0.08)]",
    border: "border-emerald-500/15",
    bg: "bg-emerald-500/10",
  },
  pink: {
    icon: "text-pink-400",
    glow: "shadow-[0_0_30px_rgba(244,114,182,0.08)]",
    border: "border-pink-500/15",
    bg: "bg-pink-500/10",
  },
}

export function StatCard({ label, value, sub, icon: Icon, color = "orange", trend }: StatCardProps) {
  const c = colorMap[color]
  return (
    <GlassCard className={cn("p-5 space-y-3", c.glow, c.border)}>
      <div className="flex items-start justify-between">
        <div className={cn("p-2 rounded-lg", c.bg)}>
          <Icon className={cn("size-4", c.icon)} aria-hidden="true" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            trend.value >= 0 ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
          )}>
            {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-white/50 text-sm mt-0.5">{label}</div>
        {sub && <div className="text-white/30 text-xs mt-1">{sub}</div>}
      </div>
    </GlassCard>
  )
}
