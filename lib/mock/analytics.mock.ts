import type { UserStats, SubjectProgress } from "@/lib/dal/types"

export const MOCK_USER_STATS: UserStats = {
  questionsSolved: 342,
  accuracy: 67,
  dayStreak: 14,
  rank: 1284,
}

export const MOCK_SUBJECT_PROGRESS: SubjectProgress[] = [
  {
    subjectId: 1,
    subjectName: "Physics",
    subjectSlug: "physics",
    subjectColor: "#3b82f6",
    attempted: 124,
    correct: 81,
    total: 4832,
    percentage: 65,
  },
  {
    subjectId: 2,
    subjectName: "Chemistry",
    subjectSlug: "chemistry",
    subjectColor: "#10b981",
    attempted: 118,
    correct: 82,
    total: 5214,
    percentage: 69,
  },
  {
    subjectId: 3,
    subjectName: "Mathematics",
    subjectSlug: "mathematics",
    subjectColor: "#ec4899",
    attempted: 100,
    correct: 61,
    total: 4996,
    percentage: 61,
  },
]
