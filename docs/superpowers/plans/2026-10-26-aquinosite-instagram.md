# AquiNoSite Instagram Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare an isolated AquiNoSite repository for Instagram content creation and automated publishing without email or Teslinha-specific materials.

**Architecture:** Keep non-secret editorial rules in `config/instagram.json`, institutional truth in `docs/empresa.md`, and brand-generation conventions in `.agents/skills/aquinosite/SKILL.md`. Add a small TypeScript validation module with behavior tests so the schedule and editorial fallback are executable and reviewable.

**Tech Stack:** Node.js, TypeScript, Node test runner via `tsx`, JSON configuration, Markdown documentation.

**Spec:** `docs/superpowers/specs/2026-10-26-aquinosite-instagram-design.md`

## Global Constraints

- Publish two contents per weekday: Story at 09:00 and Feed at 15:00.
- Stories use 9:16; Feed uses 1:1 by default.
- Feed posts always receive an automatic caption.
- Missing weekly topics use free creation based on approved references.
- No SMTP, email automation, Teslinha identity, or Teslinha credentials.
- Secrets stay in local `.env`, never in Git or documentation.

### Task 1: Add failing configuration behavior tests

**Files:**
- Create: `package.json`
- Create: `tests/instagram-config.test.ts`

- [ ] Write tests for the approved weekday schedule, rejection of weekends, Feed captions, free-creation fallback, and absence of SMTP settings.
- [ ] Run `npm test` and confirm the tests fail because the validator/configuration is missing.

### Task 2: Implement minimal configuration validator

**Files:**
- Create: `src/instagram-config.ts`
- Create: `config/instagram.json`

- [ ] Add typed config loading and validation with exact error messages for invalid weekday slots, missing Feed captions, missing fallback, or SMTP keys.
- [ ] Run `npm test` and confirm all behavior tests pass.
- [ ] Refactor only for clarity while keeping the test suite green.

### Task 3: Add client documentation and project conventions

**Files:**
- Create: `README.md`
- Create: `docs/empresa.md`
- Create: `.agents/skills/aquinosite/SKILL.md`
- Create: `DESIGN.md`

- [ ] Document the client facts, source URLs, content routine, image formats, automatic captions, and later 10-image reference phase.
- [ ] Define image naming, safe areas, original-content rules, and the rule that uncertain health claims must not be invented.
- [ ] Record the approved visual direction as a placeholder for the client-provided identity reference, without fabricating colors before the reference asset is added.

### Task 4: Add safe environment and asset structure

**Files:**
- Create: `.env.example`
- Create: `.gitignore`
- Create: `assets/logo/.gitkeep`
- Create: `assets/referencias/.gitkeep`
- Create: `assets/marketing/.gitkeep`

- [ ] Add only Instagram/Meta and public-media URL variable names to `.env.example`.
- [ ] Ignore `.env`, generated output, dependencies, and macOS metadata.
- [ ] Ensure no SMTP variable appears in tracked project files.

### Task 5: Verify and deliver

- [ ] Run `npm test`.
- [ ] Run `npm run typecheck`.
- [ ] Run `git diff --check` and inspect `git status`/diff for secrets or Teslinha content.
- [ ] Check `.github/workflows/`; if absent, commit and push the completed implementation to the configured remote after reviewing the diff.
