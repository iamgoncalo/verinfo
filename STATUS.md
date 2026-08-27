# STATUS.md

Short rolling status. Full detail lives in `CHECKLIST_COMPETITORS.md`.

## 2026-08-27 (latest) — Logo coverage to 90%, 2 more hostile-audit fixes, repo connected to GitHub

Landed the second logo-research batch (8 companies: Meyer/PotsandPans,
Vinod Cookware, Rancilio Group, Nescafé Dolce Gusto, illycaffè, Russell
Hobbs, Smeg, Hurom) — all self-hosted locally, bringing verified-official
logo coverage to 46/51 (90%). Applied 2 more real hostile-audit findings
from the newest 29-product batch: Smeg's citrus-juicer URL pointed to its
2-slice-toaster page instead of its own (name/price were already correct);
Nespresso's HQ was stale ("Lausanne") — corrected to Vevey, Switzerland
(relocated 2021, confirmed via nestle.com). Live-verified in the browser:
58/58 rendered logo `<img>` elements have `naturalWidth > 0` (zero broken
images), the Nespresso company drawer now shows "Vevey, Switzerland" with
the correction note preserved, zero console errors. 36/36 pytest, clean
`tsc`/`vite build`. Connected the local repo to `github.com/iamgoncalo/verinfo`
and pushed all history per explicit user request.

## 2026-08-27 — Vertical slice complete: capability ontology + DISTILLED, verified live

Built and verified end-to-end for the Air world (flagship, per instructions):
`competitor_capabilities.csv` redefined to use the exact same
realm/tag/score/basis shape as Versuni's own `product_tag_scores.csv` (not
a parallel scheme), populated for all 8 Air competitor models with a
documented rule (`TAG_SCORING_RULES.md`). Battle mode in Arena now has a
Distilled/Raw toggle; Distilled answers all 6 required questions (closest
real competitor / what they do better / what Versuni does better / price
position / capability gap / strategic read) from real computed data, not
narrative. Live-tested two pairings: Versuni AC0651/10 vs Dyson TP07
(Versuni wins on filtration, no shared area where Dyson wins, Versuni
cheaper) and vs IKEA STARKVIND (genuine mixed result — IKEA wins on
connectivity, Versuni wins on filtration, IKEA cheaper) — both fully real,
traced to actual collected evidence. 36/36 pytest gates passing, `tsc`/
`vite build` clean, zero console errors on a fresh tab.

Still TODO before the checklist is clear: scaling capability scoring
beyond Air, and the 11 categories (23 products) with zero competitor
research yet.

## 2026-08-27 (later) — Companies and countries now genuinely clickable

Fixed the remaining user complaint. Country cards in Arena Overview now
filter the company list below them (and while fixing this, caught a real
count mismatch: Germany's geo-card said 5 companies but the filtered list
only showed 4, because GARDENA has zero competing products and was
silently dropped by the coverage-count-based list — fixed so 0-product
companies still show, honestly labeled "0 products", matching their real
geo-card count). Every company card anywhere in Arena now opens a real
profile drawer: logo, HQ, all real competing products with live price
comparisons against the matched Versuni product, and a click-through into
that Versuni product's own detail drawer (drawers stack correctly).
Live-tested the full chain — country filter, a 0-product company, a
2-product company with real price comparisons, nested navigation — zero
console errors throughout. 36/36 pytest gates, clean tsc/build.

## 2026-08-27 (later) — 76/76 Versuni products now have real competitor coverage

Dispatched 3 parallel research agents for the last 11 uncovered categories
(Walita kitchen/climate, all 5 Preethi India categories, Gaggia/L'OR
Barista/breakfast/juicing). All landed and transcribed. Result: every one
of the 76 Versuni products now resolves to a real "Competitors" list in
its own detail drawer, not the old "not researched yet" placeholder —
verified live on the very last previously-uncovered product (Gaggia
Classic UP, now showing Sage, De'Longhi, and Rancilio with real prices).
51 competitors, 74 competitor products total. Several companies correctly
reused across worlds instead of duplicated (Bajaj Electricals: Food +
Preethi-India; Electrolux: Clean + Walita; BSH/Bosch: Clean + breakfast/
juicing). Two real gaps reported by the research honestly, not papered
over: Preethi chimneys only got one verified competitor company (Elica
India has no working online price/cart); a few candidates (Braun citrus
press, Lavazza, Tassimo) were investigated and explicitly excluded for
lacking a compliant Tier A/B price. 36/36 pytest, clean tsc/build, zero
console errors.

Remaining real work: capability-ontology scoring still Air-only (Section 2
of CHECKLIST_COMPETITORS.md), Timeline still a locked data gap, PROCESS
(source trace) view not built.

## 2026-08-27 — Logos fixed, checklist created, git initialized

Just fixed: all 35 competitor logos now self-hosted locally (was hotlinking
external CDNs, which the user's real browser blocked on several — Bajaj,
Instant Brands, Tefal, Dyson, De'Longhi, Nespresso all rendered blank).
Root causes found and fixed individually: Tefal's URL was an SVG sprite
fragment (can't work as a plain `<img>`) — replaced with their real
favicon. Dyson/De'Longhi/Nespresso's official logos are genuinely white
wordmarks — now rendered on a dark chip instead of invisible on white.
Electrolux's domain blocks this environment — fell back to their favicon.

Git repo initialized in `versuni-products/` (didn't exist before), first
commit made covering everything built so far.

Currently working: making Arena's companies/countries genuinely clickable
(user feedback: "why brands from competitors are not clickable? Or
countries?") and building the shared Versuni+competitor capability
ontology (`competitor_capabilities.csv`, currently empty — the top
priority per `CHECKLIST_COMPETITORS.md`).

Next: vertical-slice one Air product (600 series Air Purifier AC0651/10,
already has 8 fully-speced real competitors) all the way through:
capability scores -> product-first Arena selector -> DISTILLED tab
answering closest-competitor / their-edge / Versuni's-edge / price-position
/ capability-gap / strategic-implication -> tested live -> committed. Then
scale the pattern.
