# BEHAVIOR_FABRIC.md — Versuni Fabric of Behavior

## Objective

Model the human reality around Versuni products.

The portfolio should become a graph of:
products, capabilities, jobs, needs, contexts, triggers, behaviors, frictions, outcomes, evidence, economics and assumptions.

The system should not ask only:
"What does this product have?"

It should ask:
"What human behavior and outcome does this capability participate in?"

## Core fabric

PRODUCT
→ CAPABILITY
→ FUNCTION
→ USER_JOB
→ NEED
↔ CONTEXT
↔ TRIGGER
→ BEHAVIOR
↔ FRICTION
→ OUTCOME
↔ ECONOMICS
↔ EVIDENCE

The graph is non-linear.

## Example: Air Purification

### Product/capability
- filtration
- particle sensing
- gas sensing where verified
- airflow
- automation
- app control
- humidification / heat / fan where applicable

### Jobs
- keep indoor air cleaner
- respond to pollution episodes
- reduce effort of monitoring air
- maintain acceptable bedroom conditions
- manage air during cooking/pollen/pet events

### Needs
- health-related reassurance
- comfort
- trust
- low effort
- reliability
- control
- low maintenance
- low disruption

### Contexts
- bedroom
- night
- cooking
- urban pollution
- pollen season
- pet household
- children
- large room
- small room
- high outdoor PM
- low ventilation

### Triggers
- PM spike
- odor/gas event
- cooking
- bedtime
- pollen alert
- visitor arrival
- pet activity
- outdoor pollution event

### Behaviors
- runs continuously
- lowers fan speed
- uses auto mode
- switches off at night
- moves product between rooms
- checks app
- ignores filter reminder
- replaces filter
- opens window instead
- uses another climate device

### Frictions
- noise
- filter cost
- maintenance
- energy concern
- sensor distrust
- unclear effectiveness
- visual intrusion
- footprint
- confusing controls
- app dependency

### Outcomes
- lower measured indoor particle concentration
- lower exposure where supported
- improved perceived air quality
- higher trust
- higher adherence
- reduced management effort
- lower disruption

### Health-related outcomes
Only link when supported by actual study evidence and context.

## Required edge fields

edge_id
from_id
from_type
relationship
to_id
to_type
context_ids
trigger_ids
source_ids
evidence_state
confidence_state
direction
strength_if_quantified
unit_if_quantified
snapshot_id
notes

## Two-way navigation

PRODUCT → HUMAN REALITY
and
HUMAN REALITY → PRODUCT / CAPABILITY / CONCEPT

This is the semantic basis for later disruptive innovation.
