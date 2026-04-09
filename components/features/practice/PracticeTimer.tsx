"use client"

import { cn } from "@/lib/utils"

interface PracticeTimerProps {
  timeLeft: number
  totalTime: number
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

// Announce only at these thresholds to avoid per-second screen-reader noise.
const ANNOUNCE_THRESHOLDS = new Set([10 * 60, 5 * 60, 60])

export function PracticeTimer({ timeLeft, totalTime }: PracticeTimerProps) {
  const isWarning = timeLeft < 5 * 60
  const progressPercent = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0

  // Only update the live region text at meaningful thresholds.
  const announceText = ANNOUNCE_THRESHOLDS.has(timeLeft)
    ? `${Math.floor(timeLeft / 60) || timeLeft} ${timeLeft >= 60 ? "minutes" : "seconds"} remaining`
    : ""

  // SVG arc for circular progress
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  return (
    <div className="flex items-center gap-2">
      {/* Hidden live region — announces only at key thresholds */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announceText}
      </span>

      {/* Circular arc — decorative */}
      <div className="relative size-12 flex items-center justify-center" aria-hidden="true">
        <svg
          className="absolute inset-0 -rotate-90"
          width="48"
          height="48"
          viewBox="0 0 48 48"
        >
          <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="24" cy="24" r={radius} fill="none"
            stroke={isWarning ? "#ef4444" : "#f97316"}
            strokeWidth="3" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
      </div>

      {/* Visible time display */}
      <span
        className={cn(
          "font-mono text-lg font-bold tabular-nums tracking-tight",
          isWarning ? "text-red-400 animate-pulse" : "text-white"
        )}
        aria-label={`Time remaining: ${formatTime(timeLeft)}`}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  )
}
