export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-mesh flex items-center justify-center p-4">
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/08 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md animate-glass-in">
        {children}
      </div>
    </div>
  )
}
