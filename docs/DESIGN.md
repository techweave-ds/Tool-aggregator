# WeaveStack — Design System

## 1. Visual Identity

WeaveStack is a **dark-themed, discovery-first tool ecosystem**. The visual language is minimal, high-contrast, and data-rich — emphasizing clarity, depth, and interactivity. The design draws inspiration from dev tools, financial dashboards, and AI interfaces.

**Mood**: Technical · Premium · Calm · Exploratory
**Key words**: Discovery, Stack, System, Tool, Node, Edge

---

## 2. Color Palette

All colors are defined as CSS custom properties in `src/index.css`.

### Core Backgrounds
```
--bg:       #05060a    (deepest bg)
--surface:  #080b14    (section bg)
--card:     #0b0f1a    (card/elevated bg)
--border:   rgba(99,102,241,0.08)        (subtle borders)
--border2:  rgba(255,255,255,0.04)       (very subtle borders)
```

### Text
```
--text:     #e8ecf4    (primary text, high contrast)
--text2:    #8a94a6    (secondary text, muted)
--text3:    #3d4560    (tertiary text, very muted)
```

### Accent (Primary Brand)
```
--accent:   #6366f1    (indigo-500)
--accent2:  #4f46e5    (indigo-600, darker accent)
```

### Category Colors (in accent picker)
```
--violet:   #8b5cf6    (violet-500)
--cyan:     #06b6d4    (cyan-500)
--green:    #22c55e    (green-500)
--amber:    #f59e0b    (amber-500)
--orange:   #f97316    (orange-500)
--blue:     #3b82f6    (blue-500)
```

These category colors are used pervasively:
- `#8b5cf6` — AI / Customer Support
- `#f59e0b` — Trading
- `#06b6d4` — Automation
- `#f97316` — Restaurant
- `#3b82f6` — Development

### Admin Accent Presets
The AdminPage has an accent color picker with 6 presets:
| Name | Color | Hex |
|------|-------|-----|
| Indigo | Default | `#6366f1` |
| Violet | AI | `#8b5cf6` |
| Cyan | Automation | `#06b6d4` |
| Green | Fresh | `#22c55e` |
| Amber | Trading | `#f59e0b` |
| Rose | Warm | `#f43f5e` |

---

## 3. Typography

### Font Family
| Role | Font | Weight Range |
|------|------|-------------|
| **Display / Headings** | `Cabinet Grotesk` (sans-serif) | 400, 500, 700, 800, 900 |
| **Body / UI** | `Satoshi` (sans-serif) | 400, 500, 700 |
| **Code / Data** | `JetBrains Mono` (monospace) | 300, 400, 500 |

### Font Sizing (Tailwind classes)
- Hero heading: `text-4xl` → `text-7xl` (responsive)
- Section titles: `text-2xl` → `text-4xl`
- Body: `text-sm` → `text-base`
- Small / meta: `text-xs` → `text-sm`
- Mono data: `text-xs` → `text-sm`

### Key Typography Patterns
- **Hero headline** uses Cabinet Grotesk, weight 800, tight letter-spacing (`-0.04em`)
- **Gradient text** via `.text-gradient` utility: `linear-gradient(135deg, #e2e8f0, var(--accent), var(--violet))`
- **Code/version badges** use JetBrains Mono
- **Section headings** are often paired with a small monospace label (e.g., "01 / SUPPORT")
- **No serif fonts** in the React app (serif is only used in the standalone Noomo-inspired HTML file)

---

## 4. Spacing & Layout

- **Max content width**: 1200px (sections), constrained via `max-w-6xl` or `max-w-7xl`
- **Section padding**: `py-16 md:py-24 lg:py-32` (vertical), `px-4 md:px-8` (horizontal)
- **Card padding**: `p-4 md:p-6`
- **Gap scale**: Utility classes from Tailwind (`gap-2`, `gap-4`, `gap-6`, `gap-8`)
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (responsive pattern)

---

## 5. Visual Effects

### Glassmorphism
```css
.glass {
  backdrop-filter: blur(12px) saturate(1.2);
  -webkit-backdrop-filter: blur(12px) saturate(1.2);
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
}
```
Used on: Navbar, command palette modal, stack builder cards.

### Grid Background
```css
.grid-bg {
  background-image: linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}
```
Used on: Hero section, analytics section.

### Noise Texture
```css
.noise::after {
  content: '';
  position: fixed; inset: 0; pointer-events: none; z-index: 9999;
  opacity: 0.015;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 256px;
}
```
Applied globally on the root layout wrapper.

### Gradient Text
```css
.text-gradient {
  background: linear-gradient(135deg, #e2e8f0 0%, var(--accent) 50%, var(--violet) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Glow / Gradient Orbs
Used in hero and section decorations: radial gradients with `filter: blur(40px)` and very low opacity (0.04–0.15).

### Custom Scrollbar
```css
::-webkit-scrollbar { width: 2px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 2px; }
```

---

## 6. Component Design Patterns

### Card Pattern
All tool cards follow a consistent pattern:
- Dark card background (`bg-[var(--card)]` or `bg-white/5`)
- Subtle border (`border border-white/5`)
- Rounded corners (`rounded-xl`)
- Hover state: border color change + slight transform/glow
- Icon (lucide-react) + title + description + metadata row (tags, status badge)

### Button Variants
| Variant | Classes | Usage |
|---------|---------|-------|
| Primary | `bg-[var(--accent)] text-white rounded-lg px-4 py-2` | Main CTAs |
| Ghost | `text-[var(--text2)] hover:bg-white/5 rounded-lg` | Secondary actions |
| Pill | `rounded-full px-4 py-1.5 border border-white/10` | Tags / filters |
| Icon | `p-2 rounded-lg hover:bg-white/5` | Favorite, pin, compare |

### Status Badges
Tools have status: `active`, `beta`, `dev`, `archived`. Color mapping:
- `active` → green (`bg-green-500/10 text-green-400`)
- `beta` → amber (`bg-amber-500/10 text-amber-400`)
- `dev` → blue (`bg-blue-500/10 text-blue-400`)
- `archived` → red/gray (`bg-gray-500/10 text-gray-400`)

### Modal / Overlay Pattern
Modals use: fixed inset, dark overlay (`bg-black/60 backdrop-blur-sm`), centered card with header/body/footer, close button. Examples: StackBuilder, AddToolModal, ComparePanel.

---

## 7. Interaction Patterns

- **Hover**: subtle border glow, slight scale (1.02), color shift
- **Focus**: ring accent color
- **Click/Active**: scale 0.98
- **Scroll**: IntersectionObserver reveals with fade-up + translateY
- **Page transitions**: route changes scroll to top
- **Command palette**: Cmd+K opens search overlay (Navbar)
- **Dismiss**: click outside, Escape key, or close button for modals

---

## 8. Animation Guidelines

All animations use **framer-motion**:

| Use Case | Pattern | Duration | Easing |
|----------|---------|----------|--------|
| Page enter | `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` | 0.4s | easeOut |
| Hover cards | `whileHover={{ y: -2 }}` | 0.2s | easeOut |
| Stagger children | `variants` with `staggerChildren: 0.05` | 0.3s total | easeOut |
| Stats count-up | `useScroll` + `animate` | 2s | easeOut |
| Workflow pipeline | `animate` with stage progression | auto-advance 1.8s | — |

**CSS-only animations** (in `index.css`):
- `animate-fade-up`: opacity 0→1, translateY 24→0, 0.8s, cubic-bezier
- `animate-fade-in`: opacity 0→1, 0.6s
- `animate-scale-in`: scale 0.96→1 + fade, 0.6s, cubic-bezier

---

## 9. Responsive Breakpoints

| Breakpoint | Tailwind | Usage |
|-----------|----------|-------|
| Mobile first | `xs` (implied) | Base styles |
| Tablet | `md` (768px) | Grid shifts, layout changes |
| Desktop | `lg` (1024px) | Multi-column, full layout |
| Wide | `xl` (1280px) | Max-width constraints |

---

## 10. Custom CSS Classes (in `src/index.css`)

```css
.grid-bg           # Subtle grid overlay (hero/analytics)
.noise             # Global noise texture overlay
.text-gradient     # Gradient text effect
.glass             # Frosted glass background
.animate-fade-up   # Fade + slide up animation
.animate-fade-in   # Pure fade in
.animate-scale-in  # Scale + fade in
.delay-*           # Animation delay classes (100-800ms)
```

---

## 11. Design Assets

- **Favicon**: SVG lightning bolt on dark rounded rectangle (`public/favicon.svg`)
- **No external images** — all graphics are CSS/SVG/Canvas generated
- **Icons**: lucide-react (32 icon mappings in `src/utils/icons.jsx`)
- **Data visualization**: d3 force-directed graphs, recharts pie/bar/donut charts
- **Canvas**: interactive particle node network in EcosystemHero

---

## 12. Light Mode (via ThemeContext)

Light mode adds `.light-mode` class to `<html>`, overriding CSS variables:
```css
.light-mode {
  --bg: #f8fafc;
  --surface: #f1f5f9;
  --card: #ffffff;
  --text: #0f172a;
  --text2: #475569;
  --text3: #94a3b8;
  --border: rgba(99,102,241,0.12);
}
```
Not fully implemented across all components — some may need light-mode adjustments.
