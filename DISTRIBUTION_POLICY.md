# DISTRIBUTION_POLICY.md

## Availability states

`OFFICIAL_CURRENT | OFFICIAL_SUPPORT_ONLY | RETAIL_OBSERVED | HISTORICAL | UNKNOWN`

## Rules

Never infer availability from:
- page language
- currency shown
- a bare Google search result
- the existence of a support page alone

`OFFICIAL_CURRENT` requires an official current storefront/catalogue listing
in that country. `OFFICIAL_SUPPORT_ONLY` requires a support/manual page with
no corresponding current storefront listing. `RETAIL_OBSERVED` requires a
named retailer's live listing, explicitly not claimed as official portfolio
status. `HISTORICAL` requires an archived launch/press reference with no
current evidence either way.

## Priority markets

See `config/priority_markets.yaml`. Distribution research is executed
market-by-market in that priority order; long-tail markets are tracked in
`exports/unresolved_gaps.json`, not silently skipped.
