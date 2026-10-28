# AquiNoSite Marketing Image Pipeline — Design

## Context

The AquiNoSite repository already defines a weekday Instagram routine, approved formats, official product sources, and a logo acceptance rule, but it does not yet implement the image-generation and publication pipeline needed to apply those rules consistently. The Teslinha Suporte repository provides the quality bar to replicate: brand-led composition, clear customer problem, safe Story layout, exact naming, captions, and automatic publishing.

This design ports the functionality and repository organization, not the Teslinha brand or content. All visual, editorial, and product decisions remain specific to AquiNoSite Saúde and its official website/catalog.

## Confirmed business rules

- Run Monday through Friday in `America/Sao_Paulo`.
- Generate one Story at 09:00 and one Feed image at 15:00.
- Generate and save the image even if Instagram publication fails.
- Publish automatically without individual approval.
- Story output is vertical `9:16`, preferably `1080x1920`.
- Feed output is square `1:1`, preferably `1080x1080`.
- Every Feed publication receives one plain Brazilian-Portuguese caption with a clear CTA.
- Stories may rely on the copy inside the artwork, but must keep text and logo inside the central safe area.
- Use the official AquiNoSite logo from `assets/logo/`; never rely on an AI-generated logo.
- Use only information confirmed by `docs/empresa.md`, the official website, and the product catalog when a product is shown.
- Never invent products, prices, stock, medical claims, certifications, results, or guarantees.
- Do not publish duplicate content or a file with a previously published SHA-256 hash.
- Instagram is the only publication destination in this project.

## Repository structure

The repository will follow the same functional structure as the Teslinha project while retaining AquiNoSite-specific content:

```text
.agents/skills/aquinosite/SKILL.md   Project operating rules
assets/logo/                          Official client logos
assets/referencias/                  Visual and product references
assets/marketing/                    Final Feed and Story artwork
config/                               Schedule, visual tokens, prompts, references
docs/                                 Institutional docs and design decisions
scripts/                              Composition, validation, generation, publication
src/                                  Typed reusable pipeline modules
tests/                                Behavior and contract tests
logs/marketing/                       Local generation/publication records, ignored
```

Existing AquiNoSite files and untracked client assets must be preserved. The implementation must not import Teslinha logos, copy Teslinha claims, or replace the AquiNoSite content model.

## Architecture

### 1. Editorial and visual configuration

Add typed configuration for:

- exact Feed and Story dimensions and safe areas;
- AquiNoSite palette and typography roles;
- composition limits such as one headline, one primary visual, and one CTA;
- editorial themes and their approved reference assets;
- official logo path and product-source rules.

The existing `config/instagram.json` remains the source of schedule and client identity. New configuration files must reference it rather than duplicate schedule values.

### 2. Image generation and final composition

The image generator is responsible for an original background/scene only. Its prompt must reserve space and prohibit generated logos, important copy, third-party logos, invented products, and unsupported claims.

A deterministic composition step then:

1. normalizes the canvas to the exact requested format;
2. applies the official logo file;
3. draws the approved copy and CTA with a project font/style;
4. applies the AquiNoSite visual tokens;
5. writes the final PNG to `assets/marketing/` using `YYYY-MM-DD_HH-mm-ss_descricao-curta_vNN.png` in `America/Sao_Paulo`.

This makes logo and text quality independent of image-model typography.

### 3. Validation

The validator must reject an asset when:

- its dimensions or aspect ratio do not match the requested channel;
- Story copy or logo leaves the configured central safe area;
- the official logo is missing or has not been applied;
- the filename does not match the timestamp/version convention;
- the SHA-256 hash was already recorded as published;
- a Feed caption is missing, contains a literal `\\n`, or contains unsupported claims detected by the content contract;
- a product visual lacks a catalog entry and official product-page reference.

Validation must run before a publication request.

### 4. Publication and failure persistence

The publisher will use the existing local `.env` Instagram credential without printing or committing secrets. It will create a media container, publish it, and record the returned media ID and permalink.

Generation is committed independently from publication. A publication failure must be recorded with the file path, hash, channel, timestamp, and sanitized API error. The already-generated file remains available for retry and must not be regenerated as a duplicate.

### 5. Routine execution

The routine runner reads the configured weekday slots and executes:

- 09:00: create, validate, save, and publish one Story;
- 15:00: create, validate, save, caption, and publish one Feed.

The runner must be safe to retry: it checks the generated hash and publication log before creating a new publication attempt.

## Error handling

- Missing references or logo: fail generation and record the reason; do not publish.
- Unsupported product or missing official product page: generate a non-product educational/institutional piece or record a blocked editorial decision, according to the selected theme.
- Image-generation failure: record the failure and leave no misleading success state.
- Validation failure: retain the intermediate output outside `assets/marketing/`, record the failed checks, and do not publish.
- Instagram/API failure after a valid asset exists: retain the final asset and record a retryable failure.
- Duplicate hash: do not publish and record the duplicate source.

## Testing strategy

Tests will be added before implementation for:

- exact schedule behavior and weekday-only execution;
- independent generation when publication fails;
- Feed and Story dimensions and filename contract;
- safe-area validation;
- official-logo requirement;
- no literal `\\n` in Feed captions;
- product-source requirement;
- duplicate SHA-256 rejection;
- sanitized publication failure logging;
- preservation of existing untracked client assets.

Integration tests against Instagram will be opt-in and must never expose the access token in output.

## Acceptance examples

1. At Monday 09:00, the runner creates a new Story, saves it as a unique `9:16` PNG, validates it, and attempts publication. If Instagram rejects the request, the PNG and sanitized failure remain recorded.
2. At Tuesday 15:00, the runner creates a square Feed image and one caption without a literal `\\n`, validates the product source when applicable, and publishes it automatically.
3. Re-running the same slot with the same SHA-256 does not publish a second copy.
4. An AI-generated approximation of the AquiNoSite logo fails validation until the official logo is applied.
5. A product not present in `config/catalogo-produtos.json` cannot appear in a product artwork.

