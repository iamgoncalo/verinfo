import { useMemo, useState } from "react";
import type { SiteData, AssocRec, LabelRec } from "../types";
import { ProductGrid } from "./ProductsSection";

type NodeRef = { id: string; type: string; name: string };

const TYPE_META: Record<string, { color: string; bg: string }> = {
  PRODUCT: { color: "#3538cd", bg: "#eef2ff" },
  CATEGORY: { color: "#3538cd", bg: "#eef2ff" },
  BRAND: { color: "#3538cd", bg: "#eef2ff" },
  FAMILY: { color: "#3538cd", bg: "#eef2ff" },
  CAPABILITY: { color: "#2f7d4f", bg: "#e9f5ee" },
  INTELLIGENCE: { color: "#2f7d4f", bg: "#e9f5ee" },
  DIGITAL: { color: "#2f7d4f", bg: "#e9f5ee" },
  USER_JOB: { color: "#9a6a12", bg: "#faf1de" },
  NEED: { color: "#9a6a12", bg: "#faf1de" },
  CONTEXT: { color: "#9a6a12", bg: "#faf1de" },
  TRIGGER: { color: "#9a6a12", bg: "#faf1de" },
  BEHAVIOR: { color: "#9a6a12", bg: "#faf1de" },
  FRICTION: { color: "#b3261e", bg: "#fdf1ef" },
  OUTCOME: { color: "#726d63", bg: "#f1efe9" },
  HEALTH_RELATED_OUTCOME: { color: "#b3261e", bg: "#fdf1ef" },
};
const TYPE_LABEL: Record<string, string> = {
  CAPABILITY: "Capability", INTELLIGENCE: "Intelligence", DIGITAL: "Digital",
  USER_JOB: "Job", NEED: "Need", CONTEXT: "Context", TRIGGER: "Trigger",
  BEHAVIOR: "Behavior", FRICTION: "Friction", OUTCOME: "Outcome",
  HEALTH_RELATED_OUTCOME: "Health outcome",
};
const TAG_TYPES = Object.keys(TYPE_LABEL);

// Realm colors -- consistent, structural (Notion/Airtable pattern: color tells you WHICH
// dimension before you read the label).
const REALM_COLOR: Record<string, string> = {
  CAPABILITY: "#2f7d4f", INTELLIGENCE: "#0f766e", DIGITAL: "#3538cd", SPACE: "#b5461f",
  MEDIUM: "#7c3aed", USER_JOB: "#9a6a12", NEED: "#c2570a", MAINTENANCE: "#726d63",
  ECONOMIC: "#0d9488", LIFECYCLE: "#475569",
};
const REALM_LABEL: Record<string, string> = {
  CAPABILITY: "Capability", INTELLIGENCE: "Intelligence", DIGITAL: "Digital", SPACE: "Space",
  MEDIUM: "Medium", USER_JOB: "Job", NEED: "Need", MAINTENANCE: "Maintenance",
  ECONOMIC: "Economic", LIFECYCLE: "Lifecycle",
};
const REALM_ORDER = ["CAPABILITY", "INTELLIGENCE", "DIGITAL", "SPACE", "MEDIUM", "MAINTENANCE", "ECONOMIC", "LIFECYCLE", "USER_JOB", "NEED"];

function edgeBadge(a: AssocRec): { label: string; color: string } {
  if (a.evidenceState === "INFERRED") return { label: "HYPOTHESIS", color: "#9a6a12" };
  if (a.evidenceState === "OBSERVED") return { label: "OBSERVED", color: "#2f7d4f" };
  if (a.evidenceState === "DERIVED") return { label: "RULE-DERIVED", color: "#2f7d4f" };
  return { label: a.evidenceState || "—", color: "#726d63" };
}

type ModeT = "overview" | "graph" | "list";

export default function SmartTagsSection({ data, onOpenProduct }: { data: SiteData; onOpenProduct: (id: string) => void }) {
  const [mode, setMode] = useState<ModeT>("overview");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeEdge, setActiveEdge] = useState<AssocRec | null>(null);
  const [realmFilter, setRealmFilter] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<{ realm: string; tag: string } | null>(null);

  const nodesById = useMemo(() => {
    const m: Record<string, NodeRef> = {};
    data.products.forEach((p) => (m[p.id] = { id: p.id, type: "PRODUCT", name: p.name }));
    data.categories.forEach((c) => (m[c.id] = { id: c.id, type: "CATEGORY", name: c.name }));
    data.brands.forEach((b) => (m[b.id] = { id: b.id, type: "BRAND", name: b.name }));
    data.families.forEach((f) => (m[f.id] = { id: f.id, type: "FAMILY", name: f.name }));
    data.labels.forEach((l) => (m[l.id] = { id: l.id, type: l.type, name: l.name }));
    return m;
  }, [data]);

  const stats = useMemo(() => ({
    ruleDerived: data.labels.filter((l) => l.status === "RULE_DERIVED").length,
    candidate: data.labels.filter((l) => l.status === "CANDIDATE").length,
    edges: data.associations.filter((a) => a.rel !== "BELONGS_TO" && a.rel !== "FAMILY_MEMBER_OF").length,
  }), [data]);

  // ---- Realm rings: aggregate every product's tag-score profile (Oura pattern) ----
  const realmAgg = useMemo(() => {
    const agg: Record<string, { sum: number; n: number; withRealm: Set<string>; tagWeights: Map<string, number> }> = {};
    data.products.forEach((p) => {
      p.tags.forEach((t) => {
        const a = (agg[t.realm] ||= { sum: 0, n: 0, withRealm: new Set(), tagWeights: new Map() });
        a.sum += t.score;
        a.n += 1;
        a.withRealm.add(p.id);
        a.tagWeights.set(t.tag, (a.tagWeights.get(t.tag) || 0) + t.score);
      });
    });
    return REALM_ORDER.filter((r) => agg[r]).map((r) => ({
      realm: r,
      avg: agg[r].sum / agg[r].n,
      coveragePct: Math.round((agg[r].withRealm.size / data.products.length) * 100),
      topTag: Array.from(agg[r].tagWeights.entries()).sort((a, b) => b[1] - a[1])[0]?.[0],
    }));
  }, [data]);

  // ---- Standout tags: Steam-style rank-weighted cloud across the whole catalog ----
  const standoutTags = useMemo(() => {
    const weights = new Map<string, { realm: string; tag: string; weight: number; n: number }>();
    data.products.forEach((p) => {
      p.tags.forEach((t) => {
        const key = `${t.realm}::${t.tag}`;
        const cur = weights.get(key) || { realm: t.realm, tag: t.tag, weight: 0, n: 0 };
        cur.weight += t.score;
        cur.n += 1;
        weights.set(key, cur);
      });
    });
    return Array.from(weights.values())
      .filter((w) => w.n > 1) // exclude one-off tags -- not "standout" if only one product has it
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 24);
  }, [data]);
  const maxWeight = standoutTags[0]?.weight || 1;

  // ---- Within-realm breakdown, computed live from real tag-score data (not the label graph,
  // which uses a different, only-partially-overlapping vocabulary) ----
  const realmTagBreakdown = useMemo(() => {
    if (!realmFilter) return [];
    const agg = new Map<string, { tag: string; sum: number; n: number; max: number }>();
    data.products.forEach((p) => {
      p.tags.forEach((t) => {
        if (t.realm !== realmFilter) return;
        const cur = agg.get(t.tag) || { tag: t.tag, sum: 0, n: 0, max: 0 };
        cur.sum += t.score; cur.n += 1; cur.max = Math.max(cur.max, t.score);
        agg.set(t.tag, cur);
      });
    });
    return Array.from(agg.values())
      .map((a) => ({ tag: a.tag, avg: a.sum / a.n, n: a.n, weight: a.sum }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 14);
  }, [data, realmFilter]);

  const selectedTagProducts = useMemo(() => {
    if (!selectedTag) return [];
    return data.products
      .map((p) => ({ p, score: p.tags.find((t) => t.realm === selectedTag.realm && t.tag === selectedTag.tag)?.score }))
      .filter((r): r is { p: typeof data.products[number]; score: number } => r.score !== undefined)
      .sort((a, b) => b.score - a.score);
  }, [data, selectedTag]);

  const structuralEdges = new Set(["BELONGS_TO", "FAMILY_MEMBER_OF"]);
  const interestingCenters = useMemo(() => {
    const counts: Record<string, number> = {};
    data.associations.forEach((a) => {
      if (structuralEdges.has(a.rel)) return;
      const toNode = nodesById[a.to], fromNode = nodesById[a.from];
      if (toNode && (typeFilter === "all" || toNode.type === typeFilter)) counts[a.to] = (counts[a.to] || 0) + 1;
      if (fromNode && (typeFilter === "all" || fromNode.type === typeFilter)) counts[a.from] = (counts[a.from] || 0) + 1;
    });
    return Object.entries(counts)
      .filter(([id]) => nodesById[id] && nodesById[id].type !== "PRODUCT")
      .sort((a, b) => b[1] - a[1])
      .slice(0, 16)
      .map(([id, n]) => ({ id, n }));
  }, [data, nodesById, typeFilter]);

  const [centerId, setCenterId] = useState<string>("");
  const effectiveCenter = centerId || interestingCenters[0]?.id || "";
  const centerNode = nodesById[effectiveCenter];

  const neighbors = useMemo(() => {
    if (!effectiveCenter) return [];
    const edges = data.associations.filter(
      (a) => (a.from === effectiveCenter || a.to === effectiveCenter) && !structuralEdges.has(a.rel)
    );
    const seen = new Map<string, AssocRec>();
    edges.forEach((e) => {
      const otherId = e.from === effectiveCenter ? e.to : e.from;
      if (!seen.has(otherId) && nodesById[otherId]) seen.set(otherId, e);
    });
    return Array.from(seen.entries()).slice(0, 12);
  }, [data, effectiveCenter, nodesById]);

  function pickCenter(id: string) { setCenterId(id); setActiveEdge(null); setMode("graph"); }

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const grouped = useMemo(() => {
    const byType: Record<string, LabelRec[]> = {};
    data.labels.forEach((l) => {
      if (typeFilter !== "all" && l.type !== typeFilter) return;
      (byType[l.type] ||= []).push(l);
    });
    return byType;
  }, [data, typeFilter]);

  const size = 640, cx = size / 2, cy = 250, radius = 190;

  return (
    <>
      <div className="crumbs"><span className="crumb current">Smart Tags</span></div>

      <div className="tags-header">
        <div className="section-sub" style={{ marginTop: 0, marginBottom: 0, maxWidth: 620 }}>
          Every product's full tag profile, distilled to what matters first.
          <b> Green = observed fact</b> from verified specs. <b style={{ color: "var(--amber)" }}>Amber = hypothesis</b> — AI-proposed,
          not yet backed by real consumer evidence.
        </div>
        <div className="tags-stat-row">
          <div className="tags-stat"><b>{stats.ruleDerived}</b>rule-derived</div>
          <div className="tags-stat"><b>{stats.candidate}</b>candidate</div>
          <div className="tags-stat"><b>{stats.edges}</b>connections</div>
        </div>
      </div>

      <div className="cluster-bar" style={{ marginTop: 18 }}>
        <div className="distilled-toggle">
          <button className={mode === "overview" ? "active" : ""} onClick={() => setMode("overview")}>Overview</button>
          <button className={mode === "graph" ? "active" : ""} onClick={() => setMode("graph")}>Graph</button>
          <button className={mode === "list" ? "active" : ""} onClick={() => setMode("list")}>List</button>
        </div>
        {mode !== "overview" && (
          <>
            <label style={{ marginLeft: 8 }}>Type</label>
            <button className={"chip" + (typeFilter === "all" ? " active" : "")} onClick={() => setTypeFilter("all")}>All</button>
            {TAG_TYPES.filter((t) => data.labels.some((l) => l.type === t)).map((t) => (
              <button key={t} className={"chip" + (typeFilter === t ? " active" : "")} onClick={() => setTypeFilter(t)}>{TYPE_LABEL[t]}</button>
            ))}
          </>
        )}
      </div>

      {mode === "overview" && (
        <>
          <div className="section-title" style={{ marginTop: 8 }}>Realm overview</div>
          <div className="section-sub" style={{ marginTop: -6 }}>Average score and catalog coverage per realm, across all 76 products. Click a realm to explore it.</div>
          <div className="realm-ring-row">
            {realmAgg.map(({ realm, avg, coveragePct, topTag }) => (
              <RealmRing
                key={realm}
                realm={realm}
                avg={avg}
                coveragePct={coveragePct}
                topTag={topTag}
                active={realmFilter === realm}
                onClick={() => {
                  setSelectedTag(null);
                  setRealmFilter((cur) => (cur === realm ? null : realm));
                }}
              />
            ))}
          </div>

          {realmFilter && (
            <RealmDrilldown
              realm={realmFilter}
              breakdown={realmTagBreakdown}
              selectedTag={selectedTag?.realm === realmFilter ? selectedTag.tag : null}
              onSelectTag={(tag) => setSelectedTag({ realm: realmFilter, tag })}
              onClose={() => { setRealmFilter(null); setSelectedTag(null); }}
            />
          )}

          <div className="section-title">What defines this portfolio</div>
          <div className="section-sub" style={{ marginTop: -6 }}>
            The strongest tags across the whole catalog, ranked by total weighted presence — size and position both encode prominence.
          </div>
          <div className="standout-cloud">
            {standoutTags.map((t, i) => {
              const relSize = 0.7 + (t.weight / maxWeight) * 0.9;
              const color = REALM_COLOR[t.realm] || "#726d63";
              const isActive = selectedTag?.realm === t.realm && selectedTag?.tag === t.tag;
              return (
                <button
                  key={i}
                  className={"standout-chip" + (isActive ? " active" : "")}
                  style={{ fontSize: `${relSize * 13.5}px`, color, borderColor: color + (isActive ? "" : "40"), background: color + (isActive ? "22" : "12") }}
                  onClick={() => { setRealmFilter(t.realm); setSelectedTag({ realm: t.realm, tag: t.tag }); }}
                  title={`${REALM_LABEL[t.realm]} · appears on ${t.n} products`}
                >
                  {t.tag}
                </button>
              );
            })}
          </div>

          {selectedTag && (
            <>
              <div className="section-title">
                Products tagged <span style={{ color: REALM_COLOR[selectedTag.realm] }}>{selectedTag.tag}</span>
                <span style={{ fontWeight: 500, color: "var(--text-faint)", fontSize: 12, marginLeft: 8 }}>
                  {selectedTagProducts.length} products, ranked by score
                </span>
              </div>
              {selectedTagProducts.length ? (
                <ProductGrid products={selectedTagProducts.map((r) => r.p)} onOpenProduct={onOpenProduct} />
              ) : (
                <div className="empty-state">No products carry this exact tag.</div>
              )}
            </>
          )}
        </>
      )}

      {mode === "graph" && (
        <>
          <div className="cluster-bar">
            <label>Jump to</label>
            {interestingCenters.map(({ id, n }) => (
              <button key={id} className={"chip" + (effectiveCenter === id ? " active" : "")} onClick={() => pickCenter(id)}>
                {nodesById[id]?.name} <span style={{ opacity: 0.55 }}>({n})</span>
              </button>
            ))}
          </div>

          {!centerNode ? (
            <div className="empty-state">No tags match this filter yet.</div>
          ) : (
            <div className="tags-graph-layout">
              <div className="graph-wrap">
                <svg viewBox={`0 0 ${size} 500`} className="assoc-svg">
                  {neighbors.map(([id], i) => {
                    const angle = (2 * Math.PI * i) / neighbors.length - Math.PI / 2;
                    const x = cx + radius * Math.cos(angle);
                    const y = cy + radius * Math.sin(angle);
                    return <line key={id} x1={cx} y1={cy} x2={x} y2={y} stroke="#e8e5df" strokeWidth={2} />;
                  })}
                  <NodeGlyph x={cx} y={cy} node={centerNode} big onClick={() => {}} />
                  {neighbors.map(([id, edge], i) => {
                    const angle = (2 * Math.PI * i) / neighbors.length - Math.PI / 2;
                    const x = cx + radius * Math.cos(angle);
                    const y = cy + radius * Math.sin(angle);
                    const node = nodesById[id];
                    return (
                      <g key={id}>
                        <NodeGlyph x={x} y={y} node={node} onClick={() => pickCenter(id)} />
                        <EdgeLabel x={(cx + x) / 2} y={(cy + y) / 2} edge={edge} onClick={() => setActiveEdge(edge)} />
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="tags-detail-pane">
                <div className="section-title" style={{ marginTop: 0 }}>
                  {centerNode.name} <span style={{ fontWeight: 500, color: "var(--text-faint)", fontSize: 12 }}>{TYPE_LABEL[centerNode.type] || centerNode.type}</span>
                </div>
                {!neighbors.length && <div className="section-sub" style={{ marginTop: 0 }}>No typed edges recorded for this node yet.</div>}
                <div className="pill-list" style={{ marginBottom: 16 }}>
                  {neighbors.map(([id, edge]) => {
                    const badge = edgeBadge(edge);
                    return (
                      <span key={id} className="pill tag-pill" onClick={() => setActiveEdge(edge)}>
                        {nodesById[id]?.name}
                        <span style={{ fontSize: 9, fontWeight: 800, color: badge.color, textTransform: "uppercase" }}>{badge.label}</span>
                      </span>
                    );
                  })}
                </div>

                {activeEdge && (
                  <div className="kv-grid">
                    <div className="kv-cell"><div className="k">Relationship</div><div className="v">{activeEdge.rel.replace(/_/g, " ")}</div></div>
                    <div className="kv-cell"><div className="k">Class</div><div className="v">{activeEdge.class}</div></div>
                    <div className="kv-cell"><div className="k">Evidence</div><div className="v">{edgeBadge(activeEdge).label}</div></div>
                    <div className="kv-cell"><div className="k">Confidence</div><div className="v">{activeEdge.confidence || "—"}</div></div>
                    <div className="kv-cell" style={{ gridColumn: "1/-1" }}>
                      <div className="k">Notes</div>
                      <div className="v">{activeEdge.notes || "No additional notes recorded."}</div>
                    </div>
                  </div>
                )}

                {centerNode.type !== "CATEGORY" && (
                  <TagProducts data={data} labelId={centerNode.id} onOpenProduct={onOpenProduct} />
                )}
              </div>
            </div>
          )}
        </>
      )}

      {mode === "list" && (
        <div className="tags-list-mode">
          {realmFilter && (
            <div className="cluster-bar">
              <span className="chip active" onClick={() => setRealmFilter(null)}>Realm: {REALM_LABEL[realmFilter]} ✕</span>
            </div>
          )}
          {Object.entries(grouped).map(([type, labels]) => {
            const isOpen = expanded[type];
            const shown = isOpen ? labels : labels.slice(0, 6);
            const meta = TYPE_META[type] || { color: "#726d63", bg: "#f1efe9" };
            return (
              <div className="cluster-group" key={type}>
                <h3 style={{ color: meta.color }}>{TYPE_LABEL[type] || type} <span className="n">{labels.length}</span></h3>
                <div className="pill-list">
                  {shown.map((l) => (
                    <span
                      key={l.id}
                      className={"pill tag-pill" + (l.status === "CANDIDATE" ? " candidate" : "")}
                      onClick={() => pickCenter(l.id)}
                    >
                      {l.name}
                    </span>
                  ))}
                  {labels.length > 6 && (
                    <button className="chip" onClick={() => setExpanded((s) => ({ ...s, [type]: !isOpen }))}>
                      {isOpen ? "Show fewer" : `+${labels.length - 6} more`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function RealmRing({ realm, avg, coveragePct, topTag, active, onClick }: {
  realm: string; avg: number; coveragePct: number; topTag?: string; active: boolean; onClick: () => void;
}) {
  const color = REALM_COLOR[realm] || "#726d63";
  const r = 30, circumference = 2 * Math.PI * r;
  const dash = (avg / 10) * circumference;
  return (
    <div className={"realm-ring-card" + (active ? " active" : "")} onClick={onClick}>
      <svg width={76} height={76} viewBox="0 0 76 76">
        <circle cx={38} cy={38} r={r} fill="none" stroke="var(--panel-2)" strokeWidth={7} />
        <circle
          cx={38} cy={38} r={r} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`} transform="rotate(-90 38 38)"
        />
        <text x={38} y={43} textAnchor="middle" fontSize={17} fontWeight={800} fill={color}>{avg.toFixed(1)}</text>
      </svg>
      <div className="realm-ring-label">{REALM_LABEL[realm] || realm}</div>
      <div className="realm-ring-sub">{coveragePct}% of catalog</div>
      {topTag && <div className="realm-ring-top">Top: {topTag}</div>}
    </div>
  );
}

function RealmDrilldown({ realm, breakdown, selectedTag, onSelectTag, onClose }: {
  realm: string;
  breakdown: { tag: string; avg: number; n: number; weight: number }[];
  selectedTag: string | null;
  onSelectTag: (tag: string) => void;
  onClose: () => void;
}) {
  const color = REALM_COLOR[realm] || "#726d63";
  const maxAvg = Math.max(...breakdown.map((b) => b.avg), 1);
  return (
    <div className="realm-drilldown">
      <div className="realm-drilldown-head">
        <span style={{ color }}>{REALM_LABEL[realm] || realm}</span> — tag breakdown across the catalog
        <button className="chip" onClick={onClose} style={{ marginLeft: "auto" }}>Close ✕</button>
      </div>
      <div className="spectrum-bars">
        {breakdown.map((b) => (
          <div
            key={b.tag}
            className={"spectrum-row" + (selectedTag === b.tag ? " active" : "")}
            onClick={() => onSelectTag(b.tag)}
          >
            <span className="spectrum-tag">{b.tag}</span>
            <span className="spectrum-track">
              <span className="spectrum-fill" style={{ width: `${(b.avg / maxAvg) * 100}%`, background: color }} />
            </span>
            <span className="spectrum-avg">{b.avg.toFixed(1)}</span>
            <span className="spectrum-n">{b.n} products</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TagProducts({ data, labelId, onOpenProduct }: { data: SiteData; labelId: string; onOpenProduct: (id: string) => void }) {
  const productsById = useMemo(() => Object.fromEntries(data.products.map((p) => [p.id, p])), [data]);
  const linked = data.associations
    .filter((a) => a.to === labelId && a.fromType === "PRODUCT")
    .map((a) => productsById[a.from])
    .filter(Boolean);
  if (!linked.length) return null;
  return (
    <>
      <div className="section-title">Products with this tag ({linked.length})</div>
      <ProductGrid products={linked} onOpenProduct={onOpenProduct} />
    </>
  );
}

function NodeGlyph({ x, y, node, big, onClick }: { x: number; y: number; node: NodeRef; big?: boolean; onClick: () => void }) {
  const meta = TYPE_META[node.type] || { color: "#726d63", bg: "#f1efe9" };
  const w = big ? 156 : 122, h = big ? 46 : 36;
  const maxChars = big ? 21 : 16;
  const label = node.name.length > maxChars ? node.name.slice(0, maxChars - 1) + "…" : node.name;
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`} onClick={onClick} style={{ cursor: "pointer" }}>
      <title>{node.name}</title>
      <rect width={w} height={h} rx={h / 2} fill={meta.bg} stroke={big ? meta.color : "transparent"} strokeWidth={big ? 2 : 0} />
      <text x={w / 2} y={h / 2 + 4} textAnchor="middle" fontSize={big ? 13 : 11} fontWeight={big ? 800 : 700} fill={meta.color}>
        {label}
      </text>
    </g>
  );
}

function EdgeLabel({ x, y, edge, onClick }: { x: number; y: number; edge: AssocRec; onClick: () => void }) {
  const badge = edgeBadge(edge);
  return (
    <g transform={`translate(${x - 38}, ${y - 8})`} onClick={onClick} style={{ cursor: "pointer" }}>
      <rect width={76} height={16} rx={8} fill="white" stroke="#e8e5df" />
      <text x={38} y={11.5} textAnchor="middle" fontSize={7.5} fontWeight={800} fill={badge.color}>{badge.label}</text>
    </g>
  );
}
