# AquiNoSite Marketing Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a Teslinha-quality image-generation support pipeline for AquiNoSite that creates, composes, validates, records, and publishes weekday Instagram Story and Feed content while preserving AquiNoSite's health-equipment context.

**Architecture:** Keep `config/instagram.json` as the schedule source of truth. Add typed visual/editorial contracts in `src/`, deterministic PNG composition with the official AquiNoSite logo and copy, validation and publication modules, and a slot runner that always persists the generated asset before attempting Instagram publication. Use the existing `.env` only at runtime; no credentials or external publication calls belong in tests.

**Tech Stack:** Node.js, TypeScript, `sharp` for deterministic image composition and metadata, Node test runner through `tsx`, JSON configuration, Instagram Graph API over `fetch`, SHA-256 through Node `crypto`.

**Spec:** `docs/superpowers/specs/2026-10-28-aquinosite-marketing-pipeline-design.md`

## Global Constraints

- Run only Monday through Friday in `America/Sao_Paulo`.
- Generate Story at 09:00 and Feed at 15:00.
- Preserve generated assets when publication fails.
- Use Story `9:16`, preferably `1080x1920`; use Feed `1:1`, preferably `1080x1080`.
- Use only AquiNoSite sources and official logo/product references; never import Teslinha assets or claims.
- Do not commit `.env`, access tokens, logs containing tokens, or unrelated user files.
- Do not stage the existing untracked files under `assets/marketing/` or `assets/referencias/` unless explicitly requested.
- Feed captions must be Brazilian Portuguese, one continuous string, and contain no literal `\\n`.
- A generated image is never published before validation succeeds.
- All new production behavior must have a failing test observed before implementation.

### Task 1: Establish the typed visual and editorial contracts

**Files:**
- Create: `config/identidade-visual.json`
- Create: `config/referencias-visuais.json`
- Create: `src/marketing-types.ts`
- Modify: `src/instagram-config.ts`
- Test: `tests/marketing-config.test.ts`

**Interfaces:**
- `MarketingFormat = 'story' | 'feed'`
- `MarketingConfig` contains exact dimensions, safe areas, palette roles, typography roles, logo path, and composition limits.
- `ReferenceMap` maps editorial themes to AquiNoSite reference asset paths.
- `loadMarketingConfig()` and `loadReferenceMap()` read repository JSON files.
- `validateMarketingConfig()` returns `{ valid: true }` or `{ valid: false, errors: string[] }`.

- [ ] **Step 1: Write the failing tests** for exact Story/Feed dimensions, safe-area bounds, official logo path, and references that remain inside `assets/referencias/`.
- [ ] **Step 2: Run the focused test** with `npm test -- tests/marketing-config.test.ts`; confirm failure because the configuration and loaders do not exist.
- [ ] **Step 3: Add the JSON contracts and minimal TypeScript loaders** with AquiNoSite-specific colors, safe areas, and reference paths.
- [ ] **Step 4: Run the focused test** and confirm it passes.
- [ ] **Step 5: Run `npm run typecheck`** and commit only the task files with `feat: add AquiNoSite marketing contracts`.

### Task 2: Add deterministic filename, caption, hash, and publication-log utilities

**Files:**
- Create: `src/marketing-identity.ts`
- Create: `src/caption.ts`
- Create: `src/marketing-log.ts`
- Create: `logs/marketing/.gitkeep`
- Modify: `.gitignore`
- Test: `tests/marketing-identity.test.ts`
- Test: `tests/caption.test.ts`
- Test: `tests/marketing-log.test.ts`

**Interfaces:**
- `formatMarketingFilename(date: Date, slug: string, version: number, extension: string): string`
- `sha256File(path: string): Promise<string>`
- `assertUniqueHash(hash: string, records: PublicationRecord[]): void`
- `buildFeedCaption(input: CaptionInput): string`
- `sanitizeApiError(error: unknown): string`
- `appendMarketingRecord(record: MarketingRecord, logPath?: string): Promise<void>`
- `readMarketingRecords(logPath?: string): Promise<MarketingRecord[]>`

- [ ] **Step 1: Write failing tests** for São Paulo filename formatting, versioned slugs, duplicate hash rejection, a caption without literal `\\n`, and sanitized errors that never contain an access token.
- [ ] **Step 2: Run the focused tests** and confirm expected missing-module failures.
- [ ] **Step 3: Implement the minimal pure utilities** and newline-delimited JSON logging; configure `logs/marketing/*.jsonl` to be ignored while retaining `.gitkeep`.
- [ ] **Step 4: Run the focused tests** and confirm they pass.
- [ ] **Step 5: Run the full existing suite** and commit with `feat: add marketing identity and publication records`.

### Task 3: Implement official-logo composition and safe-area validation

**Files:**
- Create: `src/compose-marketing-image.ts`
- Create: `src/validate-marketing-image.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Test: `tests/compose-marketing-image.test.ts`
- Test: `tests/validate-marketing-image.test.ts`

**Interfaces:**
- `composeMarketingImage(input: ComposeInput): Promise<ComposeResult>` accepts a scene path, format, copy blocks, and official logo path, then writes a final PNG.
- `validateMarketingImage(input: ValidateImageInput): Promise<ValidationResult>` checks dimensions, aspect ratio, logo presence, safe-area geometry, filename, and duplicate hash.
- The final image dimensions are exactly `1080x1920` for Story and `1080x1080` for Feed.

- [ ] **Step 1: Write failing tests** using small generated fixture images for exact output dimensions, official logo application, copy staying inside the configured safe area, and rejection of an omitted logo.
- [ ] **Step 2: Run focused tests** and confirm they fail because the compositor and validator do not exist.
- [ ] **Step 3: Add `sharp` and implement the minimal compositor**: resize/crop the scene, add AquiNoSite palette overlays, apply the official logo file, draw copy using a deterministic font asset or system fallback, and write PNG metadata.
- [ ] **Step 4: Implement the validator** against the generated metadata/manifest and configured geometry; do not attempt OCR in the first version.
- [ ] **Step 5: Run focused tests and inspect one Story and one Feed fixture**; confirm exact dimensions and logo placement.
- [ ] **Step 6: Run `npm run typecheck` and the full suite**, then commit with `feat: compose and validate AquiNoSite artwork`.

### Task 4: Add product/editorial source validation

**Files:**
- Create: `src/editorial-contract.ts`
- Modify: `src/marketing-types.ts`
- Test: `tests/editorial-contract.test.ts`

**Interfaces:**
- `validateEditorialBrief(brief: EditorialBrief, sources: EditorialSources): EditorialValidationResult`
- `validateProductReference(productSlug: string, catalogPath?: string): ProductValidationResult`
- A product brief must contain a catalog entry and official product-page path; an educational/institutional brief may omit a product.

- [ ] **Step 1: Write failing tests** for accepted catalog products, rejected unknown products, unsupported medical claims, and non-product educational content.
- [ ] **Step 2: Run the focused tests** and confirm they fail for the missing contract.
- [ ] **Step 3: Implement source validation** using `docs/empresa.md`, `config/catalogo-produtos.json`, and the official website URL already recorded in config.
- [ ] **Step 4: Run focused and full tests** and commit with `feat: validate AquiNoSite editorial sources`.

### Task 5: Implement Instagram publication with retry-safe failure persistence

**Files:**
- Create: `src/instagram-publisher.ts`
- Create: `src/publication-types.ts`
- Test: `tests/instagram-publisher.test.ts`

**Interfaces:**
- `publishInstagram(input: PublishInput, client?: InstagramClient): Promise<PublishResult>`.
- `InstagramClient` exposes `createMediaContainer()` and `publishMedia()` so tests can use a deterministic local client without network access.
- `PublishResult` always includes channel, asset path, hash, status, and either permalink/media ID or sanitized error.

- [ ] **Step 1: Write failing tests** for Story and Feed media types, caption inclusion only for Feed, successful permalink recording, and API failure that preserves the asset and sanitizes the error.
- [ ] **Step 2: Run focused tests** and confirm expected failure.
- [ ] **Step 3: Implement the Graph API client** using runtime `INSTAGRAM_ACCESS_TOKEN` only; never print request URLs containing tokens.
- [ ] **Step 4: Implement failure persistence through `marketing-log.ts`** and duplicate/hash checks before container creation.
- [ ] **Step 5: Run focused and full tests** and commit with `feat: add retry-safe Instagram publisher`.

### Task 6: Implement slot runner and generation manifest contract

**Files:**
- Create: `src/content-slot.ts`
- Create: `scripts/run-content-slot.ts`
- Create: `scripts/validate-marketing-image.ts`
- Create: `scripts/publish-instagram.ts`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `.agents/skills/aquinosite/SKILL.md`
- Test: `tests/content-slot.test.ts`
- Test: `tests/marketing-scripts.test.ts`

**Interfaces:**
- `runContentSlot(input: SlotInput): Promise<SlotResult>`.
- Slot input contains `channel`, `scheduledAt`, `scenePath`, `brief`, and optional `caption`.
- The runner saves the final asset and log record before invoking publication; a publication failure returns a failed publication status, not a failed generation status.

- [ ] **Step 1: Write failing tests** for Monday-Friday acceptance, weekend rejection, Story/Feed format selection, asset persistence before publication, and no publication for failed validation.
- [ ] **Step 2: Run focused tests** and confirm the missing runner fails correctly.
- [ ] **Step 3: Implement the runner and CLI scripts** around the previously tested modules; expose `npm run marketing:validate`, `npm run marketing:publish`, and `npm run marketing:slot`.
- [ ] **Step 4: Update README and skill** so future Codex runs use the same repository structure and AquiNoSite-specific prompt/asset rules as the implementation.
- [ ] **Step 5: Run all tests, typecheck, and a local dry-run** with a fixture scene and a fake Instagram client; commit with `feat: add AquiNoSite marketing slot runner`.

### Task 7: Configure the recurring routine and verify the repository boundary

**Files:**
- Modify: `config/instagram.json`
- Create: `config/rotina-instagram.json`
- Create: `docs/rotina-instagram.md`
- Test: `tests/routine-config.test.ts`

- [ ] **Step 1: Write failing tests** for weekday-only schedule, Story at 09:00, Feed at 15:00, and generation-on-publication-failure behavior.
- [ ] **Step 2: Run focused tests** and confirm failure for the routine manifest.
- [ ] **Step 3: Implement the routine manifest and documentation** without changing the already-confirmed schedule.
- [ ] **Step 4: Run all tests and typecheck**.
- [ ] **Step 5: Inspect `.github/workflows/`; do not add a workflow unless explicitly requested.**
- [ ] **Step 6: Review `git status` and stage only task files; leave pre-existing untracked marketing/reference files untouched.**
- [ ] **Step 7: Commit with `feat: configure AquiNoSite Instagram routine` and push to the existing remote after verification.**

## Verification commands

```bash
npm test
npm run typecheck
npm run marketing:slot -- --dry-run --channel story --scene fixtures/story-scene.png
npm run marketing:validate -- assets/marketing/<generated-file>.png
```

The implementation is complete only when the tests pass, the dry run produces the correct dimensions and filename, an induced publication failure leaves the asset and sanitized log record, and the final Git push reports success.

