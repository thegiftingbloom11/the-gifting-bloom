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
import { usePageAnalytics } from "@/lib/bloom-analytics";
import { bouquetBuilderEnabled, type Product } from "@/lib/bloom";
import {
  collectionPages,
  hasPublishedProducts,
  homeSeo,
  productDescription,
  productPath,
  publicPageSeo,
  siteName,
  siteOrigin,
  structuredData,
  webUrl,
} from "@/lib/bloom-seo";

const AdminLogin = lazy(() =>
  import("@/components/bloom-admin").then((module) => ({ default: module.AdminLogin })),
);
const AdminDashboard = lazy(() =>
  import("@/components/bloom-admin").then((module) => ({ default: module.AdminDashboard })),
);

const publicViews: Record<keyof typeof publicPageSeo, () => ReactNode> = {
  "/customise": () => <Customise />,
  "/our-story": () => <OurStory />,
  "/bloom-diaries": () => <Diaries />,
  "/gift-finder": () => <GiftFinder />,
  "/contact": () => <Contact />,
  "/privacy-policy": () => <Policy type="privacy" />,
  "/terms-conditions": () => <Policy type="terms" />,
};

const ownerPages: Record<string, { title: string; description: string; view: () => ReactNode }> = {
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
  canonicalPath?: string;
  product?: Product;
  breadcrumbName?: string;
  noIndex?: boolean;
  status: number;
  view?: (() => ReactNode) | undefined;
} {
  const pathname = path.replace(/\/+$/, "") || "/";
  let slug: string | undefined;
  if (matchPath("/product/:slug", pathname)) {
    try {
      slug = decodeURIComponent(pathname.slice("/product/".length));
    } catch {
      // A malformed escape is treated as an unknown product URL.
    }
  }
  const product = slug && store.products.find((item) => item.slug === slug);
  if (product)
    return {
      title: product.name,
      description: productDescription(product),
      canonicalPath: productPath(product),
      product,
      noIndex: product.is_demo,
      status: 200,
      view: () => <Detail key={product.id} product={product} />,
    };
  if (pathname === "/") return { ...homeSeo, canonicalPath: "/", status: 200 };
  const collection = collectionPages.find(({ path }) => path === pathname);
  if (collection) {
    return {
      title: collection.title,
      description: collection.description,
      breadcrumbName: collection.name,
      canonicalPath: collection.path,
      noIndex: !hasPublishedProducts(store.products, collection.filter),
      status: 200,
      view: () => <Gallery collection={collection} />,
    };
  }
  if (pathname === "/customise" && !bouquetBuilderEnabled) {
    return {
      ...publicPageSeo["/contact"],
      view: publicViews["/contact"],
      noIndex: true,
      status: 200,
    };
  }
  if (Object.hasOwn(publicViews, pathname)) {
    const key = pathname as keyof typeof publicViews;
    return { ...publicPageSeo[key], view: publicViews[key], canonicalPath: key, status: 200 };
  }
  if (Object.hasOwn(ownerPages, pathname)) {
    return { ...ownerPages[pathname]!, noIndex: true, status: 200 };
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
  const page = resolvePage(pathname, store);
  const title = page.title + " | " + siteName;
  const canonicalPath = page.noIndex ? undefined : page.canonicalPath;
  usePageAnalytics(canonicalPath, title, page.product);
  if (pathname === "/shop")
    return (
      <Navigate
        to={galleryRedirect(new URL(location.pathname + location.search, "https://example.com"))}
        replace
      />
    );
  const origin = siteOrigin(requestOrigin);
  const productPreview = page.product?.image_url && webUrl(page.product.image_url, origin)?.href;
  const previewImage = productPreview || new URL("/the-gifting-bloom-preview.jpg", origin).href;
  const previewAlt = productPreview
    ? page.product?.image_alt?.trim() || page.title
    : "The Gifting Bloom logo";
  const schema =
    canonicalPath &&
    structuredData({
      origin,
      path: canonicalPath,
      name: page.breadcrumbName || page.title,
      store,
      ...(page.product && { product: page.product }),
    });
  return (
    <BloomShell store={store} refreshStore={refreshStore}>
      <title>{title}</title>
      <meta name="description" content={page.description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={page.product ? "product" : "website"} />
      <meta property="og:url" content={origin + (canonicalPath || pathname)} />
      <meta property="og:image" content={previewImage} />
      {!productPreview && (
        <>
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      <meta property="og:image:alt" content={previewAlt} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={previewImage} />
      <meta name="twitter:image:alt" content={previewAlt} />
      {page.noIndex && <meta name="robots" content="noindex, follow" />}
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />}
      {canonicalPath && <link rel="canonical" href={origin + canonicalPath} />}
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
