export default function AppLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 w-48 rounded-xl bg-white/[0.06]" />
      <div className="h-4 w-72 rounded-lg bg-white/[0.04]" />
      {/* Card skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-white/[0.04] border border-white/[0.06]" />
        ))}
      </div>
    </div>
  )
}
