import { useMemo, useState, type ReactElement } from "react";
import siteData from "./data/site-data.json";
import VersuniLogo from "./VersuniLogo";
import type { SiteData, Product } from "./types";
import { IconSearch, IconGrid, IconList, IconHome, IconTag, IconLeaf, IconCoin, IconTarget, IconBook, IconLayers, IconGlobe } from "./icons";
import ProductsSection from "./sections/ProductsSection";
import SmartTagsSection from "./sections/SmartTagsSection";
import EconomicsSection from "./sections/EconomicsSection";
import HouseSection from "./sections/HouseSection";
import CompetitorsSection from "./sections/CompetitorsSection";
import SourcesSection from "./sections/SourcesSection";
import DistributionSection from "./sections/DistributionSection";
import ProductFocus from "./sections/ProductFocus";
import SearchResults from "./sections/SearchResults";

const DATA = siteData as unknown as SiteData;

export type Section = "products" | "brands" | "categories" | "house" | "tags" | "competitors" | "economics" | "distribution" | "sources";

export default function App() {
  const [section, setSection] = useState<Section>("products");
  const [search, setSearch] = useState("");
  const [gridMode, setGridMode] = useState<"grid" | "list">("grid");
  const [openProductId, setOpenProductId] = useState<string | null>(null);
  const [presetScope, setPresetScope] = useState<{ world?: string; brand?: string; category?: string } | null>(null);

  const productsById = useMemo(() => Object.fromEntries(DATA.products.map((p) => [p.id, p])), []);
  const openProduct: Product | null = openProductId ? productsById[openProductId] : null;

  function go(sec: Section, scope?: { world?: string; brand?: string; category?: string }) {
    setSection(sec);
    setPresetScope(scope ?? null);
    setSearch("");
  }

  const sideItems: { id: Section; label: string; icon: ReactElement; count?: number }[] = [
    { id: "products", label: "All Products", icon: <IconHome />, count: DATA.products.length },
    { id: "brands", label: "Brands", icon: <IconTag />, count: DATA.brands.length },
    { id: "categories", label: "Categories", icon: <IconGrid />, count: DATA.categories.length },
    { id: "house", label: "House", icon: <IconHome /> },
    { id: "tags", label: "Smart Tags", icon: <IconLayers /> },
    { id: "competitors", label: "Arena", icon: <IconTarget /> },
    { id: "economics", label: "Economics", icon: <IconCoin /> },
    { id: "distribution", label: "Distribution", icon: <IconGlobe /> },
    { id: "sources", label: "Sources", icon: <IconBook /> },
  ];

  return (
    <div className="app">
      <div className="topbar">
        <div className="brandmark" onClick={() => go("products")}>
          <VersuniLogo height={20} />
          <span className="word2">Product Universe</span>
        </div>
        <div className="search">
          <IconSearch />
          <input
            placeholder="Search everything — products, SKUs, brands, capabilities, needs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="view-toggle">
          <button className={gridMode === "grid" ? "active" : ""} onClick={() => setGridMode("grid")}><IconGrid /></button>
          <button className={gridMode === "list" ? "active" : ""} onClick={() => setGridMode("list")}><IconList /></button>
        </div>
        <div className="topbar-stats">
          <span><b>{DATA.brands.length}</b> brands</span>
          <span><b>{DATA.families.length}</b> families</span>
          <span><b>{DATA.products.length}</b> products</span>
        </div>
      </div>

      <div className="layout">
        <div className="sidebar">
          <div className="side-group">
            <h4>Explore the whole home</h4>
            {sideItems.map((it) => (
              <div
                key={it.id}
                className={"side-item" + (section === it.id && !search ? " active" : "")}
                onClick={() => go(it.id)}
              >
                <span className="ic">{it.icon}</span>
                {it.label}
                {it.count !== undefined && <span className="side-count">{it.count}</span>}
              </div>
            ))}
          </div>
          <div className="side-group">
            <h4>Worlds</h4>
            {DATA.worlds.map((w) => {
              const n = DATA.products.filter((p) => p.world === w.id).length;
              return (
                <div key={w.id} className="side-item" onClick={() => go("products", { world: w.id })}>
                  <span className="ic"><IconLeaf /></span>
                  {w.name}
                  <span className="side-count">{n}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="main">
          {search.trim() ? (
            <SearchResults data={DATA} query={search} onOpenProduct={setOpenProductId} onGo={go} />
          ) : (
            <>
              {section === "products" && (
                <ProductsSection data={DATA} gridMode={gridMode} preset={presetScope} onOpenProduct={setOpenProductId} />
              )}
              {section === "brands" && (
                <ProductsSection data={DATA} gridMode={gridMode} preset={null} forceLevel="brands" onOpenProduct={setOpenProductId} onPickBrand={(b) => go("products", { brand: b })} />
              )}
              {section === "categories" && (
                <ProductsSection data={DATA} gridMode={gridMode} preset={null} forceLevel="categories" onOpenProduct={setOpenProductId} onPickCategory={(c) => go("products", { category: c })} />
              )}
              {section === "house" && <HouseSection data={DATA} onOpenProduct={setOpenProductId} />}
              {section === "tags" && <SmartTagsSection data={DATA} onOpenProduct={setOpenProductId} />}
              {section === "competitors" && <CompetitorsSection data={DATA} onOpenProduct={setOpenProductId} preset={presetScope} />}
              {section === "economics" && <EconomicsSection data={DATA} onOpenProduct={setOpenProductId} />}
              {section === "distribution" && <DistributionSection data={DATA} onOpenProduct={setOpenProductId} />}
              {section === "sources" && <SourcesSection />}
            </>
          )}
        </div>
      </div>

      {openProduct && (
        <ProductFocus
          product={openProduct}
          data={DATA}
          onClose={() => setOpenProductId(null)}
          onNavigate={(pid) => setOpenProductId(pid)}
          onOpenArena={(world) => { go("competitors", { world }); setOpenProductId(null); }}
        />
      )}
    </div>
  );
}
