import { lazy, Suspense, useCallback, useState, type ReactNode } from "react";
import { Navigate, matchPath, useLocation } from "react-router";
import { ArrowRight } from "lucide-react";
import { Contact, Diaries, Home, OurStory, Policy } from "@/components/bloom-content";
import { Customise } from "@/components/bloom-customise";
import { Detail, Gallery, GiftFinder } from "@/components/bloom-gallery";
import { BloomLogo } from "@/components/bloom-logo";
import { Link, RouteScroll } from "@/components/bloom-navigation";
import { BloomShell } from "@/components/bloom-shell";
import { getStore, type StoreData } from "@/lib/bloom-api";

const AdminLogin = lazy(() =>
  import("@/components/bloom-admin").then((module) => ({ default: module.AdminLogin })),
);
const AdminDashboard = lazy(() =>
  import("@/components/bloom-admin").then((module) => ({ default: module.AdminDashboard })),
);

const pages: Record<string, { title: string; description: string; view: () => ReactNode }> = {
  "/bouquets": {
    title: "Handmade bouquets",
    description: "Explore our handmade flower designs.",
    view: () => <Gallery category="bouquets" />,
  },
  "/mini-gifts": {
    title: "Mini gifts",
    description: "Explore little handmade keepsakes.",
    view: () => <Gallery category="mini-gifts" />,
  },
  "/customise": {
    title: "Design a bouquet",
    description: "Preview a bouquet with your choice of flowers and wrapping.",
    view: () => <Customise />,
  },
  "/our-story": {
    title: "Our story",
    description: "Meet The Gifting Bloom and discover how our gifts are made.",
    view: () => <OurStory />,
  },
  "/bloom-diaries": {
    title: "Bloom Diaries",
    description: "Instagram posts and moments from The Gifting Bloom.",
    view: () => <Diaries />,
  },
  "/gift-finder": {
    title: "Gift finder",
    description: "Find a handmade gift by occasion and colour.",
    view: () => <GiftFinder />,
  },
  "/contact": {
    title: "Contact",
    description: "Get in touch about a handmade gift or bouquet design.",
    view: () => <Contact />,
  },
  "/privacy-policy": {
    title: "Privacy policy",
    description: "How The Gifting Bloom handles enquiry details.",
    view: () => <Policy type="privacy" />,
  },
  "/terms-conditions": {
    title: "Website terms",
    description: "Terms for The Gifting Bloom website.",
    view: () => <Policy type="terms" />,
  },
  "/admin": {
    title: "Owner dashboard",
    description: "Manage the gallery and enquiries.",
    view: () => <AdminDashboard />,
  },
  "/admin/login": {
    title: "Owner sign-in",
    description: "Sign in to manage The Gifting Bloom website.",
    view: () => <AdminLogin />,
  },
};

const home = {
  title: "Handmade gifts and bouquets",
  description: "Handmade bouquets, little keepsakes and personalised gifts from The Gifting Bloom.",
};

export function galleryRedirect(url: URL) {
  const occasion = url.searchParams.get("occasion");
  const search = occasion ? "?" + new URLSearchParams({ occasion }).toString() : "";
  return "/" + search + "#collection";
}

export function resolvePage(
  path: string,
  store: StoreData,
): {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
  structuredData?: string;
  status: number;
  view?: (() => ReactNode) | undefined;
} {
  const pathname = path.replace(/\/+$/, "") || "/";
  const slug = matchPath("/product/:slug", pathname)?.params["slug"];
  const product = slug && store.products.find((item) => item.slug === slug);
  if (product)
    return {
      title: product.name,
      description: product.seo || product.description || product.name,
      image: product.image_url,
      noIndex: product.is_demo,
      ...(product.is_demo
        ? {}
        : {
            structuredData: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: product.name,
              description: product.seo || product.description || product.name,
              image: product.image_url || undefined,
            }).replace(/</g, "\\u003c"),
          }),
      status: 200,
      view: () => <Detail key={product.id} product={product} />,
    };
  if (pathname === "/") return { ...home, status: 200, view: undefined };
  if (Object.hasOwn(pages, pathname)) {
    return { ...pages[pathname]!, noIndex: pathname.startsWith("/admin"), status: 200 };
  }
  return {
    title: "Page not found",
    description: "Explore the collection of handmade gifts.",
    noIndex: true,
    status: 404,
    view: () => (
      <main className="wrap inner-page">
        <div className="empty">
          <BloomLogo className="mx-auto mb-3 size-20" />
          <p className="eyebrow">404</p>
          <h1>This bloom has moved.</h1>
          <Link className="btn btn-primary" to="/" hash="collection">
            Explore the gallery <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    ),
  };
}

function webUrl(value: string, base?: string) {
  try {
    const url = new URL(value, base);
    return url.protocol === "https:" || url.protocol === "http:" ? url : undefined;
  } catch {
    return undefined;
  }
}

export function App({
  initialStore,
  requestOrigin,
}: {
  initialStore: StoreData;
  requestOrigin: string;
}) {
  const [store, setStore] = useState(initialStore);
  const refreshStore = useCallback(async () => setStore(await getStore()), []);
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  const search = new URLSearchParams(location.search);
  if (pathname === "/shop")
    return (
      <Navigate
        to={galleryRedirect(new URL(location.pathname + location.search, "https://example.com"))}
        replace
      />
    );
  const page = resolvePage(pathname, store);
  const title = page.title + " | The Gifting Bloom";
  const configuredOrigin = import.meta.env["VITE_SITE_URL"];
  const canonicalOrigin = configuredOrigin && webUrl(configuredOrigin)?.origin;
  const origin = canonicalOrigin || requestOrigin;
  const productPreview = page.image && webUrl(page.image, origin)?.href;
  const previewImage = productPreview || new URL("/the-gifting-bloom-preview.jpg", origin).href;
  const previewAlt = productPreview ? page.title : "The Gifting Bloom logo";
  return (
    <BloomShell store={store} refreshStore={refreshStore}>
      <title>{title}</title>
      <meta name="description" content={page.description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:site_name" content="The Gifting Bloom" />
      <meta property="og:url" content={origin + pathname} />
      <meta property="og:image" content={previewImage} />
      {!productPreview && (
        <>
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      <meta property="og:image:alt" content={previewAlt} />
      <meta name="twitter:image" content={previewImage} />
      <meta name="twitter:image:alt" content={previewAlt} />
      {page.noIndex && <meta name="robots" content="noindex, follow" />}
      {page.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: page.structuredData }}
        />
      )}
      {canonicalOrigin && page.status === 200 && <link rel="canonical" href={origin + pathname} />}
      <RouteScroll />
      <Suspense
        fallback={
          <main className="wrap inner-page" role="status">
            Loading…
          </main>
        }
      >
        {page.view ? (
          page.view()
        ) : (
          <Home occasion={search.get("occasion") ?? ""} category={search.get("category") ?? ""} />
        )}
      </Suspense>
    </BloomShell>
  );
}
