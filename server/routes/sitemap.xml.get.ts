import { defineHandler } from "nitro";
import { getStore } from "../../src/lib/bloom-api.server";
import { indexablePaths, siteOrigin } from "../../src/lib/bloom-seo";

export default defineHandler(async (event) => {
  const origin = siteOrigin(event.req.url);
  const paths = indexablePaths(await getStore());
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
