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
