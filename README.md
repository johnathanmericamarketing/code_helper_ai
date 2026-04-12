# AI Code Generator

This repository contains a full-stack AI code request workflow:
- **Backend:** FastAPI + MongoDB (`backend/server.py`)
- **Frontend:** React dashboard (`frontend/`)

## Current hardening & delivery status

### Phase 1 (Security baseline) ✅
- Required environment validation for critical backend settings.
- API key protection for `/api` routes (`X-API-Key`).
- Workspace path sanitization against traversal.
- Explicit CORS allowlist enforcement.

### Phase 2 (Architecture cleanup) ✅
- Request processing moved to backend endpoint: `POST /api/requests/{request_id}/process`.
- Shared frontend `apiClient` centralized API URL + auth header handling.
- Remaining pages/components migrated to `apiClient`.

### Phase 3 (Quality gates) ✅
- Added backend security baseline tests in `tests/test_security_basics.py`.

### Phase 4 (Delivery automation) ✅
- Added CI workflow at `.github/workflows/ci.yml` to run:
  - backend compile checks
  - pytest suite
  - frontend production build

### Phase 5 (Operations readiness) ✅
- Added public health endpoints:
  - `GET /healthz` (liveness)
  - `GET /readyz` (readiness with DB ping)
- Added request logging middleware with per-request correlation ID (`X-Request-ID`) and latency logging.
- Added `.env.example` to make environment bootstrap explicit and repeatable.

## Visual click-to-edit assistant (UI)

- A new **Visual Inspector** tool is available in the app UI.
- You can click any element (image/text/button/container) and the tool captures:
  - selector (`id`/class/tag),
  - element type,
  - dimensions,
  - basic computed style values.
- The inspector provides immediate recommendations (e.g., image sizing, text readability, spacing) and can copy a structured prompt for follow-up change requests.
- Inspector is now safer for normal usage: it only captures when you **hold Alt + click**, so normal clicks/navigation keep working.

## Stability program (A → D)

- **Phase A:** Added frontend error boundary + GET retry support + safer inspector click mode.
- **Phase B:** Request processing now records staged transitions (`structured → planned → generated → validated`) with timestamps.
- **Phase C:** Existing backend test baseline retained and extended for operational routes.
- **Phase D:** Added lightweight metrics endpoint `GET /metrics` backed by request middleware counters.

## Environment variables

Backend:
- `API_KEY`
- `MONGO_URL`
- `DB_NAME`
- `ENCRYPTION_KEY` (Fernet key)
- `CORS_ORIGINS` (comma-separated explicit allowlist)

Frontend:
- `REACT_APP_BACKEND_URL`
- `REACT_APP_API_KEY`

## Netlify deployment notes

If you deploy this SPA to Netlify and see **“Page not found”** on app routes:

- `netlify.toml` is configured to build from `frontend/` and publish `frontend/build`.
- SPA fallback redirects are configured in both:
  - `netlify.toml` redirects (`/* -> /index.html 200`)
  - `frontend/public/_redirects` (`/* /index.html 200`)

This ensures direct navigation to routes like `/history` or `/request/:id` resolves correctly.
