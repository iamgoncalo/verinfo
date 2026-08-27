import { useMemo, useState } from "react";
import type { SiteData } from "../types";
import { displaySku } from "../util";
import { IconChevRight } from "../icons";

const NL_HOURLY_WAGE = 26.90;
const NL_DISPOSABLE_INCOME = 60200;

export default function EconomicsSection({ data, onOpenProduct }: { data: SiteData; onOpenProduct: (id: string) => void }) {
  const priced = useMemo(() => data.products.filter((p) => p.prices.length > 0), [data]);
  const unpriced = data.products.length - priced.length;
  const [country, setCountry] = useState<string>("all");

  const countries = useMemo(() => {
    const set = new Set<string>();
    priced.forEach((p) => p.prices.forEach((pr) => set.add(pr.country)));
    return Array.from(set).sort();
  }, [priced]);

  const rows = useMemo(() => {
    return priced.flatMap((p) =>
      p.prices
        .filter((pr) => country === "all" || pr.country === country)
        .map((pr) => ({ product: p, price: pr }))
    );
  }, [priced, country]);

  function affordability(pr: { value: string; currency: string; country: string }) {
    if (pr.currency !== "EUR" || pr.country !== "Netherlands") return null;
    const v = parseFloat(pr.value);
    if (!v) return null;
    return {
      hours: (v / NL_HOURLY_WAGE).toFixed(1),
      incomeShare: ((v / NL_DISPOSABLE_INCOME) * 100).toFixed(2),
    };
  }

  return (
    <>
      <div className="crumbs"><span className="crumb current">Economics</span></div>
      <div className="section-sub" style={{ marginTop: -10 }}>
        {priced.length} of {data.products.length} products have a real observed price on file ({unpriced} do not — logged as gaps, not guessed).
        Full TCO (energy + consumables + 3/5-year) modeling is not built yet — this view shows real observed prices and
        NL affordability context only. Affordability is derived context, never WTP.
      </div>

      <div className="cluster-bar">
        <label>Market</label>
        <button className={"chip" + (country === "all" ? " active" : "")} onClick={() => setCountry("all")}>All</button>
        {countries.map((c) => (
          <button key={c} className={"chip" + (country === c ? " active" : "")} onClick={() => setCountry(c)}>{c}</button>
        ))}
      </div>

      <table className="simple-table row-table">
        <thead>
          <tr><th></th><th>Product</th><th>Country</th><th>Type</th><th>Value</th><th>NL affordability context</th><th></th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const aff = affordability(r.price);
            return (
              <tr key={i} className="clickable-row" onClick={() => onOpenProduct(r.product.id)}>
                <td>
                  <div className={"row-thumb" + (r.product.thumb ? "" : " row-thumb-missing")}>
                    {r.product.thumb
                      ? <img src={r.product.thumb} loading="lazy" alt={r.product.name} onError={(e) => { (e.target as HTMLElement).parentElement!.classList.add("row-thumb-missing"); (e.target as HTMLElement).style.display = "none"; }} />
                      : <span className="no-img-icon">⚠</span>}
                  </div>
                </td>
                <td>{r.product.name} <span style={{ color: "var(--text-faint)" }}>({displaySku(r.product.sku)})</span></td>
                <td>{r.price.country}</td>
                <td>{r.price.type}</td>
                <td><b>{r.price.value} {r.price.currency}</b></td>
                <td style={{ color: "var(--text-muted)" }}>
                  {aff ? `${aff.hours}h gross wages · ${aff.incomeShare}% of disposable income` : "—"}
                </td>
                <td className="row-chevron"><IconChevRight size={14} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
