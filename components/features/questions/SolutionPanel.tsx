"use client"

import { useState, useEffect, useRef } from "react"
import { Sparkles, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { LatexRenderer } from "./LatexRenderer"

type Status = "idle" | "loading" | "streaming" | "done" | "error"

interface SolutionPanelProps {
  questionId: number
  questionContent: string
  revealed: boolean
}

export function SolutionPanel({ questionId, questionContent, revealed }: SolutionPanelProps) {
  const [status, setStatus] = useState<Status>("idle")
  const [solution, setSolution] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const abortRef = useRef<AbortController | null>(null)

  // Cancel any in-flight stream when component unmounts
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  async function fetchSolution() {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setStatus("loading")
    setSolution("")
    setErrorMsg("")

    try {
      const res = await fetch("/api/ai/solution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, questionContent }),
        signal: controller.signal,
      })

      if (!res.ok) {
        setErrorMsg("Failed to generate solution")
        setStatus("error")
        return
      }

      if (!res.body) {
        setErrorMsg("No response body received")
        setStatus("error")
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setSolution(accumulated)
          setStatus("streaming")
        }
        setStatus("done")
      } finally {
        reader.cancel()
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      setErrorMsg("Network error. Please try again.")
      setStatus("error")
    }
  }

  if (!revealed) return null

  return (
    <div className="px-5 pb-4">
      {status === "idle" && (
        <button
          onClick={fetchSolution}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg",
            "border border-white/[0.08] text-white/50 hover:text-orange-400 hover:border-orange-500/30",
            "transition-all duration-200"
          )}
        >
          <Sparkles className="size-3.5" aria-hidden="true" />
          Show AI Solution
        </button>
      )}

      {status === "loading" && (
        <div className="flex items-center gap-2 text-xs text-white/40 py-1.5">
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          Generating solution...
        </div>
      )}

      {(status === "streaming" || status === "done") && solution && (
        <div
          className={cn(
            "relative mt-1 rounded-xl border border-orange-500/20 bg-white/[0.03]",
            "pl-4 pr-4 py-4 border-l-2 border-l-orange-500/30"
          )}
          role="region"
          aria-label="AI Solution"
        >
          <div className="text-sm text-white/85 leading-relaxed">
            <LatexRenderer content={solution} className="solution-content" />
          </div>

          {status === "streaming" && (
            <span
              className="inline-block size-1.5 rounded-full bg-orange-400/60 animate-pulse ml-1"
              aria-label="Generating"
            />
          )}

          <p className="mt-3 text-right text-[10px] text-white/20 select-none">
            Powered by Gemini Flash
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-2 mt-1 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3">
          <AlertCircle className="size-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-red-300">{errorMsg}</p>
            <button
              onClick={fetchSolution}
              className="mt-2 flex items-center gap-1 text-[11px] text-white/40 hover:text-white/70 transition-colors"
            >
              <RefreshCw className="size-3" aria-hidden="true" />
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
