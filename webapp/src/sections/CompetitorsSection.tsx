import { useMemo, useState } from "react";
import type { SiteData, Competitor, CompetitorProduct, Positioning, Product } from "../types";
import { IconTarget, IconClose } from "../icons";
import { displaySku } from "../util";

export const POSITION_META: Record<Positioning, { color: string; bg: string; label: string }> = {
  DIRECT: { color: "#b3261e", bg: "#fdf1ef", label: "Direct" },
  ADJACENT: { color: "#9a6a12", bg: "#faf1de", label: "Adjacent" },
  SUBSTITUTE: { color: "#3538cd", bg: "#eef2ff", label: "Substitute" },
};

export const FLAG: Record<string, string> = {
  "United States": "🇺🇸", Germany: "🇩🇪", China: "🇨🇳", France: "🇫🇷",
  "South Korea": "🇰🇷", Switzerland: "🇨🇭", Sweden: "🇸🇪", India: "🇮🇳",
  Singapore: "🇸🇬", Netherlands: "🇳🇱", Italy: "🇮🇹", Australia: "🇦🇺",
  "United Kingdom": "🇬🇧", Canada: "🇨🇦", Brazil: "🇧🇷", Belgium: "🇧🇪", Japan: "🇯🇵",
};

export function CompanyLogo({ c, size = 36 }: { c: Competitor; size?: number }) {
  const [failed, setFailed] = useState(false);
  const initials = c.name.replace(/\(.+?\)/g, "").trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  if (!c.logoUrl || failed) {
    return (
      <div className="company-logo-fallback" style={{ width: size, height: size, fontSize: size * 0.36 }} title={c.name}>
        {initials}
      </div>
    );
  }
  return (
    <img
      src={c.logoUrl}
      alt={c.name}
      className={"company-logo-img" + (c.logoBg === "dark" ? " logo-bg-dark" : "")}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}

function firstPrice(p: CompetitorProduct) {
  return p.prices.find((x) => x.type === "OFFICIAL_PRICE") || p.prices[0];
}

type ModeT = "overview" | "battle" | "map" | "matrix" | "rankings" | "timeline";

export default function CompetitorsSection({ data, onOpenProduct, preset }: {
  data: SiteData; onOpenProduct: (id: string) => void; preset?: { world?: string } | null;
}) {
  const [world, setWorld] = useState<string>(preset?.world ?? "all");
  const [mode, setMode] = useState<ModeT>("overview");
  const [openCompanyId, setOpenCompanyId] = useState<string | null>(null);

  const competitorsById = useMemo(() => Object.fromEntries(data.competitors.map((c) => [c.id, c])), [data]);

  const worldsWithCoverage = useMemo(() => {
    const set = new Set(data.competitorProducts.map((p) => p.world));
    return data.worlds.filter((w) => set.has(w.id));
  }, [data]);

  const scoped = useMemo(
    () => data.competitorProducts.filter((p) => world === "all" || p.world === world),
    [data, world]
  );

  const stats = useMemo(() => {
    const companies = new Set(scoped.map((p) => p.competitor));
    return {
      companies: companies.size,
      products: scoped.length,
      priceObs: scoped.reduce((n, p) => n + p.prices.length, 0),
      direct: scoped.filter((p) => p.positioning === "DIRECT").length,
      adjacent: scoped.filter((p) => p.positioning === "ADJACENT").length,
      substitute: scoped.filter((p) => p.positioning === "SUBSTITUTE").length,
    };
  }, [scoped]);

  if (!data.competitorProducts.length) {
    return (
      <>
        <div className="crumbs"><span className="crumb current">Arena</span></div>
        <div className="empty-state" style={{ maxWidth: 520, margin: "60px auto" }}>
          <IconTarget size={40} />
          <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Research in progress</div>
          <div>Competitor research agents are running now. This section will populate as each world's sourced results land.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="crumbs"><span className="crumb current">Arena</span></div>
      <div className="page-tagline">Versuni compared against real competitors.</div>

      <div className="tags-header">
        <div className="section-sub" style={{ marginTop: 0, marginBottom: 0, maxWidth: 620 }}>
          Who competes with Versuni, at what price, positioned how. Every price and company location traces to an
          official source — see <b>COMPETITOR_POLICY.md</b>. Coverage so far:{" "}
          {worldsWithCoverage.map((w) => w.name).join(", ") || "none yet"}.
        </div>
        <div className="tags-stat-row">
          <div className="tags-stat"><b>{stats.companies}</b>companies</div>
          <div className="tags-stat"><b>{stats.products}</b>products</div>
          <div className="tags-stat"><b>{stats.priceObs}</b>prices</div>
        </div>
      </div>

      <div className="cluster-bar" style={{ marginTop: 18 }}>
        <label>World</label>
        <button className={"chip" + (world === "all" ? " active" : "")} onClick={() => setWorld("all")}>All</button>
        {worldsWithCoverage.map((w) => (
          <button key={w.id} className={"chip" + (world === w.id ? " active" : "")} onClick={() => setWorld(w.id)}>
            {w.name}
          </button>
        ))}
      </div>

      <div className="cluster-bar">
        <div className="distilled-toggle">
          <button className={mode === "overview" ? "active" : ""} onClick={() => setMode("overview")}>Overview</button>
          <button className={mode === "battle" ? "active" : ""} onClick={() => setMode("battle")}>Battle</button>
          <button className={mode === "map" ? "active" : ""} onClick={() => setMode("map")}>Map</button>
          <button className={mode === "matrix" ? "active" : ""} onClick={() => setMode("matrix")}>Matrix</button>
          <button className={mode === "rankings" ? "active" : ""} onClick={() => setMode("rankings")}>Rankings</button>
          <button className={mode === "timeline" ? "active" : ""} onClick={() => setMode("timeline")}>Timeline</button>
        </div>
        <span className="realm-ring-sub" style={{ marginLeft: 4 }}>
          {POSITION_META.DIRECT.label} {stats.direct} · {POSITION_META.ADJACENT.label} {stats.adjacent} · {POSITION_META.SUBSTITUTE.label} {stats.substitute}
        </span>
      </div>

      {mode === "overview" && <OverviewMode data={data} scoped={scoped} competitorsById={competitorsById} world={world} onOpenCompany={setOpenCompanyId} />}
      {mode === "battle" && <BattleMode data={data} scoped={scoped} competitorsById={competitorsById} onOpenProduct={onOpenProduct} />}
      {mode === "map" && <MapMode scoped={scoped} competitorsById={competitorsById} />}
      {mode === "matrix" && <MatrixMode data={data} scoped={scoped} competitorsById={competitorsById} />}
      {mode === "rankings" && <RankingsMode scoped={scoped} competitorsById={competitorsById} world={world} />}
      {mode === "timeline" && <TimelineGap />}

      {mode !== "overview" && (
        <>
          <div className="section-title">Companies</div>
          <div className="company-card-grid">
            {data.competitors
              .filter((c) => world === "all" || scoped.some((p) => p.competitor === c.id))
              .map((c) => (
                <CompanyCard key={c.id} c={c} productCount={scoped.filter((p) => p.competitor === c.id).length} onClick={() => setOpenCompanyId(c.id)} />
              ))}
          </div>
        </>
      )}

      {openCompanyId && (
        <CompanyProfileDrawer
          data={data}
          competitor={data.competitors.find((c) => c.id === openCompanyId)!}
          onClose={() => setOpenCompanyId(null)}
          onOpenProduct={onOpenProduct}
        />
      )}
    </>
  );
}

function CompanyCard({ c, productCount, onClick }: { c: Competitor; productCount: number; onClick: () => void }) {
  return (
    <div className="company-card" onClick={onClick}>
      <div className="company-card-top">
        <CompanyLogo c={c} />
        <div>
          <div className="company-card-name">{c.name}</div>
          <div className="company-card-hq">
            {FLAG[c.hqCountry] || ""} {c.hqCity ? `${c.hqCity}, ` : ""}{c.hqCountry || "HQ not verified"}
          </div>
        </div>
      </div>
      {c.parentCompany && <div className="company-card-parent">Owned by {c.parentCompany}</div>}
      <div className="company-card-foot">
        <span>{c.domain}</span>
        <span>{productCount} product{productCount === 1 ? "" : "s"}</span>
      </div>
    </div>
  );
}

function OverviewMode({ data, scoped, competitorsById, world, onOpenCompany }: {
  data: SiteData; scoped: CompetitorProduct[]; competitorsById: Record<string, Competitor>; world: string;
  onOpenCompany: (id: string) => void;
}) {
  const [countryFilter, setCountryFilter] = useState<string | null>(null);

  const activeCompanies = useMemo(() => {
    const inScope = new Set(scoped.map((p) => p.competitor));
    return data.competitors.filter((c) => world === "all" || inScope.has(c.id));
  }, [data, scoped, world]);

  const byCountry = useMemo(() => {
    const m = new Map<string, Competitor[]>();
    activeCompanies.forEach((c) => {
      const key = c.hqCountry || "Unverified";
      const list = m.get(key) || [];
      list.push(c);
      m.set(key, list);
    });
    return Array.from(m.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [activeCompanies]);

  const topByCoverage = useMemo(() => {
    const counts = new Map<string, number>();
    scoped.forEach((p) => counts.set(p.competitor, (counts.get(p.competitor) || 0) + 1));
    if (countryFilter) {
      // Country view is an identity listing, not just a coverage ranking -- include every
      // company HQ'd there even with 0 products, so the count matches the geo-card exactly
      // (e.g. GARDENA has 0 competing products on file but is still a real German company).
      return activeCompanies
        .filter((c) => (c.hqCountry || "Unverified") === countryFilter)
        .map((c) => ({ c, n: counts.get(c.id) || 0 }))
        .sort((a, b) => b.n - a.n);
    }
    return Array.from(counts.entries())
      .map(([id, n]) => ({ c: competitorsById[id], n }))
      .filter((x): x is { c: Competitor; n: number } => !!x.c)
      .sort((a, b) => b.n - a.n)
      .slice(0, 12);
  }, [scoped, competitorsById, countryFilter, activeCompanies]);

  const logoCoverage = activeCompanies.length
    ? Math.round((activeCompanies.filter((c) => c.logoState === "VERIFIED_OFFICIAL").length / activeCompanies.length) * 100)
    : 0;

  return (
    <>
      <div className="section-title" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
        <span>{countryFilter ? `Companies in ${countryFilter}` : "Who shows up most"}</span>
        {countryFilter && <button className="chip active" onClick={() => setCountryFilter(null)}>Clear ✕</button>}
      </div>
      <div className="section-sub" style={{ marginTop: -6 }}>
        {countryFilter
          ? `${topByCoverage.length} compan${topByCoverage.length === 1 ? "y" : "ies"} headquartered in ${countryFilter}. Click any card for its full profile.`
          : "Companies ranked by how many competing products they have in this scope. Click any card for its full profile."}
      </div>
      <div className="standout-company-grid">
        {topByCoverage.map(({ c, n }) => (
          <div key={c.id} className="standout-company-card" onClick={() => onOpenCompany(c.id)}>
            <CompanyLogo c={c} size={44} />
            <div className="standout-company-name">{c.name}</div>
            <div className="standout-company-meta">{FLAG[c.hqCountry] || ""} {c.hqCountry}</div>
            <div className="standout-company-n">{n} product{n === 1 ? "" : "s"}</div>
          </div>
        ))}
      </div>

      {logoCoverage < 100 && (
        <div className="section-sub" style={{ marginTop: 4 }}>
          Logo coverage: {logoCoverage}% verified-official so far — companies without a confirmed logo show their
          initials instead of a placeholder image, never an invented mark.
        </div>
      )}

      <div className="section-title" style={{ marginTop: 20 }}>Where they're located</div>
      <div className="section-sub" style={{ marginTop: -6 }}>
        {activeCompanies.length} real companies, grouped by headquarters country — every HQ traces to that
        company's own official page (see COMPETITOR_POLICY.md), independently re-checked in a hostile audit pass.
        Click a country to filter the company list above to just its companies.
      </div>
      <div className="geo-grid">
        {byCountry.map(([country, comps]) => (
          <div
            key={country}
            className={"geo-card" + (countryFilter === country ? " active" : "")}
            onClick={() => setCountryFilter((cur) => (cur === country ? null : country))}
          >
            <div className="geo-flag">{FLAG[country] || "🏳"}</div>
            <div className="geo-country">{country}</div>
            <div className="geo-count">{comps.length} compan{comps.length === 1 ? "y" : "ies"}</div>
            <div className="geo-logos">
              {comps.slice(0, 5).map((c) => <CompanyLogo key={c.id} c={c} size={36} />)}
              {comps.length > 5 && <span className="geo-more">+{comps.length - 5}</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function BattleMode({ data, scoped, competitorsById, onOpenProduct }: {
  data: SiteData; scoped: CompetitorProduct[]; competitorsById: Record<string, Competitor>; onOpenProduct: (id: string) => void;
}) {
  const [rightId, setRightId] = useState<string>(scoped[0]?.id || "");
  const right = scoped.find((p) => p.id === rightId) || scoped[0];
  const [viewMode, setViewMode] = useState<"distilled" | "raw">("distilled");

  const versuniOptions = useMemo(() => {
    if (!right) return [];
    return data.products.filter((p) => p.category === right.category);
  }, [data, right]);
  const [leftId, setLeftId] = useState<string>("");
  const left = versuniOptions.find((p) => p.id === leftId) || versuniOptions[0];

  // Closest real competitor to `left`, computed independently of whatever is
  // currently selected as `right` -- so Distilled can say whether the user's
  // pick actually is the closest one, or a different one is.
  const closestCompetitor = useMemo(() => {
    if (!left) return null;
    const lp = left.prices?.[0];
    const candidates = scoped.filter((p) => p.category === left.category && p.positioning === "DIRECT");
    if (!candidates.length) return null;
    if (!lp) return candidates[0];
    const lv = parseFloat(lp.value);
    const withDelta = candidates
      .map((c) => {
        const cp = firstPrice(c);
        if (!cp || cp.currency !== lp.currency) return null;
        const cv = parseFloat(cp.value);
        if (isNaN(cv)) return null;
        return { c, delta: Math.abs(cv - lv) };
      })
      .filter((x): x is { c: CompetitorProduct; delta: number } => x !== null);
    if (!withDelta.length) return candidates[0];
    return withDelta.sort((a, b) => a.delta - b.delta)[0].c;
  }, [scoped, left]);

  if (!right) return <div className="empty-state">No products in this world yet.</div>;

  const rightPrice = firstPrice(right);
  const leftPrice = left?.prices?.[0];
  const rightCompany = competitorsById[right.competitor];

  let priceVerdict = "INSUFFICIENT EVIDENCE";
  if (leftPrice && rightPrice && leftPrice.currency === rightPrice.currency) {
    const lv = parseFloat(leftPrice.value), rv = parseFloat(rightPrice.value);
    if (!isNaN(lv) && !isNaN(rv)) {
      priceVerdict = lv < rv ? "VERSUNI LOWER" : lv > rv ? "COMPETITOR LOWER" : "TIE";
    }
  } else if (leftPrice && rightPrice) {
    priceVerdict = "INCOMPARABLE (different currency)";
  }

  // Capability gap: only real where both sides have a scored row on the same (realm, tag) --
  // never inferred, never padded to look complete.
  const leftTagMap = new Map((left?.tags || []).map((t) => [`${t.realm}::${t.tag}`, t]));
  const rightCapMap = new Map((right.capabilities || []).map((t) => [`${t.realm}::${t.tag}`, t]));
  const sharedKeys = Array.from(new Set([...leftTagMap.keys(), ...rightCapMap.keys()]));
  const competitorBetter: { realm: string; tag: string; l: number; r: number }[] = [];
  const versuniBetter: { realm: string; tag: string; l: number; r: number }[] = [];
  sharedKeys.forEach((k) => {
    const l = leftTagMap.get(k), r = rightCapMap.get(k);
    if (l && r) {
      if (r.score > l.score + 0.5) competitorBetter.push({ realm: r.realm, tag: r.tag, l: l.score, r: r.score });
      else if (l.score > r.score + 0.5) versuniBetter.push({ realm: l.realm, tag: l.tag, l: l.score, r: r.score });
    }
  });
  const hasCapabilityData = leftTagMap.size > 0 || rightCapMap.size > 0;
  const hasSharedCapabilityData = sharedKeys.some((k) => leftTagMap.has(k) && rightCapMap.has(k));

  return (
    <div className="battle-wrap">
      <div className="distilled-toggle" style={{ marginBottom: 14 }}>
        <button className={viewMode === "distilled" ? "active" : ""} onClick={() => setViewMode("distilled")}>Distilled</button>
        <button className={viewMode === "raw" ? "active" : ""} onClick={() => setViewMode("raw")}>Raw</button>
      </div>
      <div className="battle-pickers">
        <select className="battle-select" value={left?.id || ""} onChange={(e) => setLeftId(e.target.value)}>
          {versuniOptions.map((p) => <option key={p.id} value={p.id}>{p.name} ({displaySku(p.sku)})</option>)}
        </select>
        <span className="battle-vs">VS</span>
        <select className="battle-select" value={right.id} onChange={(e) => setRightId(e.target.value)}>
          {scoped.map((p) => <option key={p.id} value={p.id}>{competitorsById[p.competitor]?.name} — {p.name}</option>)}
        </select>
      </div>

      <div className="battle-grid">
        <BattleCard
          title={left?.name || "Select a Versuni product"}
          sub={left ? `Versuni · ${displaySku(left.sku)}` : ""}
          img={left?.thumb || null}
          price={leftPrice ? `${leftPrice.value} ${leftPrice.currency}` : "No price on file"}
          priceNote={leftPrice?.country}
          onClick={left ? () => onOpenProduct(left.id) : undefined}
        />
        <BattleCard
          title={right.name}
          sub={`${rightCompany?.name || right.competitor} · ${right.model}`}
          img={right.thumb}
          price={rightPrice ? `${rightPrice.value} ${rightPrice.currency}` : "No price on file"}
          priceNote={rightPrice?.country}
          badge={POSITION_META[right.positioning]}
          logo={rightCompany}
          onClick={() => window.open(right.url, "_blank")}
        />
      </div>

      <div className="battle-verdict-row">
        <span className="battle-dim">Price</span>
        <span className="verdict-badge">{priceVerdict}</span>
        <span className="battle-evidence">
          {leftPrice ? `Versuni: ${leftPrice.value} ${leftPrice.currency} (${leftPrice.country})` : "Versuni: no price on file"}
          {" · "}
          {rightPrice ? `${rightCompany?.name}: ${rightPrice.value} ${rightPrice.currency} (${rightPrice.country})` : "no price on file"}
        </span>
      </div>
      <div className="battle-verdict-row">
        <span className="battle-dim">Positioning</span>
        <span className="verdict-badge" style={{ color: POSITION_META[right.positioning].color, background: POSITION_META[right.positioning].bg }}>
          {POSITION_META[right.positioning].label}
        </span>
        <span className="battle-evidence">{right.notes || "No additional positioning note recorded."}</span>
      </div>

      {viewMode === "distilled" && (
        <DistilledPanel
          left={left} right={right} rightCompany={rightCompany} priceVerdict={priceVerdict}
          competitorBetter={competitorBetter} versuniBetter={versuniBetter}
          hasCapabilityData={hasCapabilityData} hasSharedCapabilityData={hasSharedCapabilityData}
          closestCompetitor={closestCompetitor} competitorsById={competitorsById}
          onPickClosest={() => setRightId(closestCompetitor!.id)}
        />
      )}

      {viewMode === "raw" && (right.specs.length > 0 || left?.specs?.length) && (
        <>
          <div className="section-title">Specifications on file</div>
          <div className="kv-grid">
            {right.specs.map((s, i) => (
              <div className="kv-cell" key={i}>
                <div className="k">{s.field.replace(/_/g, " ")} <span style={{ color: "var(--text-faint)" }}>(competitor)</span></div>
                <div className="v">{s.value}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === "raw" && right.tco.length > 0 && (
        <>
          <div className="section-title">Total cost of ownership</div>
          {right.tco.map((t, i) => (
            <div key={i}>
              <div className="section-sub" style={{ marginTop: -6 }}>
                {t.market} · {t.completeness === "PARTIAL" ? "Partial — a real recurring cost exists that isn't captured, see note" : "Purchase price + filter replacements over time"}
              </div>
              <div className="tco-row">
                <div className="tco-cell"><span className="tco-label">1 year</span><span className="tco-value">{t.tco1y} {t.currency}</span></div>
                <div className="tco-cell"><span className="tco-label">3 years</span><span className="tco-value">{t.tco3y} {t.currency}</span></div>
                <div className="tco-cell"><span className="tco-label">5 years</span><span className="tco-value">{t.tco5y} {t.currency}</span></div>
              </div>
              <div className="claim-limitation" style={{ marginTop: 8 }}>{t.assumptions}</div>
            </div>
          ))}
        </>
      )}

      {viewMode === "raw" && right.certifications.length > 0 && (
        <>
          <div className="section-title">Certification</div>
          <div className="cert-list">
            {right.certifications.map((c, i) => (
              <div className="cert-row" key={i}>
                <span className={"cert-badge " + (c.status === "CONFIRMED_IN_REGISTRY" ? "confirmed" : "notfound")}>
                  {c.status === "CONFIRMED_IN_REGISTRY" ? "Confirmed" : "Not found"}
                </span>
                <span className="cert-body">{c.body}</span>
                <span className="claim-limitation" style={{ flex: 1 }}>{c.establishes}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === "raw" && right.intelligence.length > 0 && (
        <>
          <div className="section-title">Intelligence classification</div>
          <div className="section-sub" style={{ marginTop: -6 }}>
            "Data available" (a sensor exists) is not "intelligence implemented" (behavior demonstrably changes).
            Each dimension is EVIDENCED only when the official page describes an actual behavior, not a marketing word.
          </div>
          <div className="intel-pill-row">
            {right.intelligence.map((d, i) => (
              <span key={i} className={"intel-pill" + (d.status === "EVIDENCED" ? " evidenced" : "")} title={d.note}>
                {d.dimension}
              </span>
            ))}
          </div>
        </>
      )}

      {viewMode === "raw" && right.claims.length > 0 && (
        <>
          <div className="section-title">Claims vs independent evidence</div>
          <div className="claims-list">
            {right.claims.map((c, i) => (
              <div className="claim-card" key={i}>
                <div className="claim-text">"{c.claim}"</div>
                <div className="claim-meta">
                  <span className="claim-type">{c.claimType}</span>
                  <span className={"corrob-badge " + c.corroboration.toLowerCase()}>{c.corroboration.replace(/_/g, " ")}</span>
                </div>
                {c.testContext && <div className="claim-limitation"><b>Test context:</b> {c.testContext}</div>}
                {c.limitation && <div className="claim-limitation"><b>Does not establish:</b> {c.limitation}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === "raw" && right.capabilities.length > 0 && (
        <>
          <div className="section-title">Capabilities (shared ontology)</div>
          <div className="section-sub" style={{ marginTop: -6 }}>
            Same realm/tag/score scale used for Versuni's own products — see TAG_SCORING_RULES.md.
          </div>
          <div className="kv-grid">
            {right.capabilities.map((cap, i) => (
              <div className="kv-cell" key={i}>
                <div className="k">{cap.realm} · {cap.tag}</div>
                <div className="v">{cap.score.toFixed(1)} / 10 <span style={{ color: "var(--text-faint)", fontWeight: 500 }}>({cap.basis})</span></div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === "raw" && right.claims.length === 0 && right.certifications.length === 0 && right.tco.length === 0 && right.intelligence.length === 0 && right.capabilities.length === 0 && (
        <div className="section-sub" style={{ marginTop: 18 }}>
          No claims, certifications, capability scores, intelligence classification, or TCO data collected for this product yet — that depth pass hasn't run for this world.
        </div>
      )}
    </div>
  );
}

function DistilledPanel({
  left, right, rightCompany, priceVerdict, competitorBetter, versuniBetter,
  hasCapabilityData, hasSharedCapabilityData, closestCompetitor, competitorsById, onPickClosest,
}: {
  left: Product | undefined; right: CompetitorProduct; rightCompany?: Competitor;
  priceVerdict: string; competitorBetter: { realm: string; tag: string; l: number; r: number }[];
  versuniBetter: { realm: string; tag: string; l: number; r: number }[];
  hasCapabilityData: boolean; hasSharedCapabilityData: boolean;
  closestCompetitor: CompetitorProduct | null; competitorsById: Record<string, Competitor>;
  onPickClosest: () => void;
}) {
  const isClosest = closestCompetitor?.id === right.id;
  const implicationParts: string[] = [];
  if (competitorBetter.length && versuniBetter.length) {
    implicationParts.push(`${rightCompany?.name || "This competitor"} leads on ${competitorBetter.length} scored capabilit${competitorBetter.length === 1 ? "y" : "ies"}, Versuni leads on ${versuniBetter.length} — a mixed picture, not a clean win either way.`);
  } else if (competitorBetter.length) {
    implicationParts.push(`${rightCompany?.name || "This competitor"} leads on every scored capability that's directly comparable (${competitorBetter.length}) — no scored area where Versuni currently leads in this pairing.`);
  } else if (versuniBetter.length) {
    implicationParts.push(`Versuni leads on every scored capability that's directly comparable (${versuniBetter.length}) against ${rightCompany?.name || "this competitor"} — no scored area where the competitor currently leads.`);
  }
  if (priceVerdict === "VERSUNI LOWER") implicationParts.push("Versuni is also the lower-priced option in this pairing.");
  else if (priceVerdict === "COMPETITOR LOWER") implicationParts.push(`${rightCompany?.name || "The competitor"} is the lower-priced option in this pairing.`);

  return (
    <div className="distilled-panel">
      <div className="distilled-qa">
        <div className="distilled-q">1. Closest real competitor</div>
        <div className="distilled-a">
          {closestCompetitor ? (
            <>
              {isClosest ? (
                <>This is it — {rightCompany?.name} {right.name} is the nearest DIRECT match by price to {left?.name || "the selected Versuni product"}.</>
              ) : (
                <>
                  The nearest DIRECT match by price is actually a different product:{" "}
                  <b>{competitorsById[closestCompetitor.competitor]?.name} {closestCompetitor.name}</b>.
                  <button className="chip" style={{ marginLeft: 8 }} onClick={onPickClosest}>Compare that one instead</button>
                </>
              )}
            </>
          ) : "No DIRECT-positioned competitor with a comparable price was found for this Versuni product."}
        </div>
      </div>

      <div className="distilled-qa">
        <div className="distilled-q">2. What {rightCompany?.name || "the competitor"} does better</div>
        <div className="distilled-a">
          {competitorBetter.length ? (
            <ul className="distilled-list">
              {competitorBetter.map((g, i) => <li key={i}>{g.tag} <span className="distilled-delta">({g.r.toFixed(1)} vs Versuni {g.l.toFixed(1)})</span></li>)}
            </ul>
          ) : hasSharedCapabilityData ? "No scored capability where this competitor beats Versuni by a meaningful margin." : "No shared scored capability data for this pairing yet — see Raw / CHECKLIST_COMPETITORS.md."}
        </div>
      </div>

      <div className="distilled-qa">
        <div className="distilled-q">3. What Versuni does better</div>
        <div className="distilled-a">
          {versuniBetter.length ? (
            <ul className="distilled-list">
              {versuniBetter.map((g, i) => <li key={i}>{g.tag} <span className="distilled-delta">(Versuni {g.l.toFixed(1)} vs {g.r.toFixed(1)})</span></li>)}
            </ul>
          ) : hasSharedCapabilityData ? "No scored capability where Versuni beats this competitor by a meaningful margin." : "No shared scored capability data for this pairing yet — see Raw / CHECKLIST_COMPETITORS.md."}
        </div>
      </div>

      <div className="distilled-qa">
        <div className="distilled-q">4. Price position</div>
        <div className="distilled-a">
          <span className="verdict-badge">{priceVerdict}</span>
        </div>
      </div>

      <div className="distilled-qa">
        <div className="distilled-q">5. Capability gap</div>
        <div className="distilled-a">
          {hasCapabilityData
            ? `${competitorBetter.length + versuniBetter.length} shared, scored capability comparison${competitorBetter.length + versuniBetter.length === 1 ? "" : "s"} available for this pairing.`
            : "No capability scoring exists yet for this pairing (that depth pass hasn't run for this world) — see CHECKLIST_COMPETITORS.md."}
        </div>
      </div>

      <div className="distilled-qa">
        <div className="distilled-q">6. Strategic read <span className="hyp-badge">DERIVED, not verified fact</span></div>
        <div className="distilled-a">
          {implicationParts.length ? implicationParts.join(" ") : "Not enough comparable evidence (price and/or capability data) to state a strategic read for this pairing without guessing."}
        </div>
      </div>
    </div>
  );
}

function BattleCard({ title, sub, img, price, priceNote, badge, logo, onClick }: {
  title: string; sub: string; img: string | null; price: string; priceNote?: string;
  badge?: { color: string; bg: string; label: string }; logo?: Competitor; onClick?: () => void;
}) {
  return (
    <div className="battle-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      {badge && <span className="battle-badge" style={{ color: badge.color, background: badge.bg }}>{badge.label}</span>}
      {logo && <div className="battle-card-logo"><CompanyLogo c={logo} size={28} /></div>}
      <div className="battle-card-img">
        {img ? <img src={img} alt={title} /> : <div className="thumb-fallback"><span className="no-img-icon">⚠</span><span>No image</span></div>}
      </div>
      <div className="battle-card-title">{title}</div>
      <div className="battle-card-sub">{sub}</div>
      <div className="battle-card-price">{price}</div>
      {priceNote && <div className="battle-card-pricenote">{priceNote}</div>}
    </div>
  );
}

function MapMode({ scoped, competitorsById }: { scoped: CompetitorProduct[]; competitorsById: Record<string, Competitor> }) {
  const points = scoped
    .map((p) => {
      const price = firstPrice(p);
      if (!price) return null;
      const v = parseFloat(price.value);
      if (isNaN(v)) return null;
      return { p, value: v, currency: price.currency };
    })
    .filter((x): x is { p: CompetitorProduct; value: number; currency: string } => x !== null);

  if (!points.length) return <div className="empty-state">No priced products in this scope yet.</div>;

  const currencies = Array.from(new Set(points.map((pt) => pt.currency)));
  const CUR_COLOR: Record<string, string> = { EUR: "#3538cd", USD: "#2f7d4f", INR: "#9a6a12", GBP: "#b5461f", BRL: "#0d9488", SGD: "#7c3aed" };
  const maxV = Math.max(...points.map((pt) => pt.value));
  const worlds = Array.from(new Set(points.map((pt) => pt.p.world)));
  const width = 720, height = 60 + worlds.length * 70;
  const leftPad = 90;

  return (
    <div className="map-wrap">
      <div className="section-sub" style={{ marginTop: 0 }}>
        Price by world. Bubble color = currency — <b>only compare bubbles of the same color</b>; this project does
        not fabricate an FX conversion, so cross-currency position is not directly comparable.
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="assoc-svg" style={{ maxWidth: 720 }}>
        {worlds.map((w, wi) => (
          <g key={w}>
            <text x={8} y={50 + wi * 70 + 5} fontSize={11} fontWeight={700} fill="var(--text-muted)">{w}</text>
            <line x1={leftPad} y1={50 + wi * 70} x2={width - 20} y2={50 + wi * 70} stroke="var(--border)" />
          </g>
        ))}
        {points.map((pt, i) => {
          const wi = worlds.indexOf(pt.p.world);
          const x = leftPad + (pt.value / maxV) * (width - leftPad - 40);
          const y = 50 + wi * 70;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={7} fill={CUR_COLOR[pt.currency] || "#726d63"} opacity={0.85}>
                <title>{`${competitorsById[pt.p.competitor]?.name} ${pt.p.name} — ${pt.value} ${pt.currency}`}</title>
              </circle>
            </g>
          );
        })}
      </svg>
      <div className="pill-list" style={{ marginTop: 8 }}>
        {currencies.map((c) => (
          <span key={c} className="pill" style={{ background: (CUR_COLOR[c] || "#726d63") + "1a", color: CUR_COLOR[c] || "#726d63" }}>{c}</span>
        ))}
      </div>
    </div>
  );
}

function MatrixMode({ data, scoped, competitorsById }: { data: SiteData; scoped: CompetitorProduct[]; competitorsById: Record<string, Competitor> }) {
  const categoryIds = Array.from(new Set(scoped.map((p) => p.category)));
  const categoriesById = useMemo(() => Object.fromEntries(data.categories.map((c) => [c.id, c])), [data]);

  if (!categoryIds.length) return <div className="empty-state">No products in this scope yet.</div>;

  return (
    <div className="matrix-wrap">
      <table className="matrix-table">
        <thead>
          <tr>
            <th>Competitor product</th>
            {categoryIds.map((cid) => <th key={cid}>{categoriesById[cid]?.name || cid}</th>)}
          </tr>
        </thead>
        <tbody>
          {scoped.map((p) => (
            <tr key={p.id}>
              <td className="matrix-rowhead">
                <span style={{ fontWeight: 700 }}>{p.name}</span>
                <span style={{ color: "var(--text-faint)", fontSize: 11 }}> · {competitorsById[p.competitor]?.name}</span>
              </td>
              {categoryIds.map((cid) => (
                <td key={cid}>
                  {p.category === cid ? (
                    <span className="matrix-cell" style={{ color: POSITION_META[p.positioning].color, background: POSITION_META[p.positioning].bg }}>
                      {POSITION_META[p.positioning].label}
                    </span>
                  ) : <span className="matrix-dash">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RankingsMode({ scoped, competitorsById, world }: { scoped: CompetitorProduct[]; competitorsById: Record<string, Competitor>; world: string }) {
  const rows = scoped
    .map((p) => {
      const price = firstPrice(p);
      if (!price) return null;
      const v = parseFloat(price.value);
      if (isNaN(v)) return null;
      return { p, price, v };
    })
    .filter((x): x is { p: CompetitorProduct; price: CompetitorProduct["prices"][number]; v: number } => x !== null);

  const byCurrency = new Map<string, typeof rows>();
  rows.forEach((r) => {
    const list = byCurrency.get(r.price.currency) || [];
    list.push(r);
    byCurrency.set(r.price.currency, list);
  });

  const groups = Array.from(byCurrency.entries()).sort((a, b) => b[1].length - a[1].length);
  const excluded = scoped.length - rows.length;

  return (
    <div className="rankings-wrap">
      <div className="section-title" style={{ marginTop: 0 }}>Lowest current price</div>
      <div className="section-sub" style={{ marginTop: -6 }}>
        Scope: {world === "all" ? "all worlds with competitor coverage" : world}. Metric: first official price on
        file per product, ranked lowest to highest, grouped by currency (no fabricated FX conversion — see
        COMPETITOR_POLICY.md). Products included: {rows.length}.{" "}
        {excluded > 0 && `Excluded (no price on file): ${excluded}.`} Source coverage: every row traces to an
        official store or major authorized retailer, see COMPETITOR_POLICY.md. As-of: prices recorded 2026-08-27.
      </div>
      {groups.map(([currency, list]) => (
        <div key={currency} className="ranking-group">
          <div className="ranking-group-title">{currency}</div>
          <ol className="ranking-list">
            {list
              .slice()
              .sort((a, b) => a.v - b.v)
              .map((r) => (
                <li key={r.p.id} className="ranking-row">
                  <span className="ranking-name">{r.p.name}</span>
                  <span className="ranking-company">{competitorsById[r.p.competitor]?.name}</span>
                  <span className="ranking-price">{r.price.value} {currency}</span>
                  <span className="ranking-country">{r.price.country}</span>
                </li>
              ))}
          </ol>
        </div>
      ))}
      {!rows.length && <div className="empty-state">No priced products in this scope yet.</div>}
    </div>
  );
}

function TimelineGap() {
  return (
    <div className="empty-state" style={{ maxWidth: 560, margin: "40px auto" }}>
      <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>DATA GAP — not built with placeholder data</div>
      <div>
        A real Timeline needs launch-date history per competitor product (when each model/series shipped, what
        changed release over release). That data hasn't been collected in this pass — Battle, Map, and Matrix all
        run on real sourced data; Timeline stays locked rather than showing an invented chronology.
      </div>
    </div>
  );
}

function CompanyProfileDrawer({ data, competitor, onClose, onOpenProduct }: {
  data: SiteData; competitor: Competitor; onClose: () => void; onOpenProduct: (id: string) => void;
}) {
  const products = data.competitorProducts.filter((p) => p.competitor === competitor.id);
  const worldsById = Object.fromEntries(data.worlds.map((w) => [w.id, w]));
  const catsById = Object.fromEntries(data.categories.map((c) => [c.id, c]));

  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="drawer">
        <div className="drawer-head">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <CompanyLogo c={competitor} size={52} />
            <div>
              <h2>{competitor.name}</h2>
              <div className="meta-line">
                {FLAG[competitor.hqCountry] || ""} {competitor.hqCity ? `${competitor.hqCity}, ` : ""}{competitor.hqCountry || "HQ not verified"}
                {competitor.parentCompany && <> · Owned by {competitor.parentCompany}</>}
              </div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><IconClose /></button>
        </div>

        <div className="drawer-body">
          <div className="badge-row">
            <a className="pill" href={`https://${competitor.domain}`} target="_blank" rel="noopener noreferrer">{competitor.domain} ↗</a>
            <span className="badge neutral">{products.length} product{products.length === 1 ? "" : "s"} competing with Versuni</span>
          </div>

          {competitor.notes && (
            <div className="section-sub" style={{ marginTop: 0 }}>{competitor.notes}</div>
          )}

          <div className="section-title">Products competing with Versuni</div>
          <div className="pf-competitor-list">
            {products.map((cp) => {
              const price = firstPrice(cp);
              const pos = POSITION_META[cp.positioning];
              const versuniMatches = data.products.filter((vp) => vp.category === cp.category);
              const priceCompare = (() => {
                if (!price) return null;
                const vpWithPrice = versuniMatches.find((vp) => vp.prices[0] && vp.prices[0].currency === price.currency);
                if (!vpWithPrice) return null;
                const vv = parseFloat(vpWithPrice.prices[0].value), cv = parseFloat(price.value);
                if (isNaN(vv) || isNaN(cv)) return null;
                return { vp: vpWithPrice, cheaper: cv < vv };
              })();
              return (
                <div key={cp.id} className="pf-competitor-row">
                  <div className={"row-thumb" + (cp.thumb ? "" : " row-thumb-missing")}>
                    {cp.thumb
                      ? <img src={cp.thumb} alt={cp.name} onError={(e) => { (e.target as HTMLElement).parentElement!.classList.add("row-thumb-missing"); (e.target as HTMLElement).style.display = "none"; }} />
                      : <span className="no-img-icon">⚠</span>}
                  </div>
                  <div className="pf-competitor-mid">
                    <a href={cp.url} target="_blank" rel="noopener noreferrer" className="pf-competitor-name" style={{ textDecoration: "none" }}>{cp.name}</a>
                    <div className="pf-competitor-company">
                      {worldsById[cp.world]?.name} · {catsById[cp.category]?.name}
                      {priceCompare && (
                        <>
                          {" · "}{priceCompare.cheaper ? "cheaper than" : "pricier than"} Versuni's{" "}
                          <span className="seg" style={{ cursor: "pointer" }} onClick={() => onOpenProduct(priceCompare.vp.id)}>{priceCompare.vp.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="pf-competitor-badge" style={{ color: pos.color, background: pos.bg }}>{pos.label}</span>
                  <div className="pf-competitor-price">{price ? `${price.value} ${price.currency}` : "No price on file"}</div>
                </div>
              );
            })}
          </div>

          {products.some((p) => p.capabilities.length > 0) && (
            <div className="section-sub" style={{ marginTop: 14 }}>
              One or more of these products has scored capability data — open it in Battle mode's Distilled view for
              a direct comparison against a matched Versuni product.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
