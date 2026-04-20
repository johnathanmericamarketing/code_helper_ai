# Code Helper Studio — Build Notes

Persistent system reference. **Read this before touching code in any new session.**

Two sections:
1. **System Reference** (sections 1–10) — permanent architecture notes. Update when the architecture changes.
2. **Change Log** (bottom) — append one line per meaningful shipped change, most recent first.

### Change Log Entry Format
```
- `YYYY-MM-DD` · <type: Feature|Fix|Style|Docs|Config> · <short description of what changed and why>
```

---

## 1. Project basics

- **Firebase project:** `code-helper-studio`
- **Hosting URL:** https://code-helper-studio.web.app
- **Repo:** https://github.com/johnathanmericamarketing/code_helper_ai
- **Active branch pattern:** `claude/<topic>-<slug>` (current: `claude/review-requirements-T9xHd`)
- **Deploy:** manual — `cd frontend && yarn build && cd .. && firebase deploy --only hosting` (CI only builds, does not deploy)
- **Stack:** React 19 (CRA + craco) + Tailwind + shadcn/radix UI + Firebase (Auth, Firestore, Functions v2, Hosting)

## 2. Top-level layout

```
code_helper_ai/
├── .github/workflows/ci.yml        # Build-only CI (no deploy)
├── firebase.json                   # hosting=frontend/build, functions=functions/
├── firestore.rules                 # userId-scoped; super_admin reads all users
├── firestore.indexes.json          # 5 composite indexes (userId + created_at DESC)
├── .firebaserc                     # project: code-helper-studio
├── frontend/                       # React SPA
├── functions/                      # Firebase Cloud Functions (Node 20)
├── scripts/set-admin.js            # CLI to promote a user to super_admin
├── tests/test_security_basics.py   # legacy pytest; references FastAPI that no longer exists
└── BUILD_NOTES.md / CLAUDE.md      # (this file + session loader)
```

## 3. Frontend (`frontend/`)

- **Build:** craco + Tailwind, path alias `@/` → `src/`, Yarn
- **Entry:** `src/index.js` → `App.js` with providers: `AppErrorBoundary` › `ThemeProvider` › `AuthProvider` › `ProjectProvider`

### Routes (from `src/App.js`)

| Path | Component | Guard |
|---|---|---|
| `/` | LandingPage | public |
| `/auth` | AuthPage | public |
| `/app` | MainLayout → redirect to `/app/projects` | ProtectedRoute |
| `/app/projects` | **ProjectsPage** (new) | Protected |
| `/app/studio` | WorkspaceStudioPage | Protected |
| `/app/brand` | **BrandPage** (new) | Protected |
| `/app/versions` | **VersionsPage** (new) | Protected |
| `/app/assets` | **AssetsPage** (new) | Protected |
| `/app/connections` | **ConnectionsPage** (new) | Protected |
| `/app/settings` | SettingsPage | Protected |
| `/admin` | AdminPage | AdminRoute (super_admin) |
| `/app/dashboard` | → redirect `/app/projects` | legacy |
| `/app/knowledge` | → redirect `/app/brand` | legacy |
| `/app/history` | → redirect `/app/versions` | legacy |
| `/app/integrations` | → redirect `/app/connections` | legacy |
| `/app/servers` | → redirect `/app/connections` | legacy |

### Pages (`src/pages/`)

| File | Purpose |
|---|---|
| `LandingPage.jsx` | Public splash (untouched) |
| `AuthPage.jsx` | Firebase email/pw + Google SSO (untouched) |
| `ProjectsPage.jsx` | **New** — project grid + empty state + ProjectSetupWizard; replaces DashboardPage |
| `WorkspaceStudioPage.jsx` | **Core UI** (preserved): 3-pane before/after, prompt → preview → publish, IntakeWizard, LiveSitePreview |
| `BrandPage.jsx` | **New** — brand identity, voice, AI instructions, content library; replaces KnowledgeBasePage |
| `VersionsPage.jsx` | **New** — versions timeline with search, compare drawer, restore; replaces HistoryPage |
| `AssetsPage.jsx` | **New** — Imagen 3 generation + URL import + asset grid; replaces AssetStudioPage |
| `ConnectionsPage.jsx` | **New** — tabbed hosting/GitHub/workspaces; merges IntegrationsPage + ServersPage |
| `SettingsPage.jsx` | Profile / API key / Safety / Billing (Stripe stubbed) — unchanged |
| `AdminPage.jsx` | super_admin dashboard — unchanged |
| `RequestDetailPage.jsx` | Debug view — kept at `/app/debug/requests/:id`, not in sidebar |

### Contexts & services

- `context/AuthContext.jsx` — wraps `onAuthStateChanged`, exposes `currentUser`.
- `context/ProjectContext.jsx` — `projects`, `activeProject`, `selectProject`, `refreshProjects`, `refreshActiveProject` (re-pulls single doc after writes).
- `contexts/ThemeContext.jsx` — dark/light, persists to localStorage.
- `lib/firebase-service.js` — `requestsService`, `generatedCodeService`, `knowledgeService`, `serversService`, `githubService`, `workspacesService`.
- `lib/project-service.js` — `projectService`: `create`, `list`, `get`, `update`, `saveIntake`, `updateSiteNotes`, `appendChangeLog`, `delete`.
- `lib/user-service.js` — `getUserProfile`, `updateUserProfile`, `changeUserEmail`, `changeUserPassword`.
- `lib/admin-service.js` — calls admin Cloud Functions.
- `lib/media-service.js` — `generateImage`.
- `lib/api.js` — Axios client, **unused** (legacy from FastAPI era).

### Notable components (`src/components/`)

**Shell (new — `components/shell/`)**
- `AppSidebar.jsx` — collapsible icon/expanded sidebar with active-route highlighting, project context, dark brand tokens.
- `AppHeader.jsx` — slim context-aware top bar with page title and user actions.
- `MobileBottomNav.jsx` — mobile-first bottom tab bar.

**Projects (new — `components/projects/`)**
- `ProjectCard.jsx` — status badge, domain link, accent top-bar, Studio quick-open, delete dropdown.
- `ProjectGrid.jsx` — responsive 3-col grid wrapper.
- `ProjectSetupWizard.jsx` — 2-step dialog (name/domain → notes → create) using existing `projectService.create()`.

**Brand (new — `components/brand/`)**
- `BrandIdentityCard.jsx` — primaryColor/secondaryColor/accentColor swatches + font inputs.
- `BrandRulesCard.jsx` — voice textarea + component preferences.
- `BrandPromptRulesCard.jsx` — AI instruction rules injected into every generation.
- `BrandContentLibraryCard.jsx` — content_urls list (add/remove external reference links).

**Versions (new — `components/versions/`)**
- `VersionCard.jsx` — type badge, relative time, model tag, compare/restore buttons.
- `VersionList.jsx` — mapped list with dark empty state.
- `VersionFilters.jsx` — search + filter bar.
- `VersionCompareDrawer.jsx` — slide-over Sheet with code preview and restore action.

**Connections (new — `components/connections/`)**
- `HostingTab.jsx`, `GithubTab.jsx`, `WorkspacesTab.jsx` — dark empty-state tabs.

**Assets (new — `components/assets/`)**
- `AssetPromptCard.jsx` — Imagen 3 prompt input + generate button.
- `AssetUrlImportCard.jsx` — URL import stored to `project.external_assets`.
- `AssetResultsGrid.jsx` — preview, copy-base64, copy-img-tag, send-to-studio, imported thumbnails.

**Studio (existing — `components/studio/`)**
- `StudioTopBar.jsx`, `StudioComposer.jsx`, `StudioPreviewStage.jsx`, `StudioLeftPanel.jsx`, `StudioMobilePublishBar.jsx`.

**Other preserved**
- `VisualInspector.jsx`, `LiveSitePreview.jsx`, `IntakeWizard.jsx`, `DeploymentDialog.jsx`, `SideBySideDiff.jsx`, `AIModelConfig.jsx`, `AppErrorBoundary.jsx`.
- `components/ui/*` — shadcn/radix kit (~35 files).

## 4. Cloud Functions (`functions/`)

Node 20, Firebase Functions v2 onCall. All callables verify `request.auth`; webhooks use signatures (stripe webhook is a stub).

| File | Export | Purpose |
|---|---|---|
| `index.js` | `testConnection`, `listRemoteFiles`, `readRemoteFile`, `deployCode` | FTP/SFTP/SSH ops via `basic-ftp` + `ssh2-sftp-client`; creds read from `servers/{id}` |
| `claude.js` | `processCodeRequest` | Calls Claude or Gemini, returns `{ structured_task, execution_plan, code_changes, validation_checks, tokens, cost_usd, model_used, mode }`; records usage; stub fallback when no key |
| `admin.js` | `adminGetUsers`, `adminGetStats`, `adminSetUserRole`, `adminGetPayments` | super_admin gated; payments is a stub |
| `stripe.js` | `createCheckoutSession`, `createPortalSession`, `stripeWebhook` | **All stubbed** — waits for `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` |
| `media.js` | `generateImage` | Google Imagen 3; BYOK (AIza…) or platform key |
| `set-admin.js` | (not re-exported from index.js) | Helper functions used by CLI script |
| `scripts/set-admin.js` | CLI | Local utility to promote a UID to super_admin |

### API-key resolution (claude.js + media.js)

1. User's BYOK key in `users/{uid}.ai_api_key` (legacy fallback: `claude_api_key`)
2. Platform env key (`ANTHROPIC_PLATFORM_KEY` / `GEMINI_PLATFORM_KEY`)
3. No key → returns stub-mode mock payload

### Dependencies of note

- `@anthropic-ai/sdk`, `@google/generative-ai`, `stripe`, `basic-ftp`, `ssh2-sftp-client`, `firebase-admin`, `firebase-functions`.

## 5. Firestore data model

| Collection | Scoped by | Fields |
|---|---|---|
| `users` | doc id = uid | `uid, email, display_name, plan (free\|byok\|platform), role (user\|super_admin), ai_api_key, claude_api_key (legacy), claude_model, max_tokens, usage_this_month{input_tokens, output_tokens, cost_usd, requests}, notifications{}, safety{}, auto_approve_low_risk, stripe_customer_id, stripe_subscription_id, created_at, updated_at` |
| `projects` | `userId` | `name, domain, tech_stack[], description, intake{backup{have,platform,acknowledged}, goals{summary,categories[],pages[]}, connection{serverId}, completedAt}, brand{brandName, tagline, primaryColor, secondaryColor, accentColor, headingFont, bodyFont, voice, dos, donts, logoUrl, extraNotes, updatedAt}, siteNotes, changeLog[{summary,requestId,model,at}], created_at, updated_at` |
| `code_requests` | `userId` + `projectId` | `id, raw_request, urgency, area_of_app, screenshots, links, knowledge_base_ids[], status (pending→generating→validated→approved), created_at, updated_at` |
| `generated_code` | `request_id` | `structured_task, execution_plan, code_changes[{file_path, diff, description}], validation_checks[], summary, rollback_instructions, model_used, tokens, cost_usd, userId, created_at` |
| `knowledge_base` | `userId` + `projectId` | `title, content, type (doc\|code\|pdf), created_at, updated_at` |
| `servers` | `userId` + `projectId` | `name, server_type (sftp\|ssh\|ftp), host, port, username, password, ssh_key, remote_path, description, is_active, last_connected, created_at, updated_at` — **creds stored plaintext**, masked on read in service |
| `github_connections` | `userId` | `name, access_token, username, default_repo, default_branch, is_active` — token plaintext, masked on read |
| `workspaces` | `userId` | `name, path, description, is_git_repo` |
| `generated_media` | implicit userId | `prompt, cost_usd, created_at` |

### Firestore rules summary

- `users/{userId}`: owner read/write; super_admin reads all.
- Other collections: owner read/create/update/delete via `resource.data.userId`.
- No field-level masking — client services handle masking on read.

### Indexes (composite)

- `code_requests`, `knowledge_base`, `servers`, `github_connections`, `workspaces` — all `(userId ASC, created_at DESC)`.

## 6. AI call path (Studio → Claude)

1. `WorkspaceStudioPage.handleGenerate` builds context (current UI snippet + `project.intake.goals` + `project.siteNotes` + last 5 `changeLog` entries).
2. `requestsService.create(payload, projectId)` → writes to `code_requests`.
3. `requestsService.process(id, prompt, context, overrideModel)` → flips status to `generating` → calls httpsCallable `processCodeRequest`.
4. `functions/claude.js:processCodeRequest`:
   - Fetch `users/{uid}`; pick model + API key.
   - Call `anthropic.messages.create` (or Gemini).
   - Parse JSON payload, record `usage_this_month`, save to `generated_code`, flip request status to `validated`.
5. Frontend renders preview in the "Your Site With Changes" pane.
6. User clicks Publish → AlertDialog confirm → `updateStatus(id, 'approved')` + `projectService.appendChangeLog(...)`.

## 7. Billing / plans

- Tiers: `free` (5 req/mo, platform stub key), `byok` (unlimited, user's key), `platform` ($15/mo, we pay Claude/Gemini).
- Usage tracked per month in `users/{uid}.usage_this_month`.
- Stripe: **not connected**. `createCheckoutSession` / `createPortalSession` / `stripeWebhook` return stub messages until `STRIPE_SECRET_KEY` is set.

## 8. Security posture — known issues

| Severity | Issue | Location |
|---|---|---|
| HIGH | Credentials stored plaintext in Firestore | `servers.{password, ssh_key}`, `github_connections.access_token`, `users.{ai_api_key, claude_api_key}` |
| HIGH | Stripe webhook doesn't verify signature | `functions/stripe.js:stripeWebhook` (stub) |
| MEDIUM | No rate limiting on callables | all Functions |
| MEDIUM | Firestore rules don't mask sensitive fields — relies on service-layer masking | `firestore.rules` |
| LOW (accepted) | Firebase web config exposed in client | `frontend/src/firebase.js` — standard for Firebase |

Address before production: move creds to Secret Manager / KMS; wire Stripe signature check; add App Check.

## 9. Known gaps / placeholders

- `WorkspaceStudioPage` Column 1 "Your Code From Server" uses hardcoded placeholder — **no real repo sync yet**.
- Stripe billing is stubbed end-to-end.
- `KnowledgeBasePage` — CRUD exists but content is not parsed / vectorized / used as AI context.
- `IntegrationsPage` — stores GitHub token but no repo fetch/commit flow.
- `tests/test_security_basics.py` — references missing `backend.server` (FastAPI-era relic).
- Unused components: `DashboardCharts.jsx`, `CodeDiffViewer.jsx`, several shadcn kit pieces.

## 10. Hosting & deploy flow

- `firebase.json`: hosting from `frontend/build`, SPA rewrite to `/index.html`.
- CI (`.github/workflows/ci.yml`): checks out, installs, runs `npm --prefix frontend run build` — **build only, no deploy**.
- Deploys are manual from a dev machine: `firebase deploy --only hosting` (and `--only functions` when Functions change).
- Remember: Firebase Hosting caches `index.html` ~1h; a hard refresh isn't enough — use incognito or DevTools "Clear site data" to verify a deploy.

---

## Future Tasks / Backlog

Items that need to be built but aren't started yet. When you start one, move it to the Change Log on completion.

---

### 🔲 Demo Account Setup

**Priority:** Medium — needed before public launch  
**Reference file:** `code-helper-studio-demo-account-setup.md`

A shared demo account that visitors can use to try Code Helper Studio at `codehelper.studio` without signing up. Two systems need to be wired together:

| System | What's needed |
|---|---|
| **Firebase Auth** | Create `demo@codehelper.studio` with fixed UID `demo-user-001` using Admin SDK |
| **Firestore** | Create `users/demo-user-001` doc with `role: demo`, token caps (10k/mo), feature flags, 5 req/day limit |
| **Firestore rules** | Update `firestore.rules` to block demo users from writing to their own profile (prevent self-promotion) |
| **Cloud Functions** | Add demo rate-limit check in `functions/claude.js` — throw after 5 requests |
| **Landing page** | Add "Try Demo" button that auto-signs in via `signInWithEmailAndPassword` without showing credentials |
| **DemoBanner component** | Persistent in-app banner when `role === 'demo'` — shows request count remaining + upgrade CTA |
| **Reset script** | `scripts/reset-demo-account.js` — wipes counters and demo projects nightly |
| **Scheduled Function** | `resetDemoAccount` — Firebase Scheduled Function running every 24 hours |
| **FastMoose/WHMCS** | `GetProducts` → `AddClient` → `AddOrder` → `AcceptOrder` to provision `demo.codehelper.studio` hosting |
| **Pre-seeded projects** | 2 example demo projects seeded on reset so visitors see real content |

**Demo credentials (when built):**
```
Email:    demo@codehelper.studio
Password: TryCodeHelper2026!   ← rotate before go-live
```

**Feature access in demo:**

| Feature | Demo |
|---|---|
| Create Request | ✅ (max 5/day) |
| Visual Inspector | ✅ |
| View Projects | ✅ (max 2, pre-seeded) |
| Admin Panel | ❌ |
| Connections/Integrations | ❌ |
| Settings / API Key | Read-only |
| Billing | Upgrade CTA only |
| Export | ❌ |

> See `code-helper-studio-demo-account-setup.md` for all scripts, Firestore schema, security rules, WHMCS API calls, and UX patterns.

---

## Change Log

Append one line per meaningful shipped change. Most recent first.

- `2026-04-20` · Feature · **UI/UX Redesign Migration complete** — post-login app shell rebuilt with `AppSidebar`, `AppHeader`, `MobileBottomNav`. New pages: `ProjectsPage` (replaces Dashboard), `BrandPage` (replaces KnowledgeBase), `VersionsPage` (replaces History), `AssetsPage` (replaces AssetStudio), `ConnectionsPage` (merges Integrations + Servers). New component directories: `shell/`, `projects/`, `brand/`, `versions/`, `connections/`, `assets/`. `App.js` updated with new routes + legacy URL redirects. Dark `#080c18` / violet `#8b5cf6` brand tokens applied throughout. All Firebase logic preserved — only UI layer changed. Landing + Auth pages untouched.
- `2026-04-20` · Docs · Created `dev-workflow.md` — standard Build Flow (brand check → component ref check → build) and Push Flow (code check → brand check → Firebase md check → GitHub push → Firebase deploy → build notes update). All future work follows this flow.
- `2026-04-20` · Docs · Rewrote `README.md` — removed all FastAPI/MongoDB/Netlify/Python references; replaced with accurate Firebase + React + Claude stack, real project structure, deploy commands, routing table, and security model.
- `2026-04-20` · Docs · Reviewed and absorbed three reference files into active session context: `code-helper-studio-brand.md` (brand guidelines), `react-components-dev-reference.md` (component library reference), `firebase-storage-upload-mcp.md` (Storage upload patterns).
- `2026-04-19` · Style · Rebuilt `AuthPage.jsx` — dark glassmorphism design, particle canvas, animated logo SVG, shimmer CTA, password toggle, smooth sign-in ↔ sign-up transitions. All Firebase Auth logic (email/pw + Google) preserved. Deployed to hosting.
- `2026-04-19` · Feature · Migrated monolithic `LandingPage.jsx` to 13 modular components in `components/landing/`. Created `landing.css` dark design system. Added interactive TryIt demo engine with simulated AI workflow and visual inspector. Deployed to hosting.
- `2026-04-18` · branch `claude/review-requirements-T9xHd` · Dedicated "Branding" button in Knowledge Base header (outline, Palette icon, green dot when set) opens BrandKitCard in a modal scoped to the active project. Inline card removed.
- `2026-04-18` · branch `claude/review-requirements-T9xHd` · `BrandKitCard` on Knowledge Base page: structured per-project brand (name, tagline, primary/secondary/accent colors via `react-colorful`, heading/body fonts, voice, do/don't, logo URL, extra notes). Saved to `project.brand` via new `projectService.updateBrand`. Piped into Studio AI context + "Get ideas" suggestions so every generation respects the brand.
- `2026-04-18` · branch `claude/review-requirements-T9xHd` · Desktop/Mobile viewport toggle on both `LiveSitePreview` and `VisualInspector` (iconed segmented control; mobile = 390px-wide framed preview with scroll + drop shadow). Works on "Your Site Now" and "Your Site With Changes" panes.
- `2026-04-18` · branch `claude/review-requirements-T9xHd` · "Get ideas" button in Studio (new `suggestIdeas` Cloud Function — Claude/Gemini, BYOK-aware, stub fallback) + rewrite of `/app/history` as a plain-language "My Changes" timeline grouped by month, driven by `project.changeLog`, with CSV report download.
- `2026-04-18` · branch `claude/review-requirements-T9xHd` · IntakeWizard (3-step: backup / goals / connection) + Studio auto-open + "Site info" button + `changeLog` append on publish + project intake/notes piped into AI context.
- `2026-04-18` · branch `claude/review-requirements-T9xHd` · Fixed SettingsPage blank-screen crash (`CLAUDE_MODELS` → `AI_MODELS`, two refs).
- `2026-04-18` · branch `claude/review-requirements-T9xHd` · Workspace Studio: clarified Before/After pane labels, subtitles, ring highlight on pending-changes pane, Publish confirm dialog + Discard button, friendlier toast/placeholder copy.
- `2026-04-18` · branch `claude/review-requirements-T9xHd` · `LiveSitePreview` component: embed user's real site in middle pane with URL bar, refresh, "open in new tab" fallback for framing-blocked sites.
- `2026-04-18` · branch `claude/review-requirements-T9xHd` · "Back to Dashboard" button on AdminPage header + error state (because `/admin` sits outside MainLayout — no sidebar).
- `2026-04-18` · branch `claude/review-requirements-T9xHd` · `projectService` helpers (`get`, `saveIntake`, `updateSiteNotes`, `appendChangeLog`) + `ProjectContext.refreshActiveProject` scaffolding for intake wizard.
