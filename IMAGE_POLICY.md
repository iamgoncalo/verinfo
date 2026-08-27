# IMAGE_POLICY.md

## Current pass: metadata-only

Per explicit user decision (2026-08-26), this pass records image **URLs and
provenance metadata only** in `images.csv`. Binary download/caching under
`assets/products/<brand>/<family>/<sku>/` is deferred. `local_path` and
`sha256` fields stay empty unless a later pass explicitly enables downloading.
This keeps `IMAGE_COMPLETE` claims honest: "image-complete" here means
"verified image URL on file," not "cached locally."

## Source preference order

1. Official product page hero image
2. Official gallery image
3. Official press/media asset
4. Official support/product asset
5. Official distributor asset (only when 1–4 unavailable)

## Never use as source-of-record

- Google Images thumbnails
- Stock appliance imagery
- AI-generated imagery presented as a real product
- A sibling SKU's image labelled as this SKU's exact image without proof

## Verification status

- `EXACT_VERIFIED` — image is confirmed to depict this exact SKU (matching
  model number/name on the same official page, or explicit confirmation
  elsewhere on the same domain).
- `FAMILY_VERIFIED` — image confirmed to depict the family/series but not
  proven to match this exact SKU/variant. Must be clearly labelled as such
  everywhere it is shown.
- `UNVERIFIED` — leave the field missing rather than guess. A missing image
  with an `UNKNOWN` status is better than a wrong image.

## Photo vs marketing graphic (2026-08-27)

An initial pass mislabeled many marketing/infographic slides (feature-callout
banners, "N quality checks" badges, spec/dimension diagrams, wattage
callouts) as real-photo `image_type`s (ANGLE/DETAIL_CONTROL/etc) because they
came from the same official gallery as genuine photos. A dedicated visual
review (10 parallel agents, each downloading and actually looking at every
image) reclassified all 349 images on file: 106 were true marketing graphics,
now typed `MARKETING_GRAPHIC`; 4 were broken/blank downloads, now typed
`UNREADABLE`. Both are excluded from `thumb`/`thumbExact` selection in
`scripts/build_webapp_data.py` (`sorted_real_images`), and the gallery orders
real photo types first, `MARKETING_GRAPHIC` last, `UNREADABLE` dropped
entirely. The product-drawer gallery labels a `MARKETING_GRAPHIC` image as
such ("Official marketing graphic · not a plain photo") rather than
presenting it as a photo. One product (`preethi-ch-kh317`) has zero real
photos on file after this correction — an honest gap, shown as "no image"
rather than substituting a graphic.

## Volume discipline

**Updated 2026-08-26 per explicit user instruction: target 3–5 verified
official images per product** (was 1–3). Prefer, in order: HERO_FRONT, ANGLE,
SIDE_BACK, DETAIL_CONTROL, PRODUCT_IN_CONTEXT, FAMILY_GROUP — pull straight
from the product's own official gallery rather than searching for new pages.
Still do not pad with redundant near-duplicate crops of the same shot; each
image in the 3–5 should show something the others don't (a different angle,
the control panel, the product in context). If a product's official page only
has 1–2 gallery images, record what exists and note the shortfall rather than
inventing or duplicating.

## Concept / future products

Any image representing a design hypothesis rather than an existing product
must be visually and textually labelled `CONCEPT — NOT AN EXISTING PRODUCT`
wherever displayed. This module (Prompt 1) does not generate concepts —
enforced here for downstream consumers.

## Dedup / integrity checks (feed into tests/)

- Same local image or asset_url claimed by many unrelated SKUs
- Image URL filename conflicts with the claimed SKU
- Page title / product title mismatch with the claimed SKU
- Image is a placeholder/logo/tiny icon rather than a product photo
- Broken URL (non-2xx on fetch, or fetch not attempted — flag as UNVERIFIED)

Flag for review rather than auto-rejecting on filename heuristics alone.
