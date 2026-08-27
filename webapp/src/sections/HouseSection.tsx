import { useEffect, useMemo, useState } from "react";
import type { SiteData } from "../types";
import { ProductGrid } from "./ProductsSection";
import { scrollContentToTop } from "../util";

const ZONES: { id: string; name: string; worlds: string[] }[] = [
  { id: "entry", name: "Entry", worlds: ["home"] },
  { id: "living", name: "Living", worlds: ["air", "pets"] },
  { id: "bedroom", name: "Bedroom", worlds: [] },
  { id: "kitchen", name: "Kitchen", worlds: ["food", "coffee"] },
  { id: "laundry", name: "Laundry", worlds: ["clothes"] },
  { id: "bathroom", name: "Bathroom", worlds: [] },
  { id: "floor", name: "Floor (whole home)", worlds: ["clean"] },
  { id: "garden", name: "Garden", worlds: ["garden"] },
  { id: "boundary", name: "Outdoor boundary", worlds: [] },
  { id: "office", name: "Home office", worlds: [] },
];

// A space archetype is a subset of the zones above, plus a one-line rationale for why that
// subset applies. This is a zone-PRESENCE model only (which zone types exist), not a room-count
// model (how many bedrooms) -- that distinction is stated explicitly wherever it's shown, per
// this project's evidence-class discipline: this is ESTIMATED_JUDGMENT, not a measured layout.
const SPACE_TYPES: { id: string; name: string; note: string; zoneIds: string[] }[] = [
  {
    id: "studio", name: "Studio apartment",
    note: "Compact, single-room living — living and kitchen share one open zone; no separate bedroom or private laundry.",
    zoneIds: ["entry", "living", "kitchen", "bathroom", "floor"],
  },
  {
    id: "apartment", name: "Apartment",
    note: "Multi-room apartment with a dedicated bedroom; laundry and outdoor space are typically shared at building level, not modeled here.",
    zoneIds: ["entry", "living", "kitchen", "bedroom", "bathroom", "floor", "office"],
  },
  {
    id: "house", name: "Family house",
    note: "Full-footprint home with its own laundry and outdoor space.",
    zoneIds: ["entry", "living", "kitchen", "bedroom", "bathroom", "laundry", "floor", "garden", "boundary"],
  },
  {
    id: "villa", name: "Villa / large home",
    note: "Largest footprint modeled — every zone type, including a dedicated home office (a zone Versuni doesn't sell any product into yet).",
    zoneIds: ["entry", "living", "kitchen", "bedroom", "bathroom", "laundry", "floor", "garden", "boundary", "office"],
  },
  {
    id: "loft", name: "Open-plan loft",
    note: "Open-plan living/kitchen with no separate laundry or outdoor zone.",
    zoneIds: ["entry", "living", "kitchen", "bedroom", "bathroom", "floor", "office"],
  },
];

export default function HouseSection({ data, onOpenProduct }: { data: SiteData; onOpenProduct: (id: string) => void }) {
  const [spaceTypeId, setSpaceTypeId] = useState<string>("house");
  const [zoneId, setZoneId] = useState<string | null>(null);
  const spaceType = SPACE_TYPES.find((s) => s.id === spaceTypeId)!;
  const zone = ZONES.find((z) => z.id === zoneId);
  const zoneProducts = zone ? data.products.filter((p) => zone.worlds.includes(p.world)) : [];

  const activeZones = useMemo(() => ZONES.filter((z) => spaceType.zoneIds.includes(z.id)), [spaceType]);

  useEffect(() => { scrollContentToTop(); }, [spaceTypeId, zoneId]);

  return (
    <>
      <div className="crumbs"><span className="crumb current">Space Intelligence</span></div>
      <div className="page-tagline">Products mapped to home zones.</div>

      <div className="cluster-bar" style={{ marginTop: 18 }}>
        <label>Space type</label>
        {SPACE_TYPES.map((s) => (
          <button
            key={s.id}
            className={"chip" + (spaceTypeId === s.id ? " active" : "")}
            onClick={() => { setSpaceTypeId(s.id); setZoneId(null); }}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="section-sub" style={{ marginTop: -6, marginBottom: 4 }}>{spaceType.note}</div>

      <div className="zone-map" style={{ marginTop: 16, marginBottom: 30 }}>
        {activeZones.map((z) => {
          const n = data.products.filter((p) => z.worlds.includes(p.world)).length;
          return (
            <div key={z.id} className={"zone-card" + (n ? " has-products" : "")} onClick={() => n && setZoneId(z.id)}>
              <h4>{z.name}</h4>
              <span className="n">{n ? `${n} products` : "no products mapped"}</span>
            </div>
          );
        })}
      </div>

      {zone && (
        <>
          <div className="section-title">{zone.name} — products</div>
          <ProductGrid products={zoneProducts} onOpenProduct={onOpenProduct} />
        </>
      )}
    </>
  );
}
