"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  Sparkles,
  BarChart2,
  CalendarDays,
  Settings,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/subjects", icon: BookOpen, label: "Subjects" },
  { href: "/practice", icon: FlaskConical, label: "Practice" },
  { href: "/predictions", icon: Sparkles, label: "AI Predictions" },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/study-plan", icon: CalendarDays, label: "Study Plan" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-screen glass border-r border-white/[0.08] p-4 gap-1">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 py-3 mb-4">
          <div className="size-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
            J
          </div>
          <span className="font-bold text-white text-lg tracking-tight">JEE LMS</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                    : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="pt-4 border-t border-white/[0.08]">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
          >
            <Settings className="size-4" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass-elevated border-t border-white/[0.08] flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.slice(0, 5).map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all",
                active ? "text-orange-400" : "text-white/40 hover:text-white/70"
              )}
            >
              <Icon className="size-5" />
              <span className="text-[10px] font-medium">{label.split(" ")[0]}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
