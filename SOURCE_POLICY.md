# SOURCE_POLICY.md

## Source tiers

- **Tier A** — official brand domain (product page, support page, manual,
  datasheet, declaration of conformity, compliance catalogue, official
  newsroom/press/media asset, official regional storefront).
- **Tier B** — authorized retailer or major retailer listing, official
  distributor asset used only when a Tier A image/spec is unavailable.
- **Tier C** — discovery-only (forums, marketplaces, unofficial blogs,
  aggregator sites, Google Images thumbnails). Never used as the source of
  record for a fact. May be used only to find a lead toward a Tier A/B source.

## Rules

1. Every factual record (`specs_long.csv`, `products.csv`, `prices.csv`,
   `distribution.csv`, `images.csv`, `accessories.csv`,
   `digital_ecosystems.csv`, `relationships.csv`) must carry a `source_id`
   resolving to a row in `sources.csv`.
2. A generic homepage/category-landing URL is never the source for a specific
   SKU-level specification, price, or image. Cite the exact page.
3. `PREDECESSOR_OF` / `SUCCESSOR_OF` relationships require explicit evidence
   (launch article, official range statement, compliance/support date
   comparison, archived portfolio evidence). Model-number sequence, "looks
   newer," or similar specs are NOT evidence — see root `CLAUDE.md` and
   `seeds/PROMPT_1_PRODUCT_CENSUS.md` §15.
4. A support/manual-only page establishes that a product was once sold and is
   supported — it does NOT establish current availability. Only an official
   current catalogue/storefront listing establishes CURRENT status.
5. A retail listing establishes retail observation, not official portfolio
   status.
6. An archived launch article establishes historical existence, not current
   availability.
7. Never call a model discontinued unless a source explicitly supports that.
8. Use localized official sites per market — do not rely only on
   English/global domains. See `config/priority_markets.yaml`.
9. Every source in `sources.csv` records: source_id, exact URL, publisher,
   title/page, source tier, source role(s), geography, publication date
   (if known), retrieval date, archive/local path (if permitted), sha256
   (if archived).
10. Source roles: IDENTITY, SPEC, IMAGE, AVAILABILITY, PRICE, LAUNCH, STATUS,
    MANUAL, COMPLIANCE, ACCESSORY, DIGITAL.
11. AI (Claude) synthesis or inference is never itself a source. If a claim
    has no traceable source_id, it is HYPOTHESIS or goes to
    `exports/unresolved_gaps.json` — never silently promoted to OBSERVED.
