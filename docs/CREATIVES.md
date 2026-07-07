# WeaveStack — Creative Direction

## 1. Brand Essence

WeaveStack is not a marketplace. It is a **workshop** — a place where users come to figure out what they need, understand how tools connect, and leave with a plan.

The brand lives at the intersection of:
- **Craft** (intentional building, thoughtful composition)
- **Discovery** (exploration, serendipity, "aha" moments)
- **Systems Thinking** (connections, relationships, workflows)

### Tagline
**"Build Anything"** — short, bold, empowering.

### Value Proposition
*"Choose an outcome. We'll show you the workflow and the tools that make it possible."*

---

## 2. Brand Voice

| Attribute | Description |
|-----------|-------------|
| **Tone** | Direct, confident, helpful. Never hype-driven or salesy. |
| **Persona** | An expert teammate who knows the tool landscape and can guide you. |
| **Vocabulary** | "Stack", "system", "outcome", "workflow", "weave", "discover" |
| **Avoid** | "Revolutionary", "game-changing", "AI-powered" (unless specific) |
| **UX microcopy** | Short, clear, action-oriented. "Explore outcomes", "Build this system", "See the tools" |

### Voice Examples
- Hero: *"What are you trying to build?"*
- CTA: *"Tell us what you want to build"*
- Empty state: *"No tools found. Try a different search."*
- Onboarding: *"Start with a goal, discover your stack."*

---

## 3. Visual Mood Board

### Aesthetic Pillars

1. **Light + Airy**
   - Cool-toned light backgrounds (`#f0f3fa`)
   - Indigo accent highlights for depth
   - Subtle indigo grid and dot patterns
   - Light glass surfaces with backdrop blur

2. **Technical + Clean**
   - No gradients for the sake of decoration — every visual has purpose
   - Data-rich: charts, graphs, node networks, badges
   - Monospace for version numbers, IDs, code snippets
   - Sharp corners + subtle rounded corners (8-12px)

3. **Connected + Flowing**
   - Lines, arrows, edges between elements (ToolConstellation, WorkflowStory)
   - Force-directed graphs showing tool relationships
   - Animated pipeline stages
   - Smooth scroll-based reveals

4. **Pristine + Spacious**
   - Generous whitespace on light background
   - Minimal UI chrome
   - Content is the interface
   - Animations serve clarity, not spectacle

### Visual References
- **Dev tools**: Vercel dashboard, Linear, Sentry
- **Platform UIs**: Stripe, Notion (light mode surfaces, clean layouts)
- **AI interfaces**: ChatGPT, Claude (conversational discovery)
- **Design**: Raycast, Linear (pixel-perfect light mode)

---

## 4. The "Workshop" Metaphor

The landing page is a **workshop-first** flow — users enter an interactive workshop:

```
Step 1: "What are you trying to build?"     (WorkshopHero — 3D cards + radial menu)
Step 2: "Here's how it works"               (WorkflowStory — animated timeline)
Step 3: "Here's the stack"                  (StackReveal — tool cards + arrows)
Step 4: "Or start with a goal"              (BuildPaths — goal pathways accordion)
Step 5: "Explore all systems"               (FeaturedSystems — expandable accordion)
Step 6: "Tell us what you want to build"    (DiscoveryCta — search CTA)
```

This flow mirrors a consultation: *"What do you need? → Here's how we'd build it → Here are the parts → What's next?"*

---

## 5. Category Identity (Visual Language per Domain)

Each category/outcome has a distinct color, icon, and visual treatment:

| Domain | Color | Icon | Vibe |
|--------|-------|------|------|
| **AI / Support** | Violet `#8b5cf6` | 🤖 / 💬 | Intelligent, helpful |
| **Trading** | Amber `#f59e0b` | 📈 | Energetic, data-driven |
| **Automation** | Cyan `#06b6d4` | ⚡ / 🔄 | Efficient, flowing |
| **Restaurant** | Orange `#f97316` | 🍽️ | Warm, operational |
| **Development** | Blue `#3b82f6` | 🛠️ | Technical, precise |
| **Utilities** | Gray/Slate | 🔧 | Practical, everyday |

---

## 6. The "Constellation" Concept

The ToolConstellation component visualizes tools as stars in a constellation — connected by invisible edges (relationships). This reinforces:

- **Every tool has context** — no tool is an island
- **Discovery through connection** — find tools by exploring their neighbors
- **The map is the territory** — the graph IS the navigation

### Constellation Visual Language
- Nodes: colored circles (by category) with tool name labels
- Edges: thin translucent lines with varying opacity
- Physics: d3 force simulation (charge, link distance, collision)
- Interaction: drag nodes, zoom/pan, click to navigate
- Legend: category color key

---

## 7. "Smart Search" as a Character

Search in WeaveStack is not a simple filter — it's an **intelligent discovery layer**:
- **Fuzzy matching**: tolerates typos, partial words
- **Category aliasing**: "chart" → "utilities", "bot" → "ai"
- **Natural language**: "find me a tool for sentiment analysis" → relevant results
- **Auto-suggest**: recent tools, popular searches
- **Keyboard-first**: Cmd+K, arrow keys, Enter

The search bar is treated as a primary interface element — always visible, always ready.

---

## 8. Tone in Motion (Animation Philosophy)

- **Reveal, not dazzle**: Elements fade up as you scroll — they don't zoom, spin, or bounce.
- **Purposeful motion**: Animations guide attention (pipeline stages advancing) or provide feedback (hover states).
- **Subtle depth**: Cards lift slightly on hover. Active states feel tactile.
- **No loading spinners** (except the page itself): Data is local, interactions are instant.

---

## 9. The Un-Brand

What WeaveStack is NOT:
- **Not a SaaS landing page** — no pricing, no signup wall, no "start free trial"
- **Not a marketplace** — we don't sell tools, we recommend them
- **Not a documentation site** — it's a discovery tool, not a manual
- **Not a portfolio** — the tools are the stars, not the brand
- **Not a blog** — no articles, no content marketing

---

## 10. Creative Constraints

These boundaries guide all creative decisions:

1. **Local-first**: No backend. All data is static or in localStorage. The experience must feel complete without a server.
2. **SPA, no SSR**: No server rendering. Everything happens in the browser.
3. **No images**: All visuals are CSS, SVG, Canvas, or emoji. No JPGs, no PNGs, no external assets.
4. **Light-theme with toggle**: Default is cool/indigo light theme. `.light-mode` class switches to a warm/amber variant. No dark theme.
5. **Single developer tooling**: No complex build pipelines, no monorepo, no design system library. Just React + Tailwind.
6. **3D-first hero**: HeroCard3D component uses CSS perspective + framer-motion spring physics for tilt-on-hover 3D card stacks.

---

## 11. Future Creative Directions (not yet implemented)

- **Interactive "weaving" animation** — visual metaphor of threads/strands combining into a stack
- **System comparison view** — side-by-side system workflows
- **Tool "sound"** — subtle audio feedback on interactions
- **Shareable stack URLs** — encode a stack in a URL hash
- **Onboarding flow** — first-time user walkthrough
- **Animated stack builder** — drag-drop tools into a pipeline canvas
