# ASSOCIATION_MODEL.md — Typed Semantic Associations

Not every association is causal.

## Association classes

### Functional
Product/capability performs a function.

### Behavioral
Context/trigger/friction influences behavior.

### Empirical
Variables co-occur or correlate in evidence.

### Mechanistic
A mechanism is supported by technical/scientific evidence.

### Economic
A product/behavior creates a cost/value relationship.

### Competitive
A product/category overlaps with a competitor/substitute.

### Epistemic
Evidence supports, contradicts or qualifies another object.

### Counterfactual
An assumption is deliberately changed to create a possibility.

## Edge direction
DIRECTED
UNDIRECTED

## Evidence strength
HIGH
MEDIUM
LOW
UNKNOWN

Do not compress all edge quality into one numeric score.

## Required edge provenance
source_ids
exact source location/span where available
rule_id if rule-derived
snapshot_id
created_at
evidence_state
notes

## Causal-language guardrail
If the evidence is correlational:
use ASSOCIATED_WITH
not CAUSES.

If an outcome is only inferred:
mark INFERRED.

If a relationship is a design hypothesis:
mark COUNTERFACTUAL or CONCEPT.
