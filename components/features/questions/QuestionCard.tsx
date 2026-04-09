"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { LatexRenderer } from "./LatexRenderer"
import { SolutionPanel } from "./SolutionPanel"
import type { Question } from "@/lib/dal/types"

const DIFFICULTY_STYLE = {
  easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  hard: "text-red-400 bg-red-400/10 border-red-400/20",
}

const OPTION_LABELS = ["A", "B", "C", "D"]

interface QuestionCardProps {
  question: Question
  index: number
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const correctIndex =
    typeof question.correctIndex === "number" ? question.correctIndex : null

  const isCorrect = selected !== null && selected === correctIndex
  const isWrong = selected !== null && selected !== correctIndex

  function handleSelect(i: number) {
    if (revealed) return
    setSelected(i)
  }

  return (
    <article className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="text-xs font-bold text-white/30 tabular-nums">#{index + 1}</span>
        <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full border", DIFFICULTY_STYLE[question.difficulty])}>
          {question.difficulty}
        </span>
        <span className="text-[11px] text-white/30">
          {question.examType === "jee_mains" ? "JEE Mains" : "JEE Advanced"} {question.year}
        </span>
        {question.topic && (
          <span className="ml-auto text-[11px] text-white/25 hidden sm:block truncate max-w-[160px]">
            {question.topic}
          </span>
        )}
      </div>

      {/* Question content */}
      <div className="px-5 pt-4 pb-3">
        <LatexRenderer
          content={question.contentLatex}
          className="text-sm text-white/90 leading-relaxed question-content"
        />
      </div>

      {/* Options */}
      {question.optionsLatex.length > 0 && (
        <div className="px-5 pb-4 space-y-2">
          {question.optionsLatex.map((opt, i) => {
            const isSelected = selected === i
            const showCorrect = revealed && i === correctIndex
            const showWrong = revealed && isSelected && i !== correctIndex

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className={cn(
                  "w-full flex items-start gap-3 px-3.5 py-2.5 rounded-xl border text-left text-sm transition-all duration-200",
                  !isSelected && !revealed && "border-white/[0.08] text-white/70 hover:border-white/[0.18] hover:text-white hover:bg-white/[0.04]",
                  isSelected && !revealed && "border-orange-500/40 bg-orange-500/[0.08] text-white",
                  showCorrect && "border-emerald-500/50 bg-emerald-500/[0.08] text-emerald-300",
                  showWrong && "border-red-500/40 bg-red-500/[0.06] text-red-300",
                  !isSelected && !showCorrect && revealed && "border-white/[0.04] text-white/30 opacity-50"
                )}
              >
                <span className={cn(
                  "shrink-0 size-5 rounded-md flex items-center justify-center text-[11px] font-bold mt-0.5",
                  showCorrect ? "bg-emerald-500/20 text-emerald-400" :
                  showWrong ? "bg-red-500/20 text-red-400" :
                  isSelected ? "bg-orange-500/20 text-orange-400" :
                  "bg-white/[0.06] text-white/40"
                )}>
                  {OPTION_LABELS[i]}
                </span>
                <LatexRenderer content={opt} className="flex-1 leading-snug" />
              </button>
            )
          })}
        </div>
      )}

      {/* Action row */}
      <div className="flex items-center gap-3 px-5 py-3 border-t border-white/[0.06] bg-white/[0.02]">
        {selected !== null && !revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="text-xs font-medium text-orange-400 hover:text-orange-300 transition-colors"
          >
            Check answer
          </button>
        )}
        {revealed && (
          <span className={cn("text-xs font-medium", isCorrect ? "text-emerald-400" : "text-red-400")}>
            {isCorrect ? "Correct! +" + question.marksCorrect : `Wrong · ${question.marksWrong}`}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] text-white/20">
            +{question.marksCorrect} / {question.marksWrong}
          </span>
        </div>
      </div>

      {/* AI Solution panel — only visible after answer is revealed */}
      <SolutionPanel
        questionId={question.id}
        questionContent={question.contentLatex}
        revealed={revealed}
      />
    </article>
  )
}
