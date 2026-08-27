import { useMemo, useState } from "react";
import type { SiteData } from "../types";
import { ProductGrid } from "./ProductsSection";

export default function DistributionSection({ data, onOpenProduct }: { data: SiteData; onOpenProduct: (id: string) => void }) {
  const [region, setRegion] = useState<string | null>(null);

  const byRegion = useMemo(() => {
    const g: Record<string, number> = {};
    data.products.forEach((p) => { g[p.region || "Unspecified"] = (g[p.region || "Unspecified"] || 0) + 1; });
    return Object.entries(g).sort((a, b) => b[1] - a[1]);
  }, [data]);

  const regionProducts = region ? data.products.filter((p) => (p.region || "Unspecified") === region) : [];

  return (
    <>
      <div className="crumbs"><span className="crumb current">Distribution</span></div>
      <div className="page-tagline">Where each product is sold.</div>

      <div className="grid" style={{ marginTop: 20 }}>
        {byRegion.map(([r, n]) => (
          <div key={r} className={"card folder-card" + (region === r ? "" : "")} style={region === r ? { borderColor: "var(--accent)" } : undefined} onClick={() => setRegion(r)}>
            <div className="folder-name">{r}</div>
            <div className="folder-meta">{n} product{n === 1 ? "" : "s"}</div>
          </div>
        ))}
      </div>

      {region && (
        <>
          <div className="section-title">{region} — products</div>
          <ProductGrid products={regionProducts} onOpenProduct={onOpenProduct} />
        </>
      )}
    </>
  );
}
