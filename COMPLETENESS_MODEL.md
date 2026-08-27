# COMPLETENESS_MODEL.md

## Hierarchy

`BRAND → CATEGORY → PRODUCT FAMILY → SERIES → SKU/MODEL → REGIONAL VARIANT`

Completeness is tracked and reported at every level independently — never
flattened into one global percentage.

## States

- `BRAND-COMPLETE` — official brand universe fully enumerated and each entry
  verified (VERIFIED/CANDIDATE/REJECTED) against an official/legal source.
- `CATEGORY-COMPLETE` — for a given brand, its full official category
  architecture is enumerated and verified.
- `FAMILY-COMPLETE` — for a given category, all current + verifiable-legacy
  product families/series are enumerated.
- `SERIES-COMPLETE` — all series within a family are enumerated.
- `SKU-COMPLETE BY MARKET` — for a given priority market, all SKUs/regional
  variants within a family are enumerated and status-classified.
- `IMAGE-COMPLETE BY ACCEPTED SKU` — every accepted SKU has at least one
  `EXACT_VERIFIED` or `FAMILY_VERIFIED` image record, clearly labelled.
- `DISTRIBUTION-COMPLETE BY PRIORITY MARKET` — every accepted family/SKU has
  an explicit availability_state (not silently missing) for each priority
  market in `config/priority_markets.yaml`.

## Reporting rule

Never claim "100% complete" globally. Completeness is always reported as a
tuple: `(level, scope, percentage or count, denominator, method)`. Example:

> Philips / Climate: family coverage 100% (9/9 verified families); accepted
> SKU coverage 91% across priority markets (41/45); exact-image coverage 84%
> (34/41 accepted SKUs); price coverage NL 72% (30/41).

All percentages in `reports/COVERAGE_REPORT.md` and
`exports/coverage_report.json` must be computed from actual row counts in
`data/normalized/*.csv` at generation time — never hand-typed or copied from
an example.

## What counts as "accepted"

A family/SKU is "accepted" into the coverage denominator only once it has at
least one Tier A or Tier B `IDENTITY` source. A CANDIDATE with only a Tier C
lead is tracked in `exports/unresolved_gaps.json`, not counted as accepted
and not counted against coverage.
