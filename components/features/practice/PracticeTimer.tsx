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

export function PracticeTimer({ timeLeft, totalTime }: PracticeTimerProps) {
  const isWarning = timeLeft < 5 * 60
  const progressPercent = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0

  // SVG arc for circular progress
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  return (
    <div className="flex items-center gap-2">
      {/* Circular arc */}
      <div className="relative size-12 flex items-center justify-center">
        <svg
          className="absolute inset-0 -rotate-90"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="3"
          />
          {/* Progress */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke={isWarning ? "#ef4444" : "#f97316"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
      </div>

      {/* Time text */}
      <span
        className={cn(
          "font-mono text-lg font-bold tabular-nums tracking-tight",
          isWarning
            ? "text-red-400 animate-pulse"
            : "text-white"
        )}
        aria-label={`Time remaining: ${formatTime(timeLeft)}`}
        aria-live="polite"
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  )
}
