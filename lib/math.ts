/**
 * Math & Chemistry rendering utilities
 * KaTeX for math, mhchem plugin for chemical equations
 * Used by QuestionRenderer and SolutionRenderer components
 */

// Token types for parsed content
export type ContentToken =
  | { type: "text"; value: string }
  | { type: "math_inline"; value: string }
  | { type: "math_display"; value: string }
  | { type: "image"; url: string; alt?: string }

/**
 * Parse a LaTeX content string into tokens.
 * Handles:
 *   - $$...$$ display math
 *   - $...$ inline math (also covers \ce{} inside)
 *   - [img:url] image tokens
 *   - Plain text
 */
export function parseLatexContent(content: string): ContentToken[] {
  const tokens: ContentToken[] = []
  // Match display math, inline math, or image tokens
  const pattern = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\[img:[^\]]+\])/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index)
      if (text) tokens.push({ type: "text", value: text })
    }

    const raw = match[0]

    if (raw.startsWith("$$")) {
      tokens.push({ type: "math_display", value: raw.slice(2, -2).trim() })
    } else if (raw.startsWith("$")) {
      tokens.push({ type: "math_inline", value: raw.slice(1, -1) })
    } else if (raw.startsWith("[img:")) {
      const url = raw.slice(5, -1)
      tokens.push({ type: "image", url })
    }

    lastIndex = pattern.lastIndex
  }

  // Remaining text
  if (lastIndex < content.length) {
    tokens.push({ type: "text", value: content.slice(lastIndex) })
  }

  return tokens
}

/**
 * KaTeX render options — shared config used by both inline and display renders.
 * mhchem is loaded via katex/contrib/mhchem (imported in components).
 */
export const katexOptions = {
  throwOnError: false,       // Render error placeholder instead of crashing
  strict: false,             // Allow \ce{} and other extensions
  trust: false,              // No \href or \url (security)
  macros: {
    "\\R": "\\mathbb{R}",
    "\\N": "\\mathbb{N}",
    "\\Z": "\\mathbb{Z}",
    "\\implies": "\\Rightarrow",
    "\\iff": "\\Leftrightarrow",
  },
} as const

/**
 * Strip LaTeX delimiters for plain-text fallback (accessibility, copy-paste).
 * $x^2$ → x^2
 */
export function stripLatexDelimiters(content: string): string {
  return content
    .replace(/\$\$([\s\S]+?)\$\$/g, "$1")
    .replace(/\$([\s\S]+?)\$/g, "$1")
}

/**
 * Validate that a LaTeX string has balanced braces.
 * Used to sanity-check Gemini solution output before caching.
 */
export function hasBalancedBraces(latex: string): boolean {
  let depth = 0
  for (const ch of latex) {
    if (ch === "{") depth++
    else if (ch === "}") depth--
    if (depth < 0) return false
  }
  return depth === 0
}

/**
 * Gemini solution system prompt — enforces LaTeX + mhchem formatting.
 * Used in lib/ai/solution.ts
 */
export const SOLUTION_SYSTEM_PROMPT = `You are an expert JEE (Joint Entrance Examination) tutor.
Generate a clear, step-by-step solution to the given question.

FORMATTING RULES (strictly follow):
- Use $$...$$ for display/block math equations
- Use $...$ for inline math expressions
- Use \\ce{} for ALL chemical formulas, equations, and reactions (e.g., \\ce{H2SO4}, \\ce{A -> B + C})
- Never write chemical formulas as plain text (e.g., never write H2SO4 — always \\ce{H2SO4})
- Never use plain text for any mathematical expression
- For diagrams or figures, describe them clearly in words
- End your solution with a line: **Answer: [option letter or numeric value]**

STRUCTURE:
1. Identify what is given and what is asked
2. State the relevant concept/formula
3. Show step-by-step working
4. State the final answer`
