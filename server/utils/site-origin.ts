export function getSiteOrigin(requestUrl: string) {
  return import.meta.env["VITE_SITE_URL"]?.replace(/\/+$/, "") || new URL(requestUrl).origin;
}
