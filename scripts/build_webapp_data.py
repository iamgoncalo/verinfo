#!/usr/bin/env python3
"""Build webapp/src/data/site-data.json from data/normalized/*.csv.

Disposable output, same discipline as build_duckdb.py — the CSVs remain
authoritative. Run this after any change to data/normalized/*.csv that the
web app should reflect. Usage: python3 scripts/build_webapp_data.py
"""
import csv
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NORM = ROOT / "data" / "normalized"


def load(name):
    with open(NORM / f"{name}.csv", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


brands = load("brands")
categories = load("categories")
families = load("families")
products = load("products")
specs = load("specs_long")
images = load("images")
prices = load("prices")
labels = load("labels")
associations = load("associations")
digital = load("digital_ecosystems")
sources = load("sources")
tag_scores = load("product_tag_scores")

competitors = load("competitors")
competitor_products = load("competitor_products")
competitor_prices = load("competitor_prices")
competitor_specs = load("competitor_specs_long")
competitor_images = load("competitor_images")
competitor_claims = load("competitor_claims")
competitor_certifications = load("competitor_certifications")
competitor_capabilities = load("competitor_capabilities")
competitor_intelligence = load("competitor_intelligence")
competitor_tco = load("competitor_tco")

tags_by_pid = defaultdict(list)
for r in tag_scores:
    tags_by_pid[r["product_id"]].append({"realm": r["realm"], "tag": r["tag"], "score": float(r["score"]),
                                          "basis": r["basis"], "rationale": r["rationale"]})
for pid in tags_by_pid:
    tags_by_pid[pid].sort(key=lambda t: -t["score"])

specs_by_pid = defaultdict(list)
for r in specs:
    specs_by_pid[r["product_id"]].append({"field": r["field"], "value": r["raw_value"], "state": r["epistemic_state"]})

images_by_pid = defaultdict(list)
for r in images:
    images_by_pid[r["product_id"]].append({"url": r["asset_url"], "type": r["image_type"], "status": r["verification_status"], "format": r["format"]})

prices_by_pid = defaultdict(list)
for r in prices:
    prices_by_pid[r["product_id"]].append({"country": r["country"], "value": r["value"], "currency": r["currency"],
                                             "type": r["price_type"], "note": r["promo_or_regular"]})

# ---- World mapping (category_id -> world_id) ----
WORLD_MAP = {
    "philips-airfryer": "food", "philips-cooking": "food", "philips-blending": "food",
    "philips-juicing": "food", "philips-breakfast": "food",
    "preethi-mixer-grinders": "food", "preethi-gas-stoves": "food", "preethi-induction-cooktops": "food",
    "preethi-chimneys": "food", "preethi-pressure-cookers": "food", "preethi-cookware": "food",
    "preethi-coffee-makers": "food", "preethi-electric-cookers": "food", "preethi-electric-kettles": "food",
    "preethi-hand-blenders-juicers": "food", "walita-kitchen": "food",
    "philips-coffee": "coffee", "saeco-coffee": "coffee", "gaggia-coffee": "coffee",
    "senseo-coffee": "coffee", "lor-barista-coffee": "coffee",
    "philips-air-climate": "air", "walita-climate": "air",
    "philips-floor-care": "clean", "walita-vacuums": "clean",
    "philips-garment-care": "clothes",
    "philips-home-safety": "home",
    "philips-pet-care": "pets",
    "philips-garden-care": "garden",
}
WORLDS = [
    {"id": "food", "name": "Food", "tagline": "Airfryers, cooking, blending, juicing, breakfast"},
    {"id": "coffee", "name": "Coffee", "tagline": "Espresso, pod, capsule, super-automatic"},
    {"id": "air", "name": "Air", "tagline": "Purification, humidification, comfort airflow"},
    {"id": "clean", "name": "Clean", "tagline": "Vacuums, robots, wet & dry floor care"},
    {"id": "clothes", "name": "Clothes", "tagline": "Irons, garment steamers"},
    {"id": "home", "name": "Home", "tagline": "Cameras, doorbells, sensors"},
    {"id": "pets", "name": "Pets", "tagline": "Feeders, fountains"},
    {"id": "garden", "name": "Garden", "tagline": "Robot mowers"},
]

digital_by_pid = defaultdict(list)
for r in digital:
    if r["product_id"]:
        digital_by_pid[r["product_id"]].append(r["app_or_service"])

products_out = []
for p in products:
    imgs = images_by_pid.get(p["product_id"], [])
    exact = [i for i in imgs if i["status"] == "EXACT_VERIFIED"]
    thumb = (exact[0]["url"] if exact else (imgs[0]["url"] if imgs else None))
    cat_id = p["category_id"]
    products_out.append({
        "id": p["product_id"], "brand": p["brand_id"], "category": cat_id, "family": p["family_id"],
        "world": WORLD_MAP.get(cat_id, "food"),
        "sku": p["sku"], "name": p["model_name"], "region": p["region"], "status": p["current_status"],
        "url": p["official_url"], "confidence": p["confidence"], "thumb": thumb, "thumbExact": bool(exact),
        "images": imgs, "specs": specs_by_pid.get(p["product_id"], []), "prices": prices_by_pid.get(p["product_id"], []),
        "apps": digital_by_pid.get(p["product_id"], []),
        "tags": tags_by_pid.get(p["product_id"], []),
    })

# ---- Labels / associations (rule-derived + candidate behavior fabric) ----
labels_out = [{"id": l["label_id"], "type": l["label_type"], "name": l["canonical_name"],
               "definition": l["definition"], "scope": l["scope"], "status": l["status"],
               "ruleId": l["rule_id"]} for l in labels]
assoc_out = [{"from": a["from_id"], "fromType": a["from_type"], "rel": a["relationship"],
              "to": a["to_id"], "toType": a["to_type"], "class": a["association_class"],
              "evidenceState": a["evidence_state"], "confidence": a["confidence_state"],
              "notes": a["notes"]} for a in associations]

# ---- Competitor intelligence layer ----
comp_prices_by_pid = defaultdict(list)
for r in competitor_prices:
    comp_prices_by_pid[r["competitor_product_id"]].append({
        "country": r["country"], "type": r["price_type"], "value": r["value"], "currency": r["currency"],
        "observedAt": r["observed_at"],
    })

comp_specs_by_pid = defaultdict(list)
for r in competitor_specs:
    comp_specs_by_pid[r["competitor_product_id"]].append({"field": r["field"], "value": r["value"]})

comp_images_by_pid = defaultdict(list)
for r in competitor_images:
    comp_images_by_pid[r["competitor_product_id"]].append({
        "url": r["url"], "publisher": r["publisher"], "matchState": r["match_state"], "retrievedAt": r["retrieved_at"],
    })

comp_claims_by_pid = defaultdict(list)
for r in competitor_claims:
    comp_claims_by_pid[r["competitor_product_id"]].append({
        "claim": r["original_claim"], "claimType": r["claim_type"], "testContext": r["test_context"],
        "normalized": r["normalized_interpretation"], "corroboration": r["independent_corroboration"],
        "conflict": r["conflict"], "limitation": r["limitation"],
    })

comp_certs_by_pid = defaultdict(list)
for r in competitor_certifications:
    comp_certs_by_pid[r["competitor_product_id"]].append({
        "body": r["certification_body"], "ref": r["certification_ref"], "status": r["status"],
        "establishes": r["establishes_note"],
    })

comp_caps_by_pid = defaultdict(list)
for r in competitor_capabilities:
    comp_caps_by_pid[r["competitor_product_id"]].append({
        "group": r["capability_group"], "capability": r["canonical_capability"],
        "original": r["original_language"], "evidenceState": r["evidence_state"],
    })

comp_intel_by_pid = defaultdict(list)
for r in competitor_intelligence:
    comp_intel_by_pid[r["competitor_product_id"]].append({
        "dimension": r["dimension"], "status": r["status"], "note": r["evidence_note"],
    })

comp_tco_by_pid = defaultdict(list)
for r in competitor_tco:
    comp_tco_by_pid[r["competitor_product_id"]].append({
        "market": r["market"], "purchasePrice": r["purchase_price"], "currency": r["currency"],
        "filterPrice": r["filter_price"], "replacementIntervalMonths": r["replacement_interval_months"],
        "tco1y": r["tco_1y"], "tco3y": r["tco_3y"], "tco5y": r["tco_5y"],
        "completeness": r["completeness_state"], "assumptions": r["assumptions_note"],
    })

competitor_products_out = []
for cp in competitor_products:
    pid = cp["competitor_product_id"]
    imgs = comp_images_by_pid.get(pid, [])
    exact = [i for i in imgs if i["matchState"] == "VERIFIED_EXACT"]
    competitor_products_out.append({
        "id": pid, "competitor": cp["competitor_id"], "world": cp["versuni_world"],
        "category": cp["versuni_category_id"], "name": cp["product_name"], "model": cp["model"],
        "positioning": cp["positioning"], "markets": cp["markets"], "url": cp["official_url"],
        "notes": cp["notes"], "thumb": (exact[0]["url"] if exact else (imgs[0]["url"] if imgs else None)),
        "images": imgs, "specs": comp_specs_by_pid.get(pid, []), "prices": comp_prices_by_pid.get(pid, []),
        "claims": comp_claims_by_pid.get(pid, []), "certifications": comp_certs_by_pid.get(pid, []),
        "capabilities": comp_caps_by_pid.get(pid, []), "intelligence": comp_intel_by_pid.get(pid, []),
        "tco": comp_tco_by_pid.get(pid, []),
    })

competitors_out = [{
    "id": c["competitor_id"], "name": c["company_name"], "parentCompany": c["parent_company"],
    "hqCountry": c["hq_country"], "hqCity": c["hq_city"], "originCountry": c["origin_country"],
    "domain": c["official_domain"], "notes": c["ownership_notes"],
    "logoUrl": c.get("logo_url", ""), "logoState": c.get("logo_state", "MISSING"),
    "logoBg": c.get("logo_bg", "light"),
} for c in competitors]

data = {
    "worlds": WORLDS,
    "brands": [{"id": b["brand_id"], "name": b["brand_name"], "domain": b["official_domain"],
                "ownership": b["ownership_status"], "status": b["status"]} for b in brands],
    "categories": [{"id": c["category_id"], "brand": c["brand_id"], "name": c["category_name"],
                    "status": c["status"], "world": WORLD_MAP.get(c["category_id"], "food")} for c in categories],
    "families": [{"id": f["family_id"], "brand": f["brand_id"], "category": f["category_id"],
                  "name": f["family_name"], "status": f["status"]} for f in families],
    "products": products_out,
    "labels": labels_out,
    "associations": assoc_out,
    "sources": [{"id": s["source_id"], "url": s["url"], "publisher": s["publisher"], "tier": s["tier"],
                 "roles": s["roles"], "geography": s["geography"], "retrievedAt": s["retrieved_at"]} for s in sources],
    "competitors": competitors_out,
    "competitorProducts": competitor_products_out,
}

out_dir = ROOT / "webapp" / "src" / "data"
out_dir.mkdir(parents=True, exist_ok=True)
out_path = out_dir / "site-data.json"
out_path.write_text(json.dumps(data, ensure_ascii=False))
print(f"Wrote {out_path}, size={out_path.stat().st_size} bytes")
print(f"products={len(products_out)}, worlds={len(WORLDS)}, labels={len(labels_out)}, associations={len(assoc_out)}")
print(f"competitors={len(competitors_out)}, competitor_products={len(competitor_products_out)}")
