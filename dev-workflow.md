# Code Helper Studio — Dev Workflow

> Standard operating procedure for all development and deployment work on this project.
> Follow these flows every time — no exceptions.

---

## Flow 1 — Build Flow

Run this checklist **before and during** building any new feature, page, or component.

### Step 1 — Check Branding

> File: `code-helper-studio-brand.md`

Before writing a single line of code, confirm:

- [ ] Background color is `#080c18` — never white, never light
- [ ] Brand color is violet `#8b5cf6` / indigo `#6366f1` gradient
- [ ] Font is **Inter** for UI, **JetBrains Mono** for code/placeholders only
- [ ] Logo uses `LogoIcon.jsx` with the correct `prefix` prop
- [ ] Glass cards use the correct formula (`backdrop-filter: blur(20px)`, `rgba(15,23,42,0.8)`)
- [ ] Primary CTA uses brand gradient — only **one** per section
- [ ] Animations use only `transform` and `opacity` — never `width`, `height`, or `margin`
- [ ] No exclamation marks in UI copy
- [ ] Dark mode is forced — no `prefers-color-scheme` media query

### Step 2 — Check React Components Reference

> File: `react-components-dev-reference.md`

Before building any UI element from scratch, check if it already exists:

- [ ] Look up the component category in the reference (e.g. Modal, Toast, Table, Drag & Drop)
- [ ] Check the 🚀 recommended pick first
- [ ] Verify the package is compatible with React 18 and the project's CRA/CRACO setup
- [ ] Check [bundlephobia.com](https://bundlephobia.com) for bundle size impact if unsure
- [ ] Only build from scratch if nothing in the reference fits

**Quick picks for this project:**

| Need | Package |
|---|---|
| Toast | `react-toastify` (already installed) |
| Icons | `lucide-react` (already installed via shadcn) |
| Forms | `react-hook-form` |
| Animation | `framer-motion` |
| Drag & drop | `react-dnd` |
| Charts | `recharts` |
| Virtual lists | `react-window` |
| Command palette | `cmdk` |
| Rich text | `@ckeditor/ckeditor5-react` |

### Step 3 — Build

- [ ] Follow the component structure: new pages in `frontend/src/pages/`, new components in `frontend/src/components/`
- [ ] New landing section components go in `frontend/src/components/landing/`
- [ ] Use CSS variables from `landing.css` — don't hardcode hex values inline
- [ ] Test at **390px** (mobile) and **1280px** (desktop) before considering it done
- [ ] No raw Firebase/API error strings shown to users — always use plain-English messages

---

## Flow 2 — Push Flow

Run this checklist **every time** before committing and deploying.

### Step 1 — Check the Code

- [ ] The frontend builds without errors: `cd frontend && npm run build`
- [ ] No `console.error` output during build
- [ ] No broken imports or missing files
- [ ] All new components are exported and imported correctly
- [ ] Lint warnings reviewed (fix `exhaustive-deps` where practical)

### Step 2 — Check Branding Alignment

> File: `code-helper-studio-brand.md`

Do a final visual review:

- [ ] Page background is dark (`#080c18`) — not white, not grey
- [ ] No light-mode card styles leaked in
- [ ] Correct font loaded (Inter in `<head>`, not browser default)
- [ ] Logo is animated SVG — not a static icon or emoji
- [ ] All buttons follow the CTA pattern (gradient primary, ghost/outline secondary)
- [ ] Copy is clean — no raw error codes, no ALL-CAPS emphasis, no `!` at end of sentences

### Step 3 — Check Firebase Reference

> File: `firebase-storage-upload-mcp.md`

If any Storage, Auth, or Functions code was touched:

- [ ] Storage paths follow the convention: `user-uploads/{uid}/...` or `public/...`
- [ ] Security rules are updated in `firestore.rules` / Storage rules if collections changed
- [ ] No service account keys or secrets committed to the repo
- [ ] Cloud Functions env vars stay in `functions/.env` — not in frontend `.env`
- [ ] Error codes are caught and mapped to plain-English messages (see Error Handling Reference in the md file)
- [ ] Download URLs are obtained via `getDownloadURL()` — never constructed manually

### Step 4 — Push to GitHub

```bash
# From project root
git add .
git status          # Review what's staged — no .env files, no keys
git commit -m "feat: <short description of what changed>"
git push origin master
```

> **Never commit:** `.env`, `functions/.env`, `serviceAccountKey.json`, or any file containing API keys.

### Step 5 — Push to Firebase

```bash
# Build first (if not already done in Step 1)
cd frontend
npm run build
cd ..

# Deploy hosting only (most common)
firebase deploy --only hosting

# Deploy functions only (if Cloud Functions changed)
firebase deploy --only functions

# Deploy everything
firebase deploy
```

**Live URLs after deploy:**
- Production: [https://code-helper-studio.web.app](https://code-helper-studio.web.app)
- Custom domain: [https://codehelper.studio](https://codehelper.studio)
- Firebase Console: [https://console.firebase.google.com/project/code-helper-studio](https://console.firebase.google.com/project/code-helper-studio)

### Step 6 — Update build_notes.md

> File: `build_notes.md`

After every successful deploy, add an entry to the Change Log:

- [ ] Open `build_notes.md`
- [ ] Add a new line at the top of the Change Log section (below the header)
- [ ] Use the format: `` - `YYYY-MM-DD` · <type> · <what changed and why> ``
- [ ] Type is one of: `Feature` | `Fix` | `Style` | `Refactor` | `Docs` | `Config`
- [ ] Keep it one line — enough detail to understand what changed, not a full essay
- [ ] If the architecture changed (new collection, new route, new Cloud Function), update the relevant numbered section in `build_notes.md` too

**Example entries:**
```
- `2026-04-20` · Feature · Added dark-mode particle canvas to HeroSection — matches auth page pattern
- `2026-04-20` · Fix · Resolved broken import in TryItSection causing white-screen in production
- `2026-04-20` · Style · Updated LandingFooter to use correct Inter 700 wordmark weight per brand guidelines
```

---

## Reference Files

| File | When to use |
|---|---|
| `code-helper-studio-brand.md` | Before building UI, before pushing |
| `react-components-dev-reference.md` | Before building any UI component |
| `firebase-storage-upload-mcp.md` | Before touching Storage, Auth, or Functions code |
| `build_notes.md` | After every deploy — log what changed |
| `README.md` | Project overview, tech stack, local dev setup |

---

*This document defines the standard workflow for Code Helper Studio. Follow it on every build and every push.*
