#!/usr/bin/env python3
"""Rebuild data/generated/versuni_products.duckdb from data/normalized/*.csv.

Disposable output — the CSVs in data/normalized/ remain authoritative.
Usage: uv run scripts/build_duckdb.py
"""
import duckdb
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NORMALIZED = ROOT / "data" / "normalized"
OUT = ROOT / "data" / "generated" / "versuni_products.duckdb"

TABLES = [
    "brands", "categories", "families", "products", "specs_long",
    "distribution", "prices", "images", "accessories",
    "digital_ecosystems", "relationships", "sources",
    "labels", "label_aliases", "associations", "product_tag_scores",
    "competitors", "competitor_products", "competitor_prices",
    "competitor_specs_long", "competitor_images", "competitor_claims",
    "competitor_certifications", "competitor_capabilities",
    "competitor_intelligence", "competitor_tco",
]


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    if OUT.exists():
        OUT.unlink()
    con = duckdb.connect(str(OUT))
    for table in TABLES:
        csv_path = NORMALIZED / f"{table}.csv"
        if not csv_path.exists():
            print(f"SKIP {table}: {csv_path} not found")
            continue
        con.execute(
            f"CREATE TABLE {table} AS SELECT * FROM read_csv(?, ALL_VARCHAR=TRUE, "
            f"delim=',', quote='\"', escape='\"', header=TRUE, "
            f"null_padding=TRUE, ignore_errors=FALSE)",
            [str(csv_path)],
        )
        n = con.execute(f"SELECT count(*) FROM {table}").fetchone()[0]
        print(f"OK {table}: {n} rows")
    con.close()
    print(f"\nBuilt {OUT}")


if __name__ == "__main__":
    main()
