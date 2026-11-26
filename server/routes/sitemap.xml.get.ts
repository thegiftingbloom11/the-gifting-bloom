import { defineHandler } from "nitro";
import { getStore } from "../../src/lib/bloom-api.server";
import { bouquetBuilderEnabled } from "../../src/lib/bloom";

export default defineHandler(async (event) => {
  const origin =
    import.meta.env["VITE_SITE_URL"]?.replace(/\/+$/, "") || new URL(event.req.url).origin;
  const { products } = await getStore();
  const paths = [
    "/",
    "/bouquets",
    "/mini-gifts",
    ...(bouquetBuilderEnabled ? ["/customise"] : []),
    "/our-story",
    "/bloom-diaries",
    "/gift-finder",
    "/contact",
    "/privacy-policy",
    "/terms-conditions",
    ...products
      .filter((product) => !product.is_demo)
      .map((product) => "/product/" + encodeURIComponent(product.slug)),
  ];
  const entries = paths
    .map(
      (path) =>
        "<url><loc>" +
        (origin + path).replace(/&/g, "&amp;").replace(/</g, "&lt;") +
        "</loc></url>",
    )
    .join("");
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      entries +
      "</urlset>",
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
});
