# Code Helper Studio

> **Your personal AI software engineer** — describe any website change in plain English, get a structured diff, a live visual preview, and one-click publish. Brand rules enforced automatically.

**Live:** [https://code-helper-studio.web.app](https://code-helper-studio.web.app) · [https://codehelper.studio](https://codehelper.studio)

---

## What it is

Code Helper Studio is an AI-powered web application that lets founders, marketers, and operators make precise website changes without writing code. Users describe a change in plain language; the AI generates a safe code diff with a visual before/after preview and a one-click publish workflow — with full version history and brand rules enforced automatically.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Create React App + CRACO), React Router v6 |
| **Auth** | Firebase Authentication (Email/Password + Google OAuth) |
| **Database** | Cloud Firestore |
| **File Storage** | Firebase Storage |
| **Backend Functions** | Firebase Cloud Functions (Node.js) |
| **AI** | Anthropic Claude API (via Cloud Functions) |
| **Hosting** | Firebase Hosting |
| **Styling** | Vanilla CSS (custom dark design system) + shadcn/ui components |

---

## Project Structure

```
code_helper_ai-main/
├── frontend/                   # React app
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.svg         # Animated orbiting-atom SVG
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   └── src/
│       ├── pages/
│       │   ├── LandingPage.jsx     # Public marketing page
│       │   ├── AuthPage.jsx        # Sign in / Sign up
│       │   ├── WorkspacePage.jsx   # Main app workspace
│       │   ├── SettingsPage.jsx
│       │   ├── KnowledgeBasePage.jsx
│       │   └── AssetStudioPage.jsx
│       ├── components/
│       │   ├── landing/            # 13 landing page components
│       │   └── ui/                 # shadcn/ui base components
│       ├── context/
│       │   ├── AuthContext.jsx     # Firebase auth state
│       │   └── ProjectContext.jsx  # Active project state
│       ├── styles/
│       │   └── landing.css         # Landing page dark design system
│       └── firebase.js             # Firebase SDK init
├── functions/                  # Firebase Cloud Functions
│   ├── index.js                # Function entrypoints
│   ├── claude.js               # Anthropic Claude integration
│   ├── media.js                # Media / asset processing
│   └── .env                    # Function environment variables (not committed)
├── firebase.json               # Firebase project config (hosting, functions, firestore)
├── .firebaserc                 # Project alias → code-helper-studio
├── firestore.rules             # Firestore security rules
├── code-helper-studio-brand.md # ← Brand guidelines (read this before building UI)
└── README.md
```

---

## Local Development

### Prerequisites

- Node.js 18+
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project access: `firebase login`

### Frontend

```bash
cd frontend
npm install
npm start          # Dev server at http://localhost:3000
```

### Cloud Functions (local emulation)

```bash
firebase emulators:start --only functions,firestore,auth
```

### Environment Variables

**Frontend** (`frontend/.env.local`):

```env
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=code-helper-studio
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

**Cloud Functions** (`functions/.env`):

```env
ANTHROPIC_API_KEY=...
```

---

## Build & Deploy

### Build the frontend

```bash
cd frontend
npm run build
```

Output goes to `frontend/build/`. Firebase Hosting serves this directory (configured in `firebase.json`).

### Deploy to Firebase

```bash
# Hosting only (most common)
firebase deploy --only hosting

# Functions only
firebase deploy --only functions

# Everything
firebase deploy
```

**Hosting URL:** [https://code-helper-studio.web.app](https://code-helper-studio.web.app)  
**Firebase Console:** [https://console.firebase.google.com/project/code-helper-studio](https://console.firebase.google.com/project/code-helper-studio)

---

## Routing

Client-side routing is handled by React Router. Firebase Hosting is configured with a catch-all rewrite in `firebase.json` so that all routes resolve to `index.html`:

```json
"rewrites": [{ "source": "**", "destination": "/index.html" }]
```

| Route | Page |
|---|---|
| `/` | Landing page (public) |
| `/auth` | Sign in / Sign up |
| `/app` | Workspace (auth required) |
| `/settings` | Settings (auth required) |
| `/knowledge` | Knowledge Base (auth required) |
| `/assets` | Asset Studio (auth required) |

---

## Design System

All UI follows **`code-helper-studio-brand.md`** — the canonical brand reference. Key rules:

- **Dark mode only** — base background `#080c18`, never white or light surfaces
- **Brand color** — violet `#8b5cf6` / indigo `#6366f1` gradient
- **Fonts** — Inter (UI), JetBrains Mono (code/terminal/placeholders)
- **Logo** — animated orbiting-atom SVG; always use `LogoIcon.jsx` with the `prefix` prop
- **Components** — glassmorphism cards, shimmer CTAs, particle canvas backgrounds

> Before building or modifying any UI, read `code-helper-studio-brand.md`.

---

## Firebase Security

- **Firestore rules** are defined in `firestore.rules` — users can only read/write their own documents.
- **Auth** is enforced at the route level via `AuthContext` — unauthenticated users are redirected to `/auth`.
- **Cloud Functions** validate the calling user's Firebase ID token before processing any AI request.
- API keys and secrets are stored in Cloud Functions environment config, never in the frontend bundle.

---

## Key Decisions

| Decision | Rationale |
|---|---|
| Firebase over custom backend | Removes server management; auth, DB, storage, and functions in one platform |
| CRACO over Vite | Preserves CRA compatibility with existing tooling and `@` path aliases |
| Vanilla CSS over Tailwind | Full control over the dark design system without utility-class conflicts |
| Claude (Anthropic) for AI | Superior instruction-following for precise, scoped code mutations |
| Modular landing components | 13-component architecture makes isolated iteration fast without touching app code |
