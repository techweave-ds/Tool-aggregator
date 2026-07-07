# WeaveStack — Project Architecture

## Overview

WeaveStack is a **discovery-first tool ecosystem** — a React SPA that helps users find, compare, and combine tools into working systems. Users describe what they want to build, and WeaveStack recommends curated tool stacks across domains like AI, trading, automation, restaurant management, and more.

**Version**: 3.0.0
**Stack**: React 18 + Vite + Tailwind CSS + Zustand + React Router v6
**Deploy Targets**: Cloudflare Pages (primary), Netlify (secondary)

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18 | UI rendering |
| **Bundler** | Vite 5+ | Dev server & production builds |
| **Styling** | Tailwind CSS 3 + PostCSS + Autoprefixer | Utility-first CSS with custom design tokens |
| **Routing** | react-router-dom v6 | SPA routing with nested layouts |
| **State (global)** | Zustand | Lightweight stores (compare, discovery, stack) |
| **State (local)** | React Context + localStorage | Favorites, pins, recents, theme, activity |
| **Animation** | framer-motion | Page transitions, scroll reveals, hover effects |
| **Icons** | lucide-react | UI icon library |
| **Charts** | recharts | Analytics charts (pie, bar, donut) |
| **Graph** | d3 (force layout) | Tool constellation interactive graph |
| **Fonts** | Plus Jakarta Sans + Inter + JetBrains Mono | Display, body, mono typography |

---

## Directory Structure

```
silent-meadow/
├── index.html                          # HTML entry point
├── package.json                        # Dependencies & scripts
├── vite.config.js                      # Vite bundler config
├── tailwind.config.js                  # Tailwind (not actively used — all styles via index.css)
├── postcss.config.js                   # PostCSS processors
├── netlify.toml                        # Netlify deploy config
├── wrangler.toml                       # Cloudflare Pages deploy config
├── DEPLOY.md                           # Deployment guide
├── .gitignore                          # Ignore rules
│
├── public/
│   ├── favicon.svg                     # Brand favicon
│   ├── _headers                        # Cloudflare security headers
│   └── _redirects                      # SPA redirect rules
│
├── src/
│   ├── main.jsx                        # App entry point
│   ├── App.jsx                         # Root: 5 context providers + RouterProvider
│   ├── index.css                       # ALL styles — Tailwind base + custom CSS (no Tailwind classes used)
│   │
│   ├── router/
│   │   └── index.jsx                   # 6 routes (/, /tools, /tool/:id, /import, /admin, *)
│   │
│   ├── data/
│   │   ├── tools.json                  # 31 built-in tool definitions
│   │   └── systems.js                  # 8 systems + 7 goals
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx              # Fixed top nav + Cmd+K palette + StackBuilder modal
│   │   │   └── RootLayout.jsx          # Navbar + Outlet
│   │   │
│   │   ├── sections/                   # Shared sections
│   │   │   └── FooterSection.jsx
│   │   │
│   │   ├── workshop/                   # Interactive workshop (current landing page)
│   │   │   ├── WorkshopHero.jsx        # "What are you trying to build?" with 3D card
│   │   │   ├── WorkflowStory.jsx       # Animated timeline with progress bar
│   │   │   ├── StackReveal.jsx         # Tool pipeline with numbered step cards
│   │   │   ├── BuildPaths.jsx          # Goal accordion with pathway buttons
│   │   │   ├── FeaturedSystems.jsx     # Horizontal scroll rail of system cards
│   │   │   └── DiscoveryCta.jsx        # Search CTA with cycling suggestions
│   │   │
│   │   └── ui/                         # Reusable UI components
│   │       ├── AddToolModal.jsx
│   │       ├── AdminGate.jsx           # PIN-protected gate (sessionStorage)
│   │       ├── ComparePanel.jsx        # Side-by-side tool comparison
│   │       ├── HeroCard3D.jsx          # 3D stacked tool preview cards
│   │       ├── HeroOrbs.jsx            # Floating gradient ambient orbs
│   │       ├── SmartSearch.jsx         # Fuzzy search with dropdown
│   │       ├── StackBuilder.jsx        # AI stack generator (keyword matching)
│   │       ├── ToolConstellation.jsx   # D3 force-directed graph
│   │       └── ToolRelationships.jsx   # Related tool chips
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx             # Home page — workshop flow
│   │   ├── ToolsPage.jsx               # Tool directory with grid/list/constellation views
│   │   ├── ToolDetailPage.jsx          # Single tool detail with hero card
│   │   ├── ImportPage.jsx              # Admin import from GitHub/Netlify
│   │   ├── AdminPage.jsx               # Admin dashboard + data management
│   │   └── NotFoundPage.jsx            # 404
│   │
│   ├── context/                        # React Context providers
│   │   ├── ThemeContext.jsx            # Cool/warm theme toggle (cool/indigo default, warm/amber .light-mode)
│   │   ├── FavoritesContext.jsx
│   │   ├── PinnedContext.jsx
│   │   ├── RecentToolsContext.jsx
│   │   └── ActivityContext.jsx
│   │
│   ├── hooks/
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
├── docs/
│   ├── PROJECT.md                      # ← THIS FILE
│   ├── DESIGN.md
│   ├── ARCHITECTURE.md                 # Rebuild guide
│   ├── ROADMAP.md                      # Future work
│   ├── CANVAS.md
│   ├── CREATIVES.md
│   └── FEATURES.md
│
└── Tools_Aggregation_EXCEL.md          # Original tool spreadsheet
```

---

## Routes

| Path | Page | Auth | Description |
|------|------|------|-------------|
| `/` | LandingPage | — | Interactive workshop: hero → workflow → stack → goals → systems → CTA |
| `/tools` | ToolsPage | — | Full tool directory with search, filter, graph, compare |
| `/tool/:id` | ToolDetailPage | — | Single tool detail with relationships |
| `/import` | ImportPage | PIN | Import tools from GitHub/Netlify |
| `/admin` | AdminPage | PIN | Stats, data management, accent color picker |
| `*` | NotFoundPage | — | 404 |

---

## Data Flow

```
tools.json (built-in 31 tools)
    │
    ├─ utils/tools.js ── getAllTools()
    │   merges built-in + localStorage('custom-tools') + localStorage('imported-tools')
    │   └─ consumed by Navbar, ToolsPage, ToolDetailPage, FeaturedSystems, StackReveal, AdminPage
    │
    ├─ utils/relationships.js
    │   static map of toolId -> { complements, alternatives, workflow }
    │   └─ consumed by ToolConstellation (d3 graph), ToolRelationships
    │
    ├─ utils/smartSearch.js
    │   fuzzy search + NLP patterns
    │   └─ consumed by SmartSearch, Navbar Cmd+K
    │
    └─ stores/stackStore.js
        6 templates + keyword matching engine
        └─ consumed by StackBuilder
```

---

## State Management

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

### Environment Variables
| Variable | Default | Used In |
|----------|---------|---------|
| `VITE_ADMIN_PIN` | `9999` | AdminGate component |

---

## Key Conventions

- **No linter** — no ESLint or Prettier. Formatting is manual.
- **No TypeScript** — all JSX files are plain JavaScript.
- **CSS** — All styles in `index.css` via custom properties. Tailwind classes are NOT used in components — all styling is via inline `style={}` with CSS variable references.
- **Imports** — `@` alias maps to `src/` (configured in vite.config.js).
- **Naming** — PascalCase for components, camelCase for hooks/utils/stores, lowercase for data files.
