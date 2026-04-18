# Claude — start here

**Read `BUILD_NOTES.md` first.** It's the authoritative map of this repo (routes, Firestore schema, Cloud Functions, known gaps, active branch). Don't guess — consult it before touching code.

## Quick facts

- **Firebase project:** `code-helper-studio` · **Live:** https://code-helper-studio.web.app
- **Development branch:** ask the user or check `git branch --show-current`. Default pattern: `claude/<topic>-<slug>`. Commit & push to that branch — never directly to `main`.
- **Deploy is manual:** `cd frontend && yarn build && cd .. && firebase deploy --only hosting`. CI only builds; it does not deploy. The user runs `firebase deploy` from their own machine.
- **Firebase Hosting caches `index.html` for ~1h.** After a deploy, if the user says "I don't see the change" → ask them to check incognito / DevTools → Application → Clear site data. Don't assume it's a code bug until cache is ruled out.

## Working style

- Prefer **editing existing files** over creating new ones. Keep changes tightly scoped.
- **Plain-language UI copy** — most users aren't coders. "Publish", "Your Site Now", "Your Site With Changes" — not "deploy", "build", "diff".
- **Confirm before destructive actions** — don't overwrite live site, don't force-push, don't rewrite config without asking.
- **Run `yarn build` in `frontend/`** after UI changes to catch compile errors before the user deploys.
- For **exploratory questions** ("what could we do about X?"), respond in 2-3 sentences with a recommendation + tradeoff. Don't implement until the user agrees.

## When you ship a meaningful change

1. Commit on the current feature branch with a clear message.
2. `git push -u origin <branch>`.
3. **Append one line to the Change Log at the bottom of `BUILD_NOTES.md`** — date · branch · short summary. Commit that with the change (or as a follow-up).

## Open threads (check `BUILD_NOTES.md` §9 for details)

- Stripe billing is fully stubbed — needs `STRIPE_SECRET_KEY` + webhook signature check before going live.
- `servers.password` / `ssh_key` / `github_connections.access_token` / `users.ai_api_key` are plaintext in Firestore. Move to Secret Manager before broad launch.
- Studio Column 1 "Your Code From Server" is placeholder text — no real repo sync yet.
- Knowledge Base has CRUD but isn't parsed or fed into AI context.
- Old `tests/test_security_basics.py` references a FastAPI backend that no longer exists.
