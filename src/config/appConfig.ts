/**
 * Application & Deployment Domain Configuration
 * 
 * Official Domain: https://mdanmedo-erp-sap-s-4hana-6103-ai-studio-4gfwlenf4.vercel.app
 */

export const OFFICIAL_APP_DOMAIN = "https://mdanmedo-erp-sap-s-4hana-6103-ai-studio-4gfwlenf4.vercel.app";

/**
 * Returns the current active base URL dynamically with fallback to the official Vercel domain.
 */
export function getAppBaseUrl(): string {
  if (typeof window !== "undefined" && window.location && window.location.origin && !window.location.origin.includes("localhost") && !window.location.origin.includes("127.0.0.1")) {
    return window.location.origin;
  }
  return OFFICIAL_APP_DOMAIN;
}

/**
 * Generates an official client/tenant access link using the verified production domain
 */
export function generateClientPortalUrl(clientSlugOrId: string, customPath: string = ""): string {
  const base = OFFICIAL_APP_DOMAIN;
  const path = customPath ? `/${customPath.replace(/^\//, '')}` : "";
  return `${base}?client=${encodeURIComponent(clientSlugOrId)}${path}`;
}

/**
 * Generates an invoice/receipt public verification and sharing URL
 */
export function generateDocumentShareUrl(docType: "invoice" | "voucher" | "statement", docId: string): string {
  const base = OFFICIAL_APP_DOMAIN;
  return `${base}?view=${docType}&id=${encodeURIComponent(docId)}`;
}
