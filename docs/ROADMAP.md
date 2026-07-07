# WeaveStack — Roadmap & Known Issues

## Current State

WeaveStack v3.0.1 is a **light-theme, discovery-first tool ecosystem** with an interactive workshop landing page, full tool directory, and admin dashboard. All v2→v3 migration cleanup (unused sections, stale fonts, missing theme variables, dead CSS) is complete. The project is clean, deployable, and ready for feature work.

---

## Short-Term Fixes (Next Session)

| Priority | Issue | Files | Description |
|----------|-------|-------|-------------|
| Medium | Theme toggle has no UI | `ThemeContext.jsx`, `Navbar.jsx` | Theme toggle exists in context but no button triggers `.light-mode` switching. Add a toggle to Navbar or settings panel. |
| Medium | Empty states in workshop | `WorkshopHero.jsx`, `FeaturedSystems.jsx` | WorkshopHero has no "no systems" state; FeaturedSystems empty rail needs better messaging. |
| Low | Toast notifications | `Navbar.jsx`, `FavoritesContext.jsx` | No feedback on save/pin/favorite actions. Add lightweight toast system. |

---

## Medium-Term Improvements

### Performance
- Lazy-load pages with `React.lazy()` + `Suspense` instead of eager imports in router
- Reduce framer-motion bundle — evaluate `motion` standalone vs full library
- Memoize heavy components (ToolConstellation d3 re-render, ToolDetailPage context consumers)

### UX
- **Keyboard shortcuts**: Full shortcut reference modal (currently only Cmd+K)
- **Onboarding**: First-visit walkthrough highlighting the workshop flow
- **Shareable stack URLs**: Encode selected system + tools in URL hash for sharing

### Data
- **Validate localStorage data** on load (handle corrupted JSON gracefully)
- **Import dedup**: Better duplicate detection when importing from GitHub/Netlify
- **Relationship editor**: Allow admins to add/edit tool relationships in AdminPage

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
- **Tool Health**: Show last updated date, maintainer activity, API status
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
| 2026-07-07 | v3.0.1 | Cleanup: removed 9 unused files (HeroSection, CategoryGrid, DiscoveryCarousels, FeaturedTools, RecentUpdates, StatsSection, WorkflowSection, AnalyticsSection, EcosystemHero). Fixed tailwind.config.js font families (Cabinet Grotesk→Plus Jakarta Sans, Satoshi→Inter). Completed `.light-mode` CSS with warm/amber alternative theme. Added AGENTS.md. |
| 2026-07-06 | v3.0.0 | Bugfix: migrated 18 files from dark-theme --os-* vars to light-theme --* vars. Removed tool detail page sidebar layout, unified to hero card. |
| 2026-07-06 | v3.0.0 | Light theme redesign: replaced dark theme with light/air color palette, Plus Jakarta Sans + Inter fonts, 3D hero components, platform layout, workshop landing flow. |
| 2026-07-06 | v3.0.0 | Initial workshop redesign: interactive workshop flow replaces old landing page. |
| 2026-06 | v2.0.0 | Major refactor: dark theme, Cabinet Grotesk + Satoshi fonts, 5 context providers, zustand stores, full admin panel. |
