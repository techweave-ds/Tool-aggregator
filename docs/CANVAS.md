# WeaveStack — Canvas

## 1. Project Canvas (Big Picture)

```
┌──────────────────────────────────────────────────────────────────┐
│                        WEAVESTACK                                 │
│             Workshop-first Tool Ecosystem v3.0                    │
│                                                                   │
│   "What are you trying to build?"                                 │
│   └─> We show you the workflow and the tools that make it possible│
└──────────────────────────────────────────────────────────────────┘
```

### High-Level Architecture

```
USER ──> Browser ──> index.html
                        │
                    src/main.jsx
                        │
                    src/App.jsx ──> 5 Context Providers
                        │            (Theme, Favorites, Pinned,
                        │             RecentTools, Activity)
                        │
                    src/router/index.jsx ──> 6 Routes
                        │
                        ├── LandingPage (/) ──── Interactive Workshop
                        │   ├── WorkshopHero    ── "What are you building?"
                        │   ├── WorkflowStory   ── Animated stages
                        │   ├── StackReveal     ── Tool stack cards
                        │   ├── BuildPaths      ── Goal pathways
                        │   ├── FeaturedSystems ── All systems
                        │   └── DiscoveryCta    ── Final search CTA
                        │
                        ├── ToolsPage (/tools) ── Full Directory
                        │   ├── SmartSearch     ── Fuzzy search
                        │   ├── ToolConstellation ── D3 graph
                        │   ├── AddToolModal    ── Custom tool entry
                        │   └── ComparePanel    ── Side-by-side
                        │
                        ├── ToolDetailPage (/tool/:id)
                        │   ├── ToolRelationships ── Related tools
                        │   └── discoveryStore   ── Track views
                        │
                        ├── ImportPage (/import) ── PIN-gated
                        │   └── GitHub/Netlify import
                        │
                        ├── AdminPage (/admin) ── PIN-gated
                        │   └── Stats, data management
                        │
                        └── NotFoundPage (*) ── 404
```

---

## 2. Data Architecture Canvas

### Static Data (built-in)
```
src/data/tools.json ─────────────────────────────── 31 tools
  ├── id, name, description, category
  ├── version, status, icon (string), tags
  ├── github, docs, demo URLs
  ├── type: "internal" | "external"
  └── changelog: [{ version, date, changes[] }]

src/data/systems.js ─────────────────────────────── 8 systems + 7 goals
  ├── SYSTEMS: [{ id, name, icon, color, domain,
  │              description, workflow[5 steps], stack[toolIds] }]
  └── GOALS:   [{ id, name, icon, description,
                  pathways: [{ systemId, reason }] }]
```

### Dynamic Data (localStorage)
```
localStorage key                    │ Stored by           │ Consumed by
────────────────────────────────────┼─────────────────────┼──────────────────
favorites: [toolId, ...]            │ FavoritesContext    │ FavoritesContext
recent-tools: [toolId, ...]         │ RecentToolsContext  │ RecentToolsContext
pinned-tools: [toolId, ...]         │ PinnedContext       │ PinnedContext
os-theme: "dark" | "light"          │ ThemeContext        │ ThemeContext
custom-tools: [toolObj, ...]        │ AddToolModal        │ getAllTools()
imported-tools: [toolObj, ...]      │ ImportPage          │ getAllTools()
activity-log: [entry, ...]          │ ActivityContext     │ ActivityContext
admin-session: "unlocked"           │ AdminGate           │ AdminGate
weavestack-stacks: {...}            │ stackStore (zustand)│ StackBuilder
weavestack-discovery: {...}         │ discoveryStore      │ ToolDetailPage (view tracking)
```

### Data Merge Flow (in `getAllTools()`)
```
      tools.json (built-in 31)
           +
   localStorage('custom-tools') [added by user via AddToolModal]
           +
   localStorage('imported-tools') [imported from GitHub/Netlify]
           │
           ▼
    getAllTools() returns unified array
```

---

## 3. Page Composition Canvas

### Landing Page (`/`) — The Workshop

```
┌──────────────────────────────────────────────────┐
│  Navbar (fixed, transparent on landing)          │
│  ├── Logo + "WeaveStack"                         │
│  ├── [Home] [Tools] [Stack Builder] [Cmd+K]      │
│  └── Hamburger (mobile)                          │
├──────────────────────────────────────────────────┤
│  WORKSHOP HERO (WorkshopHero.jsx)                │
│  ├── 3D card display (HeroCard3D)                │
│  ├── Badge: "Workshop-First Tool Ecosystem v3.0" │
│  ├── Headline + subtitle                         │
│  ├── Radial system selector — "What are you      │
│  │   trying to build?"                           │
│  └── Systems arranged as radial menu             │
├──────────────────────────────────────────────────┤
│  WORKFLOW STORY (WorkflowStory.jsx)              │
│  ├── Appears after system selection              │
│  ├── Animated timeline of system workflow        │
│  ├── Horizontal stages with progress track       │
│  └── "See the tools" CTA → StackReveal          │
├──────────────────────────────────────────────────┤
│  STACK REVEAL (StackReveal.jsx)                  │
│  ├── Tool stack cards for selected system        │
│  ├── Connector arrows showing data flow          │
│  └── "Build this system" → /tools with filter    │
├──────────────────────────────────────────────────┤
│  BUILD PATHS (BuildPaths.jsx)                    │
│  ├── Accordion of 7 goal-driven pathways         │
│  └── Each goal shows linked system(s)           │
├──────────────────────────────────────────────────┤
│  FEATURED SYSTEMS (FeaturedSystems.jsx)          │
│  ├── Expandable accordion of all 8 systems       │
│  ├── Expanded: workflow + tool stack             │
│  └── "Build this system" CTA per system          │
├──────────────────────────────────────────────────┤
│  DISCOVERY CTA (DiscoveryCta.jsx)                │
│  ├── Search input + cycling placeholder          │
│  └── Submit navigates to /tools?search=X         │
├──────────────────────────────────────────────────┤
│  FOOTER (FooterSection.jsx)                      │
│  ├── Brand, links, social (GitHub)              │
│  └── Operational status indicator               │
└──────────────────────────────────────────────────┘
```

### Tools Page (`/tools`) — The Directory

```
┌──────────────────────────────────────────────────┐
│  Navbar (solid bg on scroll)                     │
├──────────────────────────────────────────────────┤
│  SEARCH + FILTER BAR                              │
│  ├── Category pills (all / AI / Trading / ...)   │
│  ├── Status filter (Active / Beta / Dev / All)   │
│  ├── Search input (SmartSearch)                   │
│  ├── View toggle: grid | list | constellation     │
│  └── "Add Tool" button                           │
├──────────────────────────────────────────────────┤
│  TOOL GRID / LIST / CONSTELLATION                 │
│  ├── Grid: cards with icon, title, tags, status   │
│  ├── List: compact rows with metadata             │
│  └── Constellation: D3 force graph (if selected) │
├──────────────────────────────────────────────────┤
│  ADD TOOL MODAL (AddToolModal.jsx)                │
│  └── Form: name, description, category, status    │
├──────────────────────────────────────────────────┤
│  COMPARE PANEL (fixed bottom, if active)          │
│  └── Up to 4 tools side-by-side                   │
└──────────────────────────────────────────────────┘
```

### Tool Detail Page (`/tool/:id`) — The Profile

```
┌──────────────────────────────────────────────────┐
│  Navbar                                           │
├──────────────────────────────────────────────────┤
│  HERO                                             │
│  ├── Icon (lucide) + name + status badge          │
│  ├── Pin / Favorite / Launch buttons              │
│  └── Version + type badge                         │
├──────────────────────────────────────────────────┤
│  DESCRIPTION                                      │
│  └── Full tool description from tools.json        │
├──────────────────────────────────────────────────┤
│  METADATA                                         │
│  ├── Tags (as clickable chips)                    │
│  ├── Category, type, version                      │
│  └── Links: GitHub, Docs, Demo                    │
├──────────────────────────────────────────────────┤
│  RELATIONSHIPS (ToolRelationships.jsx)             │
│  ├── "Used Together With" (workflow partners)     │
│  ├── "Complements"                                │
│  └── "Alternatives"                               │
├──────────────────────────────────────────────────┤
│  CHANGELOG                                        │
│  └── Timeline of version history                  │
└──────────────────────────────────────────────────┘
```

### Admin Page (`/admin`) — The Dashboard

```
┌──────────────────────────────────────────────────┐
│  Navbar                                           │
├──────────────────────────────────────────────────┤
│  PIN GATE (AdminGate.jsx)                         │
├──────────────────────────────────────────────────┤
│  QUICK STATS                                      │
│  ├── Total tools, categories, custom tools        │
│  └── Imported tools count                         │
├──────────────────────────────────────────────────┤
│  CATEGORY BREAKDOWN (pie chart)                   │
├──────────────────────────────────────────────────┤
│  STATUS BREAKDOWN (donut chart)                   │
├──────────────────────────────────────────────────┤
│  ACCENT COLOR PICKER                              │
│  └── 6 presets: Indigo, Violet, Cyan, Green,     │
│                  Amber, Rose                      │
├──────────────────────────────────────────────────┤
│  DATA MANAGEMENT                                  │
│  ├── Clear imported tools                         │
│  ├── Clear custom tools                           │
│  ├── Clear activity log                           │
│  ├── Clear pinned tools                           │
│  └── Reset all data                               │
└──────────────────────────────────────────────────┘
```

---

## 4. User Journey Canvas

### Primary Journey: Discovery → Action

```
DISCOVERY PHASE                            ACTION PHASE
───────────────                            ────────────
1. User lands on /                         
2. Interacts with WorkshopHero             
3. Selects a system from radial menu       4. Watches WorkflowStory animation
                                            5. Sees StackReveal (tools needed)
                                            6. Clicks "Build this system"
                                            
7. Browses BuildPaths / FeaturedSystems    8. Navigates to /tools with filter
9. Uses DiscoveryCta search                10. Views tool detail
                                           11. Launches tool (external link)
                                           └─ or adds to compare
                                           └─ or favorites / pins
```

### Secondary Journey: Workshop → Stack

```
1. User lands on /
2. Interacts with WorkshopHero (selects a system)
3. Watches WorkflowStory animation
4. Sees StackReveal (the tools needed)
5. Clicks "Build this system"
6. Navigates to /tools with pre-filtered category
```

### Admin Journey

```
1. User navigates to /admin
2. Enters PIN (default 9999)
3. Views stats and breakdowns
4. Manages data (clear/import)
5. Changes accent color
6. Session persists until tab close
```

### Import Journey

```
1. User navigates to /import
2. Enters PIN
3. Selects import source:
   ├── GitHub: enter username, optional token
   │    └─ select repos to import as tools
   └── Netlify: enter personal access token
        └─ select sites to import as tools
4. Tools appear in localStorage + tool listings
```

---

## 5. State Machine Canvas

### App-level state providers (nested):
```
ThemeProvider            ── dark/light toggle + localStorage
  └─ FavoritesProvider   ── favorite tool IDs set
       └─ PinnedProvider ── pinned tool IDs set
            └─ RecentToolsProvider ── last 20 opened tools
                 └─ ActivityProvider ── action log (max 200)
                      └─ RouterProvider
```

### Component state (local to page):
- ToolsPage: `searchQuery`, `selectedCategory`, `selectedStatus`, `viewMode` (grid|list|constellation)
- LandingPage: `selectedSystem` (null | systemId), `workshopStage` (hero|workflow|stack|...
- Navbar: `mobileMenuOpen`, `searchOpen`, `stackBuilderOpen`
- ComparePanel: `compareList` (from zustand store)

---

## 6. Relationship Canvas

```
TOOLS ──(categorized_by)──> CATEGORIES (7)
  │                              │
  │                              ▼
  ├──(has_relationship)──> OTHER TOOLS
  │    ├── workflow partners     │
  │    ├── complements           ├── AI (8 tools)
  │    └── alternatives          ├── Trading (7 tools)
  │                              ├── Development (6 tools)
  ├──(belongs_to_system)──> SYSTEMS (8) │
  │    ├── has workflow          ├── Automations (5 tools)
  │    ├── has stack             ├── Utilities (5 tools)
  │    └── serves goals          ├── Restaurant (3 tools)
  │                              └── Archive (3 tools)
  └──(discovered_via)──> DISCOVERY ENGINE
       ├── trending weights
       ├── user favorites
       └── view history
```

---

## 7. Build Pipeline Canvas

```
Source: src/*.jsx + src/*.css + tools.json
           │
           ▼
Vite bundler (vite.config.js)
   ├── React plugin
   ├── @ alias -> src/
   └── Code splitting:
        ├── vendor chunk (react, react-dom, react-router-dom)
        ├── motion chunk (framer-motion)
        └── icons chunk (lucide-react)
           │
           ▼
Output: dist/
   ├── index.html
   ├── favicon.svg
   ├── _headers (security + caching)
   ├── _redirects (SPA fallback)
   └── assets/
        ├── index-*.css
        ├── index-*.js
        ├── vendor-*.js
        ├── motion-*.js
        └── icons-*.js
           │
           ▼
Deploy ──> Cloudflare Pages (npm run deploy)
        └─> Netlify (git push)
        └─> Vercel (git push)
        └─> GitHub Pages (manual)
```

---

## 8. Future Expansion Canvas (not yet built)

```
 ┌─ Shareable stack URLs (hash-based)
 ├─ System comparison (side-by-side workflows)
 ├─ Onboarding walkthrough (first-time user)
 ├─ Tool "health" indicators (last updated, maintainer activity)
 ├─ Community tool submissions (via GitHub issues integration)
 ├─ Visual stack builder (drag-drop pipeline canvas)
 ├─ Export stack as markdown/JSON
 ├─ Multi-language support (i18n)
 ├─ PWA (service worker for offline use)
 ├─ Keyboard shortcut reference modal
 └─ API for external consumers
```
