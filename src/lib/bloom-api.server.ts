import { z } from "zod";
import { publicCloud } from "./bloom-cloud.server";
import { jsonSetting, productOptions, type Product } from "./bloom";
import { studioCollection, withStudioCollection } from "./bloom-collection";

export async function getStore() {
  const fallback = {
    products: studioCollection,
    categories: [] as { id: string; slug: string; name: string }[],
    settings: {} as Record<string, string>,
    reviews: [] as {
      id: string;
      customer_name: string;
      product_name: string;
      review: string;
      rating: number | null;
    }[],
    reels: [] as {
      id: string;
      caption: string;
      thumbnail_url: string;
      post_url: string;
      product_id: string | null;
    }[],

    cloud: false,
  };
  try {
    const db = publicCloud();
    const [products, categories, settings, reviews, reels] = await Promise.all([
      db
        .from("products")
        .select("id,name,slug,description,colors,category_id,image_url,image_alt,is_demo")
        .eq("active", true)
        .order("sort_order")
        .order("created_at"),
      db.from("product_categories").select("id,slug,name").eq("active", true).order("sort_order"),
      db.from("website_settings").select("key,value"),
      db
        .from("testimonials")
        .select("id,customer_name,product_name,review,rating")
        .eq("approved", true)
        .order("created_at", { ascending: false }),
      db
        .from("media_reels")
        .select("id,caption,thumbnail_url,post_url,product_id")
        .eq("active", true)
        .order("sort_order"),
    ]);
    const config = Object.fromEntries((settings.data ?? []).map(({ key, value }) => [key, value]));
    const catalog = (products.data ?? []).map((product): Product => {
      const category = categories.data?.find(({ id }) => id === product.category_id);
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        colors: product.colors,
        image_url: product.image_url,
        image_alt: product.image_alt,
        is_demo: product.is_demo,
        category: category?.slug ?? "",
        categoryName: category?.name ?? "Handmade gifts",
        ...jsonSetting(
          config["product:" + product.id],
          productOptions.parse,
          productOptions.parse({}),
        ),
      };
    });
    return {
      products: withStudioCollection(catalog),
      categories: categories.data ?? [],
      settings: Object.fromEntries(
        Object.entries(config).filter(
          ([key]) =>
            !["pricing", "dispatch", "shop_cta", "policy_returns", "policy_shipping"].includes(key),
        ),
      ),
      reviews: reviews.data ?? [],
      reels: reels.data ?? [],

      cloud: !products.error && !settings.error,
    };
  } catch {
    return fallback;
  }
}
export type StoreData = Awaited<ReturnType<typeof getStore>>;
const customer = {
  customer_name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d ()-]{7,26}$/)
    .refine((value) => value.replace(/\D/g, "").length >= 7),
};
export const enquirySchema = z.object({
  ...customer,
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(5).max(2000),
});
export async function sendEnquiry(input: unknown) {
  const data = enquirySchema.parse(input);
  const { error } = await publicCloud().from("contact_enquiries").insert(data);
  if (error) throw new Error("We could not send your enquiry. Please try again.");
  return true;
}
