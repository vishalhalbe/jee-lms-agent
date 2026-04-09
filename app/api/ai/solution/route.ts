import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { chatStream } from "@/lib/ai/client"
import { MODELS } from "@/lib/ai/client"
import { SOLUTION_SYSTEM_PROMPT } from "@/lib/math"

const schema = z.object({
  questionId: z.number().int().positive(),
  questionContent: z.string().min(1).max(15000),
})

export async function POST(req: Request): Promise<Response> {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
  }

  const { questionContent } = parsed.data

  try {
    const stream = await chatStream({
      model: MODELS.GEMINI_FLASH,
      messages: [
        { role: "system", content: SOLUTION_SYSTEM_PROMPT },
        { role: "user", content: questionContent },
      ],
    })

    // chatStream returns a ReadableStream of SSE data from OpenRouter.
    // We pipe it through a transform that extracts only the text content
    // so the client receives plain text chunks (not SSE envelopes).
    const textStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = stream.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        let buffer = ""

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            // Keep the last (possibly incomplete) line in the buffer
            buffer = lines.pop() ?? ""

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed || trimmed === "data: [DONE]") continue
              if (!trimmed.startsWith("data: ")) continue

              try {
                const json: unknown = JSON.parse(trimmed.slice(6))
                const delta =
                  json !== null &&
                  typeof json === "object" &&
                  "choices" in json &&
                  Array.isArray((json as { choices: unknown[] }).choices) &&
                  (json as { choices: { delta?: { content?: string } }[] }).choices[0]?.delta?.content

                if (delta) {
                  controller.enqueue(encoder.encode(delta))
                }
              } catch {
                // Skip malformed SSE lines
              }
            }
          }
        } finally {
          reader.releaseLock()
          controller.close()
        }
      },
    })

    return new Response(textStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate solution"
    return Response.json({ error: message }, { status: 500 })
  }
}
