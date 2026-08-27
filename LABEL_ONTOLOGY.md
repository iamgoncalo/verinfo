# LABEL_ONTOLOGY.md — Versuni Semantic Product & Behavior Ontology

## Mission

Turn the Versuni portfolio from a catalogue into a typed, evidence-traceable semantic fabric.

A label is not a free-form tag. It is a canonical object with:
- a type;
- a definition;
- aliases;
- scope;
- source/evidence;
- allowed relationships;
- confidence/state.

The system should answer both directions:

PRODUCT → what does it do → for whom → in which context → which behavior → which friction → which outcome

and

HUMAN NEED / BEHAVIOR → which products/capabilities/categories can address it?

## Core label types

1. PRODUCT
2. BRAND
3. CATEGORY
4. FAMILY
5. CAPABILITY
6. FUNCTION
7. USER_JOB
8. NEED
9. CONTEXT
10. TRIGGER
11. BEHAVIOR
12. FRICTION
13. OUTCOME
14. HEALTH_RELATED_OUTCOME
15. EMOTION_PERCEPTION
16. ECONOMIC
17. DIGITAL
18. INTELLIGENCE
19. COMPETITOR
20. EVIDENCE
21. TREND
22. TENSION
23. ASSUMPTION
24. COUNTERFACTUAL
25. CONCEPT
26. TEST
27. KILL_CRITERION

## Health rule

Health-related claims require explicit scientific evidence.

Never infer:
PRODUCT → "improves asthma"

from:
PRODUCT → filtration capability.

A valid chain is closer to:
filtration intervention
→ measured pollutant reduction
→ study-specific exposure/health outcome
→ explicit study context + limitations.

## Canonical relationship vocabulary

BELONGS_TO
HAS_CAPABILITY
PERFORMS_FUNCTION
SERVES_JOB
ADDRESSES_NEED
USED_IN_CONTEXT
TRIGGERED_BY
ENABLES_BEHAVIOR
BLOCKS_BEHAVIOR
CREATES_FRICTION
REDUCES_FRICTION
LEADS_TO_OUTCOME
ASSOCIATED_WITH_OUTCOME
HAS_ECONOMIC_COST
USES_DIGITAL_LAYER
USES_INTELLIGENCE_LEVEL
COMPETES_WITH
SUBSTITUTES_FOR
SHARES_CAPABILITY_WITH
SUPPORTS
CORROBORATES
CONTRADICTS
CREATES_TENSION
EMBEDS_ASSUMPTION
CHALLENGES_ASSUMPTION
BREAKS_ASSUMPTION
GENERATES_COUNTERFACTUAL
GENERATES_CONCEPT
CONSTRAINS_CONCEPT
TESTED_BY
KILLED_BY
SURVIVES_AS

## Epistemic state

OBSERVED
DERIVED
INFERRED
COUNTERFACTUAL
CONCEPT
JUDGMENT

The state belongs to the relationship as well as the node.

## Label status

VERIFIED
RULE_DERIVED
EVIDENCE_DERIVED
CANDIDATE
REJECTED
UNKNOWN

## Alias policy

Use one canonical label and many aliases.

Example:
canonical: NOISE
aliases:
- loud
- loudness
- fan noise
- operating sound
- night noise

Do not create parallel labels unless meaning differs.

## Multi-language policy

Aliases may be multilingual, but canonical labels should be stable English identifiers for computation.

Store:
alias
language
canonical_label_id
source
notes
