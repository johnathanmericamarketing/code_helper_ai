# Code Helper AI — Build Notes

Persistent system reference. Future sessions: **read this before touching code**.
Keep the Change Log at the bottom current — append a line per meaningful change.

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
| `/app` | MainLayout (DashboardPage index) | ProtectedRoute |
| `/app/studio` | WorkspaceStudioPage | Protected |
| `/app/history` | HistoryPage | Protected |
| `/app/request/:id` | RequestDetailPage | Protected |
| `/app/knowledge` | KnowledgeBasePage | Protected |
| `/app/assets` | AssetStudioPage | Protected |
| `/app/integrations` | IntegrationsPage | Protected |
| `/app/servers` | ServersPage | Protected |
| `/app/settings` | SettingsPage | Protected |
| `/admin` | AdminPage | AdminRoute (super_admin) |

### Pages (`src/pages/`)

| File | Purpose |
|---|---|
| `LandingPage.jsx` | Public splash |
| `AuthPage.jsx` | Firebase email/pw + Google SSO |
| `DashboardPage.jsx` | Project switcher + recent requests |
| `WorkspaceStudioPage.jsx` | **Core UI**: 3-pane before/after, prompt → preview → publish, IntakeWizard, LiveSitePreview |
| `HistoryPage.jsx` | List of past requests (dev-style) — candidate for friendly "My Changes" report rewrite |
| `RequestDetailPage.jsx` | Full generated-code view: structured_task, execution_plan, diffs, validation checks |
| `KnowledgeBasePage.jsx` | CRUD for custom docs (UI only — no parsing/vector search yet) |
| `AssetStudioPage.jsx` | AI image generation via Imagen 3 |
| `IntegrationsPage.jsx` | GitHub PATs + local workspaces |
| `ServersPage.jsx` | SFTP / SSH / FTP credentials + test connection |
| `SettingsPage.jsx` | Profile / Claude API key / Safety / Billing (Stripe stubbed) |
| `AdminPage.jsx` | super_admin dashboard: users, stats, payments (mostly live, payments stubbed) |
| `CreateRequestPage.jsx` | Old standalone request form (largely superseded by Studio) |

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

- `VisualInspector.jsx` — iframe with injected script; hover highlights, click opens image-gen dialog sized to element.
- `LiveSitePreview.jsx` — iframe-based browser of user's live site (URL bar, refresh, open-in-new-tab, framing-blocked fallback).
- `IntakeWizard.jsx` — 3-step modal (Backup → Goals → Connection), saves to `project.intake`. Auto-opens in Studio when `intake.completedAt` missing.
- `Sidebar.jsx` / `Header.jsx` / `MobileNav.jsx` — navigation.
- `DeploymentDialog.jsx` — pick server + deploy generated diffs.
- `SideBySideDiff.jsx` — diff renderer (`CodeDiffViewer.jsx` appears unused).
- `AIModelConfig.jsx`, `ValidationResults.jsx`, `StepIndicator.jsx`, `ExportButton.jsx`, `CodePlayground.jsx`, `RequestForm.jsx`, `AppErrorBoundary.jsx`.
- `components/ui/*` — shadcn/radix kit (~35 files: card, dialog, alert-dialog, select, tabs, etc.).

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
| `projects` | `userId` | `name, domain, tech_stack[], description, intake{backup{have,platform,acknowledged}, goals{summary,categories[],pages[]}, connection{serverId}, completedAt}, brand{colors[], typography{headings, body}, tone, preferences, aiInstructions}, siteNotes, changeLog[{summary,requestId,model,at}], created_at, updated_at` |
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

## Change Log

Append one line per meaningful shipped change. Most recent first.

- `2026-04-19` · branch `main` · **External Assets & Content**: Implemented "Import via URL" for images/videos in `AssetsPage` and a "Content Library" for documents/links in `BrandPage`, bypassing complex OAuth flows for Drive/Dropbox in favor of direct public link sharing.

- `2026-04-19` · branch `main` · **Studio Enhancements**: Added "Prompt Library" dialog to Studio Composer allowing users to select pre-made prompts or save their custom prompts directly to their Firebase user profile.
- `2026-04-19` · branch `main` · **Usage Tracking**: Added a global API cost pill (`UsagePill`) directly into `AppHeader.jsx` to let users track real-time monthly usage spend anywhere in the workspace.
- `2026-04-19` · branch `main` · **Settings Update**: Split API key input in Settings into explicit `claude_api_key` and `gemini_api_key` fields.
- `2026-04-19` · branch `main` · **Phase 5 (Landing Page Rebuild)**: Replaced legacy landing page with a 10-section modular layout using `HeroStudioVisual` CSS mock.
- `2026-04-19` · branch `main` · **Phase 3 & 4 (System Logic Upgrades)**: Draft auto-loading, Review Rail, and Version Restore.
- `2026-04-19` · branch `main` · **Phase 2 (Core Pages Rebuild)**: Rebuilt Projects Page, Brand Page, and Versions Page into modular components (`components/projects`, `components/brand`, `components/versions`). UI matches the new premium design spec while preserving existing Firebase logic.
- `2026-04-19` · branch `main` · **Phase 1 (System Architecture Rebuild)**: Created unified design tokens (`tokens.css`, `index.css`). Standardized internal routing and file names (e.g. `DashboardPage` -> `ProjectsPage`). Replaced old `Sidebar`/`Header` with `AppSidebar`, `AppHeader`, and `MobileBottomNav` for the new premium workspace aesthetic.
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
