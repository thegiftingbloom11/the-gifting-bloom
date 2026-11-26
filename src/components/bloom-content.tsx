import { Link } from "./bloom-navigation";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import { ArrowRight, ArrowUpRight, Instagram, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  bouquetBuilderEnabled,
  businessAddress,
  businessEmail,
  businessWhatsAppNumber,
  categoryNames,
  instagram,
  whatsapp,
} from "@/lib/bloom";
import diaryLavender from "@/assets/collection/lavender-bouquet.jpg";
import diaryMixedFlowers from "@/assets/collection/mixed-flower-bouquet.jpg";
import diarySunflowers from "@/assets/collection/sunflower-dashboard-pot.jpg";
import storyWrapping from "@/assets/story-bouquet-illustration.webp";
import { useBloom } from "./bloom-shell";
import { PageHeading, ProductImage, ProductPreview } from "./bloom-products";
import { BloomStory } from "./bloom-story";
import { GiftFinder, Gallery } from "./bloom-gallery";
import { Customise } from "./bloom-customise";
import { BloomLogo } from "./bloom-logo";

const featuredCategories = [
  "single-flowers",
  "bouquets",
  "keychains",
  "diya-holders",
  "car-dashboard-pots",
  "flower-pot-flowers",
  "festive-decor",
] as const;
export function Home({ occasion, category }: { occasion: string; category: string }) {
  const { products, reviews, reels, settings } = useBloom();
  const [search] = useSearchParams();
  const giftSlug = search.get("gift");
  const gift = giftSlug ? products.find((product) => product.slug === giftSlug) : undefined;
  const giftColour = search.get("giftColour")?.trim().slice(0, 80) ?? "";
  const profile = settings["instagram"] || instagram;
  const instagramHandle = profile.match(
    /^https:\/\/(?:www\.)?instagram\.com\/([\w.]+)\/?(?:[?#]|$)/i,
  )?.[1];
  return (
    <main className="single-page" id="home">
      <BloomStory />
      <section className="category-section home-section" id="gift-gallery" tabIndex={-1}>
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">For the people you love</p>
              <h2>Explore by category.</h2>
            </div>
            <Link className="text-link" to="/" hash="gift-finder" search={true}>
              Take the gift finder <ArrowRight size={17} />
            </Link>
          </div>
          <div className="feeling-grid">
            {featuredCategories.map((slug) => {
              const product = products.find((item) => item.category === slug && item.image_url);
              return (
                <Link
                  to="/"
                  hash="collection"
                  search={{ category: slug }}
                  key={slug}
                  className="feeling-card"
                >
                  <div className="feeling-media">
                    <ProductImage src={product?.image_url} alt="" />
                  </div>
                  <span>
                    {categoryNames[slug]}
                    <ArrowUpRight size={17} />
                  </span>
                  {product?.is_demo && <small>Concept illustration</small>}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <div className="collection-section">
        <Gallery initialOccasion={occasion} initialCategory={category} embedded />
      </div>
      <GiftFinder embedded />
      {bouquetBuilderEnabled && (
        <div className="collection-section">
          <Customise embedded />
        </div>
      )}
      <OurStory embedded />
      {!!reviews.length && (
        <section className="wrap home-section home-reviews">
          <h2>Little notes, big smiles.</h2>
          <div className="review-strip">
            {reviews.slice(0, 8).map((review) => (
              <blockquote key={review.id}>
                {review.rating && (
                  <p className="fine" aria-label={review.rating + " out of 5"}>
                    {"★".repeat(review.rating)}
                  </p>
                )}
                <p>{review.review}</p>
                <cite>
                  {review.customer_name}
                  {review.product_name && " · " + review.product_name}
                </cite>
              </blockquote>
            ))}
          </div>
        </section>
      )}
      <section className="instagram-section" id="instagram">
        <div className="wrap home-section">
          <div className="instagram-profile">
            <div className="instagram-copy">
              <div className="instagram-identity">
                <span className="instagram-avatar">
                  <BloomLogo src={settings["logo"]} className="instagram-mark" />
                </span>
                <div>
                  <h2>Bloom Diaries</h2>
                  {instagramHandle && <p className="instagram-handle">@{instagramHandle}</p>}
                </div>
              </div>
              <p>See our latest handmade blooms, gift ideas and moments from behind the scenes.</p>
              <a className="btn instagram-cta" href={profile} target="_blank" rel="noreferrer">
                <Instagram size={20} aria-hidden="true" />
                Visit us on Instagram
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="instagram-photos" aria-hidden="true">
              {[diaryLavender, diaryMixedFlowers, diarySunflowers].map((photo) => (
                <div key={photo}>
                  <ProductImage src={photo} alt="" />
                </div>
              ))}
            </div>
          </div>
          {!!reels.length && <ReelGrid embedded />}
        </div>
      </section>
      <Contact
        key={gift ? `gift:${gift.slug}` : `colour:${giftColour}`}
        embedded
        giftName={gift?.name ?? ""}
        giftColour={giftColour}
      />
    </main>
  );
}

function ReelGrid({ embedded = false }: { embedded?: boolean } = {}) {
  const { reels, products, settings } = useBloom();
  if (!reels.length)
    return (
      <div className="notice diary-note">
        <Instagram size={25} />
        <p>Explore the latest posts on The Gifting Bloom’s official Instagram.</p>
        <a
          className="text-link"
          href={settings["instagram"] || instagram}
          target="_blank"
          rel="noreferrer"
        >
          View on Instagram <ArrowUpRight size={16} />
        </a>
      </div>
    );
  return (
    <div className="reel-grid">
      {reels.map((reel) => {
        const product = products.find((item) => item.id === reel.product_id);
        const match = reel.post_url.match(
          /^https:\/\/(?:www\.)?instagram\.com\/(reel|p)\/([\w-]+)/,
        );
        const embed = match && "https://www.instagram.com/" + match[1] + "/" + match[2] + "/embed/";
        const video = settings["reel-video:" + reel.id];
        return (
          <article key={reel.id} className="reel">
            <Dialog>
              <DialogTrigger asChild>
                <button className="reel-cover" aria-label={"Play " + (reel.caption || "reel")}>
                  <ProductImage src={reel.thumbnail_url} alt="" />
                  <Play size={24} />
                </button>
              </DialogTrigger>
              <DialogContent className="bloom-dialog reel-modal">
                <DialogTitle>{reel.caption || "Bloom Diaries"}</DialogTitle>
                {video ? (
                  <video
                    src={video}
                    controls
                    playsInline
                    preload="metadata"
                    poster={reel.thumbnail_url}
                  />
                ) : (
                  embed && (
                    <iframe
                      title="Instagram reel"
                      src={embed}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  )
                )}
                <a href={reel.post_url} target="_blank" rel="noreferrer" className="text-link">
                  View on Instagram <ArrowUpRight size={16} />
                </a>
              </DialogContent>
            </Dialog>
            {reel.caption && <p>{reel.caption}</p>}
            <div className="button-row">
              {product &&
                (embedded ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button" className="text-link">
                        View this bloom <ArrowRight size={15} />
                      </button>
                    </DialogTrigger>
                    <ProductPreview product={product} embedded />
                  </Dialog>
                ) : (
                  <Link className="text-link" to="/product/$slug" params={{ slug: product.slug }}>
                    View this bloom <ArrowRight size={15} />
                  </Link>
                ))}
              <a className="text-link" href={reel.post_url} target="_blank" rel="noreferrer">
                Instagram <ArrowUpRight size={15} />
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function Diaries() {
  return (
    <main className="wrap inner-page">
      <PageHeading label="Behind the scenes" title="Bloom Diaries">
        Little moments from the making, wrapping, and giving of a bloom.
      </PageHeading>
      <ReelGrid />
    </main>
  );
}
export function OurStory({ embedded = false }: { embedded?: boolean } = {}) {
  const { settings } = useBloom();
  const craftImage = settings["craft_image"];
  const Container = embedded ? "section" : "main";
  return (
    <Container
      id={embedded ? "our-story" : undefined}
      className={embedded ? "wrap home-section" : "wrap inner-page"}
    >
      <PageHeading
        as={embedded ? "h2" : "h1"}
        label="The Gifting Bloom"
        title="Made by hand. Gifted by heart."
      />
      <div className="craft-layout">
        <div className={craftImage ? "craft-image" : "craft-image craft-image-illustration"}>
          <ProductImage
            src={craftImage || storyWrapping}
            alt={
              craftImage
                ? "Crafting at The Gifting Bloom"
                : "Illustration of a maker tying a ribbon around a handmade bouquet"
            }
          />
        </div>
        <div className="craft-copy">
          <h2>{settings["story_title"] || "Let’s plan your bouquet."}</h2>
          <p>
            Fresh flowers naturally wilt over time. The Gifting Bloom’s handcrafted bouquets stay in
            bloom long after the occasion, giving you a keepsake to enjoy for years.
          </p>
          <p className="preserve-lines">
            {settings["brand_story"] ||
              "Tell us the occasion, colours and wrapping you have in mind. We’ll discuss the options, pricing and availability before you decide."}
          </p>
          {settings["founder_story"] && (
            <>
              <h2>Meet the maker</h2>
              <p className="preserve-lines">{settings["founder_story"]}</p>
            </>
          )}
          <div className="button-row">
            <Link
              className="btn btn-primary"
              to={bouquetBuilderEnabled ? "/" : "/contact"}
              hash={bouquetBuilderEnabled ? "customise" : undefined}
            >
              {bouquetBuilderEnabled ? "Build a bouquet" : "Ask about a custom bouquet"}
              <ArrowRight size={16} />
            </Link>
            <Link className="text-link" to="/" hash="collection">
              Browse the collection <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

// Web3Forms uses a public form access key to route submissions to its configured inbox.
const web3FormsAccessKey = "c9bde02e-d7ea-49c1-8e7e-b375dc990cb0";

export function Contact({
  embedded = false,
  giftName = "",
  giftColour = "",
}: { embedded?: boolean; giftName?: string; giftColour?: string } = {}) {
  const { products, settings } = useBloom();
  const [search] = useSearchParams();
  const requestedGift = embedded
    ? giftName
    : products.find((product) => product.slug === search.get("gift"))?.name;
  const requestedColour = embedded ? giftColour : search.get("giftColour")?.trim().slice(0, 80);
  const address = settings["contact_address"]?.trim() || businessAddress;
  const email = settings["contact_email"]?.trim() || businessEmail;
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const giftMessage = requestedGift
    ? `Hi! I'd like to ask about ${requestedGift}.`
    : requestedColour
      ? `Hi! I'd like to request a gift in this colour or combination: ${requestedColour}.`
      : "";
  const enquiryType = requestedGift
    ? "Gift enquiry"
    : requestedColour
      ? "Custom gift enquiry"
      : undefined;
  const chatMessage = giftMessage || "Hi! I have a question about a gift.";
  const chat =
    whatsapp(settings["whatsapp"], chatMessage) ?? whatsapp(businessWhatsAppNumber, chatMessage);
  const profile = settings["instagram"] || instagram;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const element = event.currentTarget;
    const form = new FormData(element);
    setError("");
    setSent(false);
    const deliveryAddress = String(form.get("delivery-address") ?? "").trim();
    const neededBy = String(form.get("needed-by") ?? "");
    const enquiry = String(form.get("message") ?? "").trim();
    if (!deliveryAddress) {
      setError("Please enter your full delivery address, including the PIN code.");
      return;
    }
    if (enquiry.length < 5) {
      setError("Please tell us a little more about your enquiry.");
      return;
    }
    setSending(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: web3FormsAccessKey,
          from_name: "The Gifting Bloom",
          subject: `The Gifting Bloom | ${form.get("subject")}`,
          name: String(form.get("name") ?? "").trim(),
          email: form.get("email"),
          phone: form.get("phone"),
          message: enquiry,
          "Delivery address": deliveryAddress,
          ...(neededBy && { "Needed by": neededBy }),
          ...(form.has("botcheck") && { botcheck: true }),
        }),
      });
      const result: { success?: boolean } | null = await response.json();
      if (!response.ok || result?.success !== true) throw new Error("Enquiry submission failed");
      element.reset();
      setSent(true);
    } catch {
      setError("We couldn’t send your enquiry. Please try again or contact us directly.");
    } finally {
      setSending(false);
    }
  }
  const Container = embedded ? "section" : "main";
  return (
    <Container
      id={embedded ? "contact" : undefined}
      className={embedded ? "wrap home-section" : "wrap inner-page"}
    >
      <PageHeading as={embedded ? "h2" : "h1"} label="Contact" title="Let’s talk blooms.">
        Ask about our handmade gifts or share an idea for a personalised bouquet.
      </PageHeading>
      <div className="split-page contact-layout">
        <div className="panel contact-form-panel">
          <h2>Send an enquiry</h2>
          <p className="contact-required-note">Fields marked * are required.</p>
          <form key={giftMessage} className="contact-form" onSubmit={submit} aria-busy={sending}>
            <input type="checkbox" name="botcheck" hidden tabIndex={-1} autoComplete="off" />
            <label>
              <span>
                Full name <span aria-hidden="true">*</span>
              </span>
              <input
                name="name"
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                placeholder="Your name"
              />
            </label>
            <label>
              <span>
                Email <span aria-hidden="true">*</span>
              </span>
              <input
                required
                type="email"
                name="email"
                maxLength={254}
                autoComplete="email"
                placeholder="you@example.com"
              />
            </label>
            <label>
              <span>
                Phone <span aria-hidden="true">*</span>
              </span>
              <input
                required
                name="phone"
                type="tel"
                maxLength={26}
                pattern={String.raw`\+?(?:[ \(\)\-]*[0-9]){7,}[ \(\)\-]*`}
                title="Enter at least seven digits. You can include a country code."
                autoComplete="tel"
                placeholder="Your phone number"
              />
            </label>
            <label>
              <span>
                Enquiry type <span aria-hidden="true">*</span>
              </span>
              <select name="subject" required defaultValue={enquiryType ?? ""}>
                <option value="" disabled>
                  Choose a topic
                </option>
                <option>General enquiry</option>
                <option>Gift enquiry</option>
                <option>Custom gift enquiry</option>
                <option>Delivery enquiry</option>
              </select>
            </label>
            <label>
              <span>
                Delivery address <span aria-hidden="true">*</span>
              </span>
              <textarea
                name="delivery-address"
                required
                maxLength={500}
                rows={2}
                autoComplete="shipping street-address"
                placeholder="Flat or house no., street, area, city, state and PIN code"
              />
            </label>
            <label>
              <span>
                Needed by <small>Optional</small>
              </span>
              <input type="date" name="needed-by" />
            </label>
            <label className="contact-span">
              <span>
                Message <span aria-hidden="true">*</span>
              </span>
              <textarea
                name="message"
                required
                minLength={5}
                maxLength={2000}
                rows={4}
                placeholder="Tell us about the gift, occasion or colours you have in mind."
                defaultValue={giftMessage}
              />
            </label>
            {error && (
              <p role="alert" className="error-note contact-span">
                {error}
              </p>
            )}
            {sent && (
              <p role="status" className="contact-success contact-span">
                Thanks! Your enquiry has been sent.
              </p>
            )}
            <div className="contact-submit contact-span">
              <button className="btn btn-primary" type="submit" disabled={sending}>
                {sending ? "Sending…" : "Send enquiry"} <ArrowRight size={16} aria-hidden="true" />
              </button>
              <Link className="text-link" to="/privacy-policy">
                Privacy policy
              </Link>
            </div>
          </form>
        </div>
        <aside className="contact-channels">
          <h2>Message us directly</h2>
          <div className="contact-links">
            {chat && (
              <a className="contact-social-whatsapp" href={chat} target="_blank" rel="noreferrer">
                <span className="contact-social-mark" aria-hidden="true" />
                <span>WhatsApp</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
            <a className="contact-social-instagram" href={profile} target="_blank" rel="noreferrer">
              <span className="contact-social-mark" aria-hidden="true" />
              <span>Instagram</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a href={`mailto:${email}`}>
              <span className="contact-social-mark contact-email-mark" aria-hidden="true" />
              <span>{email}</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <address className="contact-address">
              <span className="contact-social-mark contact-address-mark" aria-hidden="true" />
              <span className="preserve-lines">{address}</span>
            </address>
          </div>
        </aside>
      </div>
    </Container>
  );
}

const policies = {
  privacy: [
    "Privacy Policy",
    "We use the contact details you submit to respond to your enquiry. Web3Forms processes contact form submissions and delivers them to us by email. WhatsApp and Instagram handle direct messages under their own privacy policies.",
  ],
  terms: [
    "Terms & Conditions",
    "This website presents handmade gift designs. Please respect our original photos and illustrations, and contact us with any questions.",
  ],
} as const;
export function Policy({ type }: { type: keyof typeof policies }) {
  const { settings } = useBloom();
  const [title, fallback] = policies[type];
  return (
    <main className={type === "privacy" ? "wrap inner-page privacy-page" : "wrap inner-page"}>
      <PageHeading label="Customer care" title={title} />
      <div className="panel policy">
        <p className="preserve-lines">
          {settings[type === "privacy" ? "policy_privacy" : "policy_site_terms"] || fallback}
        </p>
        <Link to="/contact" className="text-link">
          Get in touch <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
