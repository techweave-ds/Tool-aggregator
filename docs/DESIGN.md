# WeaveStack — Design System (v3 Light Theme)

## 1. Visual Identity

WeaveStack is a **light-themed, discovery-first tool ecosystem**. The visual language is clean, airy, and platform-like — emphasizing clarity, depth, and interactivity. The design draws inspiration from modern dev platforms (Vercel, Linear) and financial dashboards.

**Mood**: Clean · Technical · Spacious · Exploratory
**Key words**: Platform, Stack, System, Discovery, Workshop

---

## 2. Color Palette

All colors are defined as CSS custom properties in `src/index.css`.

### Backgrounds (Light)
```
--bg:       #f0f3fa    (cool off-white)
--bg2:      #e8ecf5    (slightly deeper bg)
--surface:  #ffffff    (card surfaces)
--surface2: #f5f7fd    (alt surface)
--card:     #ffffff    (cards)
--card2:    #f8faff    (alt cards)
```

### Borders
```
--border:   rgba(99,102,241,0.14)    (accent-tinted)
--border2:  rgba(0,0,0,0.07)         (subtle gray)
```

### Text
```
--text:     #0f172a    (slate-900, high contrast)
--text2:    #475569    (slate-600, secondary)
--text3:    #94a3b8    (slate-400, muted)
```

### Accent & Category Colors
```
--accent:   #6366f1    (indigo-500, primary brand)
--accent2:  #4f46e5    (indigo-600, darker)
--violet:   #8b5cf6
--cyan:     #06b6d4
--green:    #22c55e
--amber:    #f59e0b
--orange:   #f97316
--blue:     #3b82f6
--red:      #ef4444
--gray:     #64748b
```

### Shadow System (Real Depth)
```
--shadow-xs:  0 1px 2px rgba(15,23,42,0.05)
--shadow-sm:  0 1px 3px rgba(15,23,42,0.07), 0 1px 2px rgba(15,23,42,0.05)
--shadow-md:  0 4px 12px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.05)
--shadow-lg:  0 12px 32px rgba(15,23,42,0.1), 0 4px 12px rgba(15,23,42,0.07)
--shadow-xl:  0 24px 64px rgba(15,23,42,0.12), 0 8px 24px rgba(15,23,42,0.08)
--shadow-2xl: 0 40px 80px rgba(15,23,42,0.15), 0 12px 32px rgba(15,23,42,0.1)
```

### Glow Shadows (for buttons, cards)
```
--glow-indigo: 0 8px 32px rgba(99,102,241,0.22)
--glow-violet: 0 8px 32px rgba(139,92,246,0.2)
--glow-cyan:   0 8px 32px rgba(6,182,212,0.2)
```

### OS Fallback Aliases
For backward compatibility with older components, `--os-*` aliases mirror the main variables:
`--os-accent`, `--os-text`, `--os-card`, `--os-bg`, `--os-border`, etc.

---

## 3. Typography

### Font Family
| Role | Font | Weights Used |
|------|------|--------------|
| **Display / Headings** | `Plus Jakarta Sans` | 800, 900 (bold) |
| **Body / UI** | `Inter` | 400, 500, 600 |
| **Code / Data** | `JetBrains Mono` | 350, 400, 500 |

Loaded via Google Fonts in `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@350;400;500&display=swap');
```

### Font Sizing
- Hero heading: `clamp(36px, 5vw, 64px)` with `-0.045em` letter-spacing
- Section titles: `clamp(28px, 4vw, 48px)`
- Body: `text-sm` (14px) → `text-base` (16px)
- Small / meta: `text-xs` (12px)
- Mono data: `text-[10px]` → `text-xs`

### Key Typography Patterns
- **Brand name**: Plus Jakarta Sans, black weight — "Weave" in dark text, **"Stack"** in accent color
- **Gradient text**: `.text-gradient` — indigo-to-violet gradient
- **Warm gradient**: `.text-gradient-warm` — orange-to-amber
- **Section labels**: monospace, `tracking-[0.18em]`, uppercase, small (`8-10px`)
- **All body/UI text**: Inter font family
- **Code/version badges**: JetBrains Mono

---

## 4. Spacing & Layout

- **Max content width**: 1200px via `max-w-6xl`, ToolsPage uses `max-w-7xl`
- **Section padding**: `py-24` (96px) vertical, `px-6` horizontal
- **Card padding**: `p-4` → `p-5` → `p-6`
- **Gap scale**: `gap-2`, `gap-3`, `gap-4`, `gap-6`
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Platform accent line**: 2px fixed gradient bar at very top (`platform-top-line`)
- **Navbar**: fixed, `top-[2px]` (below platform line), 56px height, glass blur

---

## 5. Visual Effects

### Glass (Light Version)
```css
.glass {
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(20px) saturate(1.8);
  border: 1px solid rgba(255,255,255,0.95);
  box-shadow: var(--shadow-md);
}
```
Used on: Navbar background, command palette, modals.

### Grid Background
```css
.grid-bg {
  background-image: linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px);
  background-size: 52px 52px;
}
```

### Dot Grid
```css
.dot-grid {
  background-image: radial-gradient(circle, rgba(99,102,241,0.2) 1px, transparent 1px);
  background-size: 28px 28px;
}
```
Used on: WorkshopHero, DiscoveryCta.

### Cards
```css
.card {
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
}
.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Platform Card
```css
.platform-card {
  background: var(--card);
  border: 1px solid rgba(99,102,241,0.12);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}
```

### Platform Accent Line
2px fixed bar at very top of viewport, gradient from indigo → violet → cyan. All content begins below it (`top-[2px]` on nav).

### Gradient Orbs
Floating radial gradients with `filter: blur(60px)` for depth. Used in HeroOrbs and as section decorations. Very low opacity (0.04–0.18).

---

## 6. Status Badges

| Status | Style | Color |
|--------|-------|-------|
| **Production** | `.badge-prod` | green bg/text, green border |
| **Beta** | `.badge-beta` | amber bg/text, amber border |
| **Alpha** | `.badge-alpha` | indigo bg/text, indigo border |
| **Archived** | `.badge-arch` | gray bg/text, gray border |

Status dots: `.dot-prod` (green + glow), `.dot-beta` (amber), `.dot-alpha` (indigo)

---

## 7. Animations

### CSS Keyframes (in index.css)
| Name | Effect |
|------|--------|
| `fadeUp` | opacity 0→1, translateY 18→0 (0.65s) |
| `fadeIn` | opacity 0→1 (0.5s) |
| `scaleIn` | scale 0.96→1 + fade (0.45s) |
| `float` | vertical float (4s, infinite) |
| `floatAlt` | float + rotate (5s, infinite) |
| `pulse-glow` | opacity + scale (3s, infinite) |
| `shimmer` | background position sweep |
| `orbit` | circular orbit around center (120px radius) |
| `slideIn` | translateX -8→0 (slide in from left) |

### Animation Classes
`.animate-fade-up`, `.animate-fade-in`, `.animate-scale-in`, `.animate-float`, `.animate-float-alt`, `.animate-pulse-glow`
Delay classes: `.delay-100` through `.delay-800`

### Framer Motion Patterns
| Use Case | Pattern | Timing |
|----------|---------|--------|
| Section enter | `initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}` | 0.4s |
| Staggered cards | `transition={{delay: i * 0.06}}` | per index |
| Hover | `whileHover={{ scale: 1.02 }}` | 0.2s |
| Tap | `whileTap={{ scale: 0.98 }}` | 0.1s |
| Page transitions | route change → scroll to top | instant |

---

## 8. Component Design Patterns

### Tool Card (ToolsPage)
```
3px color top border
Icon (lucide) + name + "NEW" badge
Category label
2-line description
Tag chips (max 3)
Status dot + version | "Open" button
```

### Workshop System Card
```
Color header band (4px)
Emoji icon + system name + domain label
Short description (2-line clamp)
Workflow mini-steps with arrows
Tool chips with emoji icons
Setup badge + "Build" CTA button
Expandable detail section
```

### Modal Pattern
```
Fixed inset overlay (rgba(15,23,42,0.45) + blur)
Centered card with spring animation
Header (title + close button)
Scrollable body
Footer (actions)
```

---

## 9. Responsive Breakpoints

| Breakpoint | Tailwind | Usage |
|-----------|----------|-------|
| Mobile first | (default) | Single column, stacked |
| Tablet | `md` (768px) | 2-column grids, horizontal layouts |
| Desktop | `lg` (1024px) | Sidebars, multi-column, floating badges |
| Wide | `xl` (1280px) | Max-width constraints |

---

## 10. Custom CSS Classes (index.css)

```
.grid-bg              → Subtle grid pattern overlay
.dot-grid             → Dot pattern for hero/CTA
.glass                → Frosted glass background (light)
.text-gradient        → Indigo-violet gradient text
.text-gradient-warm   → Orange-amber gradient text
.card                 → Card with hover lift
.platform-card        → Elevated card with accent border
.platform-top-line    → Fixed 2px gradient bar at top
.orb                  → Floating gradient blob
.section-divider      → Gradient horizontal divider
.badge-prod/beta/alpha/arch → Status badges
.dot-prod/beta/alpha  → Status indicator dots
.perspective-1000/1500 → 3D perspective containers
.preserve-3d          → 3D transform style
```

---

## 11. Design Assets

- **Favicon**: SVG lightning bolt on gradient rounded square (`public/favicon.svg`)
- **No external images** — all visuals are CSS, SVG, Canvas, or emoji
- **Icons**: lucide-react (32+ icon mappings in `src/utils/icons.jsx`)
- **Data visualization**: d3 force-directed graphs, recharts pie/bar/donut charts
- **Canvas**: interactive particle node network in EcosystemHero
