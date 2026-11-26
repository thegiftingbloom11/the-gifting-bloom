/// <reference types="nitro/vite/types" />
import "./styles.css";
import { renderToReadableStream } from "react-dom/server.edge";
import { StaticRouter } from "react-router";
import clientAssets from "./entry-client?assets=client";
import serverAssets from "./entry-server?assets=ssr";
import { App, galleryRedirect, resolvePage } from "./app";
import { BloomDocument } from "./bloom-document";
import { getStore } from "./lib/bloom-api.server";
import { renderErrorPage } from "./lib/error-page";

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    if (url.pathname.replace(/\/+$/, "") === "/shop") {
      return new Response(null, { status: 301, headers: { Location: galleryRedirect(url) } });
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    try {
      const store = await getStore();
      const status = resolvePage(url.pathname, store).status;
      const headers = { "Content-Type": "text/html; charset=utf-8" };
      if (request.method === "HEAD") return new Response(null, { status, headers });
      const assets = clientAssets.merge(serverAssets);
      // The production client CSS already includes the styles imported by the SSR entry.
      const css = import.meta.env.PROD && clientAssets.css.length ? clientAssets.css : assets.css;
      const data = {
        store,
        requestOrigin: url.origin,
        assets: { entry: assets.entry, css, js: assets.js },
      };
      const body = await renderToReadableStream(
        <BloomDocument data={data}>
          <StaticRouter location={url.pathname + url.search}>
            <App initialStore={store} requestOrigin={data.requestOrigin} />
          </StaticRouter>
        </BloomDocument>,
      );
      return new Response(body, { status, headers });
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
  },
};
