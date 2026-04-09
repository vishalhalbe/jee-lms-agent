import type { UserStats, SubjectProgress } from "./types"

const USE_MOCK = process.env.USE_MOCK_DATA === "true"

export async function getUserStats(_clerkId: string): Promise<UserStats> {
  if (USE_MOCK) {
    const { MOCK_USER_STATS } = await import("@/lib/mock/analytics.mock")
    return MOCK_USER_STATS
  }

  // Real DB: aggregate from testAttempts + topicProgress
  // TODO: implement when real data exists
  return { questionsSolved: 0, accuracy: 0, dayStreak: 0, rank: null }
}

export async function getSubjectProgress(
  _clerkId: string
): Promise<SubjectProgress[]> {
  if (USE_MOCK) {
    const { MOCK_SUBJECT_PROGRESS } = await import(
      "@/lib/mock/analytics.mock"
    )
    return MOCK_SUBJECT_PROGRESS
  }

  return []
}
