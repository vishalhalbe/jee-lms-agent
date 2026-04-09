export default function PredictionsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-44 rounded-xl bg-white/[0.06]" />
        <div className="h-4 w-80 rounded-lg bg-white/[0.04]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-80 rounded-2xl bg-white/[0.04] border border-white/[0.06]" />
        ))}
      </div>
    </div>
  )
}
