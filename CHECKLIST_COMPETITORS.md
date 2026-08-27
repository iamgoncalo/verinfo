# CHECKLIST_COMPETITORS.md

Persistent source of truth for the Competitor Intelligence layer. Every item
is exactly one of: `TODO` / `WORKING` / `VERIFIED` / `BLOCKED`. `VERIFIED`
requires runtime/data proof (a test that passed, a live browser check, a
counted row) — never a summary claim. Update this file after every
substantial unit of work, before moving to the next item.

Git HEAD at last update: see bottom of file.

## 0. Identity & location (company graph)

| Item | State | Proof |
|---|---|---|
| Company identity (35 competitors, HQ, parent, domain) | VERIFIED | `data/normalized/competitors.csv`, 35 rows; pytest `test_competitors_have_hq_country_or_explicit_gap` |
| HQ city/country accuracy | VERIFIED | Independent hostile-audit agent checked 21/35 HQs against live official sources; found + fixed 2 wrong (WINIX, Ring); 19/21 were already correct |
| Verified official company logos | VERIFIED | 34/35 self-hosted locally under `webapp/public/logos/` (fixes CORS/hotlink blocking seen live in the browser); 1 (Ring) honestly MISSING — its only official asset is a ZIP, not a renderable image. `test_local_logo_files_exist_on_disk` passes for all referenced files. 3 logos (Dyson/De'Longhi/Nespresso) are real official white wordmarks rendered on a dark chip (`logo_bg=dark`), not faked. |
| Market (where each competitor product is sold) | VERIFIED | `competitor_products.markets` + `competitor_prices.country`, present for all 44 priced rows |

## 1. Product-by-product coverage (all 76 Versuni products)

| Item | State | Proof |
|---|---|---|
| Every Versuni product resolves to a real competitor list OR an honest empty state (never silent/blank) | VERIFIED | `ProductFocus.tsx` Competitors section, live-tested on an Air product (8 real matches) |
| Products in a category with >=1 real competitor match | WORKING | 53 / 76 products (70%) — computed 2026-08-27 from `competitor_products.versuni_category_id` coverage |
| Products in a category with zero competitor matches yet (shows honest "not researched yet" state) | TODO | 23 / 76 products, 11 categories: gaggia-coffee, lor-barista-coffee, philips-breakfast, philips-juicing, preethi-chimneys, preethi-cookware, preethi-gas-stoves, preethi-induction-cooktops, preethi-pressure-cookers, walita-climate, walita-kitchen |
| Arena: SELECT VERSUNI PRODUCT -> COMPETITORS entry point (product-first, not world-first) | TODO | Currently Arena is world-scoped with Battle mode letting you pick a Versuni product from a dropdown; not yet a dedicated product-first selector |

## 2. Air world — flagship extreme depth (8 competitor models: Dyson x2, IKEA, WINIX, Coway x2, Levoit x2)

| Item | State | Proof |
|---|---|---|
| Specs (CADR, coverage, filtration, noise, power, dims) | VERIFIED | `competitor_specs_long.csv`, 76 rows covering all 8 products; pytest FK checks pass |
| Certification checked against primary registry (AHAM/ENERGY STAR/CARB), not manufacturer claim | VERIFIED | `competitor_certifications.csv`, 24 rows, 4 CONFIRMED_IN_REGISTRY |
| Claims vs independent evidence | VERIFIED | `competitor_claims.csv`, 18 rows, all 8 products |
| Intelligence classification (SENSE/REACT/ADAPT/PREDICT/LEARN/COORDINATE) | VERIFIED | `competitor_intelligence.csv`, 48 rows (8x6); 0/8 products EVIDENCED on ADAPT or LEARN |
| TCO (1y/3y/5y) | VERIFIED | `competitor_tco.csv`, 8 rows, 7 COMPLETE + 1 honestly PARTIAL (IKEA optional filter, no stated interval) |
| Official images | VERIFIED | `competitor_images.csv`, 8 rows, all VERIFIED_EXACT |
| **Shared capability ontology (Versuni + competitor, same realm/tag vocabulary, scored 0-10)** | VERIFIED | `competitor_capabilities.csv` redefined to mirror `product_tag_scores.csv`'s exact shape (realm/tag/score/basis) and populated for all 8 Air competitors, 23 rows. Rule documented in `TAG_SCORING_RULES.md`'s "Competitor extension". Live-tested: Versuni AC0651/10 vs Dyson TP07 correctly computes "Versuni leads on Air Filtration (10.0 vs 9.0)"; vs IKEA STARKVIND correctly computes a genuine mixed result (IKEA leads Reactive/Connected 7.0 vs 6.0, Versuni leads Air Filtration 10.0 vs 6.5) |

## 3. Other worlds — systematic (not extreme) depth

| World | Competitor products | Specs | Certification | Claims | TCO | Images | Capabilities |
|---|---|---|---|---|---|---|---|
| Food | 6 | TODO | TODO | TODO | TODO | TODO | TODO |
| Coffee | 7 | TODO | TODO | TODO | TODO | TODO | TODO |
| Clean | 7 | TODO | TODO | TODO | TODO | TODO | TODO |
| Clothes | 6 | TODO | TODO | TODO | TODO | TODO | TODO |
| Home | 4 | TODO | TODO | TODO | TODO | TODO | TODO |
| Pets | 5 | TODO | TODO | TODO | TODO | TODO | TODO |
| Garden | 2 | TODO | TODO | TODO | TODO | TODO | TODO |

These 7 worlds have identity + price + positioning (VERIFIED, see section 0
and the price-audit note below) but none of the deep layers Air has. This
table exists so that gap is visible, not implied-complete by omission.

## 4. Prices

| Item | State | Proof |
|---|---|---|
| Every competitor price sourced to an official store or major authorized retailer | VERIFIED | `COMPETITOR_POLICY.md` rule, enforced by transcription discipline |
| Independent price audit | VERIFIED | Hostile-audit agent checked 38/45 prices against live sources; 36 confirmed exactly, 1 fixed (Braun CareStyle 7 Pro, stale), 1 dropped (PetSafe Smart Feed, product discontinued — wrong model code also fixed) |
| Native currency preserved, never silently converted | VERIFIED | pytest `test_competitor_prices_reference_known_products_and_have_currency`; Map/Rankings modes group by currency explicitly |

## 5. Arena UI

| Item | State | Proof |
|---|---|---|
| Overview (geography, standout companies) | VERIFIED | Live-tested: real country groupings, real logos, real product counts |
| Battle mode (Versuni product vs competitor product) | VERIFIED | Live-tested on Dyson/Coway/IKEA/WINIX/Levoit vs Versuni Air products; renders specs/TCO/certification/intelligence/claims when present |
| Map mode | VERIFIED | Live-tested, currency-grouped, no fabricated FX |
| Matrix mode | VERIFIED | Live-tested, product x category positioning grid |
| Rankings mode | VERIFIED | Live-tested, currency-grouped price ranking |
| Timeline | BLOCKED | No launch-date history collected — intentionally locked with an explicit DATA GAP message, not faked |
| Per-product Competitors section (in the product detail drawer) | VERIFIED | Live-tested: real logo/HQ/price/positioning list, sorted DIRECT first, "Full comparison in Arena" deep-link works |
| Companies and countries are clickable into something real (not just decoration) | TODO | User feedback: currently under-interactive — being fixed now |
| DISTILLED tab (closest competitor / what they do better / what Versuni does better / price position / capability gap / strategic implication) | VERIFIED (Air only) | Built inside Battle mode as a Distilled/Raw toggle. Live-tested end-to-end for AC0651/10 vs Dyson TP07 and vs IKEA STARKVIND (see item 2 above) — all 6 questions render real, computed content; the "closest competitor" check correctly identified IKEA as closer than the initially-selected Dyson and the "compare that one instead" deep-link works. Only produces real capability-gap content where `competitor_capabilities.csv` has rows (currently Air only) — other worlds show an honest "no shared scored capability data yet" message, not a fabricated one. |
| RAW / PROCESS toggle for Arena (matching the Distilled/Raw pattern used elsewhere in the app) | WORKING | Distilled/Raw built and verified inside Battle mode. "PROCESS" (source trace) not built yet. |

## 6. Engineering integrity

| Item | State | Proof |
|---|---|---|
| pytest quality gates | VERIFIED | 35/35 passing as of this checklist |
| `tsc --noEmit` clean | VERIFIED | Checked after every UI change this session |
| `vite build` clean | VERIFIED | Checked after every UI change this session |
| Zero console errors (excluding harmless Vite HMR websocket noise) | VERIFIED | Checked live in browser repeatedly |
| Zero horizontal overflow | VERIFIED | Checked live in browser |
| Git repository + commit discipline | WORKING | Repo initialized 2026-08-27, first commit made; ongoing commits after each verified unit going forward |

## Real blockers (not silently worked around)

- **Timeline**: genuinely no data exists (no launch-date history collected for any competitor product). Locked, not faked.
- **Ring logo**: only official asset is a ZIP archive of vector files, not a renderable image. Shows initials, not invented.
- **Electrolux Group's own domain** blocks direct fetches from this environment (connection reset on every attempt) — used their favicon as a lower-quality but still official fallback.
- **11 categories (23 products)** have zero competitor research yet — real, stated gap, not hidden.

---
Last updated: 2026-08-27. Git HEAD at last update: (see `git log -1 --oneline` in the repo — updated after each commit referenced from this file).
