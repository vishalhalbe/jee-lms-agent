export default function SubjectsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-32 rounded-xl bg-white/[0.06]" />
        <div className="h-4 w-64 rounded-lg bg-white/[0.04]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-52 rounded-2xl bg-white/[0.04] border border-white/[0.06]" />
        ))}
      </div>
    </div>
  )
}
