# versuni-products

Standalone, evidence-first product-truth module for the Versuni house of brands.

This is **Prompt 1** of the Versuni Freedom Intelligence machine: a global census of
brands → categories → product families → series → SKUs → regional variants, with
sources, images (metadata only, no binaries), prices, specs, accessories, digital
ecosystems, relationships, and explicit completeness/gap reporting.

Strategy and clustering remain **out of scope** here (that is Prompt 2). Competitor
research was originally deferred the same way but has since been added directly —
see `COMPETITOR_POLICY.md` and `data/normalized/competitor_*.csv`.
This module produces truth, not narrative.

## Read first

- `../CLAUDE.md` (root authority: AFI theses, evidence classes, authority order)
- `SCOPE.md`
- `SOURCE_POLICY.md`
- `CHECKLIST.md`
- `DATA_DICTIONARY.md`
- `COMPLETENESS_MODEL.md`
- `IMAGE_POLICY.md`
- `DISTRIBUTION_POLICY.md`
- `COMPETITOR_POLICY.md`
- `TAG_SCORING_RULES.md`
- `seeds/VERSUNI_PRODUCT_UNIVERSE_SEED.md`
- `seeds/products-air-strategy.md`
- `seeds/products-air-clusters.md`
- `config/priority_markets.yaml`

## Layout

```
data/normalized/   canonical CSVs — authoritative
data/raw/          frozen raw retrieval snapshots, per run_id
data/generated/    versuni_products.duckdb — disposable, rebuilt from normalized/
exports/           JSON exports for downstream consumption
reports/           human-readable atlases and coverage/gap reports
scripts/           rebuild + test scripts
tests/             automated quality checks over normalized/
```

## Status

See `reports/COVERAGE_REPORT.md` and `exports/coverage_report.json` for current
completeness by brand/category/family/series/SKU/image/price.
See `reports/GAPS.md` and `exports/unresolved_gaps.json` for what remains unresolved.

This module is under active construction. Do not treat an empty or partial CSV as
"zero products exist" — check `reports/GAPS.md` first.
