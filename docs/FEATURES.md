# WeaveStack — Features

## Overview

WeaveStack is organized into **6 feature domains**: Discovery, Workshop, Tools, Admin, Intelligence, and UI/UX. Each domain contains one or more features.

---

## 1. DISCOVERY DOMAIN

Features that help users find and explore tools.

### 1.1 Smart Search
**File**: `src/components/ui/SmartSearch.jsx` · `src/utils/smartSearch.js`

Full-text search with fuzzy matching, natural language processing, and category aliasing.
- Fuzzy matching (tolerates typos, partial words)
- Natural language patterns (`"tool for X"`, `"find X"`, `"X tool"`)
- Category alias resolution (e.g., `"chart"` → `"utilities"`)
- Keyboard navigation (arrow keys, Enter, Escape)
- Recent tools shown as suggestions
- Category-scoped search via `/tools?category=X`

### 1.2 Interactive Constellation Graph
**File**: `src/components/ui/ToolConstellation.jsx` · `src/utils/relationships.js`

D3 force-directed graph showing all tools as connected nodes.
- Color-coded nodes by category
- Edges for workflow, complement, and alternative relationships
- Drag nodes, zoom/pan canvas
- Click node → navigate to tool detail page
- Legend with category color key
- Highlight on hover

### 1.3 Discovery Engine
**File**: `src/stores/discoveryStore.js`

Zustand store with persist middleware for discovery recommendations.
- `trackView(toolId)`: records a tool view (capped at 100, deduped)
- `getRecommendations(tools)`: personalized recs based on viewed categories
- `getTrending(tools)`: globally trending tools by view count
- `discoveryScore`: cumulative engagement score (capped at 100)
- `trendingWeights`: map of toolId → view count
- Persists to localStorage as `weavestack-discovery`

### 1.4 Recent Tools
**File**: `src/hooks/useRecentTools.js` · `src/context/RecentToolsContext.jsx`

Tracks the last 20 tools the user has opened.
- Stored in localStorage
- Displayed in search dropdown and Navbar Cmd+K palette
- Resolved to full tool objects (with title, icon, category)

---

## 2. WORKSHOP DOMAIN

Features that guide users from goal to stack. These form the interactive "workshop" on the landing page.

### 2.1 Workshop Hero (Radial Selector)
**File**: `src/components/workshop/WorkshopHero.jsx`

Interactive hero section with 3D card display and radial system selector.
- Left: HeroCard3D — stacked tool cards with CSS perspective tilt-on-hover (framer-motion spring physics)
- Right: "What are you trying to build?" prompt with radial system menu
- Systems arranged in a circle around center prompt
- Hover: tooltip with system name and brief description
- Select: triggers WorkflowStory and StackReveal
- Mobile: bottom sheet selector (vertical list)
- Selected state: highlighted with system color
- Auto-advances to next workshop stage on selection

### 2.2 Workflow Story (Animated Timeline)
**File**: `src/components/workshop/WorkflowStory.jsx`

Animated workflow timeline for the selected system.
- Horizontal layout on desktop, vertical on mobile
- Stages connected by a progress track line
- Auto-advances through stages with staggered delay
- Each stage: icon + title + short description
- Completion: "See the tools" CTA button
- Uses system color for progress line highlighting

### 2.3 Stack Reveal
**File**: `src/components/workshop/StackReveal.jsx`

Displays the recommended tool stack for a selected system.
- Tool cards with icon, name, purpose, capabilities(expandable)
- Connector arrows between tools showing data flow
- Stats: setup difficulty, best for, tool count
- "Build this system" button (navigates to /tools with filter)
- Resolves tool IDs from systems.js to full tool data from tools.json

### 2.4 Build Paths (Goals)
**File**: `src/components/workshop/BuildPaths.jsx`

Accordion of goal-driven pathways.
- 7 goals: Grow Revenue, Automate Work, Launch SaaS, Build AI Agent, Trade Markets, Run Restaurant, Generate Content
- Expandable accordion: each goal shows linked systems
- Each pathway: system name + brief reason why it serves that goal
- Navigate to system selection on pathway click

### 2.5 Featured Systems
**File**: `src/components/workshop/FeaturedSystems.jsx`

Expandable accordion of all 8 featured systems.
- Each system panel: name, icon, color, domain badge
- Expanded: full description, workflow steps list, tool stack
- Tool names link to tool detail pages
- "Build this system" CTA per system

### 2.6 Discovery CTA
**File**: `src/components/workshop/DiscoveryCta.jsx`

Final call-to-action section.
- Search input with placeholder text (`"Tell us what you want to build"`)
- Cycling placeholder suggestions (rotating every 3s)
- Submit button navigates to tools page with search query
- Subtle decorative background

---

## 3. TOOLS DOMAIN

Features for viewing, managing, and comparing individual tools.

### 3.1 Tool Grid
**File**: `src/pages/ToolsPage.jsx`

Primary tool listing view.
- Card-based grid layout
- Each card: lucide icon, name, description, category badge, status badge, tags
- Pin button (star icon), Favorite button (heart icon)
- Click card → navigate to tool detail
- Responsive: 1-col mobile, 2-col tablet, 3-col desktop

### 3.2 Tool List View
**File**: `src/pages/ToolsPage.jsx`

Compact list view alternative to grid.
- Rows with icon, name, category, status, version, action buttons
- Sortable columns (by name, category, status)
- Better for scanning many tools

### 3.3 Tool Filtering
**File**: `src/pages/ToolsPage.jsx`

Multi-dimensional filtering system.
- Category pills (All, AI, Trading, Development, Automations, Utilities, Restaurant, Archive)
- Status filter (All, Active, Beta, Dev)
- Search query (SmartSearch integration)
- URL query parameter sync (`/tools?category=AI&status=active`)

### 3.4 Tool Detail Page
**File**: `src/pages/ToolDetailPage.jsx`

Full tool profile page.
- Hero section: large icon, name, status badge, version, type badge
- Pin / Favorite / Launch (external link) buttons
- Full description
- Metadata: category, tags (clickable chips), version, type, links (GitHub, Docs, Demo)
- Relationships section (see 3.6)
- Changelog timeline (version history from tools.json)

### 3.5 Compare Panel
**File**: `src/components/ui/ComparePanel.jsx` · `src/stores/compareStore.js`

Side-by-side comparison of up to 4 tools.
- Each column: icon, name, category, status, version, type, description
- Tags displayed per tool
- Add/remove tools from comparison
- Zustand store manages compare list
- Fixed bottom panel when active

### 3.6 Tool Relationships
**File**: `src/components/ui/ToolRelationships.jsx` · `src/utils/relationships.js`

Shows related tools grouped by relationship type.
- **"Used Together With"** — workflow partners (tools that work together in a pipeline)
- **"Complements"** — complementary tools (different but related)
- **"Alternatives"** — alternative tools (similar purpose)
- Clickable chips navigate to tool detail
- Relationship data in `src/utils/relationships.js` (static map)

### 3.7 Add Custom Tool
**File**: `src/components/ui/AddToolModal.jsx`

Modal form for users to add their own tools.
- Fields: name, description, category (dropdown), status (dropdown), URL, tags
- Saves to localStorage `custom-tools`
- Appears in all tool listings via `getAllTools()`

### 3.8 Command Palette (Cmd+K)
**File**: `src/components/layout/Navbar.jsx`

Quick search overlay accessible via Ctrl/Cmd+K.
- Opens overlay with search input
- Shows recent tools as suggestions
- Fuzzy search across all tools
- Keyboard navigation (arrow keys, Enter)
- Navigate to tool detail or filtered page

---

## 4. ADMIN DOMAIN

Features for power users and administrators.

### 4.1 Admin Dashboard
**File**: `src/pages/AdminPage.jsx`

PIN-protected admin panel.
- Quick stats: total tools, categories, custom tools, imported tools
- Category breakdown (recharts pie chart)
- Status breakdown (recharts donut chart)
- Monthly growth (recharts bar chart)
- Category insights (top categories with percentages)

### 4.2 Accent Color Picker
**File**: `src/pages/AdminPage.jsx`

6 preset accent colors for UI personalization.
- Indigo (default `#6366f1`), Violet (`#8b5cf6`), Cyan (`#06b6d4`)
- Green (`#22c55e`), Amber (`#f59e0b`), Rose (`#f43f5e`)
- Persisted in localStorage `os-theme`
- Updates CSS variable `--accent` globally

### 4.3 Data Management
**File**: `src/pages/AdminPage.jsx`

Clear/reset user data from admin panel.
- Clear imported tools
- Clear custom tools
- Clear activity log
- Clear pinned tools
- Reset all data

### 4.4 Admin Gate
**File**: `src/components/ui/AdminGate.jsx`

PIN-based access control for admin pages.
- PIN configured via `VITE_ADMIN_PIN` env var (default `9999`)
- Session stored in `sessionStorage` (cleared on tab close)
- Lock/unlock toggle
- Non-intrusive: locks on route entry, not on app mount

### 4.5 Import Tools (GitHub)
**File**: `src/pages/ImportPage.jsx`

Import tools from GitHub repositories.
- Enter GitHub username
- Optional personal access token (for private repos)
- Fetches repo list, user selects which to import
- Imports to localStorage: repo name → tool name, description, GitHub URL, dev status

### 4.6 Import Tools (Netlify)
**File**: `src/pages/ImportPage.jsx`

Import tools from Netlify sites.
- Enter Netlify personal access token
- Fetches site list, user selects which to import
- Imports to localStorage: site name → tool name, URL, active status

---

## 5. INTELLIGENCE DOMAIN

Features that provide insights, analytics, and smart recommendations.

### 5.1 Discovery Engine
**File**: `src/stores/discoveryStore.js`

Zustand store with persist middleware for discovery recommendations.
- `trackView(toolId)`: records a tool view (capped at 100, deduped)
- `getRecommendations(tools)`: personalized recs based on viewed categories
- `getTrending(tools)`: globally trending tools by view count
- `discoveryScore`: cumulative engagement score (capped at 100)
- `trendingWeights`: map of toolId → view count
- Persists to localStorage as `weavestack-discovery`

### 5.4 Stack Builder
**File**: `src/components/ui/StackBuilder.jsx` · `src/stores/stackStore.js`

Tool stack recommendation engine with keyword matching.
- Natural language query input or preset selection
- Keywords matched against 6 stack templates:
  - AI Support Bot, Lead Generation, Trading Automation
  - Knowledge Base, Restaurant Ordering, DevOps Pipeline
- Each template: name, description, tools (string IDs), explanation, question
- Results: tool cards with rationale for each recommendation
- Save stack to localStorage via `weavestack-stacks` persistence

---

## 6. UI/UX DOMAIN

Features that enhance the user experience, navigation, and visual polish.

### 6.1 Cool/Indigo Theme (default)
**File**: `src/index.css`

Light/air-themed UI with cool-toned color palette.
- Cool-toned light backgrounds (`#f0f3fa` base, `#ffffff` surfaces)
- High contrast text (`#0f172a`) with muted secondary colors
- Indigo accent (`#6366f1`) for interactive elements
- Light glass surfaces with backdrop blur
- Subtle indigo grid and dot background patterns
- 3D perspective utilities (`.perspective-1000`, `.preserve-3d`)

### 6.2 Warm/Amber Theme (`.light-mode`)
**File**: `src/context/ThemeContext.jsx` · `src/index.css`

Toggleable warm variant via localStorage `os-theme`. 33 CSS variable overrides switch from cool/indigo to warm/amber.
- Warm cream backgrounds (`#fefcf5` base, `#ffffff` surfaces)
- Amber accent (`#d97706`) for interactive elements
- Warm stone text (`#292524`) with complementary muted tones
- Shadows re-based to warm stone (`rgba(41,37,36, ...)`)
- Toggled via `.light-mode` class on `<html>` — no UI button currently exists

### 6.3 Fixed Navigation
**File**: `src/components/layout/Navbar.jsx`

Fixed top navigation bar with context-aware styling.
- Transparent on landing page, solid on scroll/other pages
- Logo + brand name
- Nav links: Home, Tools
- Stack Builder button (opens modal)
- Cmd+K command palette trigger
- Mobile: hamburger menu with slide-in overlay
- Recent tools shown in search

### 6.4 Scroll Reveal Animations
**File**: `src/index.css`

CSS-only scroll-reveal system using IntersectionObserver.
- Classes: `.reveal`, `.animate-fade-up`, `.animate-scale-in`
- Delays: `.delay-100` through `.delay-800`
- Cubic-bezier easing `(0.16, 1, 0.3, 1)` — smooth ease-out
- Applied to sections, cards, and content blocks

### 6.5 Favorites System
**File**: `src/context/FavoritesContext.jsx` · `src/hooks/useFavorites.js`

Cross-page favorites functionality.
- Heart icon toggle on tool cards and detail pages
- Stored in localStorage as array of tool IDs
- Used for personalization (discovery recommendations)
- Consistent favorite count and state across app

### 6.6 Pinned Tools
**File**: `src/context/PinnedContext.jsx`

Pin system for quick-access tool marking.
- Star/pin icon toggle on tool cards and detail pages
- Stored in localStorage
- Indicates "bookmarked" or "important" status
- Separate from favorites (user can mark two ways)

### 6.7 Activity Log
**File**: `src/context/ActivityContext.jsx`

Implicit activity tracking for analytics.
- Logs: tool views, page visits, imports, custom tool additions
- Max 200 entries (FIFO eviction)
- Used by admin dashboard metrics
- Clearable from admin panel

### 6.8 Loading States
**File**: Various components

Loading indicators for async operations.
- Spinner during GitHub/Netlify import fetching
- Skeleton cards during data resolution
- Modal loading states for stack builder

### 6.9 Empty States
**File**: `src/pages/ToolsPage.jsx`

Graceful empty states for zero results.
- "No tools found" with suggestion to adjust filters
- Category-specific empty messages
- Quick filter reset button

---

## 7. STANDALONE HTML FILES

Non-React HTML files included in the project.

### 7.1 weavestack-showcase.html
**File**: `weavestack-showcase.html`

Full-featured standalone showcase page (703 lines). All CSS/JS/data inlined.
- Hero with canvas particle network
- Stats section with animated counters
- Features grid (12 feature cards)
- Stack builder with 6 presets and keyword matching
- Smart search with fuzzy matching
- D3 force-directed constellation graph
- Analytics (pie chart + bar chart on canvas)
- Tools grid with 33 tools (favorite/pin/filter)
- Tool detail modal
- All data embedded as JS objects

### 7.2 weavestack-nov1.html
**File**: `weavestack-nov1.html`

Noomo-inspired standalone HTML page (381 lines).
- Preloader with circular CSS mask reveal animation
- Hero with Playfair Display serif italic typeface
- Right-shifted hero word with character-level kerning
- Glassmorphism navigation
- "Reimagine"-style button with animated gradient border + letter-by-letter animation
- 4 outcome sections (Support, Trading, Automation, Restaurant) with orb visuals
- Fixed footer with stagger-item animation
- "Scroll to explore" prompt with animated line
- IntersectionObserver scroll reveals

---

## 8. DATA LAYER

### 8.1 Tool Data Model
**Source**: `src/data/tools.json`

```javascript
{
  id: "crypto-alert-bot",
  name: "Crypto Alert Bot",
  description: "Real-time cryptocurrency price monitoring...",
  category: "Trading",    // AI | Trading | Development | Automations | Utilities | Restaurant | Archive
  version: "2.1.0",
  status: "active",       // active | beta | dev | archived
  icon: "Bitcoin",        // maps to lucide-react icon name
  tags: ["crypto", "alerts", "trading", "automation"],
  github: "https://github.com/...",
  docs: "https://...",
  demo: "https://...",
  type: "internal",       // internal | external
  changelog: [
    { version: "2.1.0", date: "2026-01-15", changes: ["Added...", "Fixed..."] }
  ]
}
```

### 8.2 System Data Model
**Source**: `src/data/systems.js`

```javascript
SYSTEM: {
  id: "customer-support",
  name: "Customer Support Assistant",
  icon: "💬",
  color: "#8b5cf6",
  domain: "AI",
  shortDesc: "...",
  description: "...",
  setup: "Medium",
  ideal: "Support teams & helpdesk operators",
  workflow: [
    { stage: "Customer submits question", detail: "...", icon: "📨" }
  ],
  stack: ["supportweave", "knowledgos", "prompt-generator", "ai-chat-dashboard"]
}

GOAL: {
  id: "grow-revenue",
  name: "Grow Revenue",
  icon: "📈",
  description: "...",
  pathways: [
    { systemId: "lead-generation", reason: "..." }
  ]
}
```

### 8.3 Relationship Data Model
**Source**: `src/utils/relationships.js`

```javascript
RELATIONSHIPS: {
  "supportweave": {
    complements: ["ai-chat-dashboard"],
    alternatives: ["knowledgos"],
    workflow: ["knowledgos", "prompt-generator"]
  }
}
```

### 8.4 Stack Template Model
**Source**: `src/stores/stackStore.js`

```javascript
STACK_TEMPLATE: {
  id: "ai-support-bot",
  name: "AI Support Bot",
  question: "AI Support Bot",
  description: "Automated customer support...",
  tools: ["supportweave", "knowledgos", "leadlaunch"],  // string IDs
  explanation: "SupportWeave handles email triage..."
}
```
