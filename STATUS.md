# STATUS.md

Short rolling status. Full detail lives in `CHECKLIST_COMPETITORS.md`.

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

Still TODO before the checklist is clear: making Arena's company/country
cards genuinely clickable (raised directly by the user, not yet fixed),
scaling capability scoring beyond Air, and the 11 categories (23 products)
with zero competitor research yet.

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
