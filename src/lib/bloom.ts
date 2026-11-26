import type { Tables } from "@/integrations/supabase/types";
import { z } from "zod";

export const instagram = "https://www.instagram.com/the_gifting_bloom11/";
export const colours = {
  Rose: "#b84d69",
  Blush: "#e7a0b4",
  Ivory: "#f5e5ca",
  Lavender: "#ae99cc",
  Blue: "#82b4db",
  Sage: "#94a687",
  Gold: "#e1a32e",
  Plum: "#684052",
};
export const occasions = [
  "Valentine's Day",
  "Birthdays",
  "Anniversaries",
  "Friendship Day",
  "Graduation",
  "Congratulations",
  "Festive Gifting",
  "Just Because",
] as const;
export const categoryNames = {
  bouquets: "Bouquets",
  "single-flowers": "Single Flowers",
  keychains: "Keychains",
  "diya-holders": "Diya Holders",
  "car-dashboard-pots": "Car Dashboard Pots",
  "flower-pot-flowers": "Flower Pot Flowers",
  "mini-gifts": "Mini gifts",
};

export function matchesProductCategory(category: string, filter: string) {
  return (
    !filter ||
    category === filter ||
    (filter === "mini-gifts" &&
      ["keychains", "diya-holders", "car-dashboard-pots"].includes(category))
  );
}
export const productOptions = z.object({
  images: z.array(z.url()).max(8).default([]),
  video: z.union([z.url(), z.literal("")]).default(""),
  occasions: z.array(z.string().max(80)).max(12).default([]),
  variants: z.array(z.string().max(80)).max(12).default([]),

  seo: z.string().max(160).default(""),
});
export type ProductOptions = z.infer<typeof productOptions>;
export type Product = Omit<
  Tables<"products">,
  | "created_at"
  | "updated_at"
  | "category_id"
  | "active"
  | "sort_order"
  | "price_cents"
  | "stock_count"
> &
  ProductOptions & { category: string; categoryName: string };
export const customSchema = z.object({
  flower: z.enum(["rose", "daisy", "sunflower"]),
  count: z.number().int().min(1).max(24),
  colours: z
    .array(z.enum(["Rose", "Blush", "Ivory", "Lavender", "Sage", "Gold", "Plum"]))
    .min(1)
    .max(4),
  size: z.enum(["petite", "classic", "grand"]),
  wrap: z.enum(["Ivory", "Blush", "Lavender", "Sage"]),
  ribbon: z.enum(["Ivory", "Rose", "Gold", "Plum"]),
  occasion: z.string().max(80),
  message: z.string().max(500),
  packaging: z.boolean(),
});
export type Custom = z.infer<typeof customSchema>;
export function jsonSetting<T>(
  value: string | undefined,
  parse: (input: unknown) => T,
  fallback: T,
): T {
  try {
    return value ? parse(JSON.parse(value)) : fallback;
  } catch {
    return fallback;
  }
}
export const whatsapp = (number: string | undefined, message: string) => {
  const digits = number?.replace(/\D/g, "");
  return digits && /^\d{8,15}$/.test(digits)
    ? "https://wa.me/" + digits + "?text=" + encodeURIComponent(message)
    : undefined;
};
export function describeCustom(item: Custom) {
  return [
    item.count + " " + item.flower + " stems",
    item.colours.join(", "),
    item.size,
    item.wrap + " wrap",
    item.ribbon + " ribbon",
    item.occasion,
    item.packaging && "gift box",
    item.message && "Note: " + item.message,
  ]
    .filter(Boolean)
    .join(" · ");
}
