# DATA_DICTIONARY.md

All files are UTF-8 CSV with a header row, one row per fact/entity. `product_id`
format: `<brand_id>-<category_id>-<family_id>-<sku>` (lowercase, hyphenated,
ASCII-safe). IDs are stable once assigned — never reused after retirement.

## brands.csv
`brand_id, brand_name, parent_company, ownership_status, operating_relationship,
official_domain, status (VERIFIED|CANDIDATE|REJECTED), source_ids, notes`

## categories.csv
`category_id, brand_id, category_name, local_market_names, parent_category_id,
status, source_ids, notes`

## families.csv
`family_id, brand_id, category_id, family_name, series_name, status
(CURRENT|LEGACY|SUPPORT_ONLY|HISTORICAL|CANDIDATE|UNKNOWN), first_seen_evidence,
source_ids, notes`

## products.csv
`product_id, brand_id, category_id, family_id, sku, model_name,
regional_suffix, colour, voltage, region, current_status
(CURRENT|LEGACY|SUPPORT_ONLY|HISTORICAL|CANDIDATE|UNKNOWN), status_evidence_id,
launch_date, launch_date_confidence, official_url, support_url, manual_url,
source_ids, missing_fields, confidence`

## specs_long.csv
`product_id, field, raw_value, unit, normalized_value, normalized_unit,
source_id, exact_source_location, epistemic_state (OBSERVED|DERIVED|UNKNOWN)`

Category-specific `field` vocabularies (non-exhaustive, extend as discovered):
- Air: cadr_m3h, room_coverage_m2, noise_min_dba, noise_max_dba, power_max_w,
  filter_architecture, filter_life_months, sensors, connectivity, app,
  voice_control, humidification, fan, heating, adaptive_mode, ai_claim,
  dimensions, weight_kg
- Airfryer: capacity_l, power_w, cooking_modes, temp_range_c, basket_architecture,
  steam, connectivity, dimensions
- Coffee: brew_architecture, recipe_count, grinder, milk_system, pressure_bar,
  bean_system, connectivity, profiles
- Floor care: runtime_min, wet_dry, navigation, station, brushes, mapping,
  suction_metric (verbatim, source-defined)
- Garment: steam_rate_g_min, steam_boost_g, power_w, heatup_time_s,
  optimaltemp, board_integration
- Home safety: resolution, sensor_type, connectivity_protocol,
  detection_features, power_source

## distribution.csv
`product_id_or_family_id, entity_level (SKU|FAMILY), country, market_cluster,
availability_state (OFFICIAL_CURRENT|OFFICIAL_SUPPORT_ONLY|RETAIL_OBSERVED|
HISTORICAL|UNKNOWN), channel, observed_date, source_id`

## prices.csv
`product_id, country, seller_source, price_type (OFFICIAL_RRP|OFFICIAL_PRICE|
AUTHORIZED_RETAIL|MAJOR_RETAIL|MARKETPLACE_OBSERVED|UNKNOWN), value, currency,
vat_state, promo_or_regular, observed_at, source_id`

## images.csv
`image_id, product_id, image_type (HERO_FRONT|ANGLE|SIDE_BACK|
PRODUCT_IN_CONTEXT|DETAIL_CONTROL|FAMILY_GROUP), verification_status
(EXACT_VERIFIED|FAMILY_VERIFIED|UNVERIFIED), source_page, asset_url,
local_path, sha256, width, height, format, retrieved_at`

Per `SCOPE.md`, `local_path`/`sha256` stay empty in this pass (metadata-only
image policy) — see `IMAGE_POLICY.md`.

## accessories.csv
`accessory_id, accessory_name, accessory_type (ACCESSORY|CONSUMABLE),
relationship (ACCESSORY_FOR|CONSUMABLE_FOR|COMPATIBLE_WITH), product_id,
source_id, notes`

## digital_ecosystems.csv
`app_or_service, platform, product_id, feature, region, relationship
(USES_APP|USES_SERVICE|CONNECTED_TO|SHARES_DIGITAL_PLATFORM_WITH), source_id`

## relationships.csv
`relationship_id, product_id_a, relationship_type (VARIANT_OF|
REGIONAL_VARIANT_OF|FAMILY_MEMBER_OF|ACCESSORY_FOR|CONSUMABLE_FOR|USES_APP|
SHARES_PLATFORM_WITH|PREDECESSOR_OF|SUCCESSOR_OF|PARALLEL_TO), product_id_b,
evidence_summary, source_id`

## sources.csv
`source_id, url, publisher, title, tier (A|B|C), roles (pipe-separated:
IDENTITY|SPEC|IMAGE|AVAILABILITY|PRICE|LAUNCH|STATUS|MANUAL|COMPLIANCE|
ACCESSORY|DIGITAL), geography, publication_date, retrieved_at, archive_path,
sha256`

## labels.csv

`label_id, label_type, canonical_name, definition, scope, status, source_ids,
rule_id, confidence_state, notes`

`label_type` is one of the 27 types in `LABEL_ONTOLOGY.md` (PRODUCT, BRAND,
CATEGORY, FAMILY, CAPABILITY, FUNCTION, USER_JOB, NEED, CONTEXT, TRIGGER,
BEHAVIOR, FRICTION, OUTCOME, HEALTH_RELATED_OUTCOME, EMOTION_PERCEPTION,
ECONOMIC, DIGITAL, INTELLIGENCE, COMPETITOR, EVIDENCE, TREND, TENSION,
ASSUMPTION, COUNTERFACTUAL, CONCEPT, TEST, KILL_CRITERION). `status` is one of
VERIFIED / RULE_DERIVED / EVIDENCE_DERIVED / CANDIDATE / REJECTED / UNKNOWN
per `LABEL_ONTOLOGY.md`. PRODUCT/BRAND/CATEGORY/FAMILY identity labels are
NOT duplicated here — they live in their own tables; `labels.csv` starts at
CAPABILITY and above (Stage 2+ of `LABELING_PIPELINE.md`).

## label_aliases.csv

`alias, language, canonical_label_id, source, notes` — per the alias policy
in `LABEL_ONTOLOGY.md`: one canonical label, many aliases, multilingual
allowed, canonical IDs stay stable English identifiers.

## associations.csv

`edge_id, from_id, from_type, relationship, to_id, to_type, association_class,
direction, evidence_strength, evidence_state, context_ids, trigger_ids,
source_ids, exact_source_location, rule_id, snapshot_id, confidence_state,
strength_if_quantified, unit_if_quantified, created_at, notes`

`relationship` is drawn from the canonical vocabulary in `LABEL_ONTOLOGY.md`
(BELONGS_TO, HAS_CAPABILITY, PERFORMS_FUNCTION, SERVES_JOB, ADDRESSES_NEED,
USED_IN_CONTEXT, TRIGGERED_BY, ENABLES_BEHAVIOR, BLOCKS_BEHAVIOR,
CREATES_FRICTION, REDUCES_FRICTION, LEADS_TO_OUTCOME,
ASSOCIATED_WITH_OUTCOME, HAS_ECONOMIC_COST, USES_DIGITAL_LAYER,
USES_INTELLIGENCE_LEVEL, COMPETES_WITH, SUBSTITUTES_FOR,
SHARES_CAPABILITY_WITH, SUPPORTS, CORROBORATES, CONTRADICTS,
CREATES_TENSION, EMBEDS_ASSUMPTION, CHALLENGES_ASSUMPTION,
BREAKS_ASSUMPTION, GENERATES_COUNTERFACTUAL, GENERATES_CONCEPT,
CONSTRAINS_CONCEPT, TESTED_BY, KILLED_BY, SURVIVES_AS).
`association_class` is one of Functional / Behavioral / Empirical /
Mechanistic / Economic / Competitive / Epistemic / Counterfactual per
`ASSOCIATION_MODEL.md`. `evidence_strength` is HIGH / MEDIUM / LOW / UNKNOWN
— never compressed into one numeric score. Causal-language guardrail: use
ASSOCIATED_WITH_OUTCOME, never a causal verb, unless the evidence is
genuinely causal (none is, in this module, yet).

## Epistemic states

`OBSERVED` — directly stated by a Tier A/B source.
`DERIVED` — computed from OBSERVED fields via an explicit, documented rule.
`UNKNOWN` — not yet resolved. Never converted to an empty string silently;
always an explicit `UNKNOWN` token so it is queryable and shows up in
coverage/gap reports.
