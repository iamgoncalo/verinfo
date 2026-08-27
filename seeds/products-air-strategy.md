# PRODUCTS.md — Versuni Disruptive Innovation Product Truth

## Purpose

This file is the canonical **product truth layer** for Project 1.

It is not a catalogue for its own sake. Its purpose is to answer five strategic questions:

1. **What does Versuni already know how to build?**
2. **Where is that capability concentrated?**
3. **Where is the Air portfolio genuinely differentiated versus merely tiered?**
4. **Which capabilities elsewhere in Versuni can transfer into Air?**
5. **What becomes possible if the current definition of an “air purifier” is treated as temporary rather than fixed?**

The assessed case remains **Air Treatment / Air Purification**.  
The broader Versuni portfolio is used only as a **capability context** for disruptive innovation.

---

# 1. PRODUCT TRUTH MODEL

Every real product object must distinguish:

| Class | Meaning |
|---|---|
| **OBSERVED** | Directly supported by an official/accepted source |
| **DERIVED** | Computed from observed product fields |
| **INFERRED** | Analyst interpretation with explicit rule |
| **COUNTERFACTUAL** | A design hypothesis; not an existing product |

A product specification is never promoted from `UNKNOWN` to a value because a neighbouring SKU appears similar.

### Required fields

```yaml
product_id:
brand:
family:
series:
sku:
region:
status: VERIFIED | PARTIAL | CANDIDATE | RETIRED/LEGACY_IF_VERIFIED

official_name:
official_url:
official_image_url:
image_source_url:
retrieved_at:
snapshot_id:

architecture:
cadr_m3h:
room_coverage_m2:
noise_min_dba:
noise_max_dba:
power_max_w:
filter_architecture:
filter_life:
sensors:
connectivity:
app:
voice_control:
humidification:
fan:
heating:
adaptive_mode:
ai_claim:

source_ids:
missing_fields:
confidence:
```

---

# 2. THE VERSUNI UNIVERSE — CAPABILITY CONTEXT

The useful hierarchy is:

**Brand → Category → Product family → Series → regional SKU**

The broad capability universe is:

### FOOD
Airfryer · Steam · Cook · Blend · Process · Juice · Breakfast

### COFFEE
Philips LatteGo · Café Aromis · Baristina · Barista Brew · Saeco · Gaggia · Senseo · L'OR

### AIR
Purify · Humidify · Cool · Heat · Air Performer

### CLEAN
Vacuum · Wash · Mop · Robot · AquaTrio · OneUp

### CLOTHES
Iron · Steam · PerfectCare · OneTurn

### HOME
Cameras · Doorbells · Sensors · Presence detection

### PETS
Feed · Water · Monitor

### GARDEN
Autonomous mow

### DIGITAL LAYER
HomeID · Air+ · HomeRun · Home Safety · Pet Series  
Sensors → connectivity → personalization → automation → AI

This universe matters because disruptive innovation often comes from **capability transfer**, not from asking the incumbent product category what feature it wants next.

---

# 3. AIR — VERIFIED DEEP-DIVE UNIVERSE

The Air case should resolve the portfolio at **family/series first**, then SKU.

## A. Dedicated purification

| Family | Candidate/verified SKU examples | Strategic role |
|---|---|---|
| 600 / 600i | AC0650, AC0651 | compact / entry / connected compact |
| 800 / 800i | AC0830, AC0850 | compact previous/parallel architecture |
| PureProtect Mini 900 | AC0920, AC0950, AC0951 | newer compact PureProtect architecture |
| 1000i | AC1715 family | connected mid-range |
| 2000 / 2000i | AC2889, AC2936 | mid/high previous-generation architecture |
| PureProtect Quiet 2200 | AC2210, AC2220, AC2221 | quietness / long-life filter / new PureProtect proposition |
| 3000 / 3000i | AC3033, AC3039 and verified legacy models | high-performance previous-generation |
| PureProtect 3200 | AC3210, AC3220, AC3221 | current high-performance PureProtect |
| PureProtect Pro 4200 | AC4220, AC4221 | flagship dedicated purifier |

## B. Purification + humidity

| Family | Candidate/verified SKU examples | Strategic role |
|---|---|---|
| PureProtect Water 3400 | AC3420, AC3421 | purification + NanoCloud humidification |
| 3000i Purifier + Humidifier | AC3829 family | predecessor/parallel multifunction architecture where verified |

## C. Purification + climate comfort

| Family | Candidate/verified SKU examples | Strategic role |
|---|---|---|
| 2000 Series 3-in-1 | AMF220 | purifier + fan + heater |
| Air Performer 7000 | AMF765 family | purifier + fan, connected/adaptive |
| Air Performer 8000 | AMF870 family | purifier + fan + heater, adaptive/AI positioning |

---

# 4. WHAT THE PORTFOLIO ALREADY SUGGESTS — WITHOUT OVERCLAIMING

These are **hypotheses to test**, not facts to hardcode.

### Hypothesis P1 — Purification performance is becoming less sufficient as the sole basis of competition
The portfolio contains repeated movement beyond “HEPA + CADR” into:
- quiet operation,
- connected control,
- sensing,
- adaptive modes,
- longer filter life,
- humidification,
- fan/heating combinations.

**Counterfactual:**  
If every serious competitor reaches “good enough” HEPA/CADR, what remains worth paying for?

---

### Hypothesis P2 — The product category may be dissolving into “environmental comfort”
Air Performer and PureProtect Water imply a possible shift from:

**purifier → environmental appliance**

**Counterfactual:**  
If a consumer never again buys a standalone “air purifier”, what form does clean-air value take?

---

### Hypothesis P3 — Versuni owns adjacent capabilities that a pure-play purifier company may not
Examples:
- HomeRun: mobility, mapping, autonomy
- AquaTrio / Floor Care: floor-level interaction with dust and surfaces
- Home Safety: presence sensing and ML classification
- Coffee: personalization and preference learning
- Air+: indoor/outdoor environmental data
- HomeID: broader household digital experience

**Counterfactual:**  
What can Versuni build that would be unnatural for Dyson, Coway, Blueair or Levoit because Versuni can transfer capabilities across the home?

---

# 5. THE DISRUPTIVE QUESTIONS PRODUCTS MUST SUPPORT

The Products world is successful only if it makes these questions explorable:

### CATEGORY
What if “air purifier” is the wrong unit of innovation?

### LOCATION
What if purification is moved:
- to the floor,
- to furniture,
- to sleeping zones,
- to entry points,
- to the source of pollution?

### SCALE
What if one purifier becomes:
- many micro-purifiers,
- one whole-home distributed system,
- a capability embedded in another appliance?

### INTERACTION
What if the purifier has:
- no screen,
- no app,
- no explicit user control?

### TIME
What if intervention happens:
- before pollution arrives,
- before sleep,
- before the user enters the room?

### OWNERSHIP / ECONOMICS
What if consumers do not buy the appliance at all?
- filter/service subscription,
- clean-air-as-a-service,
- landlord/building purchase,
- bundled climate comfort,
- product + guaranteed air-performance contract.

### PERFORMANCE
What if CADR is commoditized?
What becomes the next basis of competition:
- trust,
- silence,
- reliability,
- zero-maintenance,
- spatial intelligence,
- invisible integration,
- predictive prevention?

---

# 6. PRODUCT IMAGERY STANDARD

For every real product shown in the website:

**REAL PRODUCT = REAL OFFICIAL IMAGE**

Never use:
- stock purifier images,
- another SKU because it looks similar,
- AI-generated product imagery presented as real.

Image record:

```yaml
product_id:
sku:
image_url:
source_page:
publisher:
retrieved_at:
local_asset:
sha256:
status: VERIFIED | UNVERIFIED
```

If exact image cannot be verified:

> IMAGE NOT VERIFIED

is better than the wrong image.

For future concepts:

> CONCEPT — NOT AN EXISTING PRODUCT

must be visually explicit.

---

# 7. PRODUCTS — DISTILLED VIEW

The default website view should not show the catalogue.

It should answer:

## WHAT IS THE PORTFOLIO SHAPE?

Possible hero metrics, only if computed from verified objects:

- Verified Air families
- CADR range
- Connected share
- Multifunction share
- Current-generation PureProtect families
- Range of filter replacement intervals
- Share with sensing / adaptive behavior

Then one high-level portfolio statement:

> **The portfolio is moving from air cleaning performance toward environmental experience — but the disruptive question is whether the next step is still a purifier at all.**

This statement must remain a hypothesis until the generation/time evidence supports it.

---

# 8. PRODUCTS — RAW VIEW

RAW mode contains:

- every verified family,
- every accepted SKU,
- official URLs,
- official image provenance,
- specifications,
- missing fields,
- classification rules,
- rejected candidate SKUs,
- region/variant notes.

RAW is the proof layer.

DISTILLED is the decision layer.

---

# 9. PRODUCT ECONOMICS FIELDS TO ADD

Every verified Air product should, where data permits, gain:

```yaml
observed_price_eur:
price_source:
price_date:
replacement_filter_price_eur:
filter_replacement_interval_months:
annualized_filter_cost_eur:
max_power_w:
estimated_usage_assumption:
estimated_annual_energy_cost_eur:
estimated_year_1_tco_eur:
estimated_3y_tco_eur:
```

All modeled values must expose assumptions.

Never call modeled TCO “observed spend”.

---

# 10. THE PRODUCT AFFORDABILITY LENS — NETHERLANDS

The product page should eventually be able to express price in human terms.

Reference economic anchors:

- 2025 Dutch median gross hourly employee wage: **€26.90/hour**.
- 2024 mean disposable household income: **€60.2k/year**.
- 2024 mean equivalised income: **€41.9k/year**.
- 2024 household consumption: **>€27k/person/year**.
- 2024 Dutch electrical household-appliance market turnover: **~€3.7bn**.
- 2024 appliance units sold: **~8.26m**.
- 2024 private households: **~8.26m**.

Derived contextual ratios — NOT direct household-budget measurements:

- appliance-market turnover / household ≈ **€448 per household-equivalent/year**
- units sold / household ≈ **1.0 electrical appliance per household-equivalent/year**

These ratios are category context, not proof that each household actually spends €448 or buys one appliance.

For every purifier with a verified price, derive:

```text
PRICE / €26.90 = MEDIAN GROSS WORK HOURS
PRICE / €60,200 = SHARE OF MEAN HOUSEHOLD DISPOSABLE INCOME
```

This is a powerful affordability visualization, but it is **not WTP**.

---

# 11. PRODUCT COUNTERFACTUALS TO MATERIALIZE IN THE MAGIC BOX

The system should be able to generate and challenge propositions such as:

- What if the purifier is not visible?
- What if the filter is never replaced by the user?
- What if the product moves?
- What if there is no single product?
- What if clean air follows a person instead of treating a room?
- What if outdoor pollution is predicted before it enters?
- What if reliability is guaranteed as an outcome rather than a product warranty?
- What if a floor-care robot becomes a local particle-removal + air-treatment node?
- What if the home’s safety sensors become the purifier’s occupancy intelligence?
- What if airflow is shared with heating/cooling rather than duplicated?
- What if the cheapest purifier has the smartest intelligence layer?
- What if premium pricing shifts from hardware power to verified outcomes?
- What if the consumer pays €0 upfront?
- What if every competitor copies the feature within 18 months?
- What remains defensible?

The purpose is not to be “creative”.

The purpose is to expose which assumptions of the existing category are unnecessarily fixed.

---

# 12. PRODUCT PAGE ACCEPTANCE TEST

The Products world is not finished unless:

1. A Versuni executive can understand the Air portfolio shape in <10 seconds.
2. The broader Versuni universe can be zoomed out without broadening the case scope.
3. Real products use verified imagery.
4. Cluster lenses genuinely reorganize the portfolio.
5. Product facts trace to sources.
6. Product classifications trace to rules.
7. Economics can be expressed as affordability/TCO without pretending to be WTP.
8. At least one cross-category capability transfer is visible.
9. The interface naturally leads to a counterfactual question.
10. The visitor can move from product → evidence → counterfactual → candidate innovation.

