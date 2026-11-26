import type { StoreData } from "./bloom-api";
import { bouquetBuilderEnabled, instagram, matchesProductCategory, type Product } from "./bloom";

export const siteName = "The Gifting Bloom";

export const homeSeo = {
  title: "Handmade Flower Bouquets & Gifts in Pune",
  description:
    "Explore handmade flower bouquets, single stems, floral keychains and festive keepsakes from The Gifting Bloom in Pune. Enquire about a gift or a custom design.",
};

export const collectionPages = [
  {
    path: "/bouquets",
    filter: "bouquets",
    name: "Handmade Bouquets",
    title: "Handmade Flower Bouquets",
    description:
      "Browse handmade sunflower, lily and mixed-flower bouquets in different colours and wraps, and enquire about a bouquet for someone special.",
  },
  {
    path: "/single-flowers",
    filter: "single-flowers",
    name: "Single Flowers",
    title: "Handmade Single Flowers & Stems",
    description:
      "Explore individually wrapped handmade lilies, sunflowers and other floral stems for small surprises, thank-yous and thoughtful keepsakes.",
  },
  {
    path: "/keychains",
    filter: "keychains",
    name: "Keychains",
    title: "Handmade Floral Keychains",
    description:
      "Discover handmade flower keychains, from tulips and sunflowers to lavender and pearl designs, for bags, keys and small gifts.",
  },
  {
    path: "/diya-holders",
    filter: "diya-holders",
    name: "Diya Holders",
    title: "Handmade Flower Diya Holders",
    description:
      "Browse handmade floral diya holders with layered petals, pearl accents and colourful finishes for festive displays and gifting.",
  },
  {
    path: "/car-dashboard-pots",
    filter: "car-dashboard-pots",
    name: "Car Dashboard Pots",
    title: "Handmade Car Dashboard Flower Pots",
    description:
      "Explore little handmade sunflower and daisy pots designed for car dashboards, with photos and details for each gift.",
  },
  {
    path: "/festive-gifts",
    filter: "festive-gifts",
    name: "Festive Gifts",
    title: "Handmade Festive Gifts & Décor",
    description:
      "Find handmade gifts for festive celebrations, including colourful diya holders, Shubh Labh hangings and other festive designs from the collection.",
  },
  {
    path: "/flower-pot-flowers",
    filter: "flower-pot-flowers",
    name: "Flower Pot Flowers",
    title: "Handmade Flowers for Pots & Vases",
    description:
      "Browse handmade stems and colourful floral arrangements for pots and vases, with photos and details from The Gifting Bloom.",
  },
  {
    path: "/mini-gifts",
    filter: "mini-gifts",
    name: "Mini Gifts",
    title: "Small Handmade Gifts & Keepsakes",
    description:
      "Explore small handmade keepsakes, including floral keychains, flower diya holders and dashboard pots, for the people who brighten your day.",
  },
] as const;

export type CollectionPage = (typeof collectionPages)[number];

export const publicPageSeo = {
  "/customise": {
    title: "Design a bouquet",
    description:
      "Preview a custom handmade bouquet by choosing the flowers, colours and wrapping, then send your design to The Gifting Bloom.",
  },
  "/our-story": {
    title: "Our Story & Handmade Process",
    description:
      "Meet The Gifting Bloom and see how handmade flowers and thoughtful gifts come together, from the first idea to the finished wrapping.",
  },
  "/bloom-diaries": {
    title: "Bloom Diaries & Studio Updates",
    description:
      "See recent creations, handmade gift ideas and moments behind the scenes from The Gifting Bloom’s Instagram and studio collection.",
  },
  "/gift-finder": {
    title: "Handmade Gift Finder by Occasion & Colour",
    description:
      "Find a handmade gift by choosing the recipient, occasion and colours they like. Explore matching bouquets, flowers and little keepsakes.",
  },
  "/contact": {
    title: "Contact",
    description:
      "Contact The Gifting Bloom in Uruli Kanchan, Pune, to ask about a handmade gift, bouquet, colour choice or custom design.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "Learn how The Gifting Bloom uses and protects the information you share when sending a gift enquiry.",
  },
  "/terms-conditions": {
    title: "Website Terms & Conditions",
    description:
      "Read the terms for browsing The Gifting Bloom, viewing handmade designs and sending an enquiry through the website.",
  },
};

export function matchesCollection(product: Product, filter: string) {
  return filter === "festive-gifts"
    ? product.category === "festive-decor" || product.occasions.includes("Festive Gifting")
    : matchesProductCategory(product.category, filter);
}

export function collectionForCategory(category: string) {
  return collectionPages.find(
    ({ filter }) => filter === (category === "festive-decor" ? "festive-gifts" : category),
  );
}

export function hasPublishedProducts(products: Product[], filter: string) {
  return products.some((product) => !product.is_demo && matchesCollection(product, filter));
}

export function productPath(product: Product) {
  return "/product/" + encodeURIComponent(product.slug);
}

export function indexablePaths(store: StoreData) {
  return [
    ...new Set([
      "/",
      ...Object.keys(publicPageSeo).filter(
        (path) => path !== "/customise" || bouquetBuilderEnabled,
      ),
      ...collectionPages
        .filter(({ filter }) => hasPublishedProducts(store.products, filter))
        .map(({ path }) => path),
      ...store.products.filter((product) => !product.is_demo).map(productPath),
    ]),
  ];
}

export function webUrl(value: string, base?: string) {
  try {
    const url = new URL(value, base);
    return url.protocol === "https:" || url.protocol === "http:" ? url : undefined;
  } catch {
    return undefined;
  }
}

export function siteOrigin(requestOrigin: string) {
  return webUrl(import.meta.env["VITE_SITE_URL"] || "")?.origin || new URL(requestOrigin).origin;
}

export function productDescription(product: Product) {
  return (
    product.seo?.trim() ||
    product.description?.trim() ||
    `See ${product.name} in the ${product.categoryName} collection and enquire at ${siteName}.`
  );
}

export function structuredData({
  origin,
  path,
  name,
  store,
  product,
}: {
  origin: string;
  path: string;
  name: string;
  store: StoreData;
  product?: Product;
}) {
  const url = origin + path;
  const organization = origin + "/#organization";
  const graph: Record<string, unknown>[] = [];
  if (path === "/") {
    const logo = store.settings["logo"]?.trim() || "/the-gifting-bloom-logo.png";
    graph.push(
      {
        "@type": "Organization",
        "@id": organization,
        name: store.settings["brand_name"] || siteName,
        url: origin + "/",
        logo: (webUrl(logo, origin) || new URL("/the-gifting-bloom-logo.png", origin)).href,
        sameAs: [webUrl(store.settings["instagram"] || instagram)?.href || instagram],
      },
      {
        "@type": "WebSite",
        "@id": origin + "/#website",
        name: siteName,
        url: origin + "/",
        publisher: { "@id": organization },
      },
    );
  } else {
    const collection = product && collectionForCategory(product.category);
    const breadcrumbs = [{ name: product ? "Gallery" : "Home", item: origin + "/" }];
    if (collection && product) {
      breadcrumbs.push({ name: product.categoryName, item: origin + collection.path });
    }
    breadcrumbs.push({ name, item: url });
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        ...crumb,
      })),
    });
    if (product) {
      const image = [
        ...new Set(
          [product.image_url, ...product.images]
            .filter(Boolean)
            .map((src) => webUrl(src, origin)?.href)
            .filter(Boolean),
        ),
      ];
      graph.push({
        "@type": "Product",
        "@id": url + "#product",
        url,
        name: product.name,
        description: product.description?.trim() || undefined,
        image: image.length ? image : undefined,
        category: product.categoryName,
      });
    }
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
    /</g,
    "\\u003c",
  );
}
