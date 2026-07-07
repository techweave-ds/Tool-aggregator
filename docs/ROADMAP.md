# WeaveStack — Roadmap & Known Issues

## Current State

WeaveStack v3.1.0 is a **light-theme, discovery-first tool ecosystem** with all v2→v3 migration cleanup complete. Phases 1-4 of feature work are shipped: theme toggle, toast system, empty states, React.lazy() code-splitting, memoization, shareable stack URLs, import dedup, relationship editor, and tool health indicators.

---

## Next Up (Short-Term)

| Priority | Issue | Files | Description |
|----------|-------|-------|-------------|
| Medium | Keyboard shortcuts modal | `Navbar.jsx` | Full shortcut reference (currently only Cmd+K). Add modal showing all keyboard shortcuts. |
| Low | Onboarding walkthrough | `LandingPage.jsx`, `WorkshopHero.jsx` | First-visit tutorial highlighting the workshop flow. |

---

## Medium-Term Improvements

### Performance
- Reduce framer-motion bundle — evaluate `motion` standalone vs full library
- Memoize ToolDetailPage context consumers (currently re-renders on every tool change)

### UX
- **Onboarding**: First-visit walkthrough highlighting the workshop flow
- **Dark mode reintroduction**: Option to switch back to a dark variant

### Dev Experience
- Add ESLint + Prettier config
- Set up basic component tests with Vitest
- Add PropTypes or migrate to TypeScript
- Document release process (npm version bump, changelog)

---

## Long-Term Vision

### Feature Additions
- **Visual Stack Builder**: Drag-and-drop canvas for composing tool pipelines
- **Community Tools**: GitHub Issues integration for tool submissions
- **Export**: Export stack as markdown, JSON, or shareable link
- **System Comparison**: Side-by-side workflow comparison between systems
- **PWA**: Service worker for offline access + install prompt

### Platform
- **Search API**: Public endpoint for external consumers to query tools
- **Multi-language**: i18n framework with English + Hindi as first languages
- **Backend integration**: Optional sync layer for cross-device persistence

### Design
- **Dark mode reintroduction**: Option to switch back to a dark variant
- **Animated "weaving" visual**: Thread/strand metaphor for stack composition
- **Tool "sounds"**: Subtle audio feedback on key interactions

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-07-07 | v3.1.0 | Phase 4: Admin relationship editor (select tool, edit complements/alternatives/workflow, save overrides to localStorage). Tool health indicators (active/maintained/stable/dormant computed from changelog dates + status). |
| 2026-07-07 | v3.1.0 | Phase 3: Shareable stack URLs via `#systemId` hash. Import dedup in `getAllTools()` (filters by unique ID, includes imported-tools in merge). localStorage validation already handled by useLocalStorage try/catch. |
| 2026-07-07 | v3.1.0 | Phase 2: `React.lazy()` code-split across 6 page chunks (main entry 218 kB→52 kB). `memo()` on ToolConstellation to prevent d3 re-renders. Suspense boundary with spinner in RootLayout. |
| 2026-07-07 | v3.1.0 | Phase 1: Theme toggle (Sun/Moon button in Navbar, cool/indigo↔warm/amber). Toast notification system (pin/fav feedback via ToastContext). Empty states in WorkshopHero and FeaturedSystems. |
| 2026-07-07 | v3.0.1 | Cleanup: removed 9 unused files (HeroSection, CategoryGrid, DiscoveryCarousels, FeaturedTools, RecentUpdates, StatsSection, WorkflowSection, AnalyticsSection, EcosystemHero). Fixed tailwind.config.js font families. Completed `.light-mode` CSS. Added AGENTS.md. |
| 2026-07-06 | v3.0.0 | Bugfix: migrated 18 files from dark-theme --os-* vars to light-theme --* vars. Removed tool detail page sidebar layout, unified to hero card. |
| 2026-07-06 | v3.0.0 | Light theme redesign: replaced dark theme with light/air color palette, Plus Jakarta Sans + Inter fonts, 3D hero components, platform layout, workshop landing flow. |
| 2026-07-06 | v3.0.0 | Initial workshop redesign: interactive workshop flow replaces old landing page. |
| 2026-06 | v2.0.0 | Major refactor: dark theme, Cabinet Grotesk + Satoshi fonts, 5 context providers, zustand stores, full admin panel. |
