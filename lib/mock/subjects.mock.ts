import type { Subject } from "@/lib/dal/types"

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: "Physics",
    slug: "physics",
    icon: "atom",
    color: "#3b82f6",
    chapterCount: 21,
    questionCount: 4832,
  },
  {
    id: 2,
    name: "Chemistry",
    slug: "chemistry",
    icon: "flask-conical",
    color: "#10b981",
    chapterCount: 28,
    questionCount: 5214,
  },
  {
    id: 3,
    name: "Mathematics",
    slug: "mathematics",
    icon: "sigma",
    color: "#ec4899",
    chapterCount: 18,
    questionCount: 4996,
  },
]
