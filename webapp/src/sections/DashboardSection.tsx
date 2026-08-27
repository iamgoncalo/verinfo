import { useMemo } from "react";
import type { SiteData } from "../types";
import type { Section } from "../App";
import { IconGrid, IconCoin, IconTarget, IconLayers, IconBook } from "../icons";

export default function DashboardSection({ data, onGo }: {
  data: SiteData;
  onGo: (sec: Section, scope?: { world?: string; brand?: string; category?: string }) => void;
}) {
  const kpis = useMemo(() => {
    const priced = data.products.filter((p) => p.prices.length > 0).length;
    const imaged = data.products.filter((p) => p.thumbExact).length;
    const tagRows = data.products.reduce((n, p) => n + p.tags.length, 0);
    const avgTags = tagRows / data.products.length;
    const tierA = data.sources.filter((s) => s.tier === "A").length;
    const versuniCategories = new Set(data.categories.map((c) => c.id));
    const coveredCategories = new Set(data.competitorProducts.map((cp) => cp.category));
    const categoryCoveragePct = Math.round(
      (Array.from(versuniCategories).filter((c) => coveredCategories.has(c)).length / versuniCategories.size) * 100
    );
    return {
      products: data.products.length, brands: data.brands.length, worlds: data.worlds.length,
      priced, pricedPct: Math.round((priced / data.products.length) * 100),
      imaged, imagedPct: Math.round((imaged / data.products.length) * 100),
      companies: data.competitors.length, competitorProducts: data.competitorProducts.length, categoryCoveragePct,
      avgTags, tagRows,
      sources: data.sources.length, tierA, tierAPct: Math.round((tierA / data.sources.length) * 100),
    };
  }, [data]);

  return (
    <>
      <div className="crumbs"><span className="crumb current">Dashboard</span></div>
      <div className="page-tagline">The whole intelligence machine, at a glance.</div>

      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => onGo("products")}>
          <div className="kpi-icon"><IconGrid size={18} /></div>
          <div className="kpi-number">{kpis.products}</div>
          <div className="kpi-label">Products tracked</div>
          <div className="kpi-caption">{kpis.brands} brands across {kpis.worlds} worlds</div>
        </div>

        <div className="kpi-card" onClick={() => onGo("economics")}>
          <div className="kpi-icon"><IconCoin size={18} /></div>
          <div className="kpi-number">{kpis.priced}<span className="kpi-of">/{kpis.products}</span></div>
          <div className="kpi-label">Real prices on file</div>
          <div className="coverage-bar" style={{ margin: "2px 0" }}><div className="fill" style={{ width: `${kpis.pricedPct}%` }} /></div>
          <div className="kpi-caption">{kpis.pricedPct}% coverage — gaps logged, never guessed</div>
        </div>

        <div className="kpi-card" onClick={() => onGo("competitors")}>
          <div className="kpi-icon"><IconTarget size={18} /></div>
          <div className="kpi-number">{kpis.companies}</div>
          <div className="kpi-label">Real competitors mapped</div>
          <div className="kpi-caption">{kpis.competitorProducts} products · {kpis.categoryCoveragePct}% category coverage</div>
        </div>

        <div className="kpi-card" onClick={() => onGo("products")}>
          <div className="kpi-icon"><IconGrid size={18} /></div>
          <div className="kpi-number">{kpis.imaged}<span className="kpi-of">/{kpis.products}</span></div>
          <div className="kpi-label">Verified exact-SKU photos</div>
          <div className="coverage-bar" style={{ margin: "2px 0" }}><div className="fill" style={{ width: `${kpis.imagedPct}%` }} /></div>
          <div className="kpi-caption">{kpis.imagedPct}% coverage — never a stock or invented image</div>
        </div>

        <div className="kpi-card" onClick={() => onGo("tags")}>
          <div className="kpi-icon"><IconLayers size={18} /></div>
          <div className="kpi-number">{kpis.avgTags.toFixed(1)}</div>
          <div className="kpi-label">Avg. smart tags / product</div>
          <div className="kpi-caption">{kpis.tagRows.toLocaleString()} tag facts total, each sourced or labeled as judgment</div>
        </div>

        <div className="kpi-card" onClick={() => onGo("sources")}>
          <div className="kpi-icon"><IconBook size={18} /></div>
          <div className="kpi-number">{kpis.sources}</div>
          <div className="kpi-label">Sources in the manifest</div>
          <div className="kpi-caption">{kpis.tierAPct}% Tier A — official brand domains</div>
        </div>
      </div>

      <div className="section-title" style={{ marginTop: 4 }}>Jump to a world</div>
      <div className="dash-world-row">
        {data.worlds.map((w) => {
          const n = data.products.filter((p) => p.world === w.id).length;
          return (
            <button key={w.id} className="dash-world-chip" onClick={() => onGo("products", { world: w.id })}>
              {w.name}<span>{n}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
