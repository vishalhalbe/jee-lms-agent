"use client"

import { UserButton } from "@clerk/nextjs"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { GlassButton } from "@/components/ui/glass-button"

interface TopNavProps {
  title?: string
}

export function TopNav({ title }: TopNavProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/[0.08] px-6 h-14 flex items-center justify-between">
      {title && (
        <h1 className="text-white/90 font-semibold text-base">{title}</h1>
      )}
      <div className="ml-auto flex items-center gap-3">
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="size-8 p-0"
        >
          {theme === "dark" ? (
            <Sun className="size-4 text-white/60" />
          ) : (
            <Moon className="size-4 text-white/60" />
          )}
        </GlassButton>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-8 rounded-lg ring-1 ring-white/20",
            },
          }}
        />
      </div>
    </header>
  )
}
