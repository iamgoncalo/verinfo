export type Status = "CURRENT" | "LEGACY" | "SUPPORT_ONLY" | "HISTORICAL" | "UNKNOWN";
export type ImgStatus = "EXACT_VERIFIED" | "FAMILY_VERIFIED" | "UNVERIFIED";
export type LabelStatus = "VERIFIED" | "RULE_DERIVED" | "EVIDENCE_DERIVED" | "CANDIDATE" | "REJECTED" | "UNKNOWN";

export interface World {
  id: string;
  name: string;
  tagline: string;
}

export interface Brand {
  id: string;
  name: string;
  domain: string;
  ownership: string;
  status: string;
}

export interface Category {
  id: string;
  brand: string;
  name: string;
  status: string;
  world: string;
}

export interface Family {
  id: string;
  brand: string;
  category: string;
  name: string;
  status: string;
}

export interface ImageRec {
  url: string;
  type: string;
  status: ImgStatus;
  format: string;
}

export interface SpecRec {
  field: string;
  value: string;
  state: string;
}

export interface PriceRec {
  country: string;
  value: string;
  currency: string;
  type: string;
  note: string;
}

export interface TagScoreRec {
  realm: string;
  tag: string;
  score: number;
  basis: "RULE_DERIVED" | "ESTIMATED_JUDGMENT" | "CANDIDATE";
  rationale: string;
}

export interface Product {
  id: string;
  brand: string;
  category: string;
  family: string;
  world: string;
  sku: string;
  name: string;
  region: string;
  status: Status;
  url: string;
  confidence: string;
  thumb: string | null;
  thumbExact: boolean;
  images: ImageRec[];
  specs: SpecRec[];
  prices: PriceRec[];
  apps: string[];
  tags: TagScoreRec[];
}

export interface LabelRec {
  id: string;
  type: string;
  name: string;
  definition: string;
  scope: string;
  status: LabelStatus;
  ruleId: string;
}

export interface AssocRec {
  from: string;
  fromType: string;
  rel: string;
  to: string;
  toType: string;
  class: string;
  evidenceState: string;
  confidence: string;
  notes: string;
}

export interface SourceRec {
  id: string;
  url: string;
  publisher: string;
  tier: string;
  roles: string;
  geography: string;
  retrievedAt: string;
}

export type Positioning = "DIRECT" | "ADJACENT" | "SUBSTITUTE";
export type CompImgMatch = "VERIFIED_EXACT" | "VERIFIED_FAMILY" | "VERIFIED_MARKET_VARIANT" | "UNSURE" | "MISSING";
export type Corroboration = "CORROBORATED" | "NOT_FOUND" | "CONTRADICTED";
export type CapabilityGroup = "PERFORMANCE" | "PERCEPTION" | "INTELLIGENCE" | "EXPERIENCE" | "ECONOMICS" | "SUSTAINABILITY" | "SAFETY_CERTIFICATION";
export type CapEvidenceState = "OBSERVED_SPEC" | "MANUFACTURER_CLAIM" | "INDEPENDENTLY_VERIFIED";
export type IntelDimension = "SENSE" | "REACT" | "ADAPT" | "PREDICT" | "LEARN" | "COORDINATE";
export type IntelStatus = "EVIDENCED" | "UNKNOWN";
export type TcoCompleteness = "COMPLETE" | "PARTIAL";

export interface Competitor {
  id: string;
  name: string;
  parentCompany: string;
  hqCountry: string;
  hqCity: string;
  originCountry: string;
  domain: string;
  notes: string;
  logoUrl: string;
  logoState: string;
  logoBg: string;
}

export interface CompPriceRec {
  country: string;
  type: string;
  value: string;
  currency: string;
  observedAt: string;
}

export interface CompSpecRec {
  field: string;
  value: string;
}

export interface CompImageRec {
  url: string;
  publisher: string;
  matchState: CompImgMatch;
  retrievedAt: string;
}

export interface CompClaimRec {
  claim: string;
  claimType: string;
  testContext: string;
  normalized: string;
  corroboration: Corroboration;
  conflict: string;
  limitation: string;
}

export interface CompCertRec {
  body: string;
  ref: string;
  status: string;
  establishes: string;
}

export interface CompCapabilityRec {
  realm: string;
  tag: string;
  score: number;
  basis: "RULE_DERIVED" | "ESTIMATED_JUDGMENT" | "CANDIDATE";
  rationale: string;
}

export interface CompIntelRec {
  dimension: IntelDimension;
  status: IntelStatus;
  note: string;
}

export interface CompTcoRec {
  market: string;
  purchasePrice: string;
  currency: string;
  filterPrice: string;
  replacementIntervalMonths: string;
  tco1y: string;
  tco3y: string;
  tco5y: string;
  completeness: TcoCompleteness;
  assumptions: string;
}

export interface CompetitorProduct {
  id: string;
  competitor: string;
  world: string;
  category: string;
  name: string;
  model: string;
  positioning: Positioning;
  markets: string;
  url: string;
  notes: string;
  thumb: string | null;
  images: CompImageRec[];
  specs: CompSpecRec[];
  prices: CompPriceRec[];
  claims: CompClaimRec[];
  certifications: CompCertRec[];
  capabilities: CompCapabilityRec[];
  intelligence: CompIntelRec[];
  tco: CompTcoRec[];
}

export interface SiteData {
  worlds: World[];
  brands: Brand[];
  categories: Category[];
  families: Family[];
  products: Product[];
  labels: LabelRec[];
  associations: AssocRec[];
  sources: SourceRec[];
  competitors: Competitor[];
  competitorProducts: CompetitorProduct[];
}

export type ViewLevel = "worlds" | "brands" | "categories" | "families" | "products";

export interface NavState {
  world: string | null;
  brand: string | null;
  category: string | null;
  family: string | null;
}
