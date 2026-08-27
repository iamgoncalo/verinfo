# GAPS.md — Unresolved Items

Generated 2026-08-26 from research-agent findings and coverage checks.

## Research-flagged gaps

- philips-air-ac2889-40: explicitly marked Discontinued
- philips-air-ac3033-73: explicitly marked Discontinued
- philips-air-ac4220-12: no buy button found in any market checked
- philips-air-amf220-15: page states no longer available
- philips-air-amf765-30: out of stock at check time
- philips-air-ac5659-40: support-only, no buy button in any market checked
- Gaggia SKU model codes largely unpublished on gaggia.com consumer pages -- treated as UNVERIFIED, marketing names only.
- Senseo US market: usa.philips.com marks all Senseo SKUs discontinued while senseo.us markets HD7810XL as current -- conflicting, flagged not resolved.
- Saeco/Gaggia hero images served via graphassets.com CDN, not saeco.com/gaggia.com domain directly -- flagged for image-provenance review.
- Versuni corporate structure: 'Versuni' confirmed as correct current company name, licensee of Royal Philips. Brand list (Philips, Saeco, Gaggia, Senseo, L'OR Barista, Preethi, Philips Walita) confirmed via versuni.com/about-us/brands but not stated as exhaustive.
- HSP5800/01 Wireless Spotlight Camera: no verified image or full specs retrieved this pass.
- us.homeaccess.philips (US smart locks + doorbell) -- corporate relationship to Versuni UNVERIFIED, not included in products.csv pending confirmation.
- GardenCare 3000 (RSL3000) UK category page showed 0 results at check time -- flagged as regionally limited, not delisted (FR confirmed live).
- Philips Walita: air purifiers in Brazil are sold under plain 'Philips' (philips.com.br), NOT under the Walita sub-brand -- material finding for Air case scope.
- Philips Walita: blenders (5000 Series ProBlend 6, Daily Collection) and some iron SKUs (PSG6064, DST5040) not re-confirmed live on walita.com.br this pass -- flagged UNVERIFIED-CURRENT, excluded from products.csv pending re-check.
- Philips Food: Steamer and Toaster category pages returned zero results on usa.philips.com at check time -- current US status UNKNOWN, not asserted CURRENT or LEGACY.
- Philips Food: Airfryer 1000/2000/3000-series hero images not captured this pass (text/specs confirmed only) -- needs follow-up image fetch.
- Philips Food: home-appliances.philips domain used as Tier-A-caveat (Versuni-operated redirect target from philips.co.uk, not literally philips.com) -- flagged for SOURCE_POLICY review.
- Floor/Garment Care: several home-appliances.philips product pages render as a bare JS shell on repeat fetch (bot-detection/caching) -- SpeedPro Max Aqua hero image, Performer Active full specs, All-in-One 6000 (AIS6020/70), and Steam&Go exact SKUs were not confirmed and need a browser-rendered re-fetch.
- HomeRun 9000 Series (XU9100/10) found only via secondary/press coverage, no directly-fetched official page -- excluded from products.csv, treated as lead only.
- Floor/Garment Care: no predecessor/successor claims asserted (e.g. SpeedPro vs AquaTrio, PowerPro vs Performer) -- no official lineage text found.
- Air/Climate NL pricing: AC0650/20, AC0950/10, AMF765/30, AMF870/35 not sold in NL under the exact GB SKU code -- NL market carries sibling SKUs AC0650/10, AMF765/10, AMF870/15 with different /xx suffixes instead (prices seen: AC0650/10 EUR83.14 promo/EUR104.99 RRP; AMF765/10 EUR429.99; AMF870/15 EUR415.00 promo/EUR539.99 RRP) -- these are NEW regional-variant SKUs not yet in products.csv, need a follow-up pass to add as REGIONAL_VARIANT_OF products.
- NL Philips storefront (home-appliances.philips/nl) shows a site-wide 'Magazijnuitverkoop' (warehouse clearance) banner as of 2026-08-26 -- most current NL prices are PROMOTIONAL against a struck-through Adviesprijs (RRP), not stable everyday pricing. Re-check after the sale period for a cleaner OFFICIAL_PRICE baseline.
- Philips Walita pricing: EP5441/55 page now 404s / delisted from VTEX catalog search (was CURRENT in earlier product-truth pass) -- status needs re-check, possible recent delisting.
- Philips Walita pricing: HR7304/90 page live but marked 'Indisponivel' (out of stock), no price shown -- still CURRENT per catalog presence, price unresolved.
- Philips Walita pricing: AC1715/10 (BR air purifier) price not retrievable -- page is a JS/Next.js SPA with no server-rendered price, and browser session auto-redirected to NL locale instead of staying on BR page. Needs a BR-geolocated JS-rendering re-fetch.
- Philips Walita pricing: EP4441/53's original 'buy coffee maker get airfryer free' bundle URL now redirects to a plain standalone product page with no bundle language -- treat the bundle promotion as INACTIVE, price captured is standalone-machine price only.
- Floor Care NL pricing: FC6904/01, FC9729/09, FC8577/09 official NL pages render with no SKU/price/buy-button (likely delisted from NL storefront); NL instead carries sibling PowerPro SKUs FC9741/09, FC9744/09, FC9745/09, FC9747/09, not substituted.
- Garment Care NL pricing: GC9682/86 and GC628/86 do not resolve on the NL storefront under that exact SKU; NL carries GC9682/80 and refurbished GC9682/86R1 / GC628/80R1 siblings instead, not substituted.
- Home Safety NL/global pricing: HSP5500/02 has NO disclosed price on ANY official Philips domain checked (NL 404s, India content page has zero commerce elements) -- genuine evidence gap, not just a market gap.
- Pet Care: Pet Series (PAW5320/02, PAW3210/02) confirmed NOT sold in the Netherlands at all (category page 404s) -- UK reference prices used instead, explicitly not NL.
- Garden Care: RSL3000/10 CONFIRMED sold in NL at EUR999.99, same price as FR -- earlier suspicion of NL regional restriction (from UK 0-results check) does not hold; it was a UK-specific gap, not NL.
- Food/Airfryer NL pricing: NA110/00, NA220/00, HD3095/87, HD2383/22 return hard 404 on the NL storefront (US-only SKUs, not sold in NL). HR1855/70R1 and HR1897/34 pages load but show no price/cart control (currently unavailable for purchase in NL) -- neither substituted nor invented.
- Coffee NL pricing: PSA3218/01->PSA3218/10 and SM6480/00->SM6580/00 SKU substitutions (exact GB/global SKU not sold in NL, sibling SKU priced instead) -- these are NEW regional-variant SKUs not yet in products.csv.
- Coffee NL pricing: L'OR Barista LM8018/90R1 has no price anywhere (global .com page shows no price at all; NL sibling LM8018/90 is temporarily sold out with empty price field) -- genuine gap, not just NL-specific.
- Coffee NL pricing: Senseo Original (senseo.nl) page loads correctly but has NO price element anywhere in DOM or network requests -- genuinely no official price-of-record on the brand's own site.
- Coffee NL pricing: Gaggia Classic UP has no price, no buy link, and no confirmed SKU/model code anywhere on gaggia.com (gaggia.nl 404s) -- remains fully unresolved.
- Coffee NL pricing: shop.saeco.com is down (SSL cert served for commercemarketplace.adobe.com, not shop.saeco.com) -- Saeco NL prices sourced from the shared Versuni platform (home-appliances.philips/nl) instead of saeco.com's own domain; re-check once shop.saeco.com is fixed.
- Coffee NL pricing: ALL Versuni-platform NL prices captured this pass are under a sitewide 'Magazijnuitverkoop' clearance banner -- treat as a snapshot, not stable baseline pricing; re-check after the sale period.
- Preethi images: PC024's entire gallery is filename-tagged 'PC005' (a different internal SKU) despite being served on PC024's own product page -- flagged FAMILY_VERIFIED not EXACT_VERIFIED, recommend visual confirmation before treating as PC024-specific.
- Preethi images: CSW037 image 2 has a GTIN mismatch (...360387 vs the product's own ...360370) -- flagged FAMILY_VERIFIED, likely a nearby pack-size variant sharing the gallery.
- FC8577/09 images sourced from HU (Hungary) market page since GB/BE storefronts show an empty PDP shell (no price/images) -- consistent with earlier delisting finding, images-only fallback, CURRENT/delisted status classification unaffected.
- GC628/86: page genuinely has only 2 gallery images (confirmed via DOM inspection, no additional carousel slides) -- not padded to 3-5.
- Walita images: full galleries found were much larger than transcribed (10-18 images per product for airfryers/humidifier/vacuum) -- only a representative 4-5 covering distinct angle types were kept in images.csv per IMAGE_POLICY volume discipline (avoid near-duplicate context shots); additional verified URLs are available in the research agent transcript if deeper coverage is wanted later.
- Walita AC1715/10 (BR air purifier): source page includes a 72-frame 360-degree turntable spin sequence and 3 stock/lifestyle marketing tiles, both excluded as non-distinct/non-product-photography per IMAGE_POLICY.
- Air/Climate images: AC0650/20, AMF765/30, AMF870/35 galleries include assets whose DAM filenames reference a sibling SKU suffix (AC0650_30, AMF765_10, AMF870_15) despite being served on the exact SKU's own page -- downgraded to FAMILY_VERIFIED per IMAGE_POLICY rather than EXACT_VERIFIED; Versuni's asset library appears to reuse one studio photoshoot across regional/plug variant siblings.
- Air/Climate images: AC0651/10 and AMF220/15 genuinely have only 3 official gallery images each (not padded); AC2220/10 and AC3033/73 genuinely have only 3-4 (not padded).

## Missing images on CURRENT products (0)


## Price coverage gap

22 of 69 CURRENT products have no price on file yet (price research pass dispatched 2026-08-26, results pending/partial at time of this report):

- `philips-air-ac0650-20`
- `philips-air-ac0950-10`
- `philips-air-amf765-30`
- `philips-air-amf870-35`
- `lor-barista-cf-lm8018`
- `senseo-cf-original-nl`
- `gaggia-cf-classicup`
- `philips-hs-hsp5500-02`
- `walita-cf-ep5441-55`
- `walita-fp-hr7304-90`
- `philips-air-ac1715-10-br`
- `philips-af-na110-00`
- `philips-af-na220-00`
- `philips-ck-hd3095-87`
- `philips-jc-hr1855-70r1`
- `philips-jc-hr1897-34`
- `philips-bf-hd2383-22`
- `philips-fc-fc6904-01`
- `philips-fc-fc9729-09`
- `philips-fc-fc8577-09`
- `philips-gc-gc9682-86`
- `philips-gc-gc628-86`
