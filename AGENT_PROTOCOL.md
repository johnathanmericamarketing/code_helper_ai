# Agent Protocol & Deployment Rules

> **CRITICAL DIRECTIVE for all AI build agents and assistants working on this repository.**

This file serves as the mandatory checklist and operating protocol for all modifications made to the `code_helper_ai` repository. 

Whenever you are asked to build, modify, or refactor a feature, you **MUST** execute the following steps without needing explicit permission or reminders from the user:

## 1. Update Build Notes (`BUILD_NOTES.md`)
Every single time a feature is completed or a meaningful structural change is made, you must log it.
- Open `BUILD_NOTES.md`.
- Navigate to the `## Change Log` section at the bottom.
- Append a new bullet point logging the date, the branch (`main`), the feature name, and a brief description of what was added or changed.

## 2. Commit and Push to GitHub
Do not leave changes dangling on the local machine. Once the code is stable and the build notes are updated:
- Run `git add .`
- Run `git commit -m "feat: [brief description of what you did]"` (or `fix:`, `docs:`, etc.)
- Run `git push` to ensure the remote repository is fully synced.

## 3. Deploy to Firebase Hosting
Every frontend UI or logic change must be pushed to the live Firebase environment immediately so the user can test and verify it.
- Navigate to the `frontend` directory: `cd frontend`
- Run the production build: `yarn build`
- Navigate back to the root: `cd ..`
- Deploy to hosting: `npx firebase deploy --only hosting`

*(Note: If you made changes to Cloud Functions, run `npx firebase deploy --only functions` as well).*

---

## 4. Daily Health & Security Audit
If you are starting the first session of the day, you must run a quick diagnostic audit before starting new feature work:
- Check the codebase for any obvious linting errors, deprecated dependencies, or architectural inconsistencies.
- Review the Firebase rules and configuration (e.g., Firestore indexes, hosting settings) to ensure security best practices are still intact.
- If you see anything that needs to be fixed, propose the fix to the user immediately.

---

### Why does this exist?
This protocol guarantees that the local codebase, the GitHub repository, the `BUILD_NOTES.md` changelog, and the live Firebase production site are **always** in perfect sync. 

**By reading this file, you agree to execute this 3-step checklist automatically at the conclusion of every task.**
