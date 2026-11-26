import type { ReactNode } from "react";
import type { StoreData } from "./lib/bloom-api";

export type BloomDocumentData = {
  store: StoreData;
  requestOrigin: string;
  assets: {
    entry: string | undefined;
    css: { href: string; "data-vite-dev-id"?: string }[];
    js: { href: string }[];
  };
};

export function BloomDocument({
  data,
  children,
}: {
  data: BloomDocumentData;
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-PZCKZQQ3" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag() { window.dataLayer.push(arguments); }
              gtag('js', new Date());
            `,
          }}
        />
        <meta name="author" content="The Gifting Bloom" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" sizes="32x32 48x48 64x64" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link
          rel="preload"
          href="/fonts/lora.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/dm-sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {data.assets.css.map((attributes) => (
          <link key={attributes.href} rel="stylesheet" {...attributes} />
        ))}
        {data.assets.js.map((attributes) => (
          <link key={attributes.href} rel="modulepreload" {...attributes} />
        ))}
      </head>
      <body>
        <noscript>
          <style>{`.bloom-story-track { height: 100svh }`}</style>
        </noscript>
        <div id="app">{children}</div>
        <script
          id="bloom-data"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
        <script type="module" src={data.assets.entry} />
      </body>
    </html>
  );
}
