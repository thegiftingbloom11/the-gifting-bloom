import { useEffect, useRef } from "react";
import type { Product } from "./bloom";
import { webUrl } from "./bloom-seo";

export function analyticsItem(product: Product) {
  return { item_id: product.slug, item_name: product.name, item_category: product.categoryName };
}

type AnalyticsEvent =
  | "bloom_page_view"
  | "view_item"
  | "view_item_list"
  | "select_item"
  | "generate_lead"
  | "contact_click";

export function trackBloomEvent(
  event: AnalyticsEvent,
  parameters: Record<string, unknown> = {},
  previousPage?: string,
) {
  if (typeof window === "undefined") return;
  const { origin, pathname } = window.location;
  const page = pathname.replace(/\/+$/, "") || "/";
  if (/^\/admin(?:\/|$)/i.test(page)) return;
  const browser = window as Window & { dataLayer?: unknown[] };
  const referrer = webUrl(document.referrer)?.origin;
  try {
    const layer = (browser.dataLayer ??= []);
    if ("ecommerce" in parameters) layer.push({ ecommerce: null });
    layer.push({
      ...parameters,
      event,
      page_location: origin + page,
      page_referrer: previousPage ? origin + previousPage : referrer ? referrer + "/" : "",
    });
  } catch (error) {
    if (import.meta.env.DEV) console.warn("Could not queue a storefront analytics event.", error);
  }
}

export function usePageAnalytics(
  path: string | undefined,
  title: string,
  product: Product | undefined,
) {
  const lastPage = useRef<string | undefined>(undefined);
  useEffect(() => {
    const previousPage = lastPage.current;
    if (path === previousPage) return;
    lastPage.current = path;
    if (!path) return;
    trackBloomEvent("bloom_page_view", { page_title: title }, previousPage);
    if (product) trackBloomEvent("view_item", { ecommerce: { items: [analyticsItem(product)] } });
  }, [path, title, product]);
}
