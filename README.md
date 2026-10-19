# Fix the Break

A micro-learning web app on **what to do when an integration breaks**: a path of short lessons, quick exercises with immediate feedback, saved progress and a day streak.

The course has two units:

- **Diagnose:** spotting the break and its blast radius, reading the evidence, and isolating which side failed.
- **Respond:** containing the damage and communicating, fixing and replaying data, and reviewing to prevent a repeat.

**Status:** work in progress. The plan lives in the [Issues list](https://github.com/MarciaCofB/fix-the-break/issues), one Issue per ticket.

## Stack

- [Cloudflare Pages](https://developers.cloudflare.com/pages/) for the static site, Pages Functions for the API, and D1 (SQLite) for the database
- Plain JavaScript (ES modules), HTML and CSS
- [Vitest](https://vitest.dev/) for unit tests

There is no framework, bundler or TypeScript. The app is small, so plain JavaScript keeps it fast to load and easy to read end to end.

## Getting started

You need Node.js 20 or later.

```sh
npm install   # install dev tools (Vitest, Wrangler)
npm run dev   # serve the site locally at http://localhost:8788
npm test      # run the unit tests once
```

npm 11 may warn that install scripts for `esbuild`, `workerd` and `fsevents` were not run. That is expected: the app works without them.

## Project structure

| Folder       | What it holds                                                                 |
| ------------ | ----------------------------------------------------------------------------- |
| `public/`    | The static site: HTML, CSS and browser JavaScript                             |
| `functions/` | Pages Functions, served under `/api/*`                                        |
| `src/`       | Pure shared logic (answer checking, progress, streak, validation), no DOM or network code |
| `content/`   | Lesson content as JSON                                                        |
| `tests/`     | Vitest unit tests                                                             |
| `docs/`      | The ticket list and notes                                                     |

## v1 scope

**In:** a path of six lessons across two units, multiple-choice and true/false exercises with instant feedback and explanations, progress saved per browser (no sign-up), and a daily streak.

**Out of v1, on purpose:**

- Accounts or login (learners get an anonymous id instead)
- Payments
- Leagues or leaderboards
- An admin UI for content (lessons live in a JSON file)
- A mobile app (the site is built to work well on phones instead)
- AI-generated content at runtime (all content is written and reviewed in advance)

**Stretch goal after v1:** sending opt-in course completions to GoHighLevel ([#18](https://github.com/MarciaCofB/fix-the-break/issues/18)).

## Licence

[MIT](LICENSE)
