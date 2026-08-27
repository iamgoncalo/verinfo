import { useMemo, useState } from "react";
import type { TagScoreRec } from "../types";

const REALM_ORDER = ["CAPABILITY", "INTELLIGENCE", "DIGITAL", "SPACE", "MEDIUM", "USER_JOB", "NEED", "MAINTENANCE", "ECONOMIC", "LIFECYCLE"];
const REALM_LABEL: Record<string, string> = {
  CAPABILITY: "Capability", INTELLIGENCE: "Intelligence", DIGITAL: "Digital", SPACE: "Space",
  MEDIUM: "Medium", USER_JOB: "Job", NEED: "Need", MAINTENANCE: "Maintenance", ECONOMIC: "Economic",
  LIFECYCLE: "Lifecycle",
};
const BASIS_META: Record<string, { color: string; label: string }> = {
  RULE_DERIVED: { color: "#2f7d4f", label: "Observed / rule-derived" },
  ESTIMATED_JUDGMENT: { color: "#3538cd", label: "Estimated judgment" },
  CANDIDATE: { color: "#9a6a12", label: "AI candidate" },
};

export default function TagProfile({ tags }: { tags: TagScoreRec[] }) {
  const [hover, setHover] = useState<TagScoreRec | null>(null);
  const grouped = useMemo(() => {
    const g: Record<string, TagScoreRec[]> = {};
    tags.forEach((t) => (g[t.realm] ||= []).push(t));
    Object.values(g).forEach((arr) => arr.sort((a, b) => b.score - a.score));
    return g;
  }, [tags]);

  const orderedRealms = REALM_ORDER.filter((r) => grouped[r]);

  return (
    <div className="tag-profile">
      <div className="tag-profile-legend">
        {Object.entries(BASIS_META).map(([k, v]) => (
          <span key={k} className="legend-item"><span className="legend-dot" style={{ background: v.color }} />{v.label}</span>
        ))}
      </div>
      <div className="tag-profile-grid">
        {orderedRealms.map((realm) => (
          <div key={realm} className="tag-realm-col">
            <div className="tag-realm-title">{REALM_LABEL[realm] || realm}</div>
            {grouped[realm].map((t, i) => {
              const meta = BASIS_META[t.basis] || { color: "#726d63" };
              return (
                <div
                  key={i}
                  className="tag-bar-row"
                  onMouseEnter={() => setHover(t)}
                  onMouseLeave={() => setHover((h) => (h === t ? null : h))}
                >
                  <div className="tag-bar-label">{t.tag}</div>
                  <div className="tag-bar-track">
                    <div className="tag-bar-fill" style={{ width: `${t.score * 10}%`, background: meta.color }} />
                  </div>
                  <div className="tag-bar-score">{t.score}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {hover && (
        <div className="tag-tooltip">
          <b>{hover.tag}</b> · {hover.score}/10 · <span style={{ color: BASIS_META[hover.basis]?.color }}>{BASIS_META[hover.basis]?.label}</span>
          <div className="tag-tooltip-rationale">{hover.rationale}</div>
        </div>
      )}
    </div>
  );
}
