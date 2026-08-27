# LABEL_RULES.md — Rule Definitions for Stage-2 Rule-Derived Labels

Every `rule_id` referenced in `data/normalized/associations.csv` must resolve
to an entry here. A rule is deterministic: given the same `specs_long.csv`
input, it always produces the same label. This is what lets a Stage-2 label
carry `status: RULE_DERIVED` rather than `CANDIDATE`.

## RULE-LENS-A-ARCHITECTURE

Source: `seeds/products-air-clusters.md` Lens A ("What physical
job-combination is the product actually built to perform?").

Applies to: Air/Climate Care products only (`philips-air-climate` category).

Inputs: `specs_long` rows for `humidification`, `fan`, `heating` on the
product.

Logic:
- No `humidification`, `fan`, or `heating` row with value "Yes" → **A1
  Dedicated Purification**.
- `humidification` = Yes, `fan`/`heating` absent → **A2 Purification +
  Humidification**.
- `fan` = Yes, `heating` absent, `humidification` absent → **A3 Purification
  + Fan**.
- `fan` = Yes AND `heating` = Yes → **A4 Purification + Fan + Heat**.

Confidence: HIGH when the underlying spec rows are OBSERVED (all current
cases in this dataset).

## RULE-LENS-D-INTELLIGENCE

Source: `seeds/products-air-clusters.md` Lens D ("How much does the product
perceive, decide and act without the user?"). Strict rule, per the seed:
"Connected != intelligent. A Wi-Fi button is not AI." "Do not upgrade a
product because marketing uses the word 'smart'."

Applies to: Air/Climate Care products only.

Inputs: presence/absence of a `sensors` spec row; presence/absence of a
`connectivity` spec row mentioning Wi-Fi/app; the verbatim `ai_claim` spec
row text (if any).

Logic (a product may satisfy more than one axis — record the highest
applicable ordinal level as `INTEL_D<n>`, and separately always record
`INTEL_D2_CONNECTED` as an independent fact if a Wi-Fi/app connectivity spec
row exists, since D2 is not subsumed by D3 in the seed's own ontology):

- No `sensors` row, no `ai_claim` row → **D0 Manual**.
- `sensors` row present, no `ai_claim` row, OR `ai_claim` text describes
  only an immediate-condition reaction (e.g. "automatically starts when it
  detects bad air quality", "intelligently senses and adapts to your air
  quality needs" — reacts to the CURRENT reading, not routine/history) →
  **D1 Reactive**.
- `ai_claim` text explicitly references adapting to **routine** or
  **history** (e.g. "AI technology that adapts to your routine", "Auto+
  mode", "self-adapting technology") → **D3 Adaptive**. This is judgment,
  not a keyword match — the rule requires the claim to describe
  context/history-based adaptation, not just a sensor threshold, per the
  seed's explicit instruction not to upgrade a product because marketing
  uses "smart"/"AI" as a bare label.
- No product in this dataset shows forecast/predictive-before-the-fact
  behavior → no **D4 Predictive** label has been assigned.
- Independently of the above: a `connectivity` spec row mentioning Wi-Fi or
  an app → also assign **D2 Connected** (a product can carry both D2 and
  D1/D3; they are different axes, not a single ordinal ladder, despite the
  D0-D4 numbering in the source seed).

Confidence: MEDIUM where the `ai_claim` wording is genuinely borderline
between "reacts to current reading" and "adapts to routine" (flagged
per-product in `associations.csv.notes`); HIGH otherwise.

## RULE-DIGITAL-LAYER (all categories)

Inputs: a `specs_long` row with `field` = `connectivity` whose `raw_value`
mentions a named app/service (Air+, HomeID, HomeRun) or "WiFi"/"app".

Logic: emit a `USES_DIGITAL_LAYER` edge from the product to the matching
`digital_ecosystems.csv` app/service row when the app name is stated
explicitly; otherwise emit it to a generic `DIGITAL_CONNECTIVITY` label
(Wi-Fi/app present, specific app unconfirmed).

Confidence: HIGH when the app is named explicitly in the spec text, MEDIUM
when only "Wi-Fi"/"app" is stated generically.

---

## Behavior-fabric labels are NOT rule-derived

Stage-3 labels (USER_JOB, NEED, CONTEXT, TRIGGER, BEHAVIOR, FRICTION,
OUTCOME) populated from `BEHAVIOR_FABRIC.md`'s worked Air Purification
example are **not** produced by a rule against this module's own evidence —
they are AI-proposed candidates seeded from category-general reasoning, not
from a Versuni-specific consumer-evidence corpus (that corpus does not exist
yet in this module; it is a later ingestion stage). They therefore carry
`status: CANDIDATE` and edge `evidence_state: INFERRED`, per
`LABEL_ONTOLOGY.md` and root `CLAUDE.md`'s `AI_SUGGESTION` evidence class —
never `VERIFIED`, `RULE_DERIVED`, or `EVIDENCE_DERIVED` until backed by real
consumer text.
