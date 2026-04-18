# Deploy checklist

Run these from the repo root unless noted. Everything below requires you to be
logged in and to have Blaze billing enabled on the `code-helper-studio` project.

## 1. One-time setup

```bash
firebase login
firebase use code-helper-studio
```

Enable Blaze in the console — Data Connect provisions Cloud SQL and Cloud
Functions v2 requires billing:
https://console.firebase.google.com/project/code-helper-studio/usage/details

## 2. Set function secrets

```bash
firebase functions:secrets:set ANTHROPIC_API_KEY
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

Paste each value when prompted. Confirm:

```bash
firebase functions:secrets:access ANTHROPIC_API_KEY
```

## 3. Deploy Cloud Functions

```bash
cd functions && npm install && cd ..
firebase deploy --only functions
```

Verify in logs that each function came up:

```bash
firebase functions:log --limit 20
```

Functions that must be live for the app to work:
- `processCodeRequest` — Workspace Studio
- `generateImage` — Asset Studio
- `createCheckoutSession`, `createPortalSession`, `stripeWebhook` — Settings billing
- `adminGetUsers`, `adminGetStats`, `adminSetUserRole`, `adminGetPayments` — Admin page

## 4. Deploy Firestore rules + indexes

```bash
firebase deploy --only firestore
```

## 5. Deploy Data Connect (first time provisions Cloud SQL)

```bash
firebase deploy --only dataconnect
```

This spins up the Cloud SQL instance `code-helper-studio-fdc`. First deploy
takes ~10 minutes. Subsequent deploys are seconds.

Regenerate the JS SDK after any schema or connector change:

```bash
firebase dataconnect:sdk:generate
```

## 6. Deploy frontend

```bash
cd frontend && yarn build && cd ..
firebase deploy --only hosting
```

## Deploy everything at once

Once secrets are set and Blaze is on:

```bash
cd frontend && yarn build && cd ..
firebase deploy
```

## Verify

After deploy, sanity-check each tab:
- Dashboard loads and lists projects
- Workspace Studio submits a request without a 500
- Asset Studio generates an image
- History shows the request and clicking into it opens RequestDetail
- Knowledge Base lists entries for the active project
- Integrations / Servers load their lists
- Settings opens the AI Config tab without error (this used to crash on `CLAUDE_MODELS`)
