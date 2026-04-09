"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AppError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error tracking service in production
    console.error("[AppError]", error.message)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="glass rounded-2xl border border-red-500/20 p-8 max-w-md w-full text-center space-y-4">
        <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="size-6 text-red-400" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Something went wrong</h2>
          <p className="text-white/40 text-sm mt-1">
            Failed to load this page. Please try again.
          </p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/20 text-sm font-medium hover:bg-orange-500/25 transition-all"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  )
}
