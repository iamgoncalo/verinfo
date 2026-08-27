type P = { size?: number; className?: string };

export const IconSearch = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
  </svg>
);
export const IconGrid = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
export const IconList = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);
export const IconClose = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);
export const IconChevLeft = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
export const IconChevRight = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
export const IconLayers = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>
);
export const IconTag = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41L11 3.83A2 2 0 009.59 3.24L4 3a1 1 0 00-1 1l.24 5.59a2 2 0 00.59 1.41l9.58 9.58a2 2 0 002.83 0l4.35-4.35a2 2 0 000-2.82z" />
    <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);
export const IconHome = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
  </svg>
);
export const IconHeart = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
  </svg>
);
export const IconLeaf = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 9.5 17 9.5S21.5 8 21 4c-2 2-4.5.5-6.5 2.5C13 8 3 9 3 20h8z" />
  </svg>
);
export const IconCoin = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5c0-1.4 1.1-2.2 2.5-2.2s2.5.7 2.5 1.8-1 1.6-2.5 1.9-2.5.9-2.5 1.9 1.1 1.8 2.5 1.8 2.5-.8 2.5-2.2" />
  </svg>
);
export const IconTarget = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);
export const IconBook = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);
export const IconGlobe = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);
// -- World icons (Food / Coffee / Air / Clean / Clothes / Home / Pets / Garden) --
export const IconFlame = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c1.2 3.2-2.8 4.4-2.8 8.2a2.8 2.8 0 005.6 0c0-1-.8-1.9-.8-2.9 1.8 1 3 3.1 3 5.3a5 5 0 11-10 0c0-4.3 3.2-6.4 5-10.6z" />
  </svg>
);
export const IconCup = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h13v5a5 5 0 01-5 5H9a5 5 0 01-5-5V8z" />
    <path d="M17 9.5h1.2a2.3 2.3 0 010 4.6H17" />
    <path d="M8 2.2c0 1-1 1-1 1.9s1 .9 1 1.9M12.2 2.2c0 1-1 1-1 1.9s1 .9 1 1.9" />
  </svg>
);
export const IconWind = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 7.5h11a2.3 2.3 0 10-2.3-2.3" />
    <path d="M2.5 12h15.2a2.5 2.5 0 11-2.5 2.5" />
    <path d="M2.5 16.5h9a2.3 2.3 0 102.3 2.3" />
  </svg>
);
export const IconDroplet = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.8s7 7.9 7 12.4a7 7 0 01-14 0c0-4.5 7-12.4 7-12.4z" />
  </svg>
);
export const IconShirt = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3L3 7.2l3 3 2-1.6V21h8V8.6l2 1.6 3-3L16 3l-2 2h-4L8 3z" />
  </svg>
);
export const IconCamera = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M8 7l1.4-2.8h5.2L16 7" />
    <circle cx="12" cy="13.5" r="3.3" />
  </svg>
);
export const IconPaw = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="9.2" r="1.7" /><circle cx="11.7" cy="6.4" r="1.7" /><circle cx="16.6" cy="7.6" r="1.7" /><circle cx="19.4" cy="11.8" r="1.7" />
    <path d="M12 12c-3.3 0-6.5 2.7-6.5 5.7 0 1.8 1.5 3.3 3.3 3.3 1.2 0 1.9-.6 3.2-.6s2 .6 3.2.6c1.8 0 3.3-1.5 3.3-3.3 0-3-3.2-5.7-6.5-5.7z" />
  </svg>
);
export const IconSprout = ({ size = 15 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-9" />
    <path d="M12 13C7 13 4 9 4 4c5 0 9 3 9 8" />
    <path d="M12 13c0-4.5 3-7 8-7 0 4-2.5 7-8 7z" />
  </svg>
);

export const IconFolder = ({ size = 40 }: P) => (
  <div style={{
    width: size, height: size * 0.8, borderRadius: 7, flexShrink: 0, position: "relative",
    background: "linear-gradient(160deg, var(--accent-soft), #e2ddf7)", border: "1px solid #d9d3f0",
  }}>
    <div style={{
      position: "absolute", top: -7, left: 0, width: size * 0.45, height: 8,
      background: "#e2ddf7", border: "1px solid #d9d3f0", borderBottom: "none", borderRadius: "5px 5px 0 0",
    }} />
  </div>
);
