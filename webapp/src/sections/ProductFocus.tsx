import { useState } from "react";
import type { SiteData, Product } from "../types";
import { IconClose, IconChevLeft, IconChevRight } from "../icons";
import { displaySku } from "../util";
import TagProfile from "./TagProfile";
import { POSITION_META, FLAG } from "./CompetitorsSection";

export default function ProductFocus({
  product, data, onClose, onNavigate, onOpenArena,
}: {
  product: Product;
  data: SiteData;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onOpenArena: (world: string) => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [mode, setMode] = useState<"distilled" | "raw">("distilled");

  const brand = data.brands.find((b) => b.id === product.brand);
  const category = data.categories.find((c) => c.id === product.category);
  const family = data.families.find((f) => f.id === product.family);
  const siblings = data.products.filter((p) => p.family === product.family && p.id !== product.id);

  const competitorsById = Object.fromEntries(data.competitors.map((c) => [c.id, c]));
  const POSITION_ORDER = { DIRECT: 0, ADJACENT: 1, SUBSTITUTE: 2 };
  const productCompetitors = data.competitorProducts
    .filter((cp) => cp.category === product.category)
    .slice()
    .sort((a, b) => POSITION_ORDER[a.positioning] - POSITION_ORDER[b.positioning]);

  const distilledFields = ["cadr_m3h", "room_coverage_m2", "power_w", "power_max_w", "capacity_l", "capacity", "noise_range_dba", "connectivity", "brew_architecture", "steam_rate_g_min"];
  const distilledSpecs = product.specs.filter((s) => distilledFields.includes(s.field));
  const shownSpecs = mode === "distilled" && distilledSpecs.length ? distilledSpecs : product.specs;

  const images = product.images.length ? product.images : (product.thumb ? [{ url: product.thumb, type: "HERO_FRONT", status: product.thumbExact ? "EXACT_VERIFIED" : "FAMILY_VERIFIED", format: "" }] : []);
  const current = images[imgIdx];

  function prevImg() { setImgIdx((i) => (i - 1 + images.length) % images.length); }
  function nextImg() { setImgIdx((i) => (i + 1) % images.length); }

  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="drawer">
        <div className="drawer-head">
          <div>
            <h2>{product.name}</h2>
            <div className="meta-line">
              <span className="seg">{displaySku(product.sku)}</span> · {brand?.name} ·{" "}
              <span className="seg" onClick={() => {}}>{category?.name}</span> /{" "}
              <span className="seg" onClick={() => {}}>{family?.name}</span> · {product.region}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><IconClose /></button>
        </div>

        <div className="drawer-body">
          <div className="badge-row">
            <span className={"badge " + product.status}>{product.status.replace("_", " ")}</span>
            <span className="badge neutral">Confidence: {product.confidence}</span>
          </div>

          <div>
            {images.length > 0 ? (
              <>
                <div className="gallery-main" onClick={() => setLightbox(true)}>
                  <img src={current.url} alt={product.name} />
                  <span className="provenance">
                    {current.type === "MARKETING_GRAPHIC"
                      ? "Official marketing graphic · not a plain photo"
                      : current.status === "EXACT_VERIFIED" ? "Official image · exact SKU" : "Official image · family match"}
                  </span>
                  {images.length > 1 && (
                    <>
                      <div className="navbtn prev" onClick={(e) => { e.stopPropagation(); prevImg(); }}><IconChevLeft /></div>
                      <div className="navbtn next" onClick={(e) => { e.stopPropagation(); nextImg(); }}><IconChevRight /></div>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="gallery-thumbs">
                    {images.map((im, i) => (
                      <img key={i} src={im.url} className={i === imgIdx ? "active" : ""} onClick={() => setImgIdx(i)} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="gallery-main thumb-missing">
                <div className="thumb-fallback">
                  <span className="no-img-icon">⚠</span>
                  <span>NO OFFICIAL IMAGE FOUND FOR THIS SKU</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="section-title" style={{ marginTop: 0 }}>Smart Tags — {product.tags.length} tags across {new Set(product.tags.map(t => t.realm)).size} realms</div>
            {product.tags.length ? (
              <TagProfile tags={product.tags} />
            ) : <div className="section-sub" style={{ marginTop: 0 }}>No tag profile generated for this product yet.</div>}
          </div>

          <div>
            <div className="section-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              Specifications
            </div>
            <div className="distilled-toggle" style={{ marginBottom: 10 }}>
              <button className={mode === "distilled" ? "active" : ""} onClick={() => setMode("distilled")}>Distilled</button>
              <button className={mode === "raw" ? "active" : ""} onClick={() => setMode("raw")}>Raw</button>
            </div>
            {shownSpecs.length ? (
              <div className="kv-grid">
                {shownSpecs.map((s, i) => (
                  <div className="kv-cell" key={i}>
                    <div className="k">{s.field.replace(/_/g, " ")}</div>
                    <div className="v">{s.value || "—"}</div>
                  </div>
                ))}
              </div>
            ) : <div className="section-sub" style={{ marginTop: 0 }}>No specifications on file.</div>}
          </div>

          <div>
            <div className="section-title">How much</div>
            {product.prices.length ? (
              <table className="price-table">
                <thead><tr><th>Country</th><th>Type</th><th>Value</th><th>Note</th></tr></thead>
                <tbody>
                  {product.prices.map((pr, i) => (
                    <tr key={i}><td>{pr.country}</td><td>{pr.type}</td><td>{pr.value} {pr.currency}</td><td style={{ color: "var(--text-muted)" }}>{pr.note}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : <div className="section-sub" style={{ marginTop: 0 }}>No price on file for this SKU.</div>}
          </div>

          {product.apps.length > 0 && (
            <div>
              <div className="section-title">What it connects to</div>
              <div className="pill-list">{product.apps.map((a, i) => <span className="pill" key={i}>{a}</span>)}</div>
            </div>
          )}

          <div>
            <div className="section-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Competitors{productCompetitors.length ? ` — ${productCompetitors.length}` : ""}</span>
              {productCompetitors.length > 0 && (
                <button className="chip" onClick={() => onOpenArena(product.world)}>Full comparison in Arena →</button>
              )}
            </div>
            {productCompetitors.length ? (
              <div className="pf-competitor-list">
                {productCompetitors.map((cp) => {
                  const c = competitorsById[cp.competitor];
                  const price = cp.prices.find((x) => x.type === "OFFICIAL_PRICE") || cp.prices[0];
                  const pos = POSITION_META[cp.positioning];
                  return (
                    <a key={cp.id} className="pf-competitor-row" href={cp.url} target="_blank" rel="noopener noreferrer">
                      <div className={"row-thumb" + (cp.thumb ? "" : " row-thumb-missing")}>
                        {cp.thumb
                          ? <img src={cp.thumb} alt={cp.name} onError={(e) => { (e.target as HTMLElement).parentElement!.classList.add("row-thumb-missing"); (e.target as HTMLElement).style.display = "none"; }} />
                          : <span className="no-img-icon">⚠</span>}
                      </div>
                      <div className="pf-competitor-mid">
                        <div className="pf-competitor-name">{cp.name}</div>
                        <div className="pf-competitor-company">
                          {c?.name || cp.competitor} · {FLAG[c?.hqCountry || ""] || ""} {c?.hqCity ? `${c.hqCity}, ` : ""}{c?.hqCountry || "HQ not verified"}
                        </div>
                      </div>
                      <span className="pf-competitor-badge" style={{ color: pos.color, background: pos.bg }}>{pos.label}</span>
                      <div className="pf-competitor-price">{price ? `${price.value} ${price.currency}` : "No price on file"}</div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="section-sub" style={{ marginTop: 0 }}>
                No competing products researched for this category yet — see the Arena section for what has been
                covered so far.
              </div>
            )}
          </div>

          {siblings.length > 0 && (
            <div>
              <div className="section-title">Related — {family?.name} siblings</div>
              <div className="related-row">
                {siblings.map((s) => (
                  <div key={s.id} className="related-chip" onClick={() => onNavigate(s.id)}>
                    {s.thumb && <img src={s.thumb} style={{ width: 20, height: 20, objectFit: "contain" }} />}
                    {displaySku(s.sku)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="detail-actions">
            <a className="btn primary" href={product.url} target="_blank" rel="noopener noreferrer">Open official product page ↗</a>
          </div>
        </div>
      </div>

      {lightbox && current && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <button className="lb-close" onClick={() => setLightbox(false)}><IconClose /></button>
          <img src={current.url} />
        </div>
      )}
    </div>
  );
}
