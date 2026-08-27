import { useState } from "react";
import type { SiteData } from "../types";
import { ProductGrid } from "./ProductsSection";

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
];

export default function HouseSection({ data, onOpenProduct }: { data: SiteData; onOpenProduct: (id: string) => void }) {
  const [zoneId, setZoneId] = useState<string | null>(null);
  const zone = ZONES.find((z) => z.id === zoneId);
  const zoneProducts = zone ? data.products.filter((p) => zone.worlds.includes(p.world)) : [];

  return (
    <>
      <div className="crumbs"><span className="crumb current">House</span></div>
      <div className="section-sub" style={{ marginTop: -10, maxWidth: 640 }}>
        A provisional, world-level house map — each world is placed in the zone it primarily operates in.
        This is NOT yet a full SpaceMD profile per product (primary/secondary scale, mobility, coverage,
        placement constraints) — that requires a dedicated modeling pass per family. Click a zone to see what's there.
      </div>

      <div className="zone-map" style={{ marginTop: 20, marginBottom: 30 }}>
        {ZONES.map((z) => {
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
