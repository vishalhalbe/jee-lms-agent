import { getSubjects } from "@/lib/dal/subjects"
import { SubjectCard } from "@/components/features/subjects/SubjectCard"

export const metadata = { title: "Subjects" }

export default async function SubjectsPage() {
  const subjects = await getSubjects()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Subjects</h1>
        <p className="text-white/40 text-sm mt-1">
          {subjects.reduce((acc, s) => acc + s.questionCount, 0).toLocaleString()} previous year questions across {subjects.length} subjects
        </p>
      </div>

      {/* Subject grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  )
}
