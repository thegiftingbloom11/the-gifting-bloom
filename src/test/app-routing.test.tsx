import { describe, expect, it } from "vitest";
import { galleryRedirect, resolvePage } from "@/app";
import type { StoreData } from "@/lib/bloom-api";
import { studioCollection, withStudioCollection } from "@/lib/bloom-collection";
import { matchesProductCategory } from "@/lib/bloom";

const catalogue: StoreData = {
  products: studioCollection,
  categories: [],
  settings: {},
  reviews: [],
  reels: [],
  cloud: false,
};

describe("App routing", () => {
  it("resolves the homepage and published gallery items", () => {
    expect(resolvePage("/", catalogue).status).toBe(200);
    expect(resolvePage("/product/pocketful-of-sun", catalogue).title).toBe("Sunflower Bouquet");
    expect(resolvePage("/admin", catalogue).noIndex).toBe(true);
  });

  it("uses studio photographs and keeps existing mini gift links working", () => {
    const categories = new Set(studioCollection.map((product) => product.category));
    expect(categories.size).toBe(6);
    expect(studioCollection.every((product) => product.image_url && !product.is_demo)).toBe(true);
    expect(
      studioCollection.filter((product) => matchesProductCategory(product.category, "mini-gifts")),
    ).toHaveLength(7);
  });

  it("keeps live catalogue entries without duplicating studio products or returning old demos", () => {
    const original = studioCollection[0]!;
    const cloudEdit = { ...original, id: "cloud-product", name: "Live sunflower bouquet" };
    const demo = { ...original, id: "demo-product", slug: "old-demo", is_demo: true };
    const result = withStudioCollection([cloudEdit, demo]);
    expect(result).toHaveLength(studioCollection.length);
    expect(result[0]).toEqual(cloudEdit);
  });

  it("redirects the legacy gallery URL with its occasion filter", () => {
    expect(galleryRedirect(new URL("https://example.com/shop?occasion=Just%20Because"))).toBe(
      "/?occasion=Just+Because#collection",
    );
  });

  it.each([
    "/cart",
    "/checkout",
    "/wishlist",
    "/order-confirmation",
    "/shipping-policy",
    "/return-refund-policy",
  ])("returns not found for %s", (path) => expect(resolvePage(path, catalogue).status).toBe(404));
});
