# DECISIONS.md — versuni-products module

## 2026-08-26 — Scope: all Versuni categories, full depth (not Air-only)

User explicitly chose full-portfolio scope over an Air-only first pass, despite
CLAUDE.md framing Air Treatment/Purifier as the only *submitted* case. Rationale:
PROMPT_1_PRODUCT_CENSUS.md as provided already specifies the full portfolio: all
brands, all categories. This module builds the reusable capability-context layer;
the Air case (Prompt 2+) draws on it but does not bound it. See root `CLAUDE.md`
§"Versuni Product Universe" and this module's `SCOPE.md`.

## 2026-08-26 — Images: metadata-only, no binary caching this pass

User explicitly chose to record verified image URLs + provenance metadata in
`images.csv` rather than downloading/hashing binaries into `assets/products/...`
this pass. Rationale: much faster given the full-portfolio scope chosen above;
binary caching can be added later as a distinct pass without touching the schema
(`local_path`/`sha256` fields already exist, just stay empty). See
`IMAGE_POLICY.md`.

## 2026-08-26 — Policy docs authored fresh, not inherited

`seeds/PROMPT_1_PRODUCT_CENSUS.md` §0 assumes README/SCOPE/SOURCE_POLICY/
CHECKLIST/DATA_DICTIONARY/COMPLETENESS_MODEL/IMAGE_POLICY/DISTRIBUTION_POLICY
already exist in the target repo. This directory was empty (greenfield), so all
of these were authored from scratch in this session, consistent with root
`CLAUDE.md`'s evidence-class and epistemic-state contracts. They are the
authoritative rules for this module going forward — update them deliberately,
not incidentally, if research reveals they need to change.

## 2026-08-26 — P0 research dispatched as 7 parallel background agents by
category cluster, not sequentially

Rationale: brand/category/family discovery across ~8 sub-brands and ~10
categories is independent, read-only research work well suited to
parallelization via the Agent tool (not Workflow — no explicit multi-agent
opt-in was given by the user, so Workflow's orchestration gate does not apply;
the Agent tool for background research does not require that opt-in). Each
agent was scoped to one brand/category cluster with the same evidence rules
(official Tier A/B domains only, no invented SKUs, no unearned
predecessor/successor claims) so results merge cleanly into the shared
`data/normalized/*.csv` schema.

## 2026-08-26 — Semantic labeling layer added mid-session, scoped to Air first

User supplied LABELING_PIPELINE.md / ASSOCIATION_MODEL.md / LABEL_ONTOLOGY.md /
BEHAVIOR_FABRIC.md / CATEGORY_BEHAVIOR_TEMPLATE.md and asked to associate them
with each product. Built the schema (labels.csv, label_aliases.csv,
associations.csv) for all 9 categories but populated content for Air/Climate
only: rule-derived ARCHITECTURE + INTELLIGENCE labels (rules documented in
`LABEL_RULES.md`, sourced from `seeds/products-air-clusters.md`'s own Lens A/D
definitions) and Stage-3 CANDIDATE behavior-fabric labels from
`BEHAVIOR_FABRIC.md`'s worked Air Purification example. Rationale: Air is the
validated case per root `CLAUDE.md`; the other 8 categories would need either
new rule sets (no equivalent Lens A/D-style seed exists for them) or real
consumer evidence (Stage 3), neither of which exist yet — building unlabeled
placeholder rows for them would look complete without being defensible.
Explicitly NOT marked VERIFIED or EVIDENCE_DERIVED — Stage-3 labels carry
`status: CANDIDATE` and `evidence_state: INFERRED` (AI_SUGGESTION per root
`CLAUDE.md`'s evidence classes) until backed by a real consumer-text corpus.

## 2026-08-26 — Price research dispatched as 7 more parallel background agents

User asked directly whether prices had been captured (they had not — P1,
not yet dispatched). Rather than one broad pass, dispatched 7 agents mirroring
the earlier P0 category split, targeting NL (the primary case market) for
Philips/Saeco/Gaggia/Senseo/L'OR Barista/Home-Pet-Garden, and re-fetching the
already-known official India/Brazil pages for Preethi/Walita (no rediscovery
needed there). Found and logged as gaps rather than silently resolved: several
GB-market SKUs (AC0650/20, AC0950/10, AMF765/30, AMF870/35) are not sold in NL
under that exact SKU code — NL carries sibling SKUs with different /xx
suffixes instead; the NL storefront is mid-clearance-sale, so most NL prices
captured are PROMOTIONAL against a struck-through RRP, not stable baseline
pricing; one Walita SKU (EP5441/55) appears to have been delisted between the
product-truth pass and the price pass, same day.

## 2026-08-27 — Competitor research: per-world, not per-SKU

User asked for full competitor research across all products, in extreme high
quality, including price and location. `SCOPE.md` had deliberately deferred
this to "Prompt 2." Decision: match at the **world/family level** (Food,
Coffee, Air, Clean, Clothes, Home, Pets, Garden), not a forced 1:1 match per
SKU — Versuni's 76 products include many regional/plug/colour variants of the
same real product, so a distinct competitor per SKU would fabricate precision
that doesn't exist. "Located" is captured as two distinct, separately sourced
facts rather than one guessed meaning: competitor company HQ (country/city,
from the company's own About page) and the market/country where each
competing product's price was actually observed — see `COMPETITOR_POLICY.md`.
Dispatched 6 parallel research agents (Food, Coffee, Air, Clean, Clothes,
Home+Pets+Garden combined) with a hard rule: prices only from Tier A/B
sources (official store or major authorized retailer), never marketplace/
forum listings; HQ facts only from the company's own official page.

## 2026-08-27 — Competitor intelligence: extreme depth for Air, hostile audit, real fixes

User escalated with a full "COMPETITOR INTELLIGENCE" mission spec: company/
brand graph, claim-vs-evidence separation, certification, TCO, image
registry, capability ontology, an intelligence classification for Air
(SENSE/REACT/ADAPT/PREDICT/LEARN/COORDINATE), and an Arena UI (Battle/Map/
Matrix/Timeline/Rankings), with Air named the flagship extreme-depth case.
Per the mission's own first_rule, audited the existing (at-the-time empty)
dataset before expanding — nothing to reconcile, genuinely a fresh build.
Reused this project's existing brands.csv pattern (company+brand conflated,
parent as a text field) for competitors.csv rather than building a heavier
COMPANY/PARENT/BRAND/SUB-BRAND graph — proportionate to the evidence
available, documented in COMPETITOR_POLICY.md v2. Dispatched 4 concurrent
Air deep-dive agents (performance+certification, intelligence+claims,
filter/TCO, images) building on the base pass, per the mission's own
"2-4 concurrently" guidance.

Then dispatched an independent hostile-audit agent with zero context on how
the data was produced, tasked to re-check >=30 prices and >=15 company HQs
against live sources. It found and reported 4 real problems (not zero, and
not fabricated to look clean): a stale/wrong price, a wrong model code on a
now-discontinued product, and two inaccurate HQ cities. All 4 were fixed
directly in the CSVs with an explicit "CORRECTED <date> per independent
audit" note preserving what was wrong and why — not silently overwritten.
The now-discontinued product's stale price was dropped rather than left
wrong. This is the same "fail loudly, never fake pass" discipline applied
to a genuine adversarial check, not just a self-report.

Explicitly NOT built this pass, stated plainly rather than hidden:
`competitor_capabilities.csv` (the normalized cross-product capability
ontology) has its schema and quality gates in place but zero rows — specs/
intelligence/claims cover much of the same per-product ground, but the
ontology mapping itself wasn't built. Also not built: Timeline (no
launch-date history collected), Playwright E2E (not installed — live
browser verification used instead), automatic refresh jobs, patent/
science/consumer-review linkage, revenue/employee/R&D figures — see
COMPETITOR_POLICY.md's "What this build will NOT include, and why" for the
full list and reasoning.

## 2026-08-27 — Competitor logos, Arena distillation, real per-product review, and a genuine navigation bug fix

User pushed back hard on the first cut: no company logos, not enough
distillation, no visible geography, and critically — the product detail
drawer still showed the stale Prompt-1-era "Competitors: not researched
yet" message even though real competitor data now existed, forcing the
user through world-level tabs instead of seeing a product's own
competitors directly ("review product by product, not food by food").

Fixed all four:
1. Dispatched 4 parallel research agents to find each of the 35
   competitors' real official logo (SVG/PNG from their own domain, never
   a third-party logo database) — added `logo_url`/`logo_source_page`/
   `logo_state` to `competitors.csv`. One agent independently discovered
   that `thewinix.com` (WINIX's domain of record) has been compromised
   and now serves an unrelated gambling storefront — corrected
   `official_domain` to `winixeurope.eu` and flagged it loudly rather
   than silently swapping it. 32/35 VERIFIED_OFFICIAL, 2 FAVICON_FALLBACK,
   1 MISSING (Ring's only official asset is a ZIP archive, not a
   renderable image — recorded honestly as MISSING for display purposes).
2. Rebuilt Arena's default view as an "Overview" mode: a real geography
   section (companies grouped by HQ country, flag + logo cloud) directly
   answering "where are they located," plus a "who shows up most"
   standout-company grid — before the Battle/Map/Matrix/Rankings deep
   dive, matching the same distillation pattern used for Smart Tags.
3. Rebuilt `ProductFocus.tsx`'s Competitors section to show that specific
   product's own real competitors (matched by category, DIRECT positioning
   first, with logo/HQ/price/link), plus a "Full comparison in Arena →"
   button that deep-links into Arena pre-scoped to that product's world.
4. Root-caused and fixed a real, pre-existing navigation bug found while
   verifying #3: `ProductsSection`'s world/brand/category state was
   initialized from the `preset` prop via `useState` only, which only
   runs once at mount — since the component stays mounted across sidebar
   world clicks, clicking a different world while already drilled into
   one silently did nothing. Added a `useEffect` keyed on `preset` to
   resync state on every navigation. Verified live: Food→Air→product now
   correctly re-navigates every time, not just from a fresh page load.

Verified live end-to-end: 42 logo images loading with zero broken `<img>`
tags (2 honest initials-fallbacks under real hotlink-protection failures,
not app bugs), zero console errors, zero horizontal overflow, 34/34
pytest gates passing, clean `tsc`/`vite build`.
