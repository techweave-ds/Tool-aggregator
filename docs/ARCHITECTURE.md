# WeaveStack — Architecture & Rebuild Guide

This document describes how to rebuild WeaveStack from scratch. It covers the file creation order, critical decisions, and the data models that drive the app.

---

## 1. Rebuild Order

The project can be rebuilt by following these steps in order. Each step introduces files that the next step depends on.

### Phase 1: Project Scaffold

```
1. npm create vite@latest silent-meadow -- --template react
2. npm install react-router-dom zustand framer-motion lucide-react recharts d3 @types/d3
3. npm install -D tailwindcss postcss autoprefixer
4. npx tailwindcss init -p
```

Config files:
- `vite.config.js` — add `@` alias to `src/`
- `tailwind.config.js` — content paths, fontFamily extensions (not critical — all styles via index.css)
- `postcss.config.js` — tailwindcss + autoprefixer
- `index.html` — root div, link to `/src/main.jsx`

### Phase 2: Entry Point & Router

```
src/main.jsx          → mounts React app, imports index.css
src/App.jsx           → wraps 5 context providers around RouterProvider
src/router/index.jsx  → 6 routes with RootLayout

src/components/layout/RootLayout.jsx  → Navbar + <Outlet />
```

### Phase 3: CSS Foundation

```
src/index.css         → ALL styles:
  - Google Fonts import (Plus Jakarta Sans, Inter, JetBrains Mono)
  - Tailwind directives (@tailwind base/components/utilities)
  - CSS variables (colors, shadows, glows, --os-* aliases)
  - Reset (box-sizing, margin, padding)
  - Typography classes (.font-display, .font-mono)
  - Utility classes (.grid-bg, .dot-grid, .glass, .card, .platform-card)
  - Keyframes + animation classes
  - Status badges, scrollbar, input, 3D utilities
  - Reduced motion media query
```

### Phase 4: Data Layer

```
src/data/tools.json   → 31 tools (id, name, description, category, status, icon, tags, urls, changelog)
src/data/systems.js   → 8 SYSTEMS + 7 GOALS (with workflow steps, stack toolIds, pathways)

src/utils/cn.js       → classname joiner (trivial — && concatenation)
src/utils/icons.jsx   → maps string icon names to lucide-react components (32 mappings)
src/utils/tools.js    → getAllTools() merges tools.json + localStorage custom/imported tools
src/utils/relationships.js → static map of toolId → { complements, alternatives, workflow }
src/utils/smartSearch.js → fuzzy search + NLP patterns + category aliases

src/services/storage.js → localStorage key constants
```

### Phase 5: State Layer

```
src/hooks/useLocalStorage.js   → generic localStorage React hook
src/hooks/useFavorites.js      → (utility functions for favorites context)
src/hooks/useRecentTools.js    → (utility functions for recent tools context)

src/context/ThemeContext.jsx        → dark/light toggle (light mode incomplete)
src/context/FavoritesContext.jsx    → favorite tool IDs (localStorage)
src/context/PinnedContext.jsx       → pinned tool IDs (localStorage)
src/context/RecentToolsContext.jsx  → last 20 opened tools (localStorage)
src/context/ActivityContext.jsx     → action log, max 200 entries (localStorage)

src/stores/compareStore.js     → Zustand: compare list (in-memory)
src/stores/discoveryStore.js   → Zustand+persist: view tracking, trending, recs
src/stores/stackStore.js       → Zustand+persist: 6 templates, generate, save
```

### Phase 6: UI Components (no dependencies on pages)

```
src/components/ui/AdminGate.jsx       → PIN gate (sessionStorage, default 9999)
src/components/ui/AddToolModal.jsx    → Form modal for adding custom tools
src/components/ui/ComparePanel.jsx    → Side-by-side comparison (up to 4 tools)
src/components/ui/SmartSearch.jsx     → Search input with fuzzy dropdown
src/components/ui/HeroCard3D.jsx      → 3 stacked tool preview cards (mouse tilt)
src/components/ui/HeroOrbs.jsx        → 4 floating gradient blobs
src/components/ui/EcosystemHero.jsx   → Canvas particle network
src/components/ui/StackBuilder.jsx    → Stack recommendation modal
src/components/ui/ToolConstellation.jsx → D3 force-directed graph
src/components/ui/ToolRelationships.jsx → Related tool chips
```

### Phase 7: Workshop Components (used by LandingPage)

```
src/components/workshop/WorkshopHero.jsx    → Hero with system selector pills + 3D card
src/components/workshop/WorkflowStory.jsx   → Animated timeline with progress bar
src/components/workshop/StackReveal.jsx     → Tool pipeline with step cards
src/components/workshop/BuildPaths.jsx      → Goal accordion with pathways
src/components/workshop/FeaturedSystems.jsx → Horizontal scroll of system cards
src/components/workshop/DiscoveryCta.jsx    → Search CTA with cycling suggestions
```

### Phase 8: Sections (used by old LandingPage, kept for compatibility)

```
src/components/sections/HeroSection.jsx
src/components/sections/CategoryGrid.jsx
src/components/sections/DiscoveryCarousels.jsx
src/components/sections/FeaturedTools.jsx
src/components/sections/FooterSection.jsx
src/components/sections/RecentUpdates.jsx
src/components/sections/StatsSection.jsx
src/components/sections/WorkflowSection.jsx
src/components/sections/AnalyticsSection.jsx
```

### Phase 9: Pages

```
src/pages/LandingPage.jsx       → workshop flow (WorkshopHero → WorkflowStory → StackReveal → BuildPaths → FeaturedSystems → DiscoveryCta → Footer)
src/pages/ToolsPage.jsx         → sidebar categories + status + grid/list/constellation
src/pages/ToolDetailPage.jsx    → hero card + relationships + changelog
src/pages/ImportPage.jsx        → GitHub/Netlify import (PIN-gated)
src/pages/AdminPage.jsx         → stats + data management (PIN-gated)
src/pages/NotFoundPage.jsx      → 404
```

### Phase 10: Layout

```
src/components/layout/Navbar.jsx  → Platform accent line + fixed nav + Cmd+K + StackBuilder
```

---

## 2. Critical Architecture Decisions

### Why no Tailwind classes in components?
The project uses inline `style={}` objects with CSS variable references (`var(--text)`, `var(--accent)`) rather than Tailwind utility classes. This makes the theme fully dynamic — changing a CSS variable in `index.css` propagates everywhere. Tailwind is only used for the build pipeline (PostCSS) and responsive prefixes.

### CSS variable strategy
- `index.css` defines all design tokens as CSS custom properties on `:root`
- Components reference tokens via `style={{ color: 'var(--accent)' }}`
- Theme switching works by toggling `.light-mode` class on `<html>` and overriding variables
- The `--os-*` aliases exist for backward compatibility with older components

### Data merge pattern
`getAllTools()` in `utils/tools.js` merges three sources:
1. Built-in `tools.json` (static)
2. `localStorage('custom-tools')` (added via AddToolModal)
3. `localStorage('imported-tools')` (added via ImportPage)

This means all tool listings automatically include user-added tools without any backend.

### State choice: Context vs Zustand
- Context + localStorage for **user preferences** (favorites, pins, recents, theme, activity)
- Zustand for **ephemeral or computed state** (compare list, discovery engine, stack builder)
- Zustand stores with `persist` middleware use the same localStorage keys as the Context approach

### Routing strategy
All routes are defined in a single `createBrowserRouter` call with `RootLayout` as the parent. No lazy loading — all pages are eagerly imported. Code splitting is done at the vendor/motion/icons chunk level in vite.config.js.

---

## 3. Data Models

### Tool (tools.json)
```json
{
  "id": "crypto-alert-bot",
  "name": "Crypto Alert Bot",
  "description": "Real-time cryptocurrency price monitoring...",
  "category": "Trading",
  "version": "2.1.0",
  "status": "Production",
  "icon": "Bitcoin",
  "tags": ["crypto", "alerts", "trading"],
  "github": "https://github.com/...",
  "docs": "https://...",
  "demo": "https://...",
  "type": "internal",
  "url": "https://...",
  "changelog": [
    { "version": "2.1.0", "date": "2026-01-15", "changes": ["Added..."] }
  ]
}
```

Categories: `Trading`, `AI`, `Development`, `Utilities`, `Restaurant`, `Automations`, `Archive`
Statuses: `Production`, `Beta`, `Alpha`, `Archived`
Types: `internal` (launch in-app), `external` (open URL)

### System (systems.js)
```js
{
  id: "customer-support",
  name: "Customer Support Assistant",
  icon: "💬",
  color: "#8b5cf6",
  domain: "AI",
  description: "...",
  shortDesc: "...",
  ideal: "Customer support teams...",
  setup: "15 min setup",
  workflow: [
    { icon: "🎤", stage: "Capture", detail: "..." },
    { icon: "🧠", stage: "Classify", detail: "..." },
    { icon: "🤖", stage: "Respond", detail: "..." },
    { icon: "📊", stage: "Analyze", detail: "..." },
    { icon: "🔄", stage: "Improve", detail: "..." }
  ],
  stack: [
    { toolId: "supportweave", purpose: "Ticket routing", capability: "..." },
  ]
}
```

### Goal (systems.js)
```js
{
  id: "grow-revenue",
  name: "Grow Revenue",
  icon: "📈",
  description: "...",
  pathways: [
    { systemId: "lead-generation", label: "Lead Generation Engine", reason: "..." }
  ]
}
```

### Relationship (relationships.js)
```js
// Static map: toolId → related toolIds by type
{
  "supportweave": {
    complements: ["ai-chat-dashboard"],
    alternatives: ["knowledgos"],
    workflow: ["knowledgos", "prompt-generator"]
  }
}
```

### Stack Template (stackStore.js)
```js
{
  id: "ai-support-bot",
  name: "AI Support Bot",
  description: "...",
  keywords: ["customer", "support", "help desk", "ticket"],
  tools: [
    { id: "supportweave", purpose: "Ticket management", capability: "..." }
  ],
  useCase: "..."
}
```

---

## 4. Dependency Map

```
index.html
  └─ src/main.jsx
       └─ src/App.jsx
            ├─ src/context/ThemeContext.jsx
            ├─ src/context/FavoritesContext.jsx
            ├─ src/context/PinnedContext.jsx
            ├─ src/context/RecentToolsContext.jsx
            ├─ src/context/ActivityContext.jsx
            └─ src/router/index.jsx
                 └─ src/components/layout/RootLayout.jsx
                      ├─ src/components/layout/Navbar.jsx
                      │    ├─ src/utils/tools.js → src/data/tools.json
                      │    ├─ src/context/RecentToolsContext.jsx
                      │    └─ src/components/ui/StackBuilder.jsx
                      │         └─ src/stores/stackStore.js
                      └─ <Outlet />
                           ├─ LandingPage
                           │    ├─ data/systems.js
                           │    ├─ workshop/WorkshopHero → ui/HeroOrbs + ui/HeroCard3D
                           │    ├─ workshop/WorkflowStory
                           │    ├─ workshop/StackReveal → utils/tools.js
                           │    ├─ workshop/BuildPaths
                           │    ├─ workshop/FeaturedSystems → utils/tools.js
                           │    ├─ workshop/DiscoveryCta
                           │    └─ sections/FooterSection
                           ├─ ToolsPage
                           │    ├─ utils/icons.jsx, utils/tools.js
                           │    ├─ hooks/useLocalStorage.js
                           │    ├─ ui/AddToolModal
                           │    ├─ ui/ToolConstellation → d3 + relationships.js
                           │    └─ ui/SmartSearch → smartSearch.js
                           ├─ ToolDetailPage
                           │    ├─ utils/icons.jsx, utils/tools.js
                           │    ├─ stores/discoveryStore.js
                           │    ├─ context/FavoritesContext, PinnedContext, RecentToolsContext
                           │    └─ ui/ToolRelationships → relationships.js
                           ├─ ImportPage → ui/AdminGate
                           ├─ AdminPage → ui/AdminGate + utils/tools.js
                           └─ NotFoundPage
```

---

## 5. LocalStorage Keys

| Key | Type | Source |
|-----|------|--------|
| `os-theme` | `"dark" \| "light"` | ThemeContext |
| `favorites` | `string[]` (tool IDs) | FavoritesContext |
| `pinned-tools` | `string[]` (tool IDs) | PinnedContext |
| `recent-tools` | `string[]` (tool IDs) | RecentToolsContext |
| `activity-log` | `object[]` | ActivityContext |
| `custom-tools` | `object[]` (tool objects) | AddToolModal |
| `imported-tools` | `object[]` (tool objects) | ImportPage |
| `weavestack-stack-store` | Zustand persist | stackStore |
| `weavestack-discovery-store` | Zustand persist | discoveryStore |
| `toolos-admin` | `"yes"` in sessionStorage | AdminGate |
| `os-accent` | hex color string | AdminPage accent picker |

---

## 6. Known Gaps for Rebuilding

- **ThemeContext.jsx**: sets `.light-mode` class but light mode CSS variables are incomplete. The project is effectively light-only.
- **tailwind.config.js**: The fontFamily extensions (`display`, `body`, `mono`) are NOT actually used — fonts are set via `font-family` in CSS variables. The config is vestigial.
- **hero sections conflict**: Both `sections/HeroSection.jsx` and `workshop/WorkshopHero.jsx` exist. LandingPage uses WorkshopHero (workshop flow). The old HeroSection is unused on the landing page.
- **No tests**: No test framework, no test files exist.
