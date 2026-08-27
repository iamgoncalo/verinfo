.PHONY: clean all test verify duckdb

clean:
	rm -f data/generated/versuni_products.duckdb
	rm -rf .pytest_cache

duckdb:
	uv run scripts/build_duckdb.py

all: duckdb

test:
	uv run pytest tests/ -v

verify: all test
	@echo "verify: OK"
