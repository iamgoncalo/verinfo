import { useMemo } from "react";
import type { SiteData } from "../types";
import { ProductGrid } from "./ProductsSection";
import type { Section } from "../App";

export default function SearchResults({
  data, query, onOpenProduct, onGo,
}: {
  data: SiteData;
  query: string;
  onOpenProduct: (id: string) => void;
  onGo: (sec: Section, scope?: { world?: string; brand?: string; category?: string }) => void;
}) {
  const q = query.toLowerCase();

  const products = useMemo(() => data.products.filter((p) =>
    p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) || p.region.toLowerCase().includes(q) ||
    p.specs.some((s) => s.field.toLowerCase().includes(q) || s.value.toLowerCase().includes(q))
  ), [data, q]);

  const brands = useMemo(() => data.brands.filter((b) => b.name.toLowerCase().includes(q)), [data, q]);
  const categories = useMemo(() => data.categories.filter((c) => c.name.toLowerCase().includes(q)), [data, q]);
  const labels = useMemo(() => data.labels.filter((l) => l.name.toLowerCase().includes(q) || l.definition.toLowerCase().includes(q)), [data, q]);

  return (
    <>
      <div className="section-title" style={{ marginTop: 0 }}>Search results for "{query}"</div>

      {brands.length > 0 && (
        <div className="cluster-group">
          <h3>Brands <span className="n">{brands.length}</span></h3>
          <div className="grid">
            {brands.map((b) => (
              <div key={b.id} className="card folder-card" onClick={() => onGo("products", { brand: b.id })}>
                <div className="folder-name">{b.name}</div>
                <div className="folder-meta">{b.domain}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="cluster-group">
          <h3>Categories <span className="n">{categories.length}</span></h3>
          <div className="grid">
            {categories.map((c) => (
              <div key={c.id} className="card folder-card" onClick={() => onGo("products", { category: c.id })}>
                <div className="folder-name">{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {labels.length > 0 && (
        <div className="cluster-group">
          <h3>Labels <span className="n">{labels.length}</span></h3>
          <div className="pill-list">
            {labels.map((l) => <span key={l.id} className={"pill" + (l.status === "CANDIDATE" ? " candidate" : "")}>{l.name}</span>)}
          </div>
        </div>
      )}

      <div className="cluster-group">
        <h3>Products <span className="n">{products.length}</span></h3>
        <ProductGrid products={products} onOpenProduct={onOpenProduct} />
      </div>
    </>
  );
}
