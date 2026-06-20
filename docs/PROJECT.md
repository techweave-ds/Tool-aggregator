# WeaveStack — Project Architecture

## Overview

WeaveStack is a **discovery-first tool ecosystem** — a React SPA that helps users find, compare, and combine tools into working systems. Users describe what they want to build, and WeaveStack recommends curated tool stacks across domains like AI, trading, automation, restaurant management, and more.

**Version**: 3.0.0
**Stack**: React 18 + Vite + Tailwind CSS + Zustand + React Router v6
**Deploy Targets**: Cloudflare Pages (primary), Netlify (secondary), Vercel, GitHub Pages

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18 | UI rendering |
| **Bundler** | Vite 5+ | Dev server & production builds |
| **Styling** | Tailwind CSS 3 + PostCSS + Autoprefixer | Utility-first CSS with custom design tokens |
| **Routing** | react-router-dom v6 | SPA routing with nested layouts |
| **State (global)** | Zustand 4 | Lightweight stores (compare, discovery, stack) |
| **State (local)** | React Context + localStorage | Favorites, pins, recents, theme, activity |
| **Animation** | framer-motion | Page transitions, scroll reveals, hover effects |
| **Icons** | lucide-react | UI icon library |
| **Charts** | recharts | Analytics charts (pie, bar, donut) |
| **Graph** | d3 (force layout) | Tool constellation interactive graph |
| **Fonts** | Cabinet Grotesk, Satoshi, JetBrains Mono | Display, body, mono typography |
| **Linting** | None (no eslint/prettier config) | — |

---

## Directory Structure

```
silent-meadow/
├── index.html                          # HTML entry point
├── package.json                        # Dependencies & scripts
├── vite.config.js                      # Vite bundler config
├── tailwind.config.js                  # Tailwind with custom fonts
├── postcss.config.js                   # PostCSS processors
├── netlify.toml                        # Netlify deploy config
├── wrangler.toml                       # Cloudflare Pages deploy config
├── DEPLOY.md                           # Deployment guide (4 targets)
├── .gitignore                          # Ignore rules
│
├── public/
│   ├── favicon.svg                     # Brand favicon
│   ├── _headers                        # Cloudflare security headers
│   └── _redirects                      # SPA redirect rules
│
├── src/
│   ├── main.jsx                        # App entry point
│   ├── App.jsx                         # Root: providers + router
│   ├── index.css                       # All Tailwind + custom CSS
│   │
│   ├── router/
│   │   └── index.jsx                   # Route definitions (6 routes)
│   │
│   ├── data/
│   │   ├── tools.json                  # 31 built-in tool definitions
│   │   └── systems.js                  # 8 systems + 7 goals
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx              # Fixed top nav with command palette
│   │   │   └── RootLayout.jsx          # Navbar + Outlet wrapper
│   │   │
│   │   ├── sections/                   # Landing page sections
│   │   │   ├── HeroSection.jsx
│   │   │   ├── CategoryGrid.jsx
│   │   │   ├── DiscoveryCarousels.jsx
│   │   │   ├── FeaturedTools.jsx
│   │   │   ├── FooterSection.jsx
│   │   │   ├── RecentUpdates.jsx
│   │   │   ├── StatsSection.jsx
│   │   │   ├── WorkflowSection.jsx
│   │   │   └── AnalyticsSection.jsx
│   │   │
│   │   ├── workshop/                   # Interactive workshop (landing)
│   │   │   ├── WorkshopHero.jsx        # Radial system selector
│   │   │   ├── WorkflowStory.jsx       # Animated timeline
│   │   │   ├── StackReveal.jsx         # Tool stack display
│   │   │   ├── BuildPaths.jsx          # Goal pathways
│   │   │   ├── FeaturedSystems.jsx     # System accordion
│   │   │   └── DiscoveryCta.jsx        # Final CTA search
│   │   │
│   │   └── ui/                         # Reusable UI components
│   │       ├── AddToolModal.jsx
│   │       ├── AdminGate.jsx           # PIN-protected gate
│   │       ├── ComparePanel.jsx        # Side-by-side comparison
│   │       ├── EcosystemHero.jsx       # Canvas network viz
│   │       ├── SmartSearch.jsx         # Fuzzy search dropdown
│   │       ├── StackBuilder.jsx        # AI stack builder
│   │       ├── ToolConstellation.jsx   # D3 force graph
│   │       └── ToolRelationships.jsx   # Related tool chips
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx             # Home page (workshop flow)
│   │   ├── ToolsPage.jsx               # Full tool directory
│   │   ├── ToolDetailPage.jsx          # Single tool detail
│   │   ├── ImportPage.jsx              # Admin import from GitHub/Netlify
│   │   ├── AdminPage.jsx               # Admin dashboard
│   │   └── NotFoundPage.jsx            # 404
│   │
│   ├── context/                        # React Context providers
│   │   ├── ThemeContext.jsx
│   │   ├── FavoritesContext.jsx
│   │   ├── PinnedContext.jsx
│   │   ├── RecentToolsContext.jsx
│   │   └── ActivityContext.jsx
│   │
│   ├── hooks/                          # Custom hooks
│   │   ├── useFavorites.js
│   │   ├── useLocalStorage.js
│   │   └── useRecentTools.js
│   │
│   ├── stores/                         # Zustand stores
│   │   ├── compareStore.js             # Compare up to 4 tools
│   │   ├── discoveryStore.js           # Discovery engine + trending
│   │   └── stackStore.js               # Stack templates + generator
│   │
│   ├── services/
│   │   └── storage.js                  # localStorage key constants
│   │
│   └── utils/
│       ├── cn.js                       # Classname joiner
│       ├── icons.jsx                   # Icon name -> lucide component
│       ├── tools.js                    # getAllTools() with custom merge
│       ├── relationships.js            # Tool relationship data + queries
│       └── smartSearch.js              # Full-text + natural language search
│
├── dist/                               # Build output (gitignored)
│
├── weavestack-nov1.html                # Standalone HTML (Noomo-inspired)
├── weavestack-showcase.html            # Standalone HTML (full showcase)
│
├── docs/                               # Documentation (this dir)
│   ├── PROJECT.md                      # ← THIS FILE
│   ├── DESIGN.md
│   ├── CREATIVES.md
│   ├── CANVAS.md
│   ├── FEATURES.md
│   └── RELATIONSHIPS.md                # File dependency map
│
└── Tools_Aggregation_EXCEL.md          # Original tool spreadsheet
```

---

## File Relationships (Import Dependency Graph)

```
index.html
  └─ src/main.jsx
       └─ src/App.jsx
            ├─ src/context/ThemeContext.jsx           # useLocalStorage('os-theme')
            ├─ src/context/FavoritesContext.jsx       # useFavorites() -> useLocalStorage('favorites')
            ├─ src/context/PinnedContext.jsx          # useLocalStorage('pinned-tools')
            ├─ src/context/RecentToolsContext.jsx     # useRecentTools() -> useLocalStorage('recent-tools')
            ├─ src/context/ActivityContext.jsx        # useLocalStorage('activity-log')
            └─ src/router/index.jsx                   # react-router-dom v6
                 │
                 ├─ src/components/layout/RootLayout.jsx
                 │    ├─ src/components/layout/Navbar.jsx
                 │    │    ├─ src/utils/tools.js -> src/data/tools.json
                 │    │    ├─ src/components/ui/StackBuilder.jsx
                 │    │    │    └─ src/stores/stackStore.js (zustand + persist)
                 │    │    └─ src/context/RecentToolsContext.jsx
                 │    └─ <Outlet /> (page content)
                 │
                 ├─ src/pages/LandingPage.jsx (route: /)
                 │    ├─ src/data/systems.js
                 │    ├─ src/components/workshop/WorkshopHero.jsx
                 │    ├─ src/components/workshop/WorkflowStory.jsx
                 │    ├─ src/components/workshop/StackReveal.jsx -> src/utils/tools.js
                 │    ├─ src/components/workshop/BuildPaths.jsx
                 │    ├─ src/components/workshop/FeaturedSystems.jsx -> src/utils/tools.js
                 │    ├─ src/components/workshop/DiscoveryCta.jsx
                 │    └─ src/components/sections/FooterSection.jsx
                 │
                 ├─ src/pages/ToolsPage.jsx (route: /tools)
                 │    ├─ src/utils/icons.jsx -> lucide-react
                 │    ├─ src/utils/tools.js -> tools.json
                 │    ├─ src/hooks/useLocalStorage.js
                 │    ├─ src/components/ui/AddToolModal.jsx
                 │    ├─ src/components/ui/ToolConstellation.jsx
                 │    │    └─ src/utils/relationships.js + d3
                 │    └─ src/components/ui/SmartSearch.jsx
                 │         └─ src/utils/smartSearch.js
                 │
                 ├─ src/pages/ToolDetailPage.jsx (route: /tool/:id)
                 │    ├─ src/utils/icons.jsx, src/utils/tools.js
                 │    ├─ src/stores/discoveryStore.js (zustand persist)
                 │    └─ src/components/ui/ToolRelationships.jsx -> relationships.js
                 │
                 ├─ src/pages/ImportPage.jsx (route: /import)
                 │    └─ src/components/ui/AdminGate.jsx
                 │
                 ├─ src/pages/AdminPage.jsx (route: /admin)
                 │    ├─ src/components/ui/AdminGate.jsx
                 │    └─ src/utils/tools.js
                 │
                 └─ src/pages/NotFoundPage.jsx (route: *)
```

---

## Routes

| Path | Page | Auth | Description |
|------|------|------|-------------|
| `/` | LandingPage | — | Interactive workshop: hero -> workflow -> stack -> goals -> systems -> CTA |
| `/tools` | ToolsPage | — | Full tool directory with search, filter, graph, compare |
| `/tool/:id` | ToolDetailPage | — | Single tool detail with relationships |
| `/import` | ImportPage | PIN | Import tools from GitHub/Netlify |
| `/admin` | AdminPage | PIN | Stats, data management, accent color picker |
| `*` | NotFoundPage | — | 404 page |

---

## Data Flow

```
tools.json (built-in 31 tools)
    │
    ├─ utils/tools.js ── getAllTools()
    │   merges built-in + localStorage('custom-tools') + localStorage('imported-tools')
    │   └─ consumed by: Navbar, ToolsPage, ToolDetailPage, FeaturedTools,
    │      DiscoveryCarousels, FeaturedSystems, StackReveal, AdminPage
    │
    ├─ utils/relationships.js
    │   static map of toolId -> { complements, alternatives, workflow }
    │   └─ consumed by: ToolConstellation (d3 graph), ToolRelationships (detail page)
    │
    ├─ utils/smartSearch.js
    │   fuzzy search + NLP patterns over tool names/descriptions/tags/categories
    │   └─ consumed by: SmartSearch component, Navbar Cmd+K
    │
    └─ stores/stackStore.js
        6 templates + keyword matching engine
        └─ consumed by: StackBuilder component
```

---

## State Management Strategy

| State Type | Mechanism | Persistence |
|-----------|-----------|-------------|
| Theme preference | React Context + useLocalStorage | localStorage('os-theme') |
| Favorites | React Context + useFavorites hook | localStorage('favorites') |
| Pinned tools | React Context + useLocalStorage | localStorage('pinned-tools') |
| Recent tools | React Context + useRecentTools hook | localStorage('recent-tools') |
| Activity log | React Context + useLocalStorage | localStorage('activity-log') |
| Compare list | Zustand store | In-memory |
| Discovery score | Zustand store + persist middleware | localStorage |
| Stack builder | Zustand store + persist middleware | localStorage |
| Custom tools | — (via getAllTools merge) | localStorage('custom-tools') |
| Imported tools | — (via getAllTools merge) | localStorage('imported-tools') |
| Admin session | — (via AdminGate) | sessionStorage |

---

## Build & Deploy

```bash
npm install        # Install dependencies
npm run dev        # Dev server at localhost:5173
npm run build      # Production build to dist/
npm run preview    # Preview build locally
npm run deploy     # Deploy to Cloudflare Pages (requires wrangler auth)
```

### Code Splitting (vite.config.js)
- `vendor`: react, react-dom, react-router-dom
- `motion`: framer-motion
- `icons`: lucide-react

### Deployment Targets
- **Cloudflare Pages** (primary): `wrangler.toml` config, `npm run deploy`
- **Netlify**: `netlify.toml` config, SPA redirect
- **Vercel**: manual config via dashboard
- **GitHub Pages**: `gh-pages` branch

---

## Environment Variables

| Variable | Default | Used In |
|----------|---------|---------|
| `VITE_ADMIN_PIN` | `9999` | AdminGate component |

---

## Known Conventions

- **No linter** — no ESLint or Prettier config. Formatting is manual.
- **No TypeScript** — all JSX files are plain JavaScript.
- **CSS** — Tailwind utility classes + custom CSS in `index.css`. No CSS modules or styled-components.
- **Imports** — `@` alias maps to `src/` (configured in vite.config.js).
- **Naming** — PascalCase for components, camelCase for hooks/utils/stores, lowercase for data files.
- **Context providers** are consumed directly in components (no custom consumer hooks beyond the context wrappers).
