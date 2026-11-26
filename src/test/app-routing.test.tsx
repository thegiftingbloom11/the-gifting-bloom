import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { galleryRedirect, resolvePage } from "@/app";
import { BloomShell } from "@/components/bloom-shell";
import { Contact } from "@/components/bloom-content";
import type { StoreData } from "@/lib/bloom-api";
import { studioCollection, withStudioCollection } from "@/lib/bloom-collection";
import { bouquetBuilderEnabled, matchesProductCategory, matchesProductColours } from "@/lib/bloom";

const catalogue: StoreData = {
  products: studioCollection,
  categories: [],
  settings: {},
  reviews: [],
  reels: [],
  cloud: false,
};

describe("App routing", () => {
  it("opens WhatsApp with the contact form details and the prefilled gift enquiry", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    try {
      render(
        <MemoryRouter>
          <BloomShell store={catalogue} refreshStore={async () => {}}>
            <Contact giftName="Sunflower Bouquet" />
          </BloomShell>
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Test Customer" } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "9876543210" } });
      fireEvent.change(screen.getByLabelText(/delivery city/i), { target: { value: "Pune" } });
      fireEvent.change(screen.getByLabelText(/needed by/i), { target: { value: "2026-12-01" } });
      fireEvent.click(screen.getByRole("button", { name: "Send via WhatsApp" }));

      expect(open).toHaveBeenCalledExactlyOnceWith(
        expect.any(String),
        "_blank",
        "noopener,noreferrer",
      );
      const url = new URL(open.mock.calls[0]![0]!);
      expect(url.origin + url.pathname).toBe("https://wa.me/918767980311");
      expect(url.searchParams.get("text")).toBe(
        [
          "The Gifting Bloom | Gift enquiry",
          "",
          "Name: Test Customer",
          "Email: test@example.com",
          "Phone: 9876543210",
          "Delivery city: Pune",
          "Requested date: 2026-12-01",
          "",
          "Hi! I'd like to ask about Sunflower Bouquet.",
        ].join("\n"),
      );
    } finally {
      open.mockRestore();
    }
  });

  it("resolves the homepage and published gallery items", () => {
    expect(resolvePage("/", catalogue).status).toBe(200);
    expect(resolvePage("/product/pocketful-of-sun", catalogue).title).toBe("Sunflower Bouquet");
    expect(resolvePage("/admin", catalogue).noIndex).toBe(true);
  });

  it("keeps the bouquet builder URL usable when the builder is paused", () => {
    expect(resolvePage("/customise", catalogue)).toMatchObject({
      title: bouquetBuilderEnabled ? "Design a bouquet" : "Contact",
      noIndex: !bouquetBuilderEnabled,
      status: 200,
    });
  });

  it("shows configured business details and a tap-to-call number in the footer", () => {
    const settings = { contact_address: "Studio address", contact_email: "gifts@example.com" };
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <BloomShell store={{ ...catalogue, settings }} refreshStore={async () => {}}>
          <main />
        </BloomShell>
      </MemoryRouter>,
    );
    expect(html).toContain("Studio address");
    expect(html).toContain('href="mailto:gifts@example.com"');
    expect(html).toContain('href="tel:+918767980311"');
    expect(html).not.toContain(">Discover<");
  });

  it("shows the business address and email in Contact and the footer with blank settings", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <BloomShell
          store={{ ...catalogue, settings: { contact_address: " ", contact_email: "" } }}
          refreshStore={async () => {}}
        >
          <Contact />
        </BloomShell>
      </MemoryRouter>,
    );
    expect(html.match(/Uruli Kanchan, Pune - 412202, Maharashtra/g)).toHaveLength(2);
    expect(html.match(/href="mailto:thegiftingbloom11@gmail\.com"/g)).toHaveLength(2);
  });

  it("uses studio photographs and keeps existing mini gift links working", () => {
    const categories = new Set(studioCollection.map((product) => product.category));
    expect(categories.size).toBe(7);
    expect(studioCollection.every((product) => product.image_url && !product.is_demo)).toBe(true);
    expect(
      studioCollection.filter((product) => matchesProductCategory(product.category, "mini-gifts")),
    ).toHaveLength(30);
    const photos = studioCollection.flatMap(({ image_url, images }) => [image_url, ...images]);
    expect(new Set(photos).size).toBe(59);
  });

  it("keeps live catalogue entries without duplicating studio products or returning old demos", () => {
    const original = studioCollection[0]!;
    const cloudEdit = { ...original, id: "cloud-product", name: "Live sunflower bouquet" };
    const demo = { ...original, id: "demo-product", slug: "old-demo", is_demo: true };
    const result = withStudioCollection([cloudEdit, demo]);
    expect(result).toHaveLength(studioCollection.length);
    expect(result[0]).toEqual(cloudEdit);
  });

  it("shows studio alternate photos when the live product has no gallery of its own", () => {
    const product = studioCollection.find(({ slug }) => slug === "lavender-letter")!;
    const liveProduct = { ...product, id: "cloud-lavender", images: [] };
    const liveGallery = { ...liveProduct, images: ["https://example.com/lavender-detail.jpg"] };
    const findProduct = (catalogue: typeof studioCollection) =>
      catalogue.find(({ slug }) => slug === product.slug);

    expect(findProduct(withStudioCollection([liveProduct]))).toEqual({
      ...liveProduct,
      images: product.images,
    });
    expect(findProduct(withStudioCollection([liveGallery]))).toEqual(liveGallery);
  });

  it("redirects the legacy gallery URL with its occasion filter", () => {
    expect(galleryRedirect(new URL("https://example.com/shop?occasion=Just%20Because"))).toBe(
      "/?occasion=Just+Because#collection",
    );
  });

  it("finds typed colours in catalogue descriptions and recognises named shades", () => {
    const reds = studioCollection.filter((product) => matchesProductColours(product, "  rEd  "));
    expect(reds.map(({ slug }) => slug)).toEqual(
      expect.arrayContaining([
        "wrapped-red-lily",
        "red-lily-bouquet",
        "burgundy-lily-bouquet",
        "red-green-single-diya-holder",
        "red-yellow-diya-holders",
        "shubh-labh-hangings",
      ]),
    );
    expect(reds.map(({ slug }) => slug)).not.toContain("wrapped-pink-lily");
  });

  it("matches each colour in a typed combination", () => {
    const redAndGreen = studioCollection.filter((product) =>
      matchesProductColours(product, "Red & green"),
    );
    expect(redAndGreen.map(({ slug }) => slug)).toContain("red-green-diya-holders");
    expect(redAndGreen.map(({ slug }) => slug)).not.toContain("wrapped-red-lily");
    expect(studioCollection.some((product) => matchesProductColours(product, "unlisted"))).toBe(
      false,
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
