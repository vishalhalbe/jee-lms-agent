// OpenRouter client — routes to Gemini, Claude, DeepSeek etc.
// Implements OpenAI-compatible API

export const MODELS = {
  // Solution generation — proven math/chemistry LaTeX formatting
  GEMINI_FLASH: "google/gemini-flash-1.5",
  // Complex reasoning — predictions, study plans
  SONNET: "anthropic/claude-sonnet-4-5",
  // Lightweight tasks
  HAIKU: "anthropic/claude-haiku-4-5",
} as const

export type ModelId = (typeof MODELS)[keyof typeof MODELS]

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface CompletionOptions {
  model: ModelId
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
}

const TIMEOUT_MS = 30_000
const MAX_RETRIES = 2

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://github.com/vishalhalbe/jee-lms-agent",
    "X-Title": "JEE LMS",
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export async function chat(options: CompletionOptions): Promise<string> {
  const url = `${process.env.OPENROUTER_BASE_URL}/chat/completions`
  const body = JSON.stringify({
    model: options.model,
    messages: options.messages,
    temperature: options.temperature ?? 0.3,
    max_tokens: options.maxTokens ?? 2048,
  })

  let lastError: unknown
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(url, { method: "POST", headers: getHeaders(), body }, TIMEOUT_MS)

      if (!res.ok) {
        const err = await res.text()
        throw new Error(`OpenRouter error ${res.status}: ${err}`)
      }

      const data: unknown = await res.json()
      if (
        typeof data !== "object" ||
        data === null ||
        !("choices" in data) ||
        !Array.isArray((data as { choices: unknown }).choices) ||
        (data as { choices: unknown[] }).choices.length === 0
      ) {
        throw new Error("OpenRouter: unexpected response shape")
      }
      const choice = (data as { choices: { message: { content: string } }[] }).choices[0]
      return choice.message.content
    } catch (err: unknown) {
      lastError = err
      // Don't retry on non-retryable errors (4xx except 429)
      if (err instanceof Error && err.message.match(/OpenRouter error [45]\d\d/) && !err.message.includes("429")) {
        break
      }
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
      }
    }
  }
  throw lastError
}

export async function chatStream(options: CompletionOptions): Promise<ReadableStream<Uint8Array>> {
  const url = `${process.env.OPENROUTER_BASE_URL}/chat/completions`
  const body = JSON.stringify({
    model: options.model,
    messages: options.messages,
    temperature: options.temperature ?? 0.3,
    max_tokens: options.maxTokens ?? 4096,
    stream: true,
  })

  const res = await fetchWithTimeout(url, { method: "POST", headers: getHeaders(), body }, TIMEOUT_MS)

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter stream error ${res.status}: ${err}`)
  }

  if (!res.body) {
    throw new Error("OpenRouter stream error: no response body")
  }

  return res.body
}
