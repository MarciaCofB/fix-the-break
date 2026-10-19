# Fix the Break — v1 ticket list

A micro-learning app on **what to do when an integration breaks**: a path of lessons, short exercises, saved progress and a day streak.

- **Unit 1 — Diagnose:** spotting the break and its blast radius; reading logs, error codes and webhook payloads; isolating which side of the integration failed.
- **Unit 2 — Respond:** containing the damage and communicating to stakeholders; fixing, replaying and backfilling data; the post-incident review and preventing a repeat.

Each ticket below is one GitHub Issue: the heading is the title, the italic line is the user story, and the checklist is the acceptance criteria. Label each with its day (`day-1` … `day-6`); ticket 18 is labelled `stretch`.

## Day 1 — deployed skeleton

### 1. Repo skeleton and test harness

*As the developer, I have a clean project structure with tests running from the first commit.*

- [ ] Public GitHub repo with `README.md`, `.gitignore`, `LICENSE` and `package.json`
- [ ] Folders: `public/` (static site), `functions/` (Pages Functions), `src/` (shared logic), `content/` (lesson JSON), `tests/`
- [ ] Vitest installed; `npm test` runs one trivial passing test
- [ ] `npm run dev` serves the site locally via Wrangler
- [ ] A "v1 scope" section in the README lists what is explicitly out (accounts, payments, leaderboards, admin UI, mobile app, runtime AI content)

### 2. Live landing page on Cloudflare Pages

*As a visitor, I can open a real URL and see what Fix the Break is.*

- [ ] Repo connected to Cloudflare Pages; a push to `main` deploys to production
- [ ] Pushes to other branches create preview deployments
- [ ] Landing page states the app's name, a one-line purpose and a "Start learning" link
- [ ] Live URL added to the README and the repo's About field
- [ ] Page has a `<title>`, meta description and favicon

## Day 2 — the path screen

### 3. Lesson content schema

*As the content author, I can add or edit lessons by changing one JSON file, with mistakes caught automatically.*

- [ ] `content/course.json` defines units → lessons → questions, each with a stable id (e.g. unit `1`, lesson `1-2`, question `1-2-3`)
- [ ] Multiple-choice questions have `prompt`, `options[]`, `correctIndex` and an `explanation`
- [ ] True/false questions have `prompt`, `answer` (boolean) and an `explanation`
- [ ] A validation function rejects duplicate ids, missing fields, out-of-range `correctIndex` and lessons without exactly 5 questions
- [ ] A unit test runs the validator against the real content file, so bad content fails the build
- [ ] Placeholder content for 2 units × 3 lessons × 5 questions

### 4. Path screen

*As a learner, I can see the whole course and where I am in it at a glance.*

- [ ] Renders both units and all six lessons from `course.json` (no hard-coded lesson titles in HTML)
- [ ] Each lesson shows one of three states: locked, available or complete — distinguished by more than colour alone (icon or label)
- [ ] Only the first lesson is available for a new learner; completing a lesson unlocks the next
- [ ] Locked lessons can't be opened, and say why ("Finish 1-2 first")
- [ ] Unit headers show progress, e.g. "2 of 3 complete"

### 5. Client-side routing

*As a learner, I can open, bookmark and go back from lesson URLs like any normal website.*

- [ ] `/` shows the path screen; `/lesson/1-2` opens that lesson without a full page reload
- [ ] Browser back and forward work as expected
- [ ] Refreshing or opening `/lesson/1-2` directly works on the live site (Pages redirect/fallback configured)
- [ ] Unknown lesson ids show a friendly "not found" with a link back to the path
- [ ] Visiting a locked lesson's URL redirects to the path screen

## Day 3 — the lesson screen

### 6. Lesson screen: render questions

*As a learner, I see one question at a time with clear answer options.*

- [ ] Shows the lesson title, the question prompt and a progress indicator ("Question 2 of 5")
- [ ] Multiple-choice renders its options; true/false renders exactly two options, "True" and "False"
- [ ] Options are real `<button>` or radio elements, not clickable `<div>`s
- [ ] A "Back to path" link is always available; leaving mid-lesson doesn't mark it complete

### 7. Lesson screen: answer checking and feedback

*As a learner, when I select an answer I see immediately whether it was right, and why.*

- [ ] Selecting an option marks it right or wrong without a page reload
- [ ] A wrong answer also highlights the correct one
- [ ] The question's `explanation` appears after answering, right or wrong
- [ ] Options lock after answering; the answer can't be changed
- [ ] The Next button only appears after answering
- [ ] Keyboard accessible: tab to an option, Enter or Space to confirm, focus moves to feedback then Next
- [ ] Feedback is announced to screen readers (`aria-live`)
- [ ] Answer checking lives in a pure function in `src/` with unit tests for both question types

### 8. Lesson completion screen

*As a learner, finishing a lesson feels like an achievement and tells me what's next.*

- [ ] After question 5, shows a completion screen with the score (e.g. "4 of 5 correct")
- [ ] A lesson counts as complete once all 5 questions are answered, regardless of score (decision recorded in the README)
- [ ] Offers "Next lesson" (when one exists) and "Back to path"
- [ ] Completing the final lesson of the course shows a course-complete message instead of "Next lesson"

### 9. Save progress locally

*As a learner, my progress is still there when I come back later on the same browser.*

- [ ] Completed lesson ids and best scores are saved to `localStorage` behind a small `progressStore` interface (so Day 4 can swap the storage without touching the UI)
- [ ] The path screen reads from the same store to show states
- [ ] The app still works if `localStorage` is unavailable (private mode): progress lasts for the session only, no crash
- [ ] Unit tests cover: marking complete, unlocking the next lesson, keeping the best score, and handling corrupted saved data

## Day 4 — real persistence

### 10. D1 schema and anonymous learner id

*As a learner, my progress is stored on the server without me creating an account.*

- [ ] D1 database created and bound to the Pages project in `wrangler.toml`
- [ ] Migration file creates `learners (id, created_at)` and `progress (learner_id, lesson_id, best_score, completed_at)` with a unique key on `(learner_id, lesson_id)`
- [ ] On first API call, a random id (`crypto.randomUUID()`) is set in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie lasting 1 year
- [ ] All timestamps stored in UTC
- [ ] Migrations are committed and the steps to apply them are in the README

### 11. Progress API

*As the frontend, I can read and save a learner's progress through two endpoints.*

- [ ] `GET /api/progress` returns the learner's completed lessons, best scores and streak as JSON
- [ ] `POST /api/progress` with `{ lessonId, score }` records a completion; repeat posts keep the best score
- [ ] Rejects unknown lesson ids and scores outside 0–5 with a `400` and a clear error message
- [ ] Uses prepared statements (no string-built SQL)
- [ ] `progressStore` switches to the API; any existing `localStorage` progress is uploaded once, then cleared
- [ ] If the API fails, the lesson still completes in the UI and a quiet "couldn't save, retrying" message appears
- [ ] Request validation is a pure function with unit tests

### 12. Day streak

*As a learner, I see how many days in a row I've completed a lesson, which nudges me to come back.*

- [ ] A "day" is a UTC calendar date (decision and trade-off recorded in the README)
- [ ] Completing one or more lessons on a day counts that day once
- [ ] Streak continues if the previous active day was yesterday; resets to 1 if a day was missed
- [ ] Streak is shown on the path screen; a missed day shows 0 until the next completion
- [ ] Streak calculation is a pure function taking dates as input, with unit tests for: first day, same-day repeat, consecutive days, a missed day, and month/year boundaries

## Day 5 — design and the gate

### 13. Visual design system

*As a learner, the app feels light, calm and trustworthy — like a well-set book, not a template.*

- [ ] One typeface with real character (not Inter), self-hosted or loaded from Google Fonts, with a fallback stack
- [ ] A modular type scale defined as CSS custom properties (e.g. 5–6 steps)
- [ ] Two or three colours total, defined as tokens; text meets WCAG AA contrast
- [ ] No pill buttons, gradient blobs or soft-shadow cards; states are shown with typography, rules and spacing
- [ ] Generous whitespace from a single spacing scale
- [ ] A short "Design decisions" note in the README explains the typeface and colour choices

### 14. Mobile and accessibility pass

*As a learner on my phone, everything is easy to read and tap.*

- [ ] Layout works from 320px wide with no horizontal scroll
- [ ] Tap targets at least 44×44px
- [ ] Visible focus styles on every interactive element
- [ ] Respects `prefers-reduced-motion`
- [ ] Lighthouse accessibility score of 95+ on the path and lesson screens (screenshot in the README)
- [ ] Tested on at least one real phone; issues found are logged as Issues and fixed or deferred

### 15. CI gate on every change

*As the maintainer, a change with failing tests can't reach `main`.*

- [ ] GitHub Action runs `npm ci` and `npm test` on every push and pull request
- [ ] Branch protection on `main` requires the test check to pass before merging
- [ ] Work happens on branches merged via pull requests
- [ ] Proven once on purpose: a PR with a deliberately failing test is blocked (link it in the README)
- [ ] CI status badge in the README

## Day 6 — content and write-up

### 16. Real lesson content

*As a learner, every lesson teaches something genuinely useful about handling a broken integration.*

- [ ] All 30 questions replaced with real content across the six lessons (Diagnose: spotting the break, reading the evidence, isolating the fault; Respond: containing and communicating, fixing and replaying, reviewing and preventing)
- [ ] Each question has a one- or two-sentence explanation that teaches, not just "Correct!"
- [ ] Mix of about 3 multiple-choice and 2 true/false per lesson
- [ ] Scenarios are concrete (a failed webhook, an expired API token, a rate limit, a field-mapping change), with no real company names or credentials
- [ ] Content validator test passes

### 17. README and walkthrough

*As a hiring client, I can understand what was built, why, and how well in five minutes.*

- [ ] README covers: what it is and the live link; the stack and why; key decisions and trade-offs (UTC days, anonymous cookie id, completion regardless of score, no framework); what was cut from v1 and why; what you'd do next
- [ ] Links to the Issues list and a note on working with Claude Code (tickets in, small commits, tests checked)
- [ ] Screenshots of the path and lesson screens on desktop and phone
- [ ] A Loom walkthrough of 3–5 minutes, linked at the top
- [ ] All v1 Issues closed or moved to a "Later" milestone with a reason

## Stretch (after v1)

### 18. (Stretch) Send course completions to GoHighLevel

*As a learner who finishes the course, I can opt in to receive a follow-up email, so the course can lead into a conversation.*

- [ ] Course-complete screen offers an optional "Email me a summary" form (name, email, explicit consent checkbox); skipping it changes nothing
- [ ] A Pages Function `POST /api/subscribe` validates the input and forwards `{ name, email, score, completedAt }` to a GoHighLevel Inbound Webhook URL
- [ ] The webhook URL lives in a Cloudflare environment secret, never in frontend code or the repo
- [ ] A GoHighLevel workflow creates or updates the contact, tags it `fix-the-break-complete` and sends one summary email
- [ ] If GoHighLevel is down, the learner sees a polite error and nothing else breaks; failures are logged
- [ ] A unit test covers the payload builder and input validation; GoHighLevel is mocked in tests
- [ ] A privacy note on the page says what's sent to GoHighLevel and why
- [ ] README section with a screenshot of the GoHighLevel workflow and the trade-off: this adds personal data, so it stays opt-in
