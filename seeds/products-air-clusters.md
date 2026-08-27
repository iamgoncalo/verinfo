# PRODUCTS-CLUSTERS.md — Versuni Air Product Clustering & Counterfactual Architecture

## Why clustering exists

Clustering is not a cosmetic filter.

Its job is to reveal **different theories of the category**.

A good cluster view should make the user notice something that is difficult to see in a catalogue.

Therefore the same product must be able to move between several legitimate lenses.

There is no single “true” product cluster.

There are multiple analytical lenses, each answering a different strategic question.

---

# 1. LENS A — ARCHITECTURE

## Question
**What physical job-combination is the product actually built to perform?**

### A1 — Dedicated Purification
Air treatment is the primary physical function.

Examples when verified:
- 600 / 600i
- 800 / 800i
- PureProtect Mini 900
- 1000i
- 2000 / 2000i
- PureProtect Quiet 2200
- 3000 / 3000i
- PureProtect 3200
- PureProtect Pro 4200

### A2 — Purification + Humidification
Air cleaning and moisture management are physically integrated.

Examples when verified:
- PureProtect Water 3400
- 3000i Purifier + Humidifier

### A3 — Purification + Fan
Clean-air function is integrated with comfort airflow.

Example:
- Air Performer 7000

### A4 — Purification + Fan + Heat
Clean-air function is integrated into thermal comfort.

Examples:
- 2000 Series 3-in-1
- Air Performer 8000

### Strategic question
If multifunction grows, is the category becoming:

> **air purifier**

or:

> **room environment system**?

### Counterfactual
If purification is no longer the primary product identity, which function becomes the purchasing trigger?

---

# 2. LENS B — PERFORMANCE

## Question
**How much clean-air delivery is being bought?**

Primary variable:
- CADR m³/h

Secondary context:
- room coverage m²
- max power W
- max/min noise where available

Performance bands must be derived from the actual verified distribution.

Do not create arbitrary “Basic / Pro / Elite” marketing labels.

Recommended implementation:

```python
verified_cadr_values -> quantiles or transparent fixed engineering thresholds
```

Every cluster label must show the underlying numerical range.

### Strategic question
Where does performance differentiation flatten?

### Counterfactual
If all meaningful competitors reach sufficient CADR for a normal room, does adding another 100 m³/h create consumer value?

This lens is not just about “more is better”.

It is designed to expose possible **commoditization**.

---

# 3. LENS C — CONSUMER CONTEXT

## Question
**What situation is this product designed to fit?**

Possible clusters only when supported by product positioning/specification:

### C1 — Compact / Bedroom
Small footprint, quiet/night use, lower room requirement.

### C2 — Everyday Room
General household use, medium area, mainstream functionality.

### C3 — Large Space
High CADR / large-room positioning.

### C4 — Climate Comfort
The purchase job extends beyond filtration to fan, heat or humidity.

### C5 — Connected / Managed Environment
Control/automation is a meaningful part of the proposition.

Do not infer “allergy”, “pets”, “baby”, “asthma”, etc. as consumer segments unless directly supported by product positioning or separate consumer evidence.

### Strategic question
Which contexts create **different willingness to solve**, not merely different room sizes?

### Counterfactual
What if the most valuable segmentation variable is not room size at all, but:
- sleep,
- reliability sensitivity,
- filter-maintenance aversion,
- occupancy pattern,
- outdoor pollution exposure,
- renter vs homeowner,
- willingness to see an appliance in the room?

---

# 4. LENS D — INTELLIGENCE

## Question
**How much does the product perceive, decide and act without the user?**

This lens must use strict rules.

### D0 — MANUAL
User directly selects operating state.  
No meaningful environment-reactive automation.

### D1 — REACTIVE
Product senses environmental variables and automatically changes operation according to a fixed rule.

Example logic:
> PM rises → fan speed rises.

### D2 — CONNECTED
Remote control / app / voice / external data access exists.

Important:
**Connected ≠ intelligent.**

A Wi-Fi button is not AI.

### D3 — ADAPTIVE
System changes operation based on context/history/routine beyond a single immediate sensor threshold.

Requires explicit product evidence.

### D4 — PREDICTIVE
System acts before the immediate measured condition based on forecast, learned pattern or external predictive information.

Requires explicit evidence.

Do not upgrade a product because marketing uses the word “smart”.

### Strategic question
Where is Versuni actually moving from:

> control

to:

> autonomy?

### Counterfactual
What if the best air purifier has no controls because the product decides correctly enough that controls become unnecessary?

---

# 5. LENS E — GENERATION / PRODUCT EVOLUTION

## Question
**What product architecture appears to be replacing, parallel to, or extending another?**

Relationship states:

```yaml
PREDECESSOR_VERIFIED
SUCCESSOR_VERIFIED
PARALLEL
REGIONAL_VARIANT
LEGACY_STILL_SOLD
UNKNOWN_RELATIONSHIP
```

Never infer succession from:
- larger model number,
- similar CADR,
- newer-looking industrial design.

Require:
- product launch timing,
- official range context,
- compliance/support dates,
- archived portfolio evidence,
- explicit source evidence where possible.

### Strategic question
What direction is the portfolio actually evolving toward?

### Counterfactual
If the current PureProtect line disappeared tomorrow, which underlying capabilities would still define Versuni Air?

That exposes capabilities that are strategic versus names that are temporary.

---

# 6. LENS F — MAINTENANCE / OWNERSHIP BURDEN

## Question
**How much work does the consumer inherit after purchase?**

Potential variables:
- filter replacement interval
- filter price
- cleaning requirements
- app/account dependency
- water tank / wick maintenance
- number of consumables
- number of modes/controls
- physical footprint

Possible derived classes:

LOW-TOUCH  
MEDIUM-TOUCH  
HIGH-TOUCH

Only after explicit rules are defined.

### Strategic question
Is the next disruptive vector performance — or removing ownership friction?

### Counterfactual
What if the consumer never buys, stores, remembers or changes a filter?

What business model appears if Versuni owns that responsibility?

---

# 7. LENS G — ECONOMIC POSITION

## Question
**How large is the purchase in the consumer’s economic life?**

Do not use price tier labels alone.

For verified current Dutch prices derive:

### G1 — Price
Observed product price.

### G2 — Gross work hours
```text
product price / €26.90
```
using the 2025 Dutch median gross hourly employee wage as context.

### G3 — Share of mean disposable household income
```text
product price / €60,200
```
using 2024 mean Dutch household disposable income.

### G4 — Year-1 TCO
Observed purchase price + modeled filter + modeled energy under explicit assumptions.

### G5 — 3-year TCO
Same, with assumptions visible.

These are affordability/context variables.

They are NOT direct WTP.

### Strategic question
Does a €100 feature create a very different decision in a €150 purifier versus a €600 purifier?

### Counterfactual
If hardware price fell 50% through commoditization, where would Versuni still have pricing power?

---

# 8. LENS H — VALUE STACK

## Question
**What is the customer actually buying?**

Potential observed/derived value layers:

1. **Removal** — particles / gases / allergens
2. **Comfort** — noise / airflow / humidity / heat
3. **Trust** — sensing / feedback / reliability
4. **Convenience** — automation / app / maintenance
5. **Outcome** — confidence in a room being “ready”
6. **Integration** — part of a larger home system

A product may span multiple layers.

This is not a scoring model.

### Strategic question
Which layer is becoming the basis of competition?

### Counterfactual
If “particle removal” becomes cheap and universal, can Versuni move upward from a device feature to a trusted home outcome?

---

# 9. THE MOST IMPORTANT CLUSTER — WHAT THE PRODUCT ASSUMES

Traditional clustering asks:
> Which products look alike?

Disruptive clustering asks:
> Which assumptions do these products share?

Create an **ASSUMPTION MAP**.

For each product/family, test assumptions such as:

- purification requires a dedicated box
- the box sits in one fixed location
- the consumer selects the room
- filters are replaced manually
- the consumer owns the product
- indoor air is treated after deterioration is measured
- air quality is optimized at room level
- clean-air delivery is the main performance metric
- the product needs a visible interface/app
- one appliance treats one bounded room
- consumer value begins after purchase
- higher performance deserves higher price

These are not product facts.
They are **category assumptions**.

The Magic Box should operate by breaking them.

---

# 10. THE COUNTERFACTUAL CLUSTER ENGINE

Instead of only asking:

> Which cluster does Product X belong to?

also ask:

> Which cluster would cease to exist if assumption Y were removed?

Example:

### Current
Dedicated purifier cluster

### Remove assumption
“Purification requires a fixed standalone appliance”

### New possibility space
- mobile purifier
- distributed micro-purifiers
- furniture-integrated purification
- HVAC/window/door integration
- floor-care + air-care hybrid
- room-as-a-service

This is the bridge from portfolio analysis to disruptive innovation.

---

# 11. ECONOMIC COUNTERFACTUALS

These should be executable scenarios where data permits.

### CF-E1 — Price compression
**What if purifier hardware ASP falls 30–50%?**
Which capabilities remain defensible?

### CF-E2 — Filter cost removal
**What if replacement filters cost the consumer €0?**
Does satisfaction/reliability become the dominant differentiator?

### CF-E3 — Energy shock
**What if household electricity cost doubles?**
Does low-power continuous operation beat high-CADR burst performance?

### CF-E4 — Subscription
**What if consumer pays monthly rather than upfront?**
How does purchase friction move?

### CF-E5 — Category budget
Dutch electrical household-appliance market in 2024:
- ~€3.7bn turnover
- ~8.26m units
- ~8.26m households

Derived context:
- ~€448 market turnover per household-equivalent/year
- ~1 appliance unit per household-equivalent/year

**What if the purifier must compete for roughly one household-appliance purchase occasion rather than for an abstract “air-quality budget”?**

This is a stronger competitive frame.

### CF-E6 — Time price
At €26.90 median gross hourly wage:
**How many hours of work does each purifier represent?**

This is not WTP.
It is an intuitive affordability normalization.

---

# 12. VISUAL CLUSTERIZATION RULES

Every lens should reorganize the SAME product objects.

Avoid separate disconnected charts.

### Default interaction

```text
AIR PORTFOLIO
      ↓
[ARCHITECTURE] [PERFORMANCE] [CONTEXT] [INTELLIGENCE] [GENERATION] [ECONOMICS]
```

Clicking a lens:
- products physically move,
- clusters gain names,
- only the relevant 1–2 metrics remain visible,
- relationships animate,
- unchanged facts do not duplicate.

### Hover
Shows:
- product image
- product name
- key lens-specific attribute
- epistemic state

### Focus
Shows:
- full product image
- 3–6 relevant specs
- why it belongs in this cluster
- source trace
- counterfactual question

Every focus view ends with:

> **WHAT ASSUMPTION WOULD YOU BREAK?**

That is the transition into the Magic Box.

---

# 13. CLUSTER QUALITY TEST

A cluster is not accepted unless it passes all five:

### 1 — REPRODUCIBLE
Another analyst using the rule gets the same assignment.

### 2 — STRATEGIC
It changes how we understand the category.

### 3 — DISTINCT
It is not a different name for the same hierarchy.

### 4 — TRACEABLE
Inputs are sourced or explicitly derived.

### 5 — COUNTERFACTUAL
It can generate at least one meaningful “what if?” question.

If a cluster merely makes the page prettier, remove it.

---

# 14. THE SIX CLUSTERS TO SHIP FIRST

For deadline quality, prioritize:

1. **ARCHITECTURE**
2. **PERFORMANCE**
3. **INTELLIGENCE**
4. **GENERATION**
5. **ECONOMICS**
6. **ASSUMPTIONS**

Consumer Context and Maintenance can remain secondary lenses if evidence is weaker.

Why?

Because these six create a complete disruptive story:

```text
WHAT IS BUILT?
        ↓
HOW POWERFUL?
        ↓
HOW INTELLIGENT?
        ↓
WHERE IS IT EVOLVING?
        ↓
WHAT DOES IT COST IN HUMAN TERMS?
        ↓
WHICH CATEGORY ASSUMPTIONS CAN WE BREAK?
```

That is substantially more useful than a conventional product taxonomy.

---

# 15. WEBSITE DISTILLATION

The Products world should default to:

## DISTILLED

At most:
- 1 dominant portfolio illustration
- 3–5 hero metrics
- 1 current lens
- 1 counterfactual question

Then:

## RAW

contains:
- full verified table
- sources
- SKU variants
- specs
- missing values
- rules

This separation is mandatory.

The executive sees meaning.
The reviewer can inspect truth.

