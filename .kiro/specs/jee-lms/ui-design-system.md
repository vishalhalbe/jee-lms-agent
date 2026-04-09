# UI Design System: Glassmorphism for JEE LMS

## Design Philosophy

Premium glassmorphism — frosted glass cards, luminous accents, dark-first with light mode support.
Optimized for performance on mobile via CSS containment and `will-change` budgeting.

## Color Palette

### Dark Mode (primary)
```css
--background: #0a0a0f          /* Deep space black */
--surface: rgba(255,255,255,0.04)   /* Glass base */
--surface-hover: rgba(255,255,255,0.08)
--border: rgba(255,255,255,0.10)
--border-bright: rgba(255,255,255,0.20)

/* Accent — JEE orange/amber */
--accent: #f97316              /* orange-500 */
--accent-glow: rgba(249,115,22,0.3)
--accent-subtle: rgba(249,115,22,0.1)

/* Text */
--text-primary: rgba(255,255,255,0.95)
--text-secondary: rgba(255,255,255,0.60)
--text-muted: rgba(255,255,255,0.35)

/* Subjects */
--physics: #60a5fa             /* blue-400 */
--chemistry: #34d399           /* emerald-400 */
--math: #f472b6                /* pink-400 */
```

### Light Mode
```css
--background: #f8f9ff
--surface: rgba(255,255,255,0.70)
--border: rgba(0,0,0,0.08)
--text-primary: rgba(0,0,0,0.90)
--text-secondary: rgba(0,0,0,0.55)
```

## Glass Card Pattern

### CSS Utility Classes (Tailwind v4)
```css
/* Base glass card */
.glass {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 16px;
}

/* Elevated glass (modals, dropdowns) */
.glass-elevated {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.05) inset,
    0 8px 32px rgba(0,0,0,0.4),
    0 0 80px rgba(249,115,22,0.05);
}

/* Accent glow card (predictions, AI features) */
.glass-accent {
  background: rgba(249, 115, 22, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(249, 115, 22, 0.20);
  box-shadow: 0 0 40px rgba(249,115,22,0.1);
}
```

### React Component Pattern
```tsx
// components/ui/glass-card.tsx
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "base" | "elevated" | "accent"
  glow?: boolean
}

export function GlassCard({
  variant = "base",
  glow = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        // Base glass
        variant === "base" && [
          "bg-white/[0.04] backdrop-blur-md",
          "border-white/10",
          "hover:bg-white/[0.07] hover:border-white/20",
        ],
        // Elevated
        variant === "elevated" && [
          "bg-white/[0.08] backdrop-blur-2xl",
          "border-white/15",
          "shadow-2xl shadow-black/40",
        ],
        // Accent (AI features)
        variant === "accent" && [
          "bg-orange-500/[0.05] backdrop-blur-md",
          "border-orange-500/20",
          "shadow-[0_0_40px_rgba(249,115,22,0.10)]",
        ],
        glow && "shadow-[0_0_80px_rgba(249,115,22,0.08)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

## Typography

```css
/* Headings — Inter or Geist */
--font-display: var(--font-geist-sans);

h1: 3rem / 700 / tracking-tight
h2: 2rem / 600
h3: 1.5rem / 600
body: 1rem / 400 / leading-relaxed
code/math: var(--font-geist-mono)
```

## Gradient Backgrounds

### Page Background
```css
/* Animated mesh gradient behind glass */
.bg-mesh {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(96,165,250,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(244,114,182,0.06) 0%, transparent 50%),
    #0a0a0f;
}
```

### Subject Gradients
```css
--grad-physics: linear-gradient(135deg, rgba(96,165,250,0.15), rgba(96,165,250,0.03))
--grad-chemistry: linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.03))
--grad-math: linear-gradient(135deg, rgba(244,114,182,0.15), rgba(244,114,182,0.03))
```

## Component Specs

### Navigation Sidebar
- Glass panel: `backdrop-blur-xl bg-white/[0.03] border-r border-white/[0.08]`
- Active item: orange accent left border + `bg-orange-500/10`
- Width: 240px desktop, slide-over on mobile

### Top Navigation Bar
- `backdrop-blur-md bg-white/[0.04] border-b border-white/[0.08]`
- Sticky, `position: sticky; top: 0; z-index: 50`

### Stats Cards (Dashboard)
- GlassCard variant="base" with colored icon + number
- Subtle top border glow matching subject color

### Test Runner
- Full-screen, dark bg, question card as `glass-elevated`
- Timer: pill badge with glass effect
- Answer options: glass buttons with hover glow

### AI Prediction Cards
- `glass-accent` with orange glow
- Confidence bar: gradient fill orange → amber
- Animated shimmer on load

### Buttons
```tsx
// Primary CTA
"bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]"

// Secondary / Ghost
"glass border-white/10 hover:border-white/20 text-white/80"
```

## Performance Rules

| Rule | Detail |
|---|---|
| `backdrop-filter` budget | Max 3 blurred layers stacked at once |
| `will-change` | Only on animated elements, remove after animation |
| Mobile fallback | If `prefers-reduced-motion` or low-end: disable blur, use solid `bg-white/10` |
| CSS containment | `contain: layout style` on card grids |
| Lazy blur | Use `Suspense` boundary — blur loads after content |

## Mobile Responsiveness

- Sidebar collapses to bottom tab bar on mobile
- Cards: full-width on mobile, grid on tablet+
- Touch targets: min 44×44px
- `backdrop-filter` graceful degradation: solid fallback via `@supports`

```css
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: rgba(20, 20, 30, 0.95); }
}
```

## Animation Standards

```css
/* Entrance */
@keyframes glass-in {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-glass-in { animation: glass-in 0.3s ease-out forwards; }

/* Glow pulse (AI features) */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(249,115,22,0.1); }
  50%       { box-shadow: 0 0 40px rgba(249,115,22,0.25); }
}
```

## Globals CSS Variables

Add to `app/globals.css`:
```css
:root {
  --glass-blur: 16px;
  --glass-blur-heavy: 24px;
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.10);
  --accent: 249 115 22;      /* orange-500 in RGB for Tailwind opacity */
  --radius: 16px;
}
```
