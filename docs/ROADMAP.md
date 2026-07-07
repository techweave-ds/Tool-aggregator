# WeaveStack — Roadmap & Known Issues

## Current State

WeaveStack v3.0 is a **light-theme, discovery-first tool ecosystem** with an interactive workshop landing page, full tool directory, and admin dashboard. The project is complete and deployable but has known issues and unfinished features.

---

## Short-Term Fixes (Next Session)

| Priority | Issue | Files | Description |
|----------|-------|-------|-------------|
| High | HeroSection.jsx vs WorkshopHero.jsx conflict | `LandingPage.jsx`, `HeroSection.jsx` | LandingPage uses workshop components. HeroSection.jsx (old landing) is unused but still imports EcosystemHero + StackBuilder. Clean up unused sections. |
| High | Tailwind font config stale | `tailwind.config.js` | Font families in config (Cabinet Grotesk, Satoshi) don't match actual usage (Plus Jakarta Sans, Inter). Update or remove. |
| Medium | ThemeContext light-mode incomplete | `ThemeContext.jsx`, `index.css` | `.light-mode` class toggles but light CSS variables are undefined. The project is effectively light-only now. Remove theme toggle or complete the light variables. |
| Medium | Missing AGENTS.md | root | Should document commands (npm run dev/build/deploy) for AI coding assistants. |
| Low | index.css .noise class | `index.css` | `.noise` texture overlay class exists but isn't applied anywhere. Remove or wire it in. |

---

## Medium-Term Improvements

### Performance
- Lazy-load pages with `React.lazy()` + `Suspense` instead of eager imports in router
- Reduce framer-motion bundle — evaluate `motion` standalone vs full library
- Memoize heavy components (ToolConstellation d3 re-render, ToolDetailPage context consumers)

### UX
- **Empty states**: WorkshopHero has no "no systems" state; FeaturedSystems empty rail needs better messaging
- **Keyboard shortcuts**: Full shortcut reference modal (currently only Cmd+K)
- **Onboarding**: First-visit walkthrough highlighting the workshop flow
- **Toast notifications**: For save/pin/favorite actions (currently no feedback)
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
- **Light mode polish**: Complete the ThemeContext light switch with proper CSS variable overrides
- **Dark mode reintroduction**: Option to switch back to a dark variant
- **Animated "weaving" visual**: Thread/strand metaphor for stack composition
- **Tool "sounds"**: Subtle audio feedback on key interactions

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-07-06 | v3.0.0 | Bugfix: migrated 18 files from dark-theme --os-* vars to light-theme --* vars. Removed tool detail page sidebar layout, unified to hero card. |
| 2026-07-06 | v3.0.0 | Light theme redesign: replaced dark theme with light/air color palette, Plus Jakarta Sans + Inter fonts, 3D hero components, platform layout, workshop landing flow. |
| 2026-07-06 | v3.0.0 | Initial workshop redesign: interactive workshop flow replaces old landing page. |
| 2026-06 | v2.0.0 | Major refactor: dark theme, Cabinet Grotesk + Satoshi fonts, 5 context providers, zustand stores, full admin panel. |
