import { useEffect, useMemo, useState, type ReactElement } from "react";
import type { SiteData, Product } from "../types";
import { IconFolder } from "../icons";
import { displaySku } from "../util";

type Preset = { world?: string; brand?: string; category?: string } | null;

export default function ProductsSection({
  data, preset, onOpenProduct,
}: {
  data: SiteData;
  gridMode: "grid" | "list";
  preset: Preset;
  onOpenProduct: (id: string) => void;
}) {
  const [world, setWorld] = useState<string | null>(preset?.world ?? null);
  const [brand, setBrand] = useState<string | null>(preset?.brand ?? null);
  const [category, setCategory] = useState<string | null>(preset?.category ?? null);
  const [family, setFamily] = useState<string | null>(null);
  const [clusterBy, setClusterBy] = useState<string>("none");
  const [rootView, setRootView] = useState<"world" | "brand" | "category">("world");

  // ProductsSection stays mounted across sidebar navigations (only the `section` id changes
  // away and back, or `preset` changes while already on "products") -- without this effect,
  // the useState initializers above only run once at first mount, so clicking a different
  // world/brand/category in the sidebar while already drilled into one silently did nothing.
  useEffect(() => {
    setWorld(preset?.world ?? null);
    setBrand(preset?.brand ?? null);
    setCategory(preset?.category ?? null);
    setFamily(null);
  }, [preset]);

  const worldsMap = useMemo(() => Object.fromEntries(data.worlds.map((w) => [w.id, w])), [data]);
  const brandsMap = useMemo(() => Object.fromEntries(data.brands.map((b) => [b.id, b])), [data]);
  const catsMap = useMemo(() => Object.fromEntries(data.categories.map((c) => [c.id, c])), [data]);
  const famsMap = useMemo(() => Object.fromEntries(data.families.map((f) => [f.id, f])), [data]);
  const labelsMap = useMemo(() => Object.fromEntries(data.labels.map((l) => [l.id, l])), [data]);

  function labelFor(p: Product, dim: string): string {
    if (dim === "category") return catsMap[p.category]?.name ?? "Unknown";
    if (dim === "brand") return brandsMap[p.brand]?.name ?? "Unknown";
    if (dim === "status") return p.status;
    if (dim === "economics") return p.prices.length ? "Priced" : "No price on file";
    if (dim === "architecture" || dim === "intelligence") {
      const rel = dim === "architecture" ? "HAS_CAPABILITY" : "USES_INTELLIGENCE_LEVEL";
      const edge = data.associations.find((a) => a.from === p.id && a.rel === rel);
      if (!edge) return "Not yet classified";
      return labelsMap[edge.to]?.name ?? edge.to;
    }
    return "—";
  }

  // Computed unconditionally (Rules of Hooks) even though only used at the family/product level.
  const scopeProducts = family
    ? data.products.filter((p) => p.family === family)
    : data.products.filter((p) =>
        (!world || p.world === world) && (!brand || p.brand === brand) && (!category || p.category === category)
      );

  const grouped = useMemo(() => {
    if (clusterBy === "none") return null;
    const g: Record<string, Product[]> = {};
    scopeProducts.forEach((p) => {
      const k = labelFor(p, clusterBy);
      (g[k] ||= []).push(p);
    });
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterBy, scopeProducts.map((p) => p.id).join(",")]);

  function reset() { setWorld(null); setBrand(null); setCategory(null); setFamily(null); }

  // ---------- ROOT: World / Brand / Category tabs, all in one place ----------
  if (!world && !brand && !category && !family) {
    return (
      <>
        <div className="crumbs"><span className="crumb current">Versuni</span></div>
        <div className="page-tagline">Every product, browsable three ways.</div>
        <div className="cluster-bar" style={{ marginBottom: 4 }}>
          <label>Explore by</label>
          <button className={"chip" + (rootView === "world" ? " active" : "")} onClick={() => setRootView("world")}>World</button>
          <button className={"chip" + (rootView === "brand" ? " active" : "")} onClick={() => setRootView("brand")}>Brand</button>
          <button className={"chip" + (rootView === "category" ? " active" : "")} onClick={() => setRootView("category")}>Category</button>
        </div>

        {rootView === "world" && (
          <>
            <div className="section-sub">Eight worlds of the home. Click one to see its products.</div>
            <div className="world-grid">
              {data.worlds.map((w) => {
                const prods = data.products.filter((p) => p.world === w.id);
                const fams = new Set(prods.map((p) => p.family)).size;
                const imaged = prods.filter((p) => p.thumbExact).length;
                const collageImgs = prods.filter((p) => p.thumb).slice(0, 4);
                const pct = prods.length ? Math.round((imaged / prods.length) * 100) : 0;
                return (
                  <div key={w.id} className="world-tile" onClick={() => setWorld(w.id)}>
                    <div className="collage">
                      {Array.from({ length: 4 }).map((_, i) =>
                        collageImgs[i] ? <img key={i} src={collageImgs[i].thumb!} loading="lazy" /> : <div key={i} className="empty" />
                      )}
                    </div>
                    <h3>{w.name}</h3>
                    <div className="tagline">{w.tagline}</div>
                    <div className="stats-row">
                      <span className="counts"><b>{prods.length}</b> products · <b>{fams}</b> families</span>
                      <span className="open-cta">OPEN →</span>
                    </div>
                    <div className="coverage-bar"><div className="fill" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {rootView === "brand" && (
          <>
            <div className="section-sub">{data.brands.length} brands. Click one to see its products.</div>
            <div className="grid">
              {data.brands.map((b) => {
                const n = data.products.filter((p) => p.brand === b.id).length;
                return (
                  <div key={b.id} className="card folder-card" onClick={() => setBrand(b.id)}>
                    <IconFolder />
                    <div className="folder-name">{b.name}</div>
                    <div className="folder-meta">{n} products · {b.domain}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {rootView === "category" && (
          <>
            <div className="section-sub">{data.categories.length} categories. Click one to see its products.</div>
            <div className="grid">
              {data.categories.map((c) => {
                const n = data.products.filter((p) => p.category === c.id).length;
                return (
                  <div key={c.id} className="card folder-card" onClick={() => setCategory(c.id)}>
                    <IconFolder />
                    <div className="folder-name">{c.name}</div>
                    <div className="folder-meta">{brandsMap[c.brand]?.name} · {n} products{c.status === "CANDIDATE" ? " · not deep-dived" : ""}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </>
    );
  }

  // ---------- Breadcrumb ----------
  const crumbs: ReactElement[] = [<span key="root" className="crumb" onClick={reset}>Versuni</span>];
  if (world) {
    crumbs.push(<span key="s1" className="sep">/</span>);
    crumbs.push(brand || category || family
      ? <span key="w" className="crumb" onClick={() => { setBrand(null); setCategory(null); setFamily(null); }}>{worldsMap[world]?.name}</span>
      : <span key="w" className="crumb current">{worldsMap[world]?.name}</span>);
  }
  if (brand) {
    crumbs.push(<span key="s2" className="sep">/</span>);
    crumbs.push(category || family
      ? <span key="b" className="crumb" onClick={() => { setCategory(null); setFamily(null); }}>{brandsMap[brand]?.name}</span>
      : <span key="b" className="crumb current">{brandsMap[brand]?.name}</span>);
  }
  if (category) {
    crumbs.push(<span key="s3" className="sep">/</span>);
    crumbs.push(family
      ? <span key="c" className="crumb" onClick={() => setFamily(null)}>{catsMap[category]?.name}</span>
      : <span key="c" className="crumb current">{catsMap[category]?.name}</span>);
  }
  if (family) {
    crumbs.push(<span key="s4" className="sep">/</span>);
    crumbs.push(<span key="f" className="crumb current">{famsMap[family]?.name}</span>);
  }
  const crumbBar = <div className="crumbs">{crumbs}</div>;

  // ---------- World level: brand folders (scoped to world) ----------
  if (world && !brand && !category && !family) {
    const brandIds = Array.from(new Set(data.products.filter((p) => p.world === world).map((p) => p.brand)));
    return (
      <>
        {crumbBar}
        <div className="section-title">{worldsMap[world]?.name} — Brands</div>
        <div className="grid">
          {brandIds.map((bid) => {
            const n = data.products.filter((p) => p.world === world && p.brand === bid).length;
            return (
              <div key={bid} className="card folder-card" onClick={() => setBrand(bid)}>
                <IconFolder />
                <div className="folder-name">{brandsMap[bid]?.name}</div>
                <div className="folder-meta">{n} products</div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // ---------- Brand level: category folders ----------
  if (brand && !category && !family) {
    const cats = data.categories.filter((c) => c.brand === brand && (!world || c.world === world));
    return (
      <>
        {crumbBar}
        <div className="section-title">{brandsMap[brand]?.name} — Categories</div>
        <div className="grid">
          {cats.map((c) => {
            const n = data.products.filter((p) => p.category === c.id).length;
            return (
              <div key={c.id} className="card folder-card" onClick={() => setCategory(c.id)}>
                <IconFolder />
                <div className="folder-name">{c.name}</div>
                <div className="folder-meta">{n} products{c.status === "CANDIDATE" ? " · not deep-dived" : ""}</div>
              </div>
            );
          })}
          {!cats.length && <div className="empty-state">No categories recorded here yet.</div>}
        </div>
      </>
    );
  }

  // ---------- Category level: family folders ----------
  if (category && !family) {
    const fams = data.families.filter((f) => f.category === category);
    return (
      <>
        {crumbBar}
        <div className="section-title">{catsMap[category]?.name} — Families</div>
        <div className="grid">
          {fams.map((f) => {
            const n = data.products.filter((p) => p.family === f.id).length;
            return (
              <div key={f.id} className="card folder-card" onClick={() => setFamily(f.id)}>
                <IconFolder />
                <div className="folder-name">{f.name}</div>
                <div className="folder-meta">{n} SKU{n === 1 ? "" : "s"} · {f.status}</div>
              </div>
            );
          })}
          {!fams.length && <div className="empty-state">No families recorded here yet.</div>}
        </div>
      </>
    );
  }

  // ---------- Family level: products, with cluster-by control ----------
  const clusterOptions = [
    { id: "none", label: "None" },
    { id: "category", label: "Category" },
    { id: "brand", label: "Brand" },
    { id: "architecture", label: "Architecture" },
    { id: "intelligence", label: "Intelligence" },
    { id: "status", label: "Lifecycle" },
    { id: "economics", label: "Priced?" },
  ];

  return (
    <>
      {crumbBar}
      <div className="cluster-bar">
        <label>Cluster by</label>
        {clusterOptions.map((o) => (
          <button key={o.id} className={"chip" + (clusterBy === o.id ? " active" : "")} onClick={() => setClusterBy(o.id)}>
            {o.label}
          </button>
        ))}
      </div>

      {!grouped ? (
        <>
          <div className="section-title">{family ? famsMap[family]?.name : "Products"} <span style={{ color: "var(--text-faint)", fontWeight: 500 }}>({scopeProducts.length})</span></div>
          <ProductGrid products={scopeProducts} onOpenProduct={onOpenProduct} />
        </>
      ) : (
        Object.entries(grouped).sort((a, b) => b[1].length - a[1].length).map(([k, prods]) => (
          <div className="cluster-group" key={k}>
            <h3>{k} <span className="n">{prods.length}</span></h3>
            <ProductGrid products={prods} onOpenProduct={onOpenProduct} />
          </div>
        ))
      )}
    </>
  );
}

export function ProductGrid({ products, onOpenProduct }: { products: Product[]; onOpenProduct: (id: string) => void }) {
  if (!products.length) return <div className="empty-state">No products here.</div>;
  return (
    <div className="grid">
      {products.map((p) => (
        <div key={p.id} className="card product-card" onClick={() => onOpenProduct(p.id)}>
          <div className={"thumb-wrap" + (p.thumb ? "" : " thumb-missing")}>
            {p.thumb ? (
              <img src={p.thumb} loading="lazy" alt={p.name} onError={(e) => { (e.target as HTMLElement).parentElement!.classList.add("thumb-missing"); (e.target as HTMLElement).parentElement!.innerHTML = '<div class="thumb-fallback"><span class="no-img-icon">⚠</span><span>IMAGE FAILED TO LOAD</span></div>'; }} />
            ) : (
              <div className="thumb-fallback"><span className="no-img-icon">⚠</span><span>NO OFFICIAL IMAGE FOUND</span></div>
            )}
          </div>
          <div className="product-name">{p.name}</div>
          <div className="product-sku">{displaySku(p.sku)}</div>
          <div className="badge-row">
            <span className={"badge " + p.status}>{p.status.replace("_", " ")}</span>
            {p.images.length > 0 && <span className="badge neutral">{p.images.length} photo{p.images.length === 1 ? "" : "s"}</span>}
            {p.thumb && !p.thumbExact && <span className="badge" style={{ background: "var(--amber-soft)", color: "var(--amber)" }}>family image</span>}
            {!p.thumb && <span className="badge" style={{ background: "#fde3e0", color: "#b3261e" }}>no image</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
