import type { ReturnTypeOfCloud } from "./bloom-cloud.server";
import { z } from "zod";
import { productOptions } from "./bloom";
import { enquiryStates } from "./bloom-admin-shared";

export async function getAdmin(db: ReturnTypeOfCloud) {
  const [products, categories, enquiries, reels, reviews, settings] = await Promise.all([
    db
      .from("products")
      .select(
        "id,name,slug,description,colors,category_id,image_url,image_alt,is_demo,active,sort_order",
      )
      .order("sort_order")
      .order("name"),
    db.from("product_categories").select("*").order("sort_order"),

    db.from("contact_enquiries").select("*").order("created_at", { ascending: false }),

    db.from("media_reels").select("*").order("sort_order"),
    db.from("testimonials").select("*").order("created_at", { ascending: false }),
    db.from("website_settings").select("*").order("key"),
  ]);
  if (
    products.error ||
    categories.error ||
    enquiries.error ||
    reels.error ||
    reviews.error ||
    settings.error
  )
    throw new Error("The owner dashboard could not be loaded.");
  return {
    products: products.data,
    categories: categories.data,

    enquiries: enquiries.data,

    reels: reels.data,
    reviews: reviews.data,
    settings: settings.data,
  };
}
export type AdminData = Awaited<ReturnType<typeof getAdmin>>;
const id = z.uuid();
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(120);
const casualUrl = z.union([z.literal(""), z.url({ protocol: /^https?$/ })]);
const mediaUrl = z.union([casualUrl, z.string().regex(/^\/blooms\/[a-z-]+\.jpg$/)]);
const instagramUrl = z
  .url()
  .refine((value) => /^https:\/\/(?:www\.)?instagram\.com\//i.test(value));
const sort_order = z.number().int().min(0).max(99999);

const settingsShape = {
  brand_name: z.string().trim().min(2).max(100),
  tagline: z.string().max(160),
  whatsapp: z.string().regex(/^$|^\+?\d{8,15}$/),
  contact_email: z.union([z.literal(""), z.email()]),
  contact_address: z.string().trim().max(350).optional(),
  instagram: instagramUrl,
  logo: casualUrl,
  craft_image: casualUrl,
  hero_story_image: casualUrl,
  banner_image: casualUrl,
  hero_heading: z.string().max(150),
  collection_heading: z.string().max(100),

  custom_cta: z.string().max(50),
  brand_story: z.string().max(4000),
  story_title: z.string().max(160),
  founder_story: z.string().max(4000),

  hide_demo: z.enum(["true", "false"]),
  policy_privacy: z.string().max(12000),

  policy_site_terms: z.string().max(12000),
};
const action = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("product"),
    id: id.optional(),
    row: z.object({
      name: z.string().trim().min(2).max(140),
      slug,
      description: z.string().max(5000),

      colors: z.array(z.string().max(80)).max(20),
      category_id: id.nullable(),
      image_url: mediaUrl,
      image_alt: z.string().max(160),
      is_demo: z.boolean(),
      active: z.boolean(),
      sort_order,
    }),
    meta: productOptions.extend({
      images: z.array(z.url({ protocol: /^https?$/ })).max(8),
      video: casualUrl,
    }),
  }),
  z.object({
    kind: z.literal("category"),
    id: id.optional(),
    row: z.object({
      name: z.string().trim().min(2).max(100),
      slug,
      active: z.boolean(),
      sort_order,
    }),
    image: casualUrl,
  }),
  z.object({ kind: z.literal("enquiry"), id, status: z.enum(enquiryStates) }),
  z.object({
    kind: z.literal("reel"),
    id: id.optional(),
    row: z.object({
      post_url: instagramUrl,
      thumbnail_url: casualUrl,
      caption: z.string().max(1500),
      product_id: id.nullable(),
      active: z.boolean(),
      sort_order,
    }),
    video: casualUrl,
  }),
  z.object({
    kind: z.literal("review"),
    id: id.optional(),
    row: z.object({
      customer_name: z.string().trim().min(1).max(120),
      product_name: z.string().max(140),
      review: z.string().trim().min(5).max(1200),
      rating: z.number().int().min(1).max(5).nullable(),
      approved: z.boolean(),
    }),
  }),
  z.object({
    kind: z.literal("settings"),
    settings: z.object(settingsShape),
  }),
  z.object({
    kind: z.literal("delete"),
    id,
    table: z.enum(["products", "product_categories", "media_reels", "testimonials"]),
  }),
]);
export type AdminAction = z.input<typeof action>;
export async function saveAdmin(db: ReturnTypeOfCloud, input: unknown) {
  const data = action.parse(input);
  function check(result: { error: { code?: string } | null }) {
    if (result.error)
      throw new Error(
        result.error.code === "23505"
          ? "That entry already exists. Choose a unique slug."
          : "The change could not be saved.",
      );
  }
  switch (data.kind) {
    case "product": {
      const key = data.id || crypto.randomUUID();
      check(
        await db
          .from("website_settings")
          .upsert({ key: "product:" + key, value: JSON.stringify(data.meta) }),
      );
      const row = { ...data.row, updated_at: new Date().toISOString() };
      check(
        data.id
          ? await db.from("products").update(row).eq("id", key)
          : await db.from("products").insert({ id: key, ...row }),
      );
      break;
    }
    case "category": {
      const key = data.id || crypto.randomUUID();
      check(
        await db
          .from("website_settings")
          .upsert({ key: "category-image:" + key, value: data.image }),
      );
      check(await db.from("product_categories").upsert({ id: key, ...data.row }));
      break;
    }
    case "enquiry":
      check(await db.from("contact_enquiries").update({ status: data.status }).eq("id", data.id));
      break;
    case "reel": {
      const key = data.id || crypto.randomUUID();
      check(
        await db.from("website_settings").upsert({ key: "reel-video:" + key, value: data.video }),
      );
      check(await db.from("media_reels").upsert({ id: key, ...data.row }));
      break;
    }
    case "review":
      check(
        await db.from("testimonials").upsert({ id: data.id || crypto.randomUUID(), ...data.row }),
      );
      break;
    case "settings":
      check(
        await db
          .from("website_settings")
          .upsert(
            Object.entries(data.settings).flatMap(([key, value]) =>
              value === undefined ? [] : [{ key, value }],
            ),
          ),
      );
      break;
    case "delete": {
      check(await db.from(data.table).delete().eq("id", data.id));
      const prefix = {
        products: "product:",
        product_categories: "category-image:",
        media_reels: "reel-video:",
        testimonials: "",
      }[data.table];
      if (prefix)
        check(
          await db
            .from("website_settings")
            .delete()
            .eq("key", prefix + data.id),
        );
      break;
    }
  }
  return true;
}

export async function uploadBloomMedia(db: ReturnTypeOfCloud, data: FormData) {
  const file = data.get("file");
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "video/mp4": "mp4",
    "video/webm": "webm",
  };
  if (
    !(file instanceof File) ||
    !Object.hasOwn(extensions, file.type) ||
    file.size < 12 ||
    file.size > 8 * 1024 * 1024
  )
    throw new Error("Use a JPG, PNG, WebP, MP4 or WebM file under 8 MB.");
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const signature = Array.from(bytes)
    .map((byte) => String.fromCharCode(byte))
    .join("");
  const valid =
    file.type === "image/jpeg"
      ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      : file.type === "image/png"
        ? bytes[0] === 137 && signature.slice(1, 4) === "PNG"
        : file.type === "image/webp"
          ? signature.startsWith("RIFF") && signature.slice(8) === "WEBP"
          : file.type === "video/mp4"
            ? signature.slice(4, 8) === "ftyp"
            : bytes[0] === 26 && bytes[1] === 69 && bytes[2] === 223 && bytes[3] === 163;
  if (!valid) throw new Error("The file contents do not match the selected media format.");
  const path = crypto.randomUUID() + "." + extensions[file.type];
  const bucket = db.storage.from("bloom-media");
  const { error } = await bucket.upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
  });
  if (error)
    throw new Error("Media upload failed. Check that the bloom-media bucket is available.");
  return bucket.getPublicUrl(path).data.publicUrl;
}
