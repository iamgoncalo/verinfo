import { useMemo, useState, type ReactElement } from "react";
import siteData from "./data/site-data.json";
import VersuniLogo from "./VersuniLogo";
import type { SiteData, Product } from "./types";
import { IconSearch, IconGrid, IconList, IconCoin, IconTarget, IconDashboard, IconHome, IconLayers, IconGlobe, IconBook } from "./icons";
import DashboardSection from "./sections/DashboardSection";
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

export type Section = "home" | "products" | "house" | "tags" | "competitors" | "economics" | "distribution" | "sources";

export default function App() {
  const [section, setSection] = useState<Section>("home");
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

  // Only 3 persistent top-level destinations -- everything else lives one click deeper as a
  // sub-tab, so the sidebar never grows past 3 rows and never needs to scroll. "Home" (the
  // dashboard) is reached via the logo, same convention as most consumer apps, not a 4th row.
  const GROUP_OF: Record<Section, "explore" | "competitors" | "insights" | "home"> = {
    home: "home",
    products: "explore", house: "explore", tags: "explore",
    competitors: "competitors",
    economics: "insights", distribution: "insights", sources: "insights",
  };
  const activeGroup = GROUP_OF[section];

  const sideItems: {
    id: Section; label: string; icon: ReactElement; group: "explore" | "competitors" | "insights"; count: number;
    children: { id: Section; label: string; icon: ReactElement }[];
  }[] = [
    {
      id: "products", label: "Explore", icon: <IconGrid />, group: "explore", count: DATA.products.length,
      children: [
        { id: "products", label: "Products", icon: <IconGrid size={13} /> },
        { id: "house", label: "Space", icon: <IconHome size={13} /> },
        { id: "tags", label: "Smart Tags", icon: <IconLayers size={13} /> },
      ],
    },
    {
      id: "competitors", label: "Arena", icon: <IconTarget />, group: "competitors", count: DATA.competitors.length,
      children: [],
    },
    {
      id: "economics", label: "Insights", icon: <IconCoin />, group: "insights", count: DATA.sources.length,
      children: [
        { id: "economics", label: "Economics", icon: <IconCoin size={13} /> },
        { id: "distribution", label: "Distribution", icon: <IconGlobe size={13} /> },
        { id: "sources", label: "Sources", icon: <IconBook size={13} /> },
      ],
    },
  ];

  return (
    <div className="app">
      <div className="topbar">
        <div className="brandmark" onClick={() => go("home")}>
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
          <div
            className={"side-item side-item-home" + (section === "home" && !search ? " active" : "")}
            onClick={() => go("home")}
          >
            <span className="ic"><IconDashboard /></span>
            Home
          </div>
          <div className="side-group">
            {sideItems.map((it) => (
              <div key={it.id}>
                <div
                  className={"side-item" + (activeGroup === it.group && !search ? " active" : "")}
                  onClick={() => go(it.id)}
                >
                  <span className="ic">{it.icon}</span>
                  {it.label}
                  <span className="side-count">{it.count}</span>
                </div>
                {it.children.length > 0 && (
                  <div className="side-children">
                    {it.children.map((c) => (
                      <div
                        key={c.id}
                        className={"side-item side-child" + (section === c.id && !search ? " active" : "")}
                        onClick={() => go(c.id)}
                      >
                        <span className="ic">{c.icon}</span>
                        {c.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="main">
          {search.trim() ? (
            <SearchResults data={DATA} query={search} onOpenProduct={setOpenProductId} onGo={go} />
          ) : (
            <>
              {section === "home" && <DashboardSection data={DATA} onGo={go} />}
              {section === "products" && (
                <ProductsSection data={DATA} gridMode={gridMode} preset={presetScope} onOpenProduct={setOpenProductId} />
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
