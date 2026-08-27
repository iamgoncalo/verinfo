import { useMemo, useState } from "react";
import siteData from "../data/site-data.json";
import type { SiteData } from "../types";

const DATA = siteData as unknown as SiteData;

export default function SourcesSection() {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<string>("all");

  const filtered = useMemo(() => {
    return DATA.sources.filter((s) => {
      if (tier !== "all" && s.tier !== tier) return false;
      if (q && !(s.publisher.toLowerCase().includes(q.toLowerCase()) || s.url.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [q, tier]);

  const tierCounts = useMemo(() => {
    const c: Record<string, number> = {};
    DATA.sources.forEach((s) => { c[s.tier] = (c[s.tier] || 0) + 1; });
    return c;
  }, []);

  return (
    <>
      <div className="crumbs"><span className="crumb current">Sources</span></div>
      <div className="page-tagline">Every claim, traced to source.</div>
      <details className="page-details">
        <summary>Details</summary>
        <div className="section-sub">
          {DATA.sources.length} sources in the manifest — {tierCounts["A"] || 0} Tier A (official brand domains), {tierCounts["B"] || 0} Tier B (retailer/distributor), {tierCounts["C"] || 0} Tier C (discovery-only).
        </div>
      </details>
      <div className="cluster-bar">
        <label>Tier</label>
        {["all", "A", "B", "C"].map((t) => (
          <button key={t} className={"chip" + (tier === t ? " active" : "")} onClick={() => setTier(t)}>{t === "all" ? "All" : `Tier ${t}`}</button>
        ))}
        <input
          placeholder="Filter by publisher or URL…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ marginLeft: "auto", padding: "7px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, minWidth: 260 }}
        />
      </div>
      <table className="simple-table">
        <thead><tr><th>Publisher</th><th>Tier</th><th>Roles</th><th>Geography</th><th>URL</th></tr></thead>
        <tbody>
          {filtered.slice(0, 300).map((s) => (
            <tr key={s.id}>
              <td>{s.publisher}</td>
              <td><span className={"badge " + (s.tier === "A" ? "RULE_DERIVED" : "neutral")}>{s.tier}</span></td>
              <td style={{ color: "var(--text-muted)" }}>{s.roles.replace(/\|/g, ", ")}</td>
              <td style={{ color: "var(--text-muted)" }}>{s.geography || "—"}</td>
              <td><a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>{s.url.length > 60 ? s.url.slice(0, 60) + "…" : s.url}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length > 300 && <div className="section-sub">Showing first 300 of {filtered.length} matches.</div>}
    </>
  );
}
