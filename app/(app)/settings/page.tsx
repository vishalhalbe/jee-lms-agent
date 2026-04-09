import { Settings } from "lucide-react"

export const metadata = { title: "Settings" }

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="glass rounded-2xl border border-white/[0.08] p-12 flex flex-col items-center gap-4 text-center">
        <div className="size-14 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
          <Settings className="size-7 text-white/40" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Coming soon</h2>
          <p className="text-white/40 text-sm mt-1 max-w-xs">
            Target year, notification preferences, theme, and account management will be available here.
          </p>
        </div>
      </div>
    </div>
  )
}
