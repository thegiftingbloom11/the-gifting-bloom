import { defineHandler } from "nitro";
import { siteOrigin } from "../../src/lib/bloom-seo";

export default defineHandler((event) => {
  const origin = siteOrigin(event.req.url);
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${origin}/sitemap.xml\n`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
});
