# COMPETITOR_POLICY.md

## Why this exists

`SCOPE.md` deliberately deferred competitor research out of Prompt 1
("Competitor products, competitor strategy... (Prompt 2)"). The user has now
asked for it directly, in extreme high quality, across all products. This
document defines the unit of comparison, the fields captured, and the
evidence rules before any competitor data is transcribed — same discipline as
`SOURCE_POLICY.md` and `IMAGE_POLICY.md`.

## Unit of comparison

Versuni's 76 products include many regional/plug/colour variant SKUs that
share one real-world product (e.g. `PSA3218/01` and `PSA3218/10` are the same
machine in two markets). Forcing a distinct competitor match onto every SKU
would fabricate precision that doesn't exist. Competitor research is therefore
done **per world** (the 8 product worlds: Food, Coffee, Air, Clean, Clothes,
Home, Pets, Garden) and, within each world, matched to the **families**
whose job/capability/price tier it competes against — not to every individual
SKU.

Every competitor product row states which Versuni `category_id`(s) it
competes against, and a positioning class:

- `DIRECT` — same job, same capability tier, same price band.
- `ADJACENT` — same job, different capability tier or price band.
- `SUBSTITUTE` — different mechanism, same job satisfied for the user.

## "Where are they located" — two distinct facts, both captured

The request asks where competitors "are located." That's ambiguous between
company identity and market availability, so both are captured explicitly
rather than picking one silently:

- **`hq_country` / `hq_city`** on `competitors.csv` — where the competing
  company is headquartered / legally based, sourced from its own official
  "About/Company/Investor" page.
- **`markets`** on `competitor_products.csv` — the countries where that
  specific competing product is actually sold, i.e. where its price was
  observed. This reuses the same `country` field already used on
  Versuni's own `prices.csv`, so the two are directly comparable.

## New tables

- `data/normalized/competitors.csv` — competitor company identity.
  Columns: `competitor_id, company_name, hq_country, hq_city, official_domain,
  ownership_notes, source_ids`.
- `data/normalized/competitor_products.csv` — one row per real, currently
  sold competing product. Columns: `competitor_product_id, competitor_id,
  versuni_category_id, product_name, model, positioning, markets,
  official_url, notes, source_ids`.
- `data/normalized/competitor_prices.csv` — mirrors the shape of
  `prices.csv`. Columns: `competitor_product_id, country, price_type, value,
  currency, observed_at, source_id`.

## Evidence rules (extends SOURCE_POLICY.md)

1. A competitor price is only recorded from a Tier A (official brand
   store/product page) or Tier B (major authorized retailer) source — never
   a marketplace listing, forum post, or aggregator (Tier C, discovery-only).
2. A competitor's HQ location is only recorded from that company's own
   official page, or a source publisher explicitly identified as the company
   itself (press kit, investor page). A blog or Wikipedia mention alone is
   not sufficient to promote to OBSERVED — it can seed a lead but the fact
   must resolve to a Tier A source before being recorded here.
3. Every row in all three tables carries `source_ids` resolving into
   `sources.csv`, exactly like every other factual table in this project.
4. Under root `CLAUDE.md`'s evidence classes: a transcribed competitor price
   or HQ fact is `OBSERVED`. A positioning judgement (`DIRECT`/`ADJACENT`/
   `SUBSTITUTE`) is `DERIVED` — a documented, consistent rule applied to
   observed capability/price facts, not itself an independently observed
   fact. Neither is elevated to a market-share, sales-volume, or "best
   competitor" claim — no such data has been collected.
5. If a world has no verifiable, currently-sold direct competitor (rare, but
   possible for a very narrow niche), that gap is logged in
   `competitors.csv` notes / `CHECKLIST.md`, not silently skipped or
   papered over with a weak substitute mislabelled as direct.
6. Coverage target: 4-8 real, sourced competing products per world, spanning
   at least 3 different competing companies where the market supports it,
   so no single competitor dominates the comparison by research convenience
   rather than market reality.

## What this is NOT

- Not a market-share or sales-volume analysis (no such data exists).
- Not a claim about which product is "better" — only what is offered, at
  what price, by whom, and where.
- Not exhaustive: this is the most relevant, verifiable competitive set per
  world, not every company that makes an air purifier or espresso machine
  worldwide.

---

## v2 — extreme-depth expansion (2026-08-27)

The user escalated the brief: full company/brand graph, claim-vs-evidence
separation, certification, TCO, an image registry, a normalized capability
ontology, an intelligence classification for Air, and an Arena comparison UI
(Battle/Map/Matrix/Timeline), with Air Purification named as the flagship
case requiring extreme depth and the other 7 worlds requiring "systematic"
(not extreme) coverage. This section extends v1 rather than replacing it —
the v1 tables, evidence rules, and per-world scope stand.

### Tiered depth model

- **Air**: extreme depth. Target 15-20 real, currently-sold models across
  8-10 real companies, each carrying specs, images, certification where
  findable, capability-ontology mapping, claim-vs-evidence entries for its
  headline claims, an intelligence classification, and a TCO estimate where
  filter-price + interval data supports one.
- **Food, Coffee, Clean, Clothes, Home, Pets, Garden**: systematic coverage
  at the v1 depth (company + product + one official price + positioning per
  product), not the full Air depth stack. This is a proportional scope
  decision, not an oversight — stated here so it isn't mistaken for one.

### Company graph — reusing this project's own existing pattern, not inventing a heavier one

Versuni's own `brands.csv` already conflates "company" and "brand" into one
row (`parent_company` is a plain text field, not a separate table — see
`philips` brand: `parent_company=Versuni`). `competitors.csv` follows the
exact same shape for symmetry: `parent_company` and `origin_country` are
added as columns on `competitors.csv` rather than exploding into separate
COMPANY / PARENT_COMPANY / BRAND / SUB-BRAND tables. A heavier graph would be
inconsistent with how this project already models Versuni's own identity
layer, and isn't earned by the evidence available (parent-company ownership
for most competitors is a one-line fact, not a multi-entity structure).

### New tables (data/normalized/)

- `competitor_specs_long.csv` — mirrors `specs_long.csv` exactly:
  `competitor_product_id, field, value, source_id`. Used for Air's deep spec
  set (CADR, room coverage, filtration type, gas/VOC capability, sensors,
  display, auto mode, connectivity, power, noise, dimensions, weight, filter
  SKU, filter price, replacement interval, warranty) and, more sparingly,
  for other worlds' key specs.
- `competitor_images.csv` — `image_id, competitor_product_id, url,
  source_page, publisher, match_state, retrieved_at, source_id`.
  `match_state` ∈ `VERIFIED_EXACT, VERIFIED_FAMILY, VERIFIED_MARKET_VARIANT,
  UNSURE, MISSING` — same discipline as Versuni's own `IMAGE_POLICY.md`.
  Never a marketplace/Pinterest/SEO-aggregator/watermarked/AI-generated
  image — official manufacturer page first, official media/support second,
  authorized-retailer exact match only as a last resort.
- `competitor_claims.csv` — `claim_id, competitor_product_id,
  original_claim, claim_type, source_id, test_context,
  normalized_interpretation, independent_corroboration, conflict,
  limitation`. Separates what a manufacturer says from what is independently
  verified. `independent_corroboration` ∈ `CORROBORATED, NOT_FOUND,
  CONTRADICTED`. A claim with `NOT_FOUND` is not treated as false — it is
  treated as unverified.
- `competitor_certifications.csv` — `cert_id, competitor_product_id,
  certification_body, certification_ref, status, source_id,
  establishes_note`. `establishes_note` states plainly what the certification
  actually proves (e.g. AHAM Verifide establishes a measured CADR under a
  standard test protocol; it does not establish health outcomes. CARB
  establishes ozone-emission compliance; it does not establish purification
  effectiveness. ENERGY STAR establishes energy efficiency; it does not
  establish health benefit) — this project will not let a certification
  badge imply more than it actually does.
- `competitor_capabilities.csv` — `competitor_product_id, capability_group,
  canonical_capability, original_language, evidence_state, source_id`.
  `capability_group` ∈ `PERFORMANCE, PERCEPTION, INTELLIGENCE, EXPERIENCE,
  ECONOMICS, SUSTAINABILITY, SAFETY_CERTIFICATION`. `evidence_state` ∈
  `OBSERVED_SPEC` (from an official spec sheet), `MANUFACTURER_CLAIM`
  (marketing language, not a spec-sheet number), `INDEPENDENTLY_VERIFIED`
  (a certification or third-party test corroborates it). Every row keeps
  the original manufacturer wording alongside the normalized capability name
  so nothing is silently reworded into a stronger claim.
- `competitor_intelligence.csv` — Air-only. `competitor_product_id,
  dimension, status, evidence_note, source_id`. `dimension` ∈ `SENSE, REACT,
  ADAPT, PREDICT, LEARN, COORDINATE` — reuses the same intelligence lens
  already built for Versuni's own products in `LABEL_RULES.md` (RULE-LENS-D),
  applied to competitors for true comparability. `status` ∈ `EVIDENCED,
  UNKNOWN` — never inferred from marketing language like "AI purification"
  alone; "data available" (a sensor exists) is not "intelligence implemented"
  (the product measurably changes behavior in response).
- `competitor_tco.csv` — `competitor_product_id, market, purchase_price,
  currency, filter_price, replacement_interval_months, annual_energy_kwh,
  energy_price_assumption, tco_1y, tco_3y, tco_5y, completeness_state,
  assumptions_note, source_id`. `completeness_state` ∈ `COMPLETE, PARTIAL`
  — PARTIAL when energy use or filter interval is unknown; the row still
  shows the known components rather than a fabricated total. A
  manufacturer-recommended replacement interval is labelled as such in
  `assumptions_note`, never presented as an independently measured fact.

### What this build will NOT include, and why

Stated up front so nothing is silently skipped and later mistaken for
complete:

- **No automatic refresh / scheduled re-scraping jobs.** This project has no
  job scheduler or hosting infrastructure — data is refreshed by re-running
  a research pass on request, exactly like every other table in this repo.
- **No Playwright E2E suite.** Not installed in this repo. Arena is verified
  live in the actual browser pane instead (screenshot + console-error check
  + a real click-through), which is the same verification method used for
  every other section of this app so far — but it is manual verification,
  not an automated E2E suite, and is reported as such.
- **No patent/science/consumer-review linkage for competitors.** This
  project has not ingested a patent corpus, a science-evidence corpus, or a
  consumer-review corpus for Versuni's own products either — extending that
  same gap to competitors would require building those corpora first. Shown
  as `DATA GAP`, not silently omitted.
- **No revenue / employee count / R&D footprint figures.** Out of scope for
  this pass; would need dedicated, separately-sourced corporate-research
  effort per company.
