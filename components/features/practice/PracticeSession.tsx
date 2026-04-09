"use client"

import { useState, useEffect, useCallback } from "react"
import type { Question } from "@/lib/dal/types"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { LatexRenderer } from "@/components/features/questions/LatexRenderer"
import { PracticeTimer } from "./PracticeTimer"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  MinusCircle,
  RotateCcw,
  Clock,
  Target,
  Zap,
  BookOpen,
} from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_TIME_SECONDS = 30 * 60 // 30 minutes

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionState = "idle" | "active" | "submitted"

// questionId → selected option index (0-based)
type Answers = Record<number, number>

interface ScoreResult {
  totalMarks: number
  correct: number
  wrong: number
  unanswered: number
  accuracy: number
  timeTaken: number // seconds
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCorrectIndex(q: Question): number | null {
  if (Array.isArray(q.correctIndex)) return q.correctIndex[0] ?? null
  return q.correctIndex
}

function calcScore(questions: Question[], answers: Answers, timeTaken: number): ScoreResult {
  let totalMarks = 0
  let correct = 0
  let wrong = 0
  let unanswered = 0

  for (const q of questions) {
    const selected = answers[q.id]
    if (selected === undefined) {
      unanswered++
    } else {
      const ci = getCorrectIndex(q)
      if (ci !== null && selected === ci) {
        totalMarks += q.marksCorrect
        correct++
      } else {
        totalMarks += q.marksWrong
        wrong++
      }
    }
  }

  const attempted = correct + wrong
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0

  return { totalMarks, correct, wrong, unanswered, accuracy, timeTaken }
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}m ${s}s`
}

function getSubjectName(subjectId: number): string {
  const map: Record<number, string> = { 1: "Physics", 2: "Chemistry", 3: "Mathematics" }
  return map[subjectId] ?? "Unknown"
}

function getSubjectColor(subjectId: number): string {
  const map: Record<number, string> = {
    1: "text-blue-400",
    2: "text-emerald-400",
    3: "text-pink-400",
  }
  return map[subjectId] ?? "text-white/60"
}

const OPTION_LABELS = ["A", "B", "C", "D"] as const

// ─── Idle Screen ──────────────────────────────────────────────────────────────

interface IdleScreenProps {
  questions: Question[]
  onStart: () => void
}

function IdleScreen({ questions, onStart }: IdleScreenProps) {
  // Subject breakdown
  const subjectCounts: Record<number, number> = {}
  const diffCounts: Record<string, number> = {}

  for (const q of questions) {
    subjectCounts[q.subjectId] = (subjectCounts[q.subjectId] ?? 0) + 1
    diffCounts[q.difficulty] = (diffCounts[q.difficulty] ?? 0) + 1
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <GlassCard variant="elevated" className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 mb-2">
            <BookOpen className="size-8 text-orange-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-white">Practice Test</h1>
          <p className="text-white/50 text-sm">Mixed JEE questions · Timed session</p>
        </div>

        {/* Info row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Questions", value: `${questions.length}`, icon: Target },
            { label: "Duration", value: "30 min", icon: Clock },
            { label: "Marks", value: "+4 / −1", icon: Zap },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="glass rounded-xl p-3 text-center space-y-1"
            >
              <Icon className="size-4 text-orange-400 mx-auto" aria-hidden="true" />
              <p className="text-white font-semibold text-sm">{value}</p>
              <p className="text-white/40 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <p className="text-white/50 text-xs uppercase tracking-wider">Subject breakdown</p>
          <div className="space-y-2">
            {Object.entries(subjectCounts).map(([sid, count]) => (
              <div key={sid} className="flex justify-between items-center text-sm">
                <span className={cn("font-medium", getSubjectColor(Number(sid)))}>
                  {getSubjectName(Number(sid))}
                </span>
                <span className="text-white/50">{count} questions</span>
              </div>
            ))}
          </div>

          <p className="text-white/50 text-xs uppercase tracking-wider pt-1">Difficulty mix</p>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(diffCounts).map(([diff, count]) => (
              <span
                key={diff}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium glass",
                  diff === "easy" && "text-emerald-400 border-emerald-500/20",
                  diff === "medium" && "text-yellow-400 border-yellow-500/20",
                  diff === "hard" && "text-red-400 border-red-500/20"
                )}
              >
                {diff} × {count}
              </span>
            ))}
          </div>
        </div>

        <GlassButton
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onStart}
        >
          Start Test
        </GlassButton>
      </GlassCard>
    </div>
  )
}

// ─── Active Screen ────────────────────────────────────────────────────────────

interface ActiveScreenProps {
  questions: Question[]
  current: number
  answers: Answers
  timeLeft: number
  onSelectOption: (qId: number, optIdx: number) => void
  onNavigate: (idx: number) => void
  onSubmit: () => void
}

function ActiveScreen({
  questions,
  current,
  answers,
  timeLeft,
  onSelectOption,
  onNavigate,
  onSubmit,
}: ActiveScreenProps) {
  const question = questions[current]
  const selected = answers[question.id]
  const total = questions.length

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] gap-4">
      {/* Top bar */}
      <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
        <PracticeTimer timeLeft={timeLeft} totalTime={TOTAL_TIME_SECONDS} />

        <span className="text-white/60 text-sm font-medium tabular-nums">
          {current + 1} <span className="text-white/30">/</span> {total}
        </span>

        <GlassButton
          variant="destructive"
          size="sm"
          onClick={() => {
            const unanswered = questions.length - Object.keys(answers).length
            const msg = unanswered > 0
              ? `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Submit anyway?`
              : "Submit the test? This cannot be undone."
            if (window.confirm(msg)) onSubmit()
          }}
          aria-label="Submit test"
        >
          Submit Test
        </GlassButton>
      </div>

      {/* Question card */}
      <GlassCard variant="elevated" className="p-6 flex-1 space-y-5">
        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("text-xs font-medium", getSubjectColor(question.subjectId))}>
            {getSubjectName(question.subjectId)}
          </span>
          {question.topic && (
            <>
              <span className="text-white/20">·</span>
              <span className="text-white/40 text-xs">{question.topic}</span>
            </>
          )}
          <span className="text-white/20">·</span>
          <span
            className={cn(
              "text-xs font-medium",
              question.difficulty === "easy" && "text-emerald-400",
              question.difficulty === "medium" && "text-yellow-400",
              question.difficulty === "hard" && "text-red-400"
            )}
          >
            {question.difficulty}
          </span>
          <span className="text-white/20">·</span>
          <span className="text-white/30 text-xs">{question.year}</span>
        </div>

        {/* Content */}
        <LatexRenderer
          content={question.contentLatex}
          className="text-white text-base leading-relaxed"
          block
        />

        {/* Options */}
        <div className="space-y-3 pt-2" role="radiogroup" aria-label="Answer options">
          {question.optionsLatex.map((optLatex, idx) => {
            const isSelected = selected === idx
            return (
              <button
                key={idx}
                onClick={() => onSelectOption(question.id, idx)}
                aria-checked={isSelected}
                role="radio"
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border transition-all duration-200",
                  "flex items-start gap-3 group",
                  isSelected
                    ? "bg-orange-500/15 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                    : "glass border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                )}
              >
                <span
                  className={cn(
                    "flex-shrink-0 size-6 rounded-full border flex items-center justify-center",
                    "text-xs font-bold transition-colors",
                    isSelected
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-white/20 text-white/40 group-hover:border-white/40"
                  )}
                  aria-hidden="true"
                >
                  {OPTION_LABELS[idx]}
                </span>
                <LatexRenderer
                  content={optLatex}
                  className={cn(
                    "flex-1 text-sm leading-relaxed",
                    isSelected ? "text-white" : "text-white/70 group-hover:text-white/90"
                  )}
                />
              </button>
            )
          })}
        </div>
      </GlassCard>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 pb-2">
        <div className="glass rounded-2xl p-4 space-y-3">
          {/* Question pills */}
          <div className="flex flex-wrap gap-2 justify-center" aria-label="Question navigation">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined
              const isCurrent = idx === current
              return (
                <button
                  key={q.id}
                  onClick={() => onNavigate(idx)}
                  aria-label={`Question ${idx + 1}${isAnswered ? " — answered" : ""}`}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "size-8 rounded-full text-xs font-bold transition-all duration-200",
                    isCurrent
                      ? "bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.5)]"
                      : isAnswered
                      ? "bg-orange-500/20 border border-orange-500/40 text-orange-300"
                      : "glass border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                  )}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>

          {/* Prev / Next */}
          <div className="flex justify-between gap-3">
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(current - 1)}
              disabled={current === 0}
              aria-label="Previous question"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Previous
            </GlassButton>

            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(current + 1)}
              disabled={current === total - 1}
              aria-label="Next question"
            >
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Score Screen ─────────────────────────────────────────────────────────────

interface ScoreScreenProps {
  questions: Question[]
  answers: Answers
  result: ScoreResult
  onReset: () => void
}

function ScoreScreen({ questions, answers, result, onReset }: ScoreScreenProps) {
  const maxMarks = questions.reduce((sum, q) => sum + q.marksCorrect, 0)

  return (
    <div className="space-y-6 animate-glass-in pb-10">
      {/* Score card */}
      <GlassCard variant="elevated" className="p-8 text-center space-y-4">
        <p className="text-white/50 text-sm uppercase tracking-wider">Your Score</p>
        <div className="space-y-1">
          <p className="text-6xl font-extrabold text-white tabular-nums">
            {result.totalMarks}
          </p>
          <p className="text-white/40 text-sm">out of {maxMarks}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="glass rounded-xl p-3 space-y-1">
            <CheckCircle2 className="size-5 text-emerald-400 mx-auto" aria-hidden="true" />
            <p className="text-white font-bold text-lg tabular-nums">{result.correct}</p>
            <p className="text-white/40 text-xs">Correct</p>
          </div>
          <div className="glass rounded-xl p-3 space-y-1">
            <XCircle className="size-5 text-red-400 mx-auto" aria-hidden="true" />
            <p className="text-white font-bold text-lg tabular-nums">{result.wrong}</p>
            <p className="text-white/40 text-xs">Wrong</p>
          </div>
          <div className="glass rounded-xl p-3 space-y-1">
            <MinusCircle className="size-5 text-white/30 mx-auto" aria-hidden="true" />
            <p className="text-white font-bold text-lg tabular-nums">{result.unanswered}</p>
            <p className="text-white/40 text-xs">Skipped</p>
          </div>
        </div>

        {/* Accuracy + time */}
        <div className="flex justify-center gap-6 pt-1 text-sm">
          <span className="text-white/60">
            Accuracy{" "}
            <span className="font-semibold text-white">{result.accuracy}%</span>
          </span>
          <span className="text-white/30">|</span>
          <span className="text-white/60">
            Time{" "}
            <span className="font-semibold text-white">
              {formatDuration(result.timeTaken)}
            </span>
          </span>
        </div>
      </GlassCard>

      {/* Per-question results */}
      <div className="space-y-3">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider px-1">
          Question Review
        </h2>
        {questions.map((q, idx) => {
          const userAnswer = answers[q.id]
          const ci = getCorrectIndex(q)
          const isCorrect = userAnswer !== undefined && ci !== null && userAnswer === ci
          const isWrong = userAnswer !== undefined && !isCorrect
          const isSkipped = userAnswer === undefined

          return (
            <GlassCard key={q.id} className="p-4 space-y-3">
              {/* Header row */}
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex-shrink-0 size-6 rounded-full flex items-center justify-center text-xs font-bold",
                    isCorrect && "bg-emerald-500/20 text-emerald-400",
                    isWrong && "bg-red-500/20 text-red-400",
                    isSkipped && "bg-white/[0.06] text-white/30"
                  )}
                  aria-hidden="true"
                >
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <LatexRenderer
                    content={q.contentLatex.slice(0, 120) + (q.contentLatex.length > 120 ? "…" : "")}
                    className="text-white/80 text-sm leading-relaxed"
                  />
                </div>
                <span
                  className={cn(
                    "flex-shrink-0 text-xs font-bold",
                    isCorrect && "text-emerald-400",
                    isWrong && "text-red-400",
                    isSkipped && "text-white/30"
                  )}
                >
                  {isCorrect && `+${q.marksCorrect}`}
                  {isWrong && `${q.marksWrong}`}
                  {isSkipped && "0"}
                </span>
              </div>

              {/* Answer comparison */}
              {!isSkipped && (
                <div className="flex gap-4 text-xs pl-9">
                  <span className="text-white/40">
                    Your answer:{" "}
                    <span
                      className={cn(
                        "font-semibold",
                        isCorrect ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {userAnswer !== undefined ? OPTION_LABELS[userAnswer] : "—"}
                    </span>
                  </span>
                  {isWrong && ci !== null && (
                    <span className="text-white/40">
                      Correct:{" "}
                      <span className="font-semibold text-emerald-400">
                        {OPTION_LABELS[ci]}
                      </span>
                    </span>
                  )}
                </div>
              )}

              {/* Option text for wrong / correct */}
              {!isSkipped && ci !== null && q.optionsLatex[ci] && (
                <div className="pl-9">
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-xs",
                      isCorrect ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-500/10 border border-emerald-500/20"
                    )}
                  >
                    <span className="text-emerald-400/60 mr-1">Correct option:</span>
                    <LatexRenderer
                      content={q.optionsLatex[ci]}
                      className="inline text-emerald-300 text-xs"
                    />
                  </div>
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>

      {/* Practice Again */}
      <div className="flex justify-center pt-2">
        <GlassButton variant="primary" size="lg" onClick={onReset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Practice Again
        </GlassButton>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface PracticeSessionProps {
  questions: Question[]
}

export function PracticeSession({ questions }: PracticeSessionProps) {
  const [state, setState] = useState<SessionState>("idle")
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [result, setResult] = useState<ScoreResult | null>(null)

  // Timer effect
  useEffect(() => {
    if (state !== "active") return
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [state])

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (state === "active" && timeLeft === 0) {
      handleSubmit()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, state])

  const handleStart = useCallback(() => {
    setTimeLeft(TOTAL_TIME_SECONDS)
    setAnswers({})
    setCurrent(0)
    setStartTime(Date.now())
    setState("active")
  }, [])

  const handleSubmit = useCallback(() => {
    const timeTaken = startTime
      ? Math.round((Date.now() - startTime) / 1000)
      : TOTAL_TIME_SECONDS - timeLeft
    const score = calcScore(questions, answers, timeTaken)
    setResult(score)
    setState("submitted")
  }, [questions, answers, startTime, timeLeft])

  const handleSelectOption = useCallback((qId: number, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }))
  }, [])

  const handleNavigate = useCallback((idx: number) => {
    setCurrent(Math.max(0, Math.min(questions.length - 1, idx)))
  }, [questions.length])

  const handleReset = useCallback(() => {
    setAnswers({})
    setCurrent(0)
    setResult(null)
    setStartTime(null)
    setTimeLeft(TOTAL_TIME_SECONDS)
    setState("idle")
  }, [])

  if (state === "idle") {
    return <IdleScreen questions={questions} onStart={handleStart} />
  }

  if (state === "submitted" && result) {
    return (
      <ScoreScreen
        questions={questions}
        answers={answers}
        result={result}
        onReset={handleReset}
      />
    )
  }

  return (
    <ActiveScreen
      questions={questions}
      current={current}
      answers={answers}
      timeLeft={timeLeft}
      onSelectOption={handleSelectOption}
      onNavigate={handleNavigate}
      onSubmit={handleSubmit}
    />
  )
}
