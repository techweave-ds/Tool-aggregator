# WeaveStack — AGENTS.md

## Commands

```bash
npm run dev        # Dev server at localhost:5173
npm run build      # Production build to dist/
npm run preview    # Preview build locally
npm run deploy     # Deploy to Cloudflare Pages (wrangler auth required)
```

## Project Conventions

- **No linter/TypeScript** — plain JSX, no ESLint/Prettier
- **All styles in src/index.css** — CSS variables for theming, inline `style={}` in components
- **No Tailwind classes in JSX** — `style={{ color: 'var(--text)' }}` pattern
- **`@` alias** points to `src/` (vite.config.js)
- **5 context providers** in App.jsx: Theme, Favorites, Pinned, RecentTools, Activity
- **3 zustand stores**: compareStore, discoveryStore, stackStore
- **Data merge**: `getAllTools()` merges `tools.json` + localStorage('custom-tools') + localStorage('imported-tools')

## File Structure Pattern

- Components: PascalCase, `src/components/{layout|sections|workshop|ui}/`
- Pages: PascalCase, `src/pages/`
- Context: PascalCase, `src/context/`
- Stores: camelCase, `src/stores/`
- Hooks: camelCase, `src/hooks/`
- Utils: camelCase, `src/utils/`
- Data: lowercase, `src/data/`

## Key Files

- `src/index.css` — ALL CSS (variables, utilities, keyframes)
- `src/data/tools.json` — 31 built-in tools
- `src/data/systems.js` — 8 systems + 7 goals
- `src/utils/tools.js` — `getAllTools()` merge function
- `src/utils/relationships.js` — tool relationship map
- `src/utils/smartSearch.js` — fuzzy search engine
- `src/pages/LandingPage.jsx` — workshop flow (homepage)
- `src/pages/ToolsPage.jsx` — tool directory

## Deploy

- Cloudflare Pages is primary target (`wrangler.toml`)
- Netlify also configured (`netlify.toml`)
- Admin PIN defaults to `9999`, override via `VITE_ADMIN_PIN`
