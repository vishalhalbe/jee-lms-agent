import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "base" | "elevated" | "accent"
  glow?: boolean
  hover?: boolean
}

export function GlassCard({
  variant = "base",
  glow = false,
  hover = true,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        variant === "base" && [
          "glass",
          hover && "hover:bg-white/[0.07] hover:border-white/20",
        ],
        variant === "elevated" && "glass-elevated",
        variant === "accent" && "glass-accent",
        glow && "animate-glow-pulse",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
