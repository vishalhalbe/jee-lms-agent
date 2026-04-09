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
  stream?: boolean
}

export async function chat(options: CompletionOptions): Promise<string> {
  const res = await fetch(`${process.env.OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/vishalhalbe/jee-lms-agent",
      "X-Title": "JEE LMS",
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 2048,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices[0].message.content as string
}

export async function chatStream(options: CompletionOptions): Promise<ReadableStream> {
  const res = await fetch(`${process.env.OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/vishalhalbe/jee-lms-agent",
      "X-Title": "JEE LMS",
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 4096,
      stream: true,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter stream error ${res.status}: ${err}`)
  }

  return res.body!
}
