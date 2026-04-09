"use client"

import { cn } from "@/lib/utils"

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export function GlassButton({
  variant = "ghost",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: GlassButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50",
        "disabled:opacity-50 disabled:pointer-events-none",
        // Sizes
        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        // Variants
        variant === "primary" && [
          "bg-orange-500 hover:bg-orange-400 text-white",
          "shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]",
        ],
        variant === "ghost" && [
          "glass border-white/10 hover:border-white/20",
          "text-white/80 hover:text-white",
        ],
        variant === "destructive" && [
          "bg-red-500/10 border border-red-500/20 text-red-400",
          "hover:bg-red-500/20",
        ],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
