import type { Prediction, PredictionTopic } from "./types"

const USE_MOCK = process.env.USE_MOCK_DATA === "true"

export async function getPredictions(): Promise<Prediction[]> {
  if (USE_MOCK) {
    const { MOCK_PREDICTIONS } = await import("@/lib/mock/predictions.mock")
    return MOCK_PREDICTIONS
  }

  // Real DB: query predictions table, parse topicsJson
  const { db } = await import("@/lib/db")
  const { predictions } = await import("@/lib/db/schema")
  const rows = await db
    .select()
    .from(predictions)
    .orderBy(predictions.createdAt)
  return rows.map((r) => ({
    id: r.id,
    examCycle: r.examCycle,
    subject: r.subject,
    topics: (r.topicsJson as PredictionTopic[]) ?? [],
    createdAt: r.createdAt.toISOString(),
  }))
}
