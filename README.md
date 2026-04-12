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
