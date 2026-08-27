import { useMemo, useState, type ReactElement } from "react";
import siteData from "./data/site-data.json";
import VersuniLogo from "./VersuniLogo";
import type { SiteData, Product } from "./types";
import { IconSearch, IconGrid, IconList, IconCoin, IconTarget, IconDashboard } from "./icons";
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

  const sideItems: { id: Section; label: string; icon: ReactElement; group: "explore" | "competitors" | "insights" }[] = [
    { id: "products", label: "Explore", icon: <IconGrid />, group: "explore" },
    { id: "competitors", label: "Arena", icon: <IconTarget />, group: "competitors" },
    { id: "economics", label: "Insights", icon: <IconCoin />, group: "insights" },
  ];

  const EXPLORE_TABS: { id: Section; label: string }[] = [
    { id: "products", label: "Products" }, { id: "house", label: "Space" }, { id: "tags", label: "Smart Tags" },
  ];
  const INSIGHTS_TABS: { id: Section; label: string }[] = [
    { id: "economics", label: "Economics" }, { id: "distribution", label: "Distribution" }, { id: "sources", label: "Sources" },
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
              <div
                key={it.id}
                className={"side-item" + (activeGroup === it.group && !search ? " active" : "")}
                onClick={() => go(it.id)}
              >
                <span className="ic">{it.icon}</span>
                {it.label}
              </div>
            ))}
          </div>
        </div>

        <div className="main">
          {search.trim() ? (
            <SearchResults data={DATA} query={search} onOpenProduct={setOpenProductId} onGo={go} />
          ) : (
            <>
              {activeGroup === "explore" && (
                <div className="hub-tabs">
                  {EXPLORE_TABS.map((t) => (
                    <button key={t.id} className={section === t.id ? "active" : ""} onClick={() => go(t.id)}>{t.label}</button>
                  ))}
                </div>
              )}
              {activeGroup === "insights" && (
                <div className="hub-tabs">
                  {INSIGHTS_TABS.map((t) => (
                    <button key={t.id} className={section === t.id ? "active" : ""} onClick={() => go(t.id)}>{t.label}</button>
                  ))}
                </div>
              )}

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
