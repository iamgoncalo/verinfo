"""Quality gates over data/normalized/*.csv — see seeds/PROMPT_1_PRODUCT_CENSUS.md §19.

Run with: uv run pytest tests/
These tests operate on whatever rows currently exist. An empty table passes
vacuously — that is expected before research lands, not a bug to work around.
Never weaken an assertion here to make coverage look better; add the row a
correct fact instead.
"""
import csv
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
NORM = ROOT / "data" / "normalized"

PLACEHOLDER_MARKERS = ("example.com", "TBD", "xxx", "lorem", "placeholder")


def load(name):
    path = NORM / f"{name}.csv"
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


@pytest.fixture(scope="module")
def tables():
    return {
        name: load(name)
        for name in [
            "brands", "categories", "families", "products", "specs_long",
            "distribution", "prices", "images", "accessories",
            "digital_ecosystems", "relationships", "sources",
            "labels", "associations", "product_tag_scores",
            "competitors", "competitor_products", "competitor_prices",
            "competitor_specs_long", "competitor_images", "competitor_claims",
            "competitor_certifications", "competitor_capabilities",
            "competitor_intelligence", "competitor_tco",
        ]
    }


def ids(rows, key):
    return {r[key] for r in rows if r.get(key)}


def test_no_duplicate_product_ids(tables):
    seen = {}
    dupes = []
    for r in tables["products"]:
        pid = r["product_id"]
        if pid in seen:
            dupes.append(pid)
        seen[pid] = True
    assert not dupes, f"duplicate product_id values: {dupes}"


def test_no_exact_sku_collisions_within_brand_region(tables):
    seen = {}
    dupes = []
    for r in tables["products"]:
        key = (r.get("brand_id"), r.get("sku"), r.get("region"))
        if key in seen:
            dupes.append(key)
        seen[key] = True
    assert not dupes, f"duplicate (brand, sku, region) combinations: {dupes}"


def test_products_reference_known_brand_category_family(tables):
    brand_ids = ids(tables["brands"], "brand_id")
    category_ids = ids(tables["categories"], "category_id")
    family_ids = ids(tables["families"], "family_id")
    orphans = [
        r["product_id"]
        for r in tables["products"]
        if (r.get("brand_id") and r["brand_id"] not in brand_ids)
        or (r.get("category_id") and r["category_id"] not in category_ids)
        or (r.get("family_id") and r["family_id"] not in family_ids)
    ]
    assert not orphans, f"products with orphan brand/category/family refs: {orphans}"


def test_families_reference_known_brand_category(tables):
    brand_ids = ids(tables["brands"], "brand_id")
    category_ids = ids(tables["categories"], "category_id")
    orphans = [
        r["family_id"]
        for r in tables["families"]
        if (r.get("brand_id") and r["brand_id"] not in brand_ids)
        or (r.get("category_id") and r["category_id"] not in category_ids)
    ]
    assert not orphans, f"families with orphan brand/category refs: {orphans}"


def test_every_product_has_a_source(tables):
    missing = [r["product_id"] for r in tables["products"] if not r.get("source_ids")]
    assert not missing, f"products with no source_ids: {missing}"


def test_specs_have_source_unless_unknown(tables):
    bad = [
        (r["product_id"], r["field"])
        for r in tables["specs_long"]
        if r.get("epistemic_state") == "OBSERVED" and not r.get("source_id")
    ]
    assert not bad, f"OBSERVED specs missing source_id: {bad}"


def test_specs_unknown_uses_explicit_token_not_empty_string(tables):
    bad = [
        (r["product_id"], r["field"])
        for r in tables["specs_long"]
        if r.get("epistemic_state") == "UNKNOWN" and r.get("normalized_value")
    ]
    assert not bad, f"UNKNOWN specs should not carry a normalized_value: {bad}"


def test_exact_verified_images_have_source_and_no_duplicate_claim(tables):
    missing_source = [
        r["image_id"]
        for r in tables["images"]
        if r.get("verification_status") == "EXACT_VERIFIED" and not r.get("source_page")
    ]
    assert not missing_source, f"EXACT_VERIFIED images missing source_page: {missing_source}"

    by_asset = {}
    conflicts = []
    for r in tables["images"]:
        if r.get("verification_status") != "EXACT_VERIFIED" or not r.get("asset_url"):
            continue
        key = r["asset_url"]
        if key in by_asset and by_asset[key] != r.get("product_id"):
            conflicts.append((key, by_asset[key], r.get("product_id")))
        by_asset[key] = r.get("product_id")
    assert not conflicts, f"same EXACT_VERIFIED image claimed by multiple products: {conflicts}"


def test_prices_have_date_currency_source(tables):
    bad = [
        r["product_id"]
        for r in tables["prices"]
        if not (r.get("observed_at") and r.get("currency") and r.get("source_id"))
    ]
    assert not bad, f"prices missing observed_at/currency/source_id: {bad}"


def test_distribution_has_geography_and_source(tables):
    bad = [
        r.get("product_id_or_family_id")
        for r in tables["distribution"]
        if not (r.get("country") and r.get("source_id"))
    ]
    assert not bad, f"distribution rows missing country/source_id: {bad}"


def test_lineage_relationships_have_source(tables):
    bad = [
        r["relationship_id"]
        for r in tables["relationships"]
        if r.get("relationship_type") in ("PREDECESSOR_OF", "SUCCESSOR_OF")
        and not r.get("source_id")
    ]
    assert not bad, f"PREDECESSOR_OF/SUCCESSOR_OF rows missing source_id: {bad}"


def test_accessory_relationships_have_source(tables):
    bad = [r["accessory_id"] for r in tables["accessories"] if not r.get("source_id")]
    assert not bad, f"accessory rows missing source_id: {bad}"


def test_current_products_not_backed_only_by_retailer_tier(tables):
    source_tier = {r["source_id"]: r.get("tier") for r in tables["sources"]}
    bad = []
    for r in tables["products"]:
        if r.get("current_status") != "CURRENT":
            continue
        src_ids = [s for s in (r.get("source_ids") or "").split("|") if s]
        tiers = {source_tier.get(s) for s in src_ids}
        if tiers and tiers.issubset({"C", None}):
            bad.append(r["product_id"])
    assert not bad, f"CURRENT products backed only by Tier C sources: {bad}"


def test_no_placeholder_or_obviously_invalid_urls(tables):
    url_fields = {
        "products": ["official_url", "support_url", "manual_url"],
        "images": ["source_page", "asset_url"],
        "sources": ["url"],
    }
    bad = []
    for table_name, fields in url_fields.items():
        for r in tables[table_name]:
            for field in fields:
                val = r.get(field)
                if not val:
                    continue
                if any(m.lower() in val.lower() for m in PLACEHOLDER_MARKERS):
                    bad.append((table_name, field, val))
                elif not (val.startswith("http://") or val.startswith("https://")):
                    bad.append((table_name, field, val))
    assert not bad, f"placeholder or malformed URLs: {bad}"


def test_all_referenced_source_ids_exist(tables):
    known = ids(tables["sources"], "source_id")
    bad = []
    for r in tables["products"]:
        for s in (r.get("source_ids") or "").split("|"):
            if s and s not in known:
                bad.append(("products", r["product_id"], s))
    for table_name in ("specs_long", "prices", "distribution", "images",
                        "accessories", "relationships"):
        for r in tables[table_name]:
            s = r.get("source_id")
            if s and s not in known:
                bad.append((table_name, r, s))
    assert not bad, f"dangling source_id references: {bad}"


def test_cadr_and_price_values_are_non_negative(tables):
    bad = []
    for r in tables["specs_long"]:
        if r.get("field") == "cadr_m3h" and r.get("normalized_value"):
            try:
                if float(r["normalized_value"]) < 0:
                    bad.append(("specs_long", r["product_id"]))
            except ValueError:
                bad.append(("specs_long-non-numeric", r["product_id"]))
    for r in tables["prices"]:
        if r.get("value"):
            try:
                if float(r["value"]) < 0:
                    bad.append(("prices", r["product_id"]))
            except ValueError:
                bad.append(("prices-non-numeric", r["product_id"]))
    assert not bad, f"impossible negative/non-numeric values: {bad}"


def test_every_product_has_at_least_ten_tag_scores(tables):
    counts = {}
    for r in tables["product_tag_scores"]:
        counts[r["product_id"]] = counts.get(r["product_id"], 0) + 1
    known_products = ids(tables["products"], "product_id")
    under = {pid: n for pid, n in counts.items() if n < 10}
    missing = known_products - set(counts)
    assert not under, f"products with fewer than 10 tag-score rows: {under}"
    assert not missing, f"products with zero tag-score rows: {missing}"


def test_tag_scores_are_in_range_and_have_a_declared_basis(tables):
    bad_range, bad_basis = [], []
    allowed_basis = {"RULE_DERIVED", "ESTIMATED_JUDGMENT", "CANDIDATE"}
    for r in tables["product_tag_scores"]:
        try:
            score = float(r["score"])
            if not (0 <= score <= 10):
                bad_range.append((r["product_id"], r["tag"], r["score"]))
        except ValueError:
            bad_range.append((r["product_id"], r["tag"], r["score"]))
        if r.get("basis") not in allowed_basis:
            bad_basis.append((r["product_id"], r["tag"], r.get("basis")))
    assert not bad_range, f"tag scores outside 0-10: {bad_range}"
    assert not bad_basis, f"tag-score rows with an undeclared/invalid basis: {bad_basis}"


# ---- Competitor intelligence layer -----------------------------------

def _all_source_ids(tables):
    known = ids(tables["sources"], "source_id")
    out = set()
    for r in tables["competitors"] + tables["competitor_products"]:
        for sid in (r.get("source_ids") or "").split("|"):
            if sid:
                out.add(sid)
    for name in ["competitor_prices", "competitor_specs_long", "competitor_images",
                 "competitor_claims", "competitor_certifications",
                 "competitor_capabilities", "competitor_intelligence", "competitor_tco"]:
        for r in tables[name]:
            sid = r.get("source_id")
            if sid:
                out.add(sid)
    return out, known


def test_competitor_source_ids_resolve(tables):
    used, known = _all_source_ids(tables)
    dangling = used - known
    assert not dangling, f"competitor source_ids with no matching row in sources.csv: {dangling}"


def test_competitor_products_reference_known_competitors_and_categories(tables):
    competitor_ids = ids(tables["competitors"], "competitor_id")
    category_ids = ids(tables["categories"], "category_id")
    bad_competitor, bad_category = [], []
    for r in tables["competitor_products"]:
        if r["competitor_id"] not in competitor_ids:
            bad_competitor.append((r["competitor_product_id"], r["competitor_id"]))
        if r["versuni_category_id"] not in category_ids:
            bad_category.append((r["competitor_product_id"], r["versuni_category_id"]))
    assert not bad_competitor, f"competitor_products with an unknown competitor_id: {bad_competitor}"
    assert not bad_category, f"competitor_products with an unknown versuni_category_id: {bad_category}"


def test_competitor_products_have_valid_positioning(tables):
    allowed = {"DIRECT", "ADJACENT", "SUBSTITUTE"}
    bad = [(r["competitor_product_id"], r.get("positioning")) for r in tables["competitor_products"]
           if r.get("positioning") not in allowed]
    assert not bad, f"competitor_products with an invalid positioning class: {bad}"


def test_competitor_prices_reference_known_products_and_have_currency(tables):
    known = ids(tables["competitor_products"], "competitor_product_id")
    bad_ref, bad_currency, bad_value = [], [], []
    for r in tables["competitor_prices"]:
        if r["competitor_product_id"] not in known:
            bad_ref.append(r["competitor_product_id"])
        if not r.get("currency"):
            bad_currency.append(r["competitor_product_id"])
        try:
            if float(r["value"]) < 0:
                bad_value.append(r["competitor_product_id"])
        except ValueError:
            bad_value.append(r["competitor_product_id"])
    assert not bad_ref, f"competitor_prices referencing an unknown competitor_product_id: {bad_ref}"
    assert not bad_currency, f"competitor_prices missing a currency (native currency must be preserved): {bad_currency}"
    assert not bad_value, f"competitor_prices with a negative/non-numeric value: {bad_value}"


def test_competitor_images_have_valid_match_state(tables):
    allowed = {"VERIFIED_EXACT", "VERIFIED_FAMILY", "VERIFIED_MARKET_VARIANT", "UNSURE", "MISSING"}
    bad = [(r["image_id"], r.get("match_state")) for r in tables["competitor_images"]
           if r.get("match_state") not in allowed]
    assert not bad, f"competitor_images with an invalid match_state: {bad}"


def test_competitor_claims_have_valid_corroboration_state(tables):
    allowed = {"CORROBORATED", "NOT_FOUND", "CONTRADICTED"}
    bad = [(r["claim_id"], r.get("independent_corroboration")) for r in tables["competitor_claims"]
           if r.get("independent_corroboration") not in allowed]
    assert not bad, f"competitor_claims with an invalid independent_corroboration state: {bad}"


def test_competitor_capabilities_use_the_same_ontology_as_versuni_tag_scores(tables):
    # competitor_capabilities.csv deliberately mirrors product_tag_scores.csv's shape
    # (realm, tag, score, basis) so a competitor row and a Versuni row on the same
    # (realm, tag) pair are directly comparable -- see TAG_SCORING_RULES.md.
    allowed_realm = {"SPACE", "MEDIUM", "CAPABILITY", "INTELLIGENCE", "DIGITAL",
                      "MAINTENANCE", "ECONOMIC", "LIFECYCLE", "USER_JOB", "NEED"}
    allowed_basis = {"RULE_DERIVED", "ESTIMATED_JUDGMENT", "CANDIDATE"}
    bad_realm, bad_basis, bad_score = [], [], []
    for r in tables["competitor_capabilities"]:
        if r.get("realm") not in allowed_realm:
            bad_realm.append((r["competitor_product_id"], r.get("realm")))
        if r.get("basis") not in allowed_basis:
            bad_basis.append((r["competitor_product_id"], r.get("basis")))
        try:
            score = float(r["score"])
            if not (0 <= score <= 10):
                bad_score.append((r["competitor_product_id"], r["tag"], r["score"]))
        except ValueError:
            bad_score.append((r["competitor_product_id"], r["tag"], r["score"]))
    assert not bad_realm, f"competitor_capabilities with a realm outside the shared Versuni ontology: {bad_realm}"
    assert not bad_basis, f"competitor_capabilities with an invalid basis: {bad_basis}"
    assert not bad_score, f"competitor_capabilities scores outside 0-10: {bad_score}"


def test_competitor_capabilities_reference_known_products(tables):
    known = ids(tables["competitor_products"], "competitor_product_id")
    bad = [r["competitor_product_id"] for r in tables["competitor_capabilities"] if r["competitor_product_id"] not in known]
    assert not bad, f"competitor_capabilities referencing an unknown competitor_product_id: {bad}"


def test_competitor_intelligence_has_valid_dimension_and_status(tables):
    allowed_dim = {"SENSE", "REACT", "ADAPT", "PREDICT", "LEARN", "COORDINATE"}
    allowed_status = {"EVIDENCED", "UNKNOWN"}
    bad_dim, bad_status = [], []
    for r in tables["competitor_intelligence"]:
        if r.get("dimension") not in allowed_dim:
            bad_dim.append((r["competitor_product_id"], r.get("dimension")))
        if r.get("status") not in allowed_status:
            bad_status.append((r["competitor_product_id"], r.get("status")))
    assert not bad_dim, f"competitor_intelligence with an invalid dimension: {bad_dim}"
    assert not bad_status, f"competitor_intelligence with an invalid status (must be EVIDENCED or UNKNOWN, never inferred): {bad_status}"


def test_competitor_tco_has_valid_completeness_state(tables):
    allowed = {"COMPLETE", "PARTIAL"}
    bad = [(r["competitor_product_id"], r.get("completeness_state")) for r in tables["competitor_tco"]
           if r.get("completeness_state") not in allowed]
    assert not bad, f"competitor_tco rows with an invalid completeness_state: {bad}"


def test_no_duplicate_competitor_ids(tables):
    seen, dupes = set(), []
    for r in tables["competitors"]:
        cid = r["competitor_id"]
        if cid in seen:
            dupes.append(cid)
        seen.add(cid)
    assert not dupes, f"duplicate competitor_id: {dupes}"


def test_no_duplicate_competitor_product_ids(tables):
    seen, dupes = set(), []
    for r in tables["competitor_products"]:
        pid = r["competitor_product_id"]
        if pid in seen:
            dupes.append(pid)
        seen.add(pid)
    assert not dupes, f"duplicate competitor_product_id: {dupes}"


def test_competitor_official_urls_are_https(tables):
    bad = [r["competitor_product_id"] for r in tables["competitor_products"]
           if r.get("official_url") and not r["official_url"].startswith("https://")]
    bad += [r["competitor_id"] for r in tables["competitors"]
            if r.get("official_domain") and (" " in r["official_domain"] or "http" in r["official_domain"])]
    assert not bad, f"competitor rows with a non-https official_url or a domain field that looks like a full URL: {bad}"


def test_competitors_have_hq_country_or_explicit_gap(tables):
    # A competitor with zero HQ info and no ownership_notes explaining the gap is silently incomplete.
    bad = [r["competitor_id"] for r in tables["competitors"]
           if not r.get("hq_country") and not r.get("ownership_notes")]
    assert not bad, f"competitors with no hq_country AND no gap note explaining why: {bad}"


def test_competitors_have_valid_logo_state(tables):
    allowed = {"VERIFIED_OFFICIAL", "FAVICON_FALLBACK", "MISSING"}
    bad = [(r["competitor_id"], r.get("logo_state")) for r in tables["competitors"]
           if r.get("logo_state") not in allowed]
    assert not bad, f"competitors with an invalid logo_state: {bad}"


def test_competitor_logo_urls_are_https_or_local(tables):
    bad = [r["competitor_id"] for r in tables["competitors"]
           if r.get("logo_url") and not (r["logo_url"].startswith("https://") or r["logo_url"].startswith("/logos/"))]
    assert not bad, f"competitors with a logo_url that is neither https nor a local /logos/ path: {bad}"


def test_local_logo_files_exist_on_disk(tables):
    logos_dir = ROOT / "webapp" / "public" / "logos"
    missing = []
    for r in tables["competitors"]:
        url = r.get("logo_url", "")
        if url.startswith("/logos/"):
            if not (logos_dir / url.removeprefix("/logos/")).exists():
                missing.append((r["competitor_id"], url))
    assert not missing, f"competitors referencing a local logo file that doesn't exist on disk: {missing}"


def test_no_placeholder_text_in_competitor_tables(tables):
    bad = []
    for name in ["competitors", "competitor_products"]:
        for r in tables[name]:
            for k, v in r.items():
                if v and any(m.lower() in v.lower() for m in PLACEHOLDER_MARKERS):
                    bad.append((name, k, v))
    assert not bad, f"placeholder text found in competitor tables: {bad}"
