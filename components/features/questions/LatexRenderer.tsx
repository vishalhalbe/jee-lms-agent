"use client"

// KaTeX + mhchem client component.
// Renders LaTeX ($...$, $$...$$) and chemistry (\ce{}) notation.

import { useEffect, useRef } from "react"
import katex from "katex"
import "katex/dist/contrib/mhchem.js"

interface LatexRendererProps {
  content: string
  className?: string
  block?: boolean
}

// Tokenise the content string into text segments and LaTeX/display-math segments.
function tokenise(content: string): { type: "text" | "inline" | "display"; value: string }[] {
  const tokens: { type: "text" | "inline" | "display"; value: string }[] = []
  // Match $$...$$ first, then $...$
  const re = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(content)) !== null) {
    if (m.index > last) {
      tokens.push({ type: "text", value: content.slice(last, m.index) })
    }
    const raw = m[0]
    if (raw.startsWith("$$")) {
      tokens.push({ type: "display", value: raw.slice(2, -2) })
    } else {
      tokens.push({ type: "inline", value: raw.slice(1, -1) })
    }
    last = m.index + raw.length
  }

  if (last < content.length) {
    tokens.push({ type: "text", value: content.slice(last) })
  }

  return tokens
}

// Escape plain-text segments before injecting into innerHTML to prevent XSS.
// KaTeX output is already safe; only the text tokens need escaping.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br/>")
}

function renderKatex(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      trust: false,
      strict: false,
    })
  } catch {
    return `<span class="text-red-400 text-xs">[math error]</span>`
  }
}

export function LatexRenderer({ content, className, block }: LatexRendererProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const tokens = tokenise(content)
    const html = tokens
      .map((t) => {
        if (t.type === "text") return escapeHtml(t.value)
        return renderKatex(t.value, t.type === "display")
      })
      .join("")
    ref.current.innerHTML = html
  }, [content])

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: block ? "block" : undefined }}
    />
  )
}
