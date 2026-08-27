# CHECKLIST.md

Execution order per `seeds/PROMPT_1_PRODUCT_CENSUS.md` §23, tracked here as a
running status. Update after each material work session.

## P0
- [x] Verify brands → `data/normalized/brands.csv` (7 brands, all VERIFIED)
- [x] Verify categories → `data/normalized/categories.csv` (30 rows, 26 VERIFIED + 4 CANDIDATE not deep-dived)
- [x] Family census → `data/normalized/families.csv` (80 families)
- [x] Official SKU census → `data/normalized/products.csv` (76 products)
- [x] Image acquisition (metadata-only) → `data/normalized/images.csv` (348 image records — 98.6% of CURRENT
      products have ≥1 image, 95.7% have an EXACT_VERIFIED image; 3-5+ per product per explicit user request)
- [x] Source manifest → `data/normalized/sources.csv` (138 sources, 137 Tier A / 1 Tier B / 0 Tier C)

## P1
- [x] Specifications → `data/normalized/specs_long.csv` (171 spec facts)
- [ ] Distribution → `data/normalized/distribution.csv` (NOT started — see GAPS.md; `region` field on
      products.csv is a weaker provisional substitute)
- [x] Prices → `data/normalized/prices.csv` (89 price rows — 68.1% of CURRENT products priced, across
      NL/India/Brazil/UK/Singapore; several genuine gaps logged — delisted SKUs, sold-out with no price,
      sites down — see GAPS.md)
- [ ] Support/manual/compliance links (folded into `products.csv` +
      `sources.csv` role=MANUAL/COMPLIANCE) — NOT started
- [ ] Accessories/consumables → `data/normalized/accessories.csv` — NOT started
- [x] Digital ecosystems → `data/normalized/digital_ecosystems.csv` (5 explicit product links; more implicit via associations.csv USES_DIGITAL_LAYER edges)

## P1.5 — Semantic labeling layer (added mid-session, see LABELING_PIPELINE.md)
- [x] Rule-derived Stage-2 labels (architecture, intelligence) for Air/Climate,
      per `LABEL_RULES.md` RULE-LENS-A-ARCHITECTURE / RULE-LENS-D-INTELLIGENCE
      → `data/normalized/labels.csv` + `associations.csv`
- [x] BELONGS_TO / FAMILY_MEMBER_OF graph edges for every product
- [x] Stage-3 CANDIDATE behavior-fabric labels (jobs/needs/contexts/triggers/
      behaviors/frictions/outcomes) for Air Treatment category, from the
      `BEHAVIOR_FABRIC.md` worked example — explicitly AI_SUGGESTION/CANDIDATE,
      not evidence-derived
- [ ] Stage-2 rule-derived labels for non-Air categories (Coffee, Food, Floor,
      Garment, Home Safety, Pet, Garden, Preethi, Walita) — NOT started
- [ ] Stage-3 behavior fabric for categories other than Air — NOT started
      (deliberately scoped to the validated case first)
- [ ] Stage-4 alias normalization → `data/normalized/label_aliases.csv` — empty, NOT started

## P2
- [ ] Lifecycle/lineage relationships → `data/normalized/relationships.csv`
      (deliberately empty — no official predecessor/successor text was found
      by any research agent; see GAPS.md)
- [ ] Long-tail regional variants — NOT started
- [ ] Extra gallery imagery (only where it adds real information) — NOT started

## P3 — Competitor intelligence layer (added, see COMPETITOR_POLICY.md)
- [x] Company/brand identity → `data/normalized/competitors.csv` (35 companies; parent_company +
      hq_country/hq_city/origin_country, matching Versuni's own `brands.csv` shape)
- [x] Competitor products, positioning (DIRECT/ADJACENT/SUBSTITUTE) → `data/normalized/competitor_products.csv` (45 rows, all 8 worlds)
- [x] Competitor prices (native currency preserved, never normalized away) → `data/normalized/competitor_prices.csv` (44 rows — one dropped by audit, see below)
- [x] Competitor specs, Air extreme-depth → `data/normalized/competitor_specs_long.csv` (76 rows: CADR, room coverage,
      filtration type, gas/VOC, noise, power, dimensions, weight, filter SKU/price/interval — all 8 Air models)
- [x] Competitor certifications (AHAM Verifide / ENERGY STAR / CARB, checked against each body's own public
      registry, not the manufacturer's claim) → `data/normalized/competitor_certifications.csv` (24 rows, 4 CONFIRMED_IN_REGISTRY)
- [x] Competitor claims vs independent evidence → `data/normalized/competitor_claims.csv` (18 rows, all 8 Air models)
- [x] Competitor intelligence classification (SENSE/REACT/ADAPT/PREDICT/LEARN/COORDINATE, Air-only) →
      `data/normalized/competitor_intelligence.csv` (48 rows — ADAPT and LEARN EVIDENCED for zero products)
- [x] Competitor TCO (1y/3y/5y, Air-priority) → `data/normalized/competitor_tco.csv` (8 rows, 1 PARTIAL flagged honestly)
- [x] Competitor official image registry → `data/normalized/competitor_images.csv` (8 rows, all VERIFIED_EXACT)
- [ ] Competitor capability ontology (normalized PERFORMANCE/PERCEPTION/INTELLIGENCE/EXPERIENCE/ECONOMICS/
      SUSTAINABILITY/SAFETY_CERTIFICATION mapping) → `data/normalized/competitor_capabilities.csv` — schema/gates
      exist, table is EMPTY. Genuinely not built this pass; specs/intelligence/claims cover much of the same
      ground per-product but the cross-product normalized ontology itself was not built. Real gap, not hidden.
- [x] Systematic (non-Air) world coverage: all 8/8 worlds done (Food, Coffee, Air, Clean, Clothes, Home, Pets, Garden)
- [x] Arena UI (Battle/Map/Matrix/Rankings) shipped and verified live; Timeline explicitly locked as DATA GAP, not faked
- [x] Hostile audit run: independent agent re-checked 38 prices + 21 company HQs against live sources.
      Found and fixed 4 real problems: 1 stale price (Braun CareStyle 7 Pro, corrected 299.00→349.65 EUR),
      1 wrong model code on a now-discontinued product (PetSafe Smart Feed — model corrected, stale price
      dropped rather than left wrong), 2 inaccurate HQ cities (WINIX: Seoul→Siheung-si; Ring: Hawthorne→Santa
      Monica). One soft caveat noted, not changed (Anker/eufy Shenzhen-vs-Changsha ambiguity). 36/38 prices and
      19/21 HQs were already correct.
- [ ] Playwright E2E — not installed in this repo; live browser verification used instead (see COMPETITOR_POLICY.md "What this build will NOT include")
- [ ] Automatic refresh / scheduled jobs, patent/science/consumer-review linkage, revenue/employee/R&D figures —
      explicitly out of scope this pass, see COMPETITOR_POLICY.md "What this build will NOT include, and why"

## Cross-cutting, ongoing
- [x] `data/generated/versuni_products.duckdb` rebuildable via
      `scripts/build_duckdb.py` (fixed CSV line-ending + explicit-dialect bugs)
- [x] `tests/` quality checks passing (16/16, see root CLAUDE.md: never weaken a
      test to obtain PASS — one real bug found and fixed: duplicate literal
      "UNVERIFIED" SKU placeholders collided in the uniqueness test)
- [x] `exports/*.json` regenerated (master_products, product_families,
      distribution_map, image_manifest, coverage_report, unresolved_gaps)
- [x] `reports/*.md` regenerated (PRODUCT_ATLAS, DISTRIBUTION_ATLAS,
      IMAGE_COVERAGE, COVERAGE_REPORT, GAPS)
- [x] `reports/GAPS.md` reflects every currently unresolved item (46 gap entries)
