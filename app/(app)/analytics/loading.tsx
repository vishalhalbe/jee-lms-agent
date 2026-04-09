export default function AnalyticsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-36 rounded-xl bg-white/[0.06]" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-white/[0.04] border border-white/[0.06]" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-white/[0.04] border border-white/[0.06]" />
    </div>
  )
}
