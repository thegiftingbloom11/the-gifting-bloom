import { defineHandler } from "nitro";
import { getSiteOrigin } from "../utils/site-origin";

export default defineHandler((event) => {
  const origin = getSiteOrigin(event.req.url);
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${origin}/sitemap.xml\n`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
});
