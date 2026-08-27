// Prompt 1 disambiguated internal placeholders for products whose exact SKU
// code couldn't be confirmed on the official source (e.g. "UNVERIFIED-preethi-gs-glamsteel-3b").
// Never show that internal id to the user — show an honest "not confirmed" label instead.
export function displaySku(sku: string): string {
  return sku.startsWith("UNVERIFIED") ? "SKU not confirmed" : sku;
}
