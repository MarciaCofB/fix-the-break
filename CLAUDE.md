# Fix the Break — project guide for Claude Code

## What this is
A micro-learning web app teaching "what to do when an integration breaks": a path of lessons, short exercises with immediate feedback, saved progress and a day streak. It is a portfolio project, so the code, tests and commit history must be easy for a reviewer to follow.

The full ticket list with acceptance criteria is in `docs/tickets.md` and as GitHub Issues. Work one ticket at a time and treat its acceptance criteria as the definition of done.

## Stack
- Cloudflare Pages (static site) + Pages Functions (API) + D1 (database)
- Plain JavaScript (ES modules), HTML and CSS. **No framework, no bundler, no TypeScript.**
- Vitest for unit tests; GitHub Actions runs them on every push and pull request
- Wrangler for local development (`npm run dev`)

## Structure
- `public/` — static site (HTML, CSS, client JS)
- `functions/` — Pages Functions (`/api/*`)
- `src/` — pure, shared logic (answer checking, progress, streak, validation). No DOM or network code here, so it is easy to test.
- `content/course.json` — all lesson content
- `tests/` — Vitest tests
- `docs/` — tickets and notes

## How we work
- Small increments: one ticket or part of a ticket per change. Don't generate large amounts of code in one go.
- Explain what you're about to change before making big edits, and explain any non-obvious code. The owner reads and understands everything before it is committed.
- Every piece of logic in `src/` gets unit tests that check real behaviour, including edge cases.
- Run `npm test` before saying a task is done.
- Commit often with clear messages; reference the Issue (e.g. `Add answer checking (#7)` or `Closes #7`).
- Keep dependencies to a minimum; ask before adding one.
- Store dates in UTC. A streak "day" is a UTC calendar date.
- Accessibility matters: real buttons and form elements, keyboard support, visible focus, sufficient contrast.

## Design direction
Light, calm, typographic and trustworthy. One typeface with real character (not Inter), a proper type scale, generous whitespace, two or three colours. **No** pill buttons, gradient blobs or soft-shadow cards. Must work well on a phone.

## Out of scope for v1 (don't build these)
No accounts or login, no payments, no leagues or leaderboards, no admin UI for content (lessons live in JSON), no mobile app, no AI-generated content at runtime. The GoHighLevel integration (ticket 18) is a stretch goal for after v1.
