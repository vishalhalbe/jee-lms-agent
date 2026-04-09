import type { Metadata } from "next"
import { getQuestions } from "@/lib/dal/questions"
import { PracticeSession } from "@/components/features/practice/PracticeSession"

export const metadata: Metadata = {
  title: "Practice",
}

export default async function PracticePage() {
  const { data: questions } = await getQuestions({ limit: 10 })

  return <PracticeSession questions={questions} />
}
