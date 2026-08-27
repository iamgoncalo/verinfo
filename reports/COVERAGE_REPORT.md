# COVERAGE_REPORT.md

Generated 2026-08-26 from actual row counts in `data/normalized/*.csv` (never hardcoded) via `scripts/generate_reports.py`.

## Totals

- Brands verified: 7
- Categories: 26 verified, 4 candidate (not deep-dived)
- Families: 80 total, 71 current, 9 legacy/support-only/unknown
- Products: 76 total, 69 current, 6 legacy/support-only, 1 unknown status
- Image coverage (CURRENT products): 100.0% have >=1 image on file, 97.1% have an EXACT_VERIFIED image
- Price coverage (CURRENT products): 68.1%
- Sources: 138 Tier A, 1 Tier B, 0 Tier C
- Labels: 77 total (18 RULE_DERIVED, 59 CANDIDATE) — see `LABEL_ONTOLOGY.md`
- Association edges: 347

## By brand

| brand | families | accepted SKUs | current SKUs | image cov. (current) | price cov. (current) |
|---|---|---|---|---|---|
| Gaggia | 1 | 1 | 1 | 100.0% | 0.0% |
| L'OR Barista | 1 | 1 | 1 | 100.0% | 0.0% |
| Philips | 45 | 47 | 40 | 100.0% | 57.5% |
| Philips Walita | 12 | 8 | 8 | 100.0% | 75.0% |
| Preethi | 17 | 15 | 15 | 100.0% | 100.0% |
| Saeco | 3 | 3 | 3 | 100.0% | 100.0% |
| Senseo | 1 | 1 | 1 | 100.0% | 0.0% |

## By category

| category | brand | families | accepted SKUs | current SKUs | image cov. | price cov. |
|---|---|---|---|---|---|---|
| Manual/Automatic Espresso | gaggia | 1 | 1 | 1 | 100.0% | 0.0% |
| Capsule Coffee | lor-barista | 1 | 1 | 1 | 100.0% | 0.0% |
| Air / Climate Care | philips | 14 | 18 | 11 | 100.0% | 54.5% |
| Airfryer | philips | 6 | 5 | 5 | 100.0% | 60.0% |
| Blending | philips | 1 | 1 | 1 | 100.0% | 100.0% |
| Breakfast (Toaster, Kettle, Sandwich Maker) | philips | 3 | 2 | 2 | 100.0% | 50.0% |
| Coffee | philips | 4 | 4 | 4 | 100.0% | 100.0% |
| Cooking (Multicooker, Steamer, Grill) | philips | 2 | 1 | 1 | 100.0% | 0.0% |
| Floor Care | philips | 6 | 5 | 5 | 100.0% | 40.0% |
| Garden Care | philips | 1 | 1 | 1 | 100.0% | 100.0% |
| Garment Care | philips | 4 | 4 | 4 | 100.0% | 50.0% |
| Home Safety | philips | 1 | 2 | 2 | 100.0% | 50.0% |
| Juicing | philips | 2 | 2 | 2 | 100.0% | 0.0% |
| Pet Care | philips | 1 | 2 | 2 | 100.0% | 100.0% |
| Kitchen Chimneys | preethi | 2 | 2 | 2 | 100.0% | 100.0% |
| Coffee Makers | preethi | 0 | 0 | 0 | None% | None% |
| Cookware | preethi | 2 | 2 | 2 | 100.0% | 100.0% |
| Electric Cookers | preethi | 0 | 0 | 0 | None% | None% |
| Electric Kettles | preethi | 0 | 0 | 0 | None% | None% |
| Gas Stoves | preethi | 5 | 3 | 3 | 100.0% | 100.0% |
| Hand Blenders / Juicers | preethi | 0 | 0 | 0 | None% | None% |
| Induction Cooktops | preethi | 1 | 2 | 2 | 100.0% | 100.0% |
| Mixer Grinders | preethi | 5 | 5 | 5 | 100.0% | 100.0% |
| Pressure Cookers | preethi | 2 | 1 | 1 | 100.0% | 100.0% |
| Super-automatic Espresso | saeco | 3 | 3 | 3 | 100.0% | 100.0% |
| Pod Coffee | senseo | 1 | 1 | 1 | 100.0% | 0.0% |
| Climatizacao (Climate) | philips-walita | 2 | 1 | 1 | 100.0% | 100.0% |
| Cuidados com a Roupa (Garment Care) | philips-walita | 2 | 0 | 0 | None% | None% |
| Cozinha (Kitchen) | philips-walita | 6 | 6 | 6 | 100.0% | 66.7% |
| Aspiradores (Vacuums) | philips-walita | 2 | 1 | 1 | 100.0% | 100.0% |

## Completeness statement

Per `COMPLETENESS_MODEL.md`: this is NOT a claim of 100% global completeness. BRAND-COMPLETE: the 8 seed-candidate brands are verified (7 accepted, all confirmed via versuni.com); no exhaustive search for additional undiscovered Versuni-operated brand identities was performed. CATEGORY-COMPLETE: solid for Air/Climate, Coffee, Food subcategories, Floor+Garment, Home Safety/Pet/Garden, Preethi, Walita — each brand's category architecture was surveyed, though breadth was prioritized over exhaustive long-tail SKU discovery per the P0 stop conditions each research agent was given. FAMILY-COMPLETE: high confidence for the categories above. SKU-COMPLETE BY MARKET: partial — representative flagship + 2-5 SKUs per family were captured, not exhaustive regional-suffix coverage. IMAGE-COMPLETE: 64% of current products (metadata-only, no binary caching per user decision). DISTRIBUTION-COMPLETE BY PRIORITY MARKET: NOT started (P1, not dispatched this pass — see GAPS.md). PRICE: NL/India/Brazil price pass in progress at time of this report.
