# WeaveStack — Deployment Guide

## ✅ Cloudflare Pages (Recommended)

### Method 1: Drag & Drop (Fastest — no account setup needed beyond login)

1. Build the project: `npm run build`
2. Go to → **dash.cloudflare.com → Pages → Create a project → Upload assets**
3. Drag the entire `/dist` folder
4. Done! Live in ~10 seconds at `https://weavestack.pages.dev`

### Method 2: CLI Deploy (One command)

```bash
# Install wrangler globally (one time)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy (from project root)
npm run deploy
```

### Method 3: GitHub Auto-Deploy (Best for ongoing dev)

1. Push this repo to GitHub
2. Cloudflare Dashboard → Pages → Connect to Git → Select repo
3. Set build settings:
   - **Build command:**   `npm run build`
   - **Output directory:** `dist`
   - **Node version:**    `18` (set in Environment Variables as `NODE_VERSION=18`)
4. Every `git push` auto-deploys ✅

---

## ✅ Netlify

### Method 1: Drag & Drop

1. Go to → **app.netlify.com → Sites → drag `/dist` folder**
2. Live immediately at `https://random-name.netlify.app`

### Method 2: CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Method 3: GitHub Auto-Deploy

1. app.netlify.com → Add new site → Import from Git
2. Build command: `npm run build`  
3. Publish directory: `dist`

---

## ✅ Vercel

```bash
npm install -g vercel
vercel --prod
```

Or connect GitHub repo at vercel.com. Build: `npm run build`, Output: `dist`.

---

## ✅ GitHub Pages

```bash
npm run build
npx gh-pages -d dist
```

---

## 🔑 Admin Access

Set `VITE_ADMIN_PIN` as an environment variable in your Cloudflare Pages dashboard (Settings → Environment variables).
Default PIN: **9999** (change for production).

Access admin at: `yoursite.com/admin`

---

## ⚡ Cloudflare-specific features included

- `_redirects` → SPA routing (all routes → index.html)
- `_headers` → Security headers + asset caching (1 year for JS/CSS)
- `wrangler.toml` → Pages project config
- Build target: `es2020` (Cloudflare Workers compatible)
- Code splitting: vendor / motion / icons chunks for faster loads
