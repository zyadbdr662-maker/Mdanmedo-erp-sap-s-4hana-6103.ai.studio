/**
 * Application & Deployment Domain Configuration
 * 
 * Official Live Vercel & Cloud Run Domains
 */

export const OFFICIAL_APP_DOMAIN = "https://ais-pre-nb2t4ysydt63tbljcawurb-174680061958.europe-west1.run.app";
export const VERCEL_APP_DOMAIN = "https://mdanmedo-erp-sap-s-4hana-6103-ai-st-iota.vercel.app";

/**
 * Returns the Vercel production domain or active origin
 */
export function getVercelBaseUrl(): string {
  if (typeof window !== "undefined" && window.location && window.location.origin) {
    const origin = window.location.origin;
    if (origin.includes("vercel.app")) {
      return origin;
    }
  }
  return VERCEL_APP_DOMAIN;
}

/**
 * Returns the current active base URL dynamically with fallback to Vercel domain.
 */
export function getAppBaseUrl(): string {
  if (typeof window !== "undefined" && window.location && window.location.origin) {
    const origin = window.location.origin;
    if (origin.startsWith("http://") || origin.startsWith("https://")) {
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return VERCEL_APP_DOMAIN;
      }
      return origin;
    }
  }
  return VERCEL_APP_DOMAIN;
}

/**
 * Generates an official Vercel client/tenant access link
 */
export function generateClientPortalUrl(clientSlugOrId: string, customPath: string = ""): string {
  const base = VERCEL_APP_DOMAIN;
  const path = customPath ? `&path=${encodeURIComponent(customPath.replace(/^\//, ''))}` : "";
  return `${base}/?tenant=${encodeURIComponent(clientSlugOrId)}${path}`;
}

/**
 * Generates a Vercel-backed employee portal link with role and token parameters
 */
export function generateVercelEmployeeLink(slug: string, role: string, token: string): string {
  const base = VERCEL_APP_DOMAIN;
  const cleanRole = role.toUpperCase();
  const subPath = `/employee/${cleanRole.toLowerCase()}`;
  return `${base}/?tenant=${encodeURIComponent(slug)}&role=${encodeURIComponent(cleanRole)}&token=${encodeURIComponent(token)}&path=${encodeURIComponent(subPath)}`;
}

/**
 * Generates an invoice/receipt public verification and sharing URL on Vercel
 */
export function generateDocumentShareUrl(docType: "invoice" | "voucher" | "statement", docId: string): string {
  const base = VERCEL_APP_DOMAIN;
  return `${base}/?view=${docType}&id=${encodeURIComponent(docId)}`;
}


