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
        <meta name="author" content="The Gifting Bloom" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" sizes="32x32 48x48 64x64" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@400;500;600;700&display=swap"
        />
        {data.assets.css.map((attributes) => (
          <link key={attributes.href} rel="stylesheet" {...attributes} />
        ))}
        {data.assets.js.map((attributes) => (
          <link key={attributes.href} rel="modulepreload" {...attributes} />
        ))}
      </head>
      <body>
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
