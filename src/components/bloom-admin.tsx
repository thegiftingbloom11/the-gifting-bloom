import { Link, useNavigate } from "./bloom-navigation";
import { LogOut, Upload } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  enquiryStates,
  getAdmin,
  ownerSession,
  saveAdmin,
  uploadBloomMedia,
  type AdminData,
} from "@/lib/bloom-admin";
import { instagram, jsonSetting, productOptions, type ProductOptions } from "@/lib/bloom";
import { useBloom } from "./bloom-shell";
import { PageHeading } from "./bloom-products";
import { BloomLogo } from "./bloom-logo";

export function AdminLogin() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      if (signInError) {
        setError("Sign-in failed. Check your email and password.");
        return;
      }
      try {
        await ownerSession();
      } catch {
        await supabase.auth.signOut();
        setError("Owner access could not be verified for this account.");
        return;
      }
      await navigate({ to: "/admin" });
    } catch {
      setError("Sign-in is temporarily unavailable.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="wrap admin-login">
      <Link to="/" className="wordmark">
        <BloomLogo /> The Gifting Bloom
      </Link>
      <PageHeading title="Owner sign-in" />
      <form className="panel form-stack" onSubmit={submit}>
        <label>
          Email
          <input name="email" type="email" required autoComplete="username" />
        </label>
        <label>
          Password
          <input name="password" type="password" required autoComplete="current-password" />
        </label>
        {error && (
          <p role="alert" className="error-note">
            {error}
          </p>
        )}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <Link className="text-link" to="/">
        Back to the storefront
      </Link>
    </main>
  );
}
type SaveData = Parameters<typeof saveAdmin>[0]["data"];
const text = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
const number = (form: FormData, name: string) => Number(text(form, name));
const list = (form: FormData, name: string) => [
  ...new Set(
    text(form, name)
      .split(/[,\n]/)
      .map((part) => part.trim())
      .filter(Boolean),
  ),
];
function Input({
  name,
  label,
  value,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  value?: string | undefined | number | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      {label}
      <input
        name={name}
        type={type}
        defaultValue={value ?? ""}
        required={required}
        {...(type === "number" ? { min: 0, step: 1 } : {})}
      />
    </label>
  );
}
function TextArea({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value?: string | undefined;
}) {
  return (
    <label>
      {label}
      <textarea name={name} defaultValue={value ?? ""} rows={3} />
    </label>
  );
}
function Flag({
  name,
  children,
  initial,
}: {
  name: string;
  children: ReactNode;
  initial?: boolean | undefined;
}) {
  return (
    <label className="checkbox-label">
      <input name={name} type="checkbox" defaultChecked={initial} />
      {children}
    </label>
  );
}
function Status({
  name = "status",
  value,
  options,
}: {
  name?: string;
  value: string;
  options: readonly string[];
}) {
  return (
    <label>
      Status
      <select name={name} defaultValue={value}>
        {options.map((option) => (
          <option value={option} key={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
function Media({
  name,
  label,
  value = "",
  video = false,
}: {
  name: string;
  label: string;
  value?: string | undefined;
  video?: boolean;
}) {
  const [url, setUrl] = useState(value);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <label>
        {label}
        <input
          name={name}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://…"
        />
      </label>
      <label className="media-upload">
        <Upload size={15} />
        {busy ? "Uploading…" : "Upload " + (video ? "video" : "image")}
        <input
          disabled={busy}
          type="file"
          accept={video ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp"}
          onChange={async (event) => {
            const input = event.currentTarget;
            const file = input.files?.[0];
            if (!file) return;
            if (file.size > 8 * 1024 * 1024) {
              setStatus("Choose a file smaller than 8 MB.");
              input.value = "";
              return;
            }
            const form = new FormData();
            form.set("file", file);
            setBusy(true);
            setStatus("");
            try {
              setUrl(await uploadBloomMedia({ data: form }));
              setStatus("Uploaded. Save to publish this change.");
            } catch (error) {
              setStatus(error instanceof Error ? error.message : "Upload failed.");
            } finally {
              setBusy(false);
              input.value = "";
            }
          }}
        />
      </label>
      {status && (
        <p className="fine" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
function Editor({
  title,
  children,
  save,
  build,
  remove,
  startOpen = false,
}: {
  title: string;
  children: ReactNode;
  save: (data: SaveData) => Promise<void>;
  build: (form: FormData) => SaveData;
  remove?: SaveData | undefined;
  startOpen?: boolean;
}) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(startOpen);
  async function commit(data: SaveData, form?: HTMLFormElement) {
    setBusy(true);
    setStatus("");
    try {
      await save(data);
      setStatus("Saved.");
      if (title.startsWith("Add ")) {
        form?.reset();
        setOpen(false);
      }
    } catch (error) {
      setStatus(
        error instanceof Error && error.message.length < 230
          ? error.message
          : "Check the form values and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <details
      className="admin-editor"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>{title}</summary>
      {open && (
        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            if (!busy) void commit(build(new FormData(event.currentTarget)), event.currentTarget);
          }}
        >
          {children}
          {status && (
            <p role="status" className="fine">
              {status}
            </p>
          )}
          <div className="button-row">
            <button className="btn btn-primary" disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </button>
            {remove && (
              <button
                type="button"
                className="btn btn-outline"
                disabled={busy}
                onClick={() => {
                  if (window.confirm("Delete " + title + "?")) void commit(remove);
                }}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      )}
    </details>
  );
}

const blankProduct = {
  name: "",
  slug: "",
  description: "",

  colors: [] as string[],
  category_id: null as string | null,
  image_url: "",
  image_alt: "",
  is_demo: false,
  active: true,
  sort_order: 0,
};
function ProductEditor({
  row,
  categories,
  meta,
  save,
}: {
  row?: AdminData["products"][number];
  categories: AdminData["categories"];
  meta: ProductOptions;
  save: (data: SaveData) => Promise<void>;
}) {
  const p = row ?? blankProduct;
  return (
    <Editor
      title={row?.name || "Add gallery item"}
      save={save}
      remove={row ? { kind: "delete", table: "products", id: row.id } : undefined}
      build={(form) => ({
        kind: "product",
        id: row?.id,
        row: {
          name: text(form, "name"),
          slug: text(form, "slug"),
          description: text(form, "description"),

          colors: list(form, "colors"),
          category_id: text(form, "category") || null,
          image_url: text(form, "image"),
          image_alt: text(form, "alt"),
          is_demo: form.has("demo"),
          active: form.has("active"),
          sort_order: number(form, "sort"),
        },
        meta: {
          images: list(form, "images"),
          video: text(form, "video"),
          occasions: list(form, "occasions"),
          variants: list(form, "variants"),

          seo: text(form, "seo"),
        },
      })}
    >
      <div className="admin-fields">
        <Input name="name" label="Product name" value={p.name} required />
        <Input name="slug" label="Slug (lowercase, hyphen-separated)" value={p.slug} required />

        <label>
          Category
          <select name="category" defaultValue={p.category_id || ""}>
            <option value="">Uncategorised</option>
            {categories.map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <Input name="sort" label="Display order" type="number" value={p.sort_order} />
        <Input name="colors" label="Colours (comma-separated)" value={p.colors.join(", ")} />
        <Input
          name="variants"
          label="Variants (comma-separated)"
          value={meta.variants.join(", ")}
        />
        <Input
          name="occasions"
          label="Occasions (comma-separated)"
          value={meta.occasions.join(", ")}
        />
      </div>
      <TextArea name="description" label="Product description" value={p.description} />
      <Input name="seo" label="SEO description" value={meta.seo} />
      <Media name="image" label="Primary image URL" value={p.image_url} />
      <Input name="alt" label="Primary image alt text" value={p.image_alt} />
      <TextArea
        name="images"
        label="Extra image URLs (one per line)"
        value={meta.images.join("\n")}
      />
      <Media name="video" label="Product video URL" value={meta.video} video />
      <div className="button-row">
        <Flag name="active" initial={p.active}>
          Visible
        </Flag>
        <Flag name="demo" initial={p.is_demo}>
          Demo listing
        </Flag>
      </div>
    </Editor>
  );
}
function SettingEditor({
  config,
  save,
}: {
  config: Record<string, string>;
  save: (data: SaveData) => Promise<void>;
}) {
  const fields = {
    brand_name: "Brand name",
    tagline: "Tagline",
    whatsapp: "WhatsApp with country code",
    contact_email: "Contact email",
    instagram: "Instagram URL",
    hero_heading: "Opening story headline",
    collection_heading: "Collection headline",

    custom_cta: "Customise button",
    story_title: "Story headline",
  };
  const media = {
    logo: "Logo",
    craft_image: "Crafting image",
    hero_story_image: "Story illustration",
    banner_image: "Final banner image",
  };
  const paragraphs = {
    contact_address: "Public business address",
    brand_story: "Brand story",
    founder_story: "Founder story",
    policy_privacy: "Privacy policy",

    policy_site_terms: "Terms and conditions",
  };

  return (
    <Editor
      title="Website content and contact"
      startOpen
      save={save}
      build={(form) => ({
        kind: "settings",
        settings: {
          ...(Object.fromEntries(
            Object.keys({ ...fields, ...media, ...paragraphs }).map((key) => [
              key,
              text(form, key),
            ]),
          ) as Record<keyof typeof fields | keyof typeof media | keyof typeof paragraphs, string>),
          hide_demo: form.has("hide_demo") ? "true" : "false",
        },
      })}
    >
      <div className="admin-fields">
        {Object.entries(fields).map(([key, label]) => (
          <Input
            key={key}
            required={key === "brand_name" || key === "instagram"}
            name={key}
            label={label}
            value={
              config[key] ??
              (key === "brand_name" ? "The Gifting Bloom" : key === "instagram" ? instagram : "")
            }
          />
        ))}
      </div>
      {Object.entries(media).map(([key, label]) => (
        <Media key={key} name={key} label={label} value={config[key]} />
      ))}
      {Object.entries(paragraphs).map(([key, label]) => (
        <TextArea key={key} name={key} label={label} value={config[key]} />
      ))}
      <Flag name="hide_demo" initial={config["hide_demo"] === "true"}>
        Hide built-in demo catalogue
      </Flag>
    </Editor>
  );
}
const sections = [
  "Dashboard",
  "Gallery",
  "Categories",

  "Enquiries",
  "Reels & media",
  "Testimonials",
  "Website settings",
] as const;
export function AdminDashboard() {
  const [data, setData] = useState<AdminData>();
  const [section, setSection] = useState<(typeof sections)[number]>("Dashboard");
  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();
  const { refreshStore } = useBloom();
  useEffect(() => {
    let alive = true;
    getAdmin()
      .then((state) => {
        if (alive) setData(state);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") void navigate({ to: "/admin/login" });
    });
    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, [navigate]);
  async function save(change: SaveData) {
    await saveAdmin({ data: change });
    setData(await getAdmin());

    await refreshStore();
  }
  if (!data)
    return (
      <main className="wrap inner-page">
        <PageHeading title="Owner dashboard" />
        {failed ? (
          <div className="panel">
            <p>Sign in with an authorised owner account to manage the store.</p>
            <Link to="/admin/login" className="btn btn-primary">
              Owner sign-in
            </Link>
          </div>
        ) : (
          <p role="status">Verifying owner access…</p>
        )}
      </main>
    );
  const config = Object.fromEntries(data.settings.map(({ key, value }) => [key, value]));
  return (
    <main className="wrap admin-shell">
      <div className="section-heading">
        <PageHeading label="The Gifting Bloom" title="Owner dashboard" />
        <div className="button-row">
          <Link className="btn btn-outline" to="/">
            View website
          </Link>
          <button
            className="btn btn-outline"
            onClick={async () => {
              await supabase.auth.signOut();
              setData(undefined);
              void navigate({ to: "/admin/login" });
            }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>
      <nav className="admin-nav" aria-label="Owner sections">
        {sections.map((item) => (
          <button
            className="choice"
            key={item}
            aria-pressed={section === item}
            onClick={() => setSection(item)}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="admin-module" key={section}>
        <h2>{section}</h2>
        {section === "Dashboard" && (
          <>
            <div className="admin-stats">
              {[
                [data.products.length, "Gallery items"],
                [data.enquiries.length, "Enquiries"],
                [data.enquiries.filter(({ status }) => status === "new").length, "New enquiries"],
              ].map(([value, label]) => (
                <div className="panel" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="admin-fields section-space">
              <div className="panel">
                <h3>Recent enquiries</h3>
                {data.enquiries.length ? (
                  data.enquiries.slice(0, 5).map((item) => (
                    <p key={item.id}>
                      {item.customer_name} · {item.subject}
                    </p>
                  ))
                ) : (
                  <p>No enquiries yet.</p>
                )}
              </div>
            </div>
          </>
        )}
        {section === "Gallery" && (
          <>
            <ProductEditor
              categories={data.categories}
              meta={productOptions.parse({})}
              save={save}
            />
            {data.products.map((row) => (
              <ProductEditor
                key={row.id}
                row={row}
                categories={data.categories}
                meta={jsonSetting(
                  config["product:" + row.id],
                  productOptions.parse,
                  productOptions.parse({}),
                )}
                save={save}
              />
            ))}
          </>
        )}
        {section === "Categories" &&
          [undefined, ...data.categories].map((row) => (
            <Editor
              key={row?.id || "new"}
              title={row?.name || "Add category"}
              save={save}
              remove={row ? { kind: "delete", table: "product_categories", id: row.id } : undefined}
              build={(form) => ({
                kind: "category",
                id: row?.id,
                row: {
                  name: text(form, "name"),
                  slug: text(form, "slug"),
                  active: form.has("active"),
                  sort_order: number(form, "sort"),
                },
                image: text(form, "category_image"),
              })}
            >
              <Input name="name" label="Category name" value={row?.name} required />
              <Input
                name="slug"
                label="Slug (use bouquets or mini-gifts for the matching page)"
                value={row?.slug}
                required
              />
              <Input name="sort" label="Display order" type="number" value={row?.sort_order ?? 0} />
              <Media
                name="category_image"
                label="Category image URL"
                value={row && config["category-image:" + row.id]}
              />
              <Flag name="active" initial={row?.active ?? true}>
                Visible
              </Flag>
            </Editor>
          ))}
        {section === "Enquiries" &&
          (data.enquiries.length ? (
            data.enquiries.map((row) => (
              <Editor
                key={row.id}
                title={row.subject + " · " + row.customer_name}
                save={save}
                build={(form) => ({
                  kind: "enquiry",
                  id: row.id,
                  status: text(form, "status") as (typeof enquiryStates)[number],
                })}
              >
                <p>
                  {row.email} · {row.phone}
                </p>
                <p className="preserve-lines">{row.message}</p>
                <Status value={row.status} options={enquiryStates} />
              </Editor>
            ))
          ) : (
            <p>No enquiries yet.</p>
          ))}
        {section === "Reels & media" &&
          [undefined, ...data.reels].map((row) => (
            <Editor
              key={row?.id || "new"}
              title={row?.caption || (row ? "Instagram reel" : "Add reel")}
              save={save}
              remove={row ? { kind: "delete", table: "media_reels", id: row.id } : undefined}
              build={(form) => ({
                kind: "reel",
                id: row?.id,
                row: {
                  caption: text(form, "caption"),
                  post_url: text(form, "post"),
                  thumbnail_url: text(form, "thumbnail"),
                  product_id: text(form, "product") || null,
                  active: form.has("active"),
                  sort_order: number(form, "sort"),
                },
                video: text(form, "video"),
              })}
            >
              <Input name="caption" label="Caption" value={row?.caption} />
              <Input
                name="post"
                label="Official Instagram reel link"
                value={row?.post_url}
                required
              />
              <Media name="thumbnail" label="Thumbnail URL" value={row?.thumbnail_url} />
              <Media
                name="video"
                label="Video URL"
                value={row && config["reel-video:" + row.id]}
                video
              />
              <label>
                Tagged product
                <select name="product" defaultValue={row?.product_id || ""}>
                  <option value="">None</option>
                  {data.products.map(({ id, name }) => (
                    <option value={id} key={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <Input name="sort" label="Display order" type="number" value={row?.sort_order ?? 0} />
              <Flag name="active" initial={row?.active ?? true}>
                Visible
              </Flag>
            </Editor>
          ))}
        {section === "Testimonials" &&
          [undefined, ...data.reviews].map((row) => (
            <Editor
              key={row?.id || "new"}
              title={
                row
                  ? row.customer_name + (row.approved ? " · published" : " · draft")
                  : "Add customer review"
              }
              save={save}
              remove={row ? { kind: "delete", table: "testimonials", id: row.id } : undefined}
              build={(form) => ({
                kind: "review",
                id: row?.id,
                row: {
                  customer_name: text(form, "name"),
                  product_name: text(form, "product"),
                  review: text(form, "review"),
                  rating: text(form, "rating") ? number(form, "rating") : null,
                  approved: form.has("approved"),
                },
              })}
            >
              <Input
                name="name"
                label="Customer name or initials"
                value={row?.customer_name}
                required
              />
              <Input name="product" label="Product name" value={row?.product_name} />
              <Input name="rating" label="Rating (1 to 5)" type="number" value={row?.rating} />
              <TextArea name="review" label="Customer’s words" value={row?.review} />
              <Flag name="approved" initial={row?.approved}>
                Approve and publish
              </Flag>
            </Editor>
          ))}
        {section === "Website settings" && <SettingEditor config={config} save={save} />}
      </section>
    </main>
  );
}
