// Prompt 1 disambiguated internal placeholders for products whose exact SKU
// code couldn't be confirmed on the official source (e.g. "UNVERIFIED-preethi-gs-glamsteel-3b").
// Never show that internal id to the user — show an honest "not confirmed" label instead.
export function displaySku(sku: string): string {
  return sku.startsWith("UNVERIFIED") ? "SKU not confirmed" : sku;
}

// The app's single scrollable content pane (.main) does not reset scroll position on its own
// when the page inside it changes -- call this on every navigation (top-level nav, sub-tabs,
// and drill-down within a page) so the user always lands at the top of what they clicked into.
export function scrollContentToTop(): void {
  document.querySelector(".main")?.scrollTo({ top: 0 });
}
