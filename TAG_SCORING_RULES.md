# TAG_SCORING_RULES.md — Multi-Realm Product Tag Scoring

`data/normalized/product_tag_scores.csv` gives every product 10-19 tags across
9 realms, each with a 0-10 relevance score. This document is the rule
definition every row traces back to — required by `basis` in that table.

## Why a score, not just presence/absence

A capability being present doesn't say how *central* it is. A humidifying
air purifier's primary job is still filtration; humidification is real but
secondary. The score expresses that, on a fixed 0-10 scale, consistently
across the whole catalog.

## Two honest bases — never blurred together

- **RULE_DERIVED** — computed directly from an *observed* fact already in
  `products.csv` / `specs_long.csv` / `prices.csv` (a spec value, a price
  percentile, a lifecycle status). Deterministic: same input, same output.
- **ESTIMATED_JUDGMENT** — a documented, consistent *rule*, but the
  underlying weights are an analyst/AI judgment call about typical use, not
  a measurement. Space/Medium/primary-Capability/Maintenance-baseline all
  fall here. This maps to the `JUDGMENT` epistemic state in
  `LABEL_ONTOLOGY.md` — never silently promoted to `OBSERVED` or `VERIFIED`.
- **CANDIDATE** — inherited from the category-level behavior fabric (see
  `LABEL_RULES.md` and `BEHAVIOR_FABRIC.md`). Same AI_SUGGESTION status as
  everywhere else in this module: not consumer-evidence-backed.

## The 9 realms

### SPACE — which zone(s) of the home
Per-`world` affinity table (Kitchen/Living/Bedroom/Bathroom/Laundry/Entry/
Floor-whole-home/Garden), top 4 zones scoring ≥2 kept. Example: Coffee world
→ Kitchen 10, Living 4, Bedroom 1. Every other zone is implicitly ~0 and
omitted rather than listed at 0 (avoids noise). **ESTIMATED_JUDGMENT.**

### MEDIUM — what phenomenon/substrate it acts on
Per-`world` table (Air/Water/Food/Textile/Surface/Security State/Pet
Environment/Garden/Digital Information), top 2 kept. **ESTIMATED_JUDGMENT.**

### CAPABILITY — what it does
One **primary** capability per product, fixed by its world (e.g. every Air
product → "Air Filtration": 10) — category-definitional, **ESTIMATED_JUDGMENT**.
Plus 0-N **secondary** capabilities from a fixed field→tag→score table
applied to that product's own `specs_long` rows (falling back to a family
sibling's specs only when the product has none of its own, noted in the
rationale) — **RULE_DERIVED**.

### INTELLIGENCE — automation level
Reuses the same non-keyword-matching logic as `LABEL_RULES.md`'s
RULE-LENS-D-INTELLIGENCE, generalized beyond Air: `ai_claim` text describing
routine/history-based adaptation → Adaptive (8); any sensor/detection/
navigation/connectivity spec without that language → Reactive/Connected (6);
a SKU with its own specs and none of the above → Manual (3); a SKU with no
spec data at all (own or family) → Unclassified (3, ESTIMATED_JUDGMENT since
there's nothing to derive from). **RULE_DERIVED** except the last case.

### DIGITAL — named connectivity
Only emitted when a `connectivity` spec row mentions Wi-Fi/app; named
ecosystem apps (Air+, HomeID, HomeRun, Alexa, Google) get their own row when
explicitly named in that spec text. **RULE_DERIVED.**

### MAINTENANCE — ownership touch/burden
A per-world baseline (2-6) plus +1 per observed consumable-adjacent spec
field (filter life, coating, compatibility, warranty, certification),
capped at 10. **ESTIMATED_JUDGMENT** (the baseline is a judgment call; the
bump is counting real spec rows).

### ECONOMIC — price tier
Only for products with a real price on file. Percentile rank of that
product's cheapest observed price among priced siblings in the *same
category*, mapped linearly to 2-10 (cheapest ≈2, most expensive ≈10).
**RULE_DERIVED** — directly computed from `prices.csv`.

### LIFECYCLE — currency
`current_status` mapped directly: CURRENT=10, UNKNOWN=5, LEGACY=3,
SUPPORT_ONLY=2, HISTORICAL=1. **RULE_DERIVED** (literally the observed
field, restated as a score).

### USER_JOB / NEED — top 2 each, inherited from category
The first 2 jobs and first 2 needs authored for that product's category in
the behavior fabric (see `LABEL_RULES.md`'s note: these are AI-proposed,
category-general, not SKU-specific or consumer-evidence-backed).
**CANDIDATE**, fixed score of 6 (deliberately not spread 0-10 — there's no
real basis to rank AI-proposed candidates against each other more finely
than "plausible top pick for this category").

## What this is not

Not a survey. Not a market-research finding. Not a re-implementation of
`CORRELATION_CAUSALITY.md`'s statistical association machinery (that
requires real observations this module doesn't have yet). A "Kitchen: 10"
score means "this category's products are almost always used in a kitchen,
per general/typical-use reasoning" — not "10 out of 10 surveyed households
placed this exact SKU in their kitchen."

## Regeneration

Rebuilt by re-running the tag-scoring script against current
`data/normalized/*.csv` — never hand-edited. If a rule changes, change it
here and in the script, then regenerate `product_tag_scores.csv` in full.
