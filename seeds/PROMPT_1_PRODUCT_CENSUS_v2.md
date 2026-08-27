# PROMPT 1 — VERSUNI PRODUCT TRUTH CENSUS
## Goal: build the most complete, source-traceable, image-complete Versuni product database possible

You are working in a completely separate module from the main innovation case.

MODULE NAME:

`versuni-products`

This module will later be merged into another project, so do NOT couple it to a specific frontend or decision engine.

Your job in this conversation is NOT strategy.

Your job is PRODUCT TRUTH.

Build a rigorous, reusable, global product-intelligence dataset for the Versuni house of brands.

The user wants:

- all identifiable Versuni brands;
- all categories;
- all product families;
- all current series;
- all exact SKUs/model numbers that can be verified;
- regional variants and suffixes;
- official product imagery;
- current/legacy status;
- launch timing where verifiable;
- geographic distribution;
- observed prices by market;
- specifications;
- accessories and consumables;
- digital ecosystems/apps;
- manuals/support/compliance sources;
- product-to-product relationships;
- explicit completeness metrics;
- explicit unresolved gaps.

The output must be extremely high quality, evidence-first, and mergeable later.

---

## 0. READ FIRST

Before doing any research, read:

- `README.md`
- `CLAUDE.md`
- `SCOPE.md`
- `SOURCE_POLICY.md`
- `CHECKLIST.md`
- `DATA_DICTIONARY.md`
- `COMPLETENESS_MODEL.md`
- `IMAGE_POLICY.md`
- `DISTRIBUTION_POLICY.md`
- `seeds/VERSUNI_PRODUCT_UNIVERSE_SEED.md`
- `seeds/products-air-strategy.md`
- `seeds/products-air-clusters.md`

The seed universe is a DISCOVERY MAP, not accepted truth.

Every seed claim must be re-verified.

Do not inherit unverified facts from the seed into normalized truth.

---

# 1. THE UNIT OF COMPLETENESS

Do NOT flatten the company into one vague count.

The canonical hierarchy is:

BRAND
→ CATEGORY
→ PRODUCT FAMILY
→ SERIES
→ SKU / MODEL
→ REGIONAL VARIANT

Track completeness at each level.

Required final coverage states:

- BRAND-COMPLETE
- CATEGORY-COMPLETE
- FAMILY-COMPLETE
- SERIES-COMPLETE
- SKU-COMPLETE BY MARKET
- IMAGE-COMPLETE BY ACCEPTED SKU
- DISTRIBUTION-COMPLETE BY PRIORITY MARKET

Never say "100% complete" globally unless it is demonstrably true.

Versuni operates across many countries, languages, voltages, retailers, suffixes, colours and support systems. A family can generate many regional model numbers.

The right answer may be:

> FAMILY-COMPLETE globally; exact SKU coverage 93% across priority markets; 71 unresolved long-tail regional variants.

That is better than false completeness.

---

# 2. BRAND CENSUS

Start from the current candidate Versuni brand universe:

- Philips
- Philips Baristina
- Saeco
- Gaggia
- Preethi
- Philips Walita
- L'OR Barista
- Senseo

Verify each against current official Versuni / brand sources.

If additional Versuni-operated brand identities or legally distinct portfolio names are discovered:

- record them;
- verify ownership/licensing/operating relationship;
- do not silently add them to the canonical list.

Output:

`data/normalized/brands.csv`

---

# 3. CATEGORY CENSUS

For each brand, discover the full official category architecture.

Candidate top-level categories include:

- Kitchen / cooking
- Airfryer
- Food preparation
- Breakfast
- Coffee
- Climate Care / Air
- Floor Care
- Garment Care
- Home Safety
- Pet Care
- Garden Care
- Accessories / consumables
- Digital products / apps / services

Do not assume every brand has every category.

Preserve local-market category names where useful.

Normalize into:

`data/normalized/categories.csv`

---

# 4. PRODUCT FAMILY CENSUS

For every category:

discover every current identifiable product family and series.

Examples from the seed include:

Philips Airfryer:
1000 / 2000 / 3000 / 4000 / 5000 / Combi

Philips Coffee:
LatteGo families
Café Aromis
Barista Brew

Climate:
600 / 800 / PureProtect Mini 900 / 1000i / 2000i /
PureProtect Quiet 2200 / 3000i / PureProtect 3200 /
PureProtect Water 3400 / PureProtect Pro 4200 /
Air Performer / fans / heaters / humidifiers

Floor:
SpeedPro / AquaTrio / HomeRun / OneUp / PowerPro / Performer

Garment:
OneTurn / PerfectCare / Steam irons / Steamers / All-in-One

Home:
Home Safety cameras / sensors / doorbells

Pet:
Smart Pet feeder / fountain

Garden:
GardenCare mower

Preethi:
multiple mixer grinder / cooktop / stove / cookware families

Walita:
regional Philips/Walita families.

These are only discovery seeds.

Rebuild the taxonomy from real sources.

Output:

`data/normalized/families.csv`

---

# 5. EXACT SKU / MODEL DISCOVERY

For every accepted family:

discover exact model numbers/SKUs where publicly verifiable.

Use:

- official product pages;
- official support pages;
- manuals;
- datasheets;
- declarations of conformity;
- compliance catalogues;
- official regional product listings;
- official brand search tools;
- official newsroom/launch pages.

A SKU suffix may indicate:

- region;
- colour;
- voltage;
- packaging;
- retailer bundle;
- generation;
- minor variant.

Do not assume what the suffix means.

Store exact model string.

Fields include:

- product_id
- brand_id
- category_id
- family_id
- sku
- model_name
- regional_suffix
- colour
- voltage
- region
- current_status
- launch_date
- official_url
- support_url
- manual_url
- source_ids

Output:

`data/normalized/products.csv`

---

# 6. CURRENT vs LEGACY vs SUPPORT-ONLY

This distinction is mandatory.

A product can be:

- CURRENT
- LEGACY
- SUPPORT_ONLY
- HISTORICAL
- CANDIDATE
- UNKNOWN

Evidence logic:

Official current catalogue:
strong evidence for CURRENT.

Only support/manual page:
does NOT establish that the product is currently sold.

Retail listing:
establishes retail observation, not official portfolio status.

Archived launch article:
establishes historical existence, not current availability.

Never call a model discontinued unless supported.

Create a lifecycle/status field with provenance.

---

# 7. FIELD-LEVEL SPECIFICATION TRUTH

Use category-specific specification fields.

Do not force unrelated categories into one giant wide table.

Canonical storage:

`data/normalized/specs_long.csv`

Each fact has:

- product_id
- field
- raw value
- unit
- normalized value
- normalized unit
- source_id
- exact source location
- epistemic state

Epistemic state:

OBSERVED
DERIVED
UNKNOWN

AI inference never becomes OBSERVED.

Examples:

Air:
CADR, room coverage, noise, power, filters, sensors, Air+, connectivity,
humidification, fan, heat, filter life, dimensions, weight.

Airfryer:
capacity, power, cooking modes, temperature range, basket architecture,
steam, connectivity, dimensions.

Coffee:
brew architecture, recipes/drink count, grinder, milk system,
pressure where meaningful, bean systems, connectivity, profiles.

Floor care:
runtime, wet/dry capability, robot navigation, station, brushes,
mapping, suction/cleaning metrics where source-defined.

Garment:
steam rate, steam boost, power, heat-up, OptimalTEMP, board/integration.

Home safety:
camera resolution, sensor type, Wi‑Fi/Thread, detection features,
battery/power.

If a source uses a marketing metric rather than a comparable engineering metric:
preserve the source wording and do not fake comparability.

---

# 8. ALL PRODUCT IMAGES — P0

This is one of the most important deliverables.

The user wants accurate product pictures for the whole portfolio.

For every accepted product/family collect official images where legally/publicly accessible.

Preferred order:

1. official product page hero image;
2. official gallery image;
3. official press/media asset;
4. official support/product asset;
5. official distributor asset only when primary image unavailable.

NEVER use:
- Google Images thumbnail as source truth;
- stock appliance imagery;
- AI-generated imagery as a real product;
- a sibling SKU image labelled as exact without proof.

Every image record:

- image_id
- product_id
- image_type
- verification_status
- source_page
- direct asset URL
- local path if cached
- SHA-256 if cached
- width
- height
- format
- retrieved_at

Verification status:

EXACT_VERIFIED
FAMILY_VERIFIED
UNVERIFIED

If an exact model has no exact image:
FAMILY_VERIFIED is acceptable only if clearly labelled.

If there is no verified image:
leave missing.

Prefer collecting:
- HERO_FRONT
- ANGLE
- SIDE/BACK where useful
- PRODUCT_IN_CONTEXT where official
- DETAIL / CONTROL
- FAMILY_GROUP when useful

Do not collect dozens of redundant gallery images.

Goal:
1–3 excellent official images per meaningful SKU/family.

Write:

`data/normalized/images.csv`

Download/cache only when permitted.

Store under:

`assets/products/<brand>/<family>/<sku>/`

Create:

`reports/IMAGE_COVERAGE.md`

with:
- accepted products
- exact image coverage
- family image coverage
- missing images
- broken URLs
- duplicates
- suspect SKU/image mismatches.

---

# 9. IMAGE DEDUPLICATION AND MATCHING

Hash local images.

Use perceptual similarity if practical to detect the same product image
served under multiple URLs.

Do not delete provenance.

Mark duplicates.

Add automated checks:

- same local image claimed by many unrelated SKUs;
- image URL name conflicts with SKU;
- page title/product title mismatch;
- image is tiny/placeholder/logo rather than product;
- broken image;
- transparent pixel / unusable image.

Do not automatically reject based on filename alone.

Flag for review.

---

# 10. GEOGRAPHIC DISTRIBUTION

Build real market/distribution evidence.

Priority market configuration is in:

`config/priority_markets.yaml`

For each product/family, record:

- country
- market cluster
- official-current evidence
- official support evidence
- retailer-observed evidence
- channel
- observed date
- source

States:

OFFICIAL_CURRENT
OFFICIAL_SUPPORT_ONLY
RETAIL_OBSERVED
HISTORICAL
UNKNOWN

Do not infer availability from:
language
currency
a Google result
support page existence.

Output:

`data/normalized/distribution.csv`

Create:

`reports/DISTRIBUTION_ATLAS.md`

The report must show:
- family × country availability;
- SKU × country availability where known;
- products apparently regional;
- products apparently global;
- unresolved geography;
- differences in naming/SKU suffixes.

---

# 11. PRICE INTELLIGENCE

The user asked "how much".

Collect price evidence separately from product truth.

For each observed price:

- product_id
- country
- seller/source
- price_type
- value
- currency
- VAT/tax state if known
- promotional or regular where known
- observed_at
- source_id

Price types:

OFFICIAL_RRP
OFFICIAL_PRICE
AUTHORIZED_RETAIL
MAJOR_RETAIL
MARKETPLACE_OBSERVED
UNKNOWN

Never call retail price WTP.

Never use one country's price as global price.

Never average across currencies without a documented conversion step.

Do not let temporary discounts define positioning without context.

Output:

`data/normalized/prices.csv`

Create price coverage and median/range views only when enough comparable
observations exist.

---

# 12. ACCESSORIES + CONSUMABLES

This is a separate product layer.

Capture:

Air:
HEPA/carbon filters
humidifier wicks
replacement filters

Coffee:
AquaClean
descaler
cleaning tablets
bean containers
milk systems
portafilters
frothers
capsules/pads where part of Versuni ecosystem

Airfryer:
trays
racks
baskets
separators

Floor:
bags
filters
brushes
pads
detergents

Garment:
boards
covers
descaler
water tanks.

Build compatibility relationships only when verified.

Output:

`data/normalized/accessories.csv`

Relationships:

ACCESSORY_FOR
CONSUMABLE_FOR
COMPATIBLE_WITH

Do not infer compatibility by family name alone.

---

# 13. DIGITAL ECOSYSTEM

Capture software/services:

- HomeID
- Air+
- HomeRun
- Philips Home Safety
- Philips Pet Series app
- device-level connectivity / intelligence

For every supported product:
record verified app/service relationships.

Fields:

- app/service
- platform
- product_id
- feature
- region if relevant
- source

Output:

`data/normalized/digital_ecosystems.csv`

Relationship vocabulary includes:

USES_APP
USES_SERVICE
CONNECTED_TO
SHARES_DIGITAL_PLATFORM_WITH

---

# 14. MANUALS / SUPPORT / COMPLIANCE

For each accepted SKU where possible collect:

- support page
- manual
- datasheet
- declaration/conformity
- compliance/certification page
- spare-parts/accessory support

These often contain better model truth than marketing pages.

Do not confuse a compliance listing with consumer positioning.

Preserve document role.

---

# 15. PRODUCT RELATIONSHIPS

Create:

`data/normalized/relationships.csv`

Allowed product relationships:

VARIANT_OF
REGIONAL_VARIANT_OF
FAMILY_MEMBER_OF
ACCESSORY_FOR
CONSUMABLE_FOR
USES_APP
SHARES_PLATFORM_WITH
PREDECESSOR_OF
SUCCESSOR_OF
PARALLEL_TO

Critical rule:

PREDECESSOR_OF / SUCCESSOR_OF require real evidence.

Model-number sequence is not evidence.

"Newer looking" is not evidence.

Similar specs are not evidence.

If relationship is plausible but unverified:
do not store it as fact.

Add to GAPS instead.

---

# 16. SOURCE MANIFEST

Every factual record must resolve to a source.

Use:

`data/normalized/sources.csv`

Every source has:

- source_id
- exact URL
- publisher
- title/page
- source tier
- source roles
- geography
- publication date where known
- retrieval date
- archive/local path where permitted
- sha256 where archived

Source roles:

IDENTITY
SPEC
IMAGE
AVAILABILITY
PRICE
LAUNCH
STATUS
MANUAL
COMPLIANCE
ACCESSORY
DIGITAL

Do not cite a generic homepage for a specific specification.

---

# 17. RAW SNAPSHOT

Preserve network-retrieved raw metadata under:

`data/raw/`

Freeze:
- source index
- retrieved metadata
- legal/public HTML/PDF references where appropriate
- download logs
- error logs

Do not silently overwrite old raw observations.

Use snapshot/run IDs.

---

# 18. GENERATED DUCKDB

Create:

`data/generated/versuni_products.duckdb`

from normalized source files.

This DuckDB is disposable.

CSV/JSON + manifests remain authoritative.

Use DuckDB for:
- joins
- coverage reports
- competitor matching later
- portfolio summaries
- integration export.

One command should rebuild it.

---

# 19. QUALITY TESTS

Create automated tests for:

- duplicate product IDs;
- exact SKU collisions;
- orphan family/category/brand relationships;
- missing identity sources;
- material spec with no source;
- exact image without source;
- image exact-match conflicts;
- price without date/currency/source;
- distribution without geography/source;
- successor/predecessor without source;
- accessory relationship without source;
- CURRENT product supported only by retailer evidence;
- invalid URLs;
- placeholder URLs;
- broken source IDs;
- impossible numerical values where obvious;
- no product image for hero-priority family;
- hidden UNKNOWN values converted to empty strings.

Do not weaken tests to make coverage look better.

---

# 20. COMPLETENESS REPORT

Create:

`exports/coverage_report.json`

and:

`reports/COVERAGE_REPORT.md`

Report coverage by:

brand
category
family
series
market
SKU
image
price
spec
manual/support
distribution.

Examples:

Philips / Climate:
family coverage 100%
accepted SKU coverage 91% across priority markets
exact-image coverage 84%
price coverage NL 72%
etc.

Use actual runtime values.

Never hardcode these examples.

---

# 21. UNRESOLVED GAPS

Create:

`exports/unresolved_gaps.json`

and update:

`reports/GAPS.md`

Every unresolved item should state:

- entity
- missing field
- attempted sources
- why unresolved
- priority
- suggested next source

A gap is a valid result.

Do not turn it into a guess.

---

# 22. SEARCH STRATEGY

Use systematic search patterns per brand and geography.

Examples:

site:official-domain product category
site:official-domain exact SKU
site:official-domain SKU manual
site:official-domain SKU support
site:official-domain SKU conformity
site:official-domain family series
site:official-domain "product family"

Use localized official sites.

Do not rely only on English/global sites.

For markets like:
India / Brazil / Italy / Netherlands / UK / Germany / France
use the relevant official localized brand sites where available.

Store research/search query logs.

---

# 23. PRIORITY ORDER

Execute in this order:

P0
1. verify brands;
2. verify categories;
3. family census;
4. official SKU census;
5. image acquisition;
6. source manifest.

P1
7. specifications;
8. distribution;
9. prices;
10. support/manual/compliance;
11. accessories/consumables;
12. digital ecosystems.

P2
13. lifecycle/lineage;
14. long-tail regional variants;
15. extra gallery imagery.

Do not spend hours on one obscure SKU while major categories remain incomplete.

---

# 24. DO NOT DO COMPETITOR STRATEGY YET

Prompt 1 is the truth census.

You may record obvious competitor candidates in notes, but do NOT build
the competitor strategy or cluster atlas yet.

That is Prompt 2.

Do not mix product truth and strategic inference.

---

# 25. FINAL OUTPUTS REQUIRED FROM PROMPT 1

Populate:

`data/normalized/brands.csv`
`data/normalized/categories.csv`
`data/normalized/families.csv`
`data/normalized/products.csv`
`data/normalized/specs_long.csv`
`data/normalized/distribution.csv`
`data/normalized/prices.csv`
`data/normalized/images.csv`
`data/normalized/accessories.csv`
`data/normalized/digital_ecosystems.csv`
`data/normalized/relationships.csv`
`data/normalized/sources.csv`

Create/rebuild:

`data/generated/versuni_products.duckdb`

Create:

`exports/master_products.json`
`exports/product_families.json`
`exports/distribution_map.json`
`exports/image_manifest.json`
`exports/coverage_report.json`
`exports/unresolved_gaps.json`

Update:

`reports/PRODUCT_ATLAS.md`
`reports/DISTRIBUTION_ATLAS.md`
`reports/IMAGE_COVERAGE.md`
`reports/GAPS.md`

---

# 26. FINAL REPORT

Return exactly:

VERSUNI PRODUCT CENSUS STATUS

BRANDS
verified:
unresolved:

CATEGORIES
verified:
unresolved:

FAMILIES
verified:
current:
legacy/support-only:

SKUS
accepted:
current:
legacy/support-only:
regional variants:
unresolved:

IMAGES
exact verified:
family verified:
unverified/missing:
broken:
duplicate warnings:

SPECS
coverage by major category:

DISTRIBUTION
countries/markets covered:
official-current observations:
support-only:
retail-only:
unknown:

PRICES
observations:
countries:
official:
retail:

ACCESSORIES / CONSUMABLES
count:
compatibility links:

DIGITAL
apps/services:
product links:

SOURCES
Tier A:
Tier B:
Tier C discovery-only:
broken/unresolved:

COMPLETENESS
brand:
category:
family:
series:
SKU by priority market:
exact image:

TESTS
pass/fail:

FILES CREATED / UPDATED
...

LOCAL COMMIT
...

BLOCKERS / GAPS
...

NEXT
RUN PROMPT 2 — DISTILL, CLUSTER, COMPARE.
