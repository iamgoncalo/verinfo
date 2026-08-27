# SCOPE.md

## In scope (Prompt 1)

- All identifiable Versuni brands, verified against official sources.
- All categories per brand, as officially structured (not assumed universal).
- All current product families/series per category.
- All exact SKUs/model numbers publicly verifiable, including regional suffixes.
- Official product imagery — URL + provenance metadata only (per user decision:
  no local binary caching in this pass). `local_asset`/`sha256` fields in
  `images.csv` stay empty unless a later pass explicitly enables downloading.
- Current/legacy/support-only lifecycle status with evidence.
- Launch timing where verifiable.
- Geographic distribution by priority market (see `config/priority_markets.yaml`).
- Observed prices by market and price type.
- Category-specific specifications.
- Accessories and consumables, with verified compatibility only.
- Digital ecosystems (apps/services) per product.
- Manuals/support/compliance source links.
- Verified product-to-product relationships (variant/successor/predecessor/etc.).
- Explicit completeness metrics and explicit unresolved gaps.

## Out of scope (Prompt 1)

- Competitor products, competitor strategy, cluster/lens analysis (Prompt 2).
- Any AI-generated "innovation possibility" or counterfactual product design.
- Willingness-to-pay, TCO modeling beyond raw price capture (that lives in the
  Air World Model / T07 economics stage per root CLAUDE.md).
- Binary image downloading/caching (deferred; metadata-only this pass).
- Full SKU-level, image-level, and price-level completion in the very first
  execution pass — full Versuni-wide depth is pursued in priority order
  (P0 → P1 → P2 per `seeds/PROMPT_1_PRODUCT_CENSUS.md` §23), not necessarily
  finished end-to-end in one session.

## Authority

Precedence for this module: root `CLAUDE.md` > this `SCOPE.md` > the other policy
docs in this directory > `seeds/PROMPT_1_PRODUCT_CENSUS.md` (the original brief,
kept verbatim in `seeds/` for traceability) > agent output.
