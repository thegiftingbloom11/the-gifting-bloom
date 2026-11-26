import { Link } from "./bloom-navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Instagram, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { sendEnquiry } from "@/lib/bloom-api";
import { instagram, occasions, whatsapp } from "@/lib/bloom";
import couple from "@/assets/story-couple-optimized.jpg";
import { useBloom } from "./bloom-shell";
import { PageHeading, ProductImage, ProductPreview } from "./bloom-products";
import { BloomStory } from "./bloom-story";
import { GiftFinder, Gallery } from "./bloom-gallery";
import { Customise } from "./bloom-customise";
import { BloomLogo } from "./bloom-logo";

const feelings = [
  ["Love & Romance", occasions[0], 0],
  ["Birthday Surprises", occasions[1], 1],
  ["Just Because", occasions[7], 2],
  ["Best Friend Gifts", occasions[3], 3],
  ["Thank You Gifts", occasions[5], 1],
  ["Custom Handmade Gifts", "", 0],
] as const;
export function Home({ occasion, category }: { occasion: string; category: string }) {
  const { products, reviews, reels, settings } = useBloom();
  const profile = settings["instagram"] || instagram;
  return (
    <main className="single-page" id="home">
      <BloomStory />
      <section className="wrap home-section" id="gift-gallery" tabIndex={-1}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">For the people you love</p>
            <h2>Gifts for every feeling.</h2>
          </div>
          <Link className="text-link" to="/" hash="gift-finder" search={true}>
            Take the gift finder <ArrowRight size={17} />
          </Link>
        </div>
        <div className="feeling-grid">
          {feelings.map(([label, feeling, index]) => {
            const product =
              products.find((item) => item.occasions.includes(feeling)) ||
              products[index] ||
              products[0];
            return (
              <Link
                to="/"
                hash={feeling ? "collection" : "customise"}
                search={feeling ? { occasion: feeling } : true}
                key={label}
                className="feeling-card"
              >
                <ProductImage src={product?.image_url} alt="" />
                <span>
                  {label}
                  <ArrowUpRight size={17} />
                </span>
                {product?.is_demo && <small>Concept illustration</small>}
              </Link>
            );
          })}
        </div>
      </section>
      <div className="collection-section">
        <Gallery initialOccasion={occasion} initialCategory={category} embedded />
      </div>
      <GiftFinder embedded />
      <div className="collection-section">
        <Customise embedded />
      </div>
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
            <BloomLogo src={settings["logo"]} className="instagram-mark" />
            <div>
              <h2>Bloom Diaries</h2>
              <p>@the_gifting_bloom11</p>
            </div>
            <a className="btn btn-primary" href={profile} target="_blank" rel="noreferrer">
              View Instagram profile <ArrowUpRight size={16} />
            </a>
          </div>
          {!!reels.length && <ReelGrid embedded />}
        </div>
      </section>
      <Contact embedded />
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
      >
        A little bloom can hold a big feeling.
      </PageHeading>
      <div className="craft-layout">
        <div className="craft-image">
          <ProductImage
            src={settings["craft_image"] || couple}
            alt={
              settings["craft_image"]
                ? "Crafting at The Gifting Bloom"
                : "An illustrated moment of giving a flower"
            }
          />
        </div>
        <div className="craft-copy">
          <h2>{settings["story_title"] || "A gift that feels personal."}</h2>
          <p className="preserve-lines">
            {settings["brand_story"] ||
              "Pick a colour that reminds you of them. Add a few words in your own voice. It’s those little choices that make a gift feel like yours to give."}
          </p>
          {settings["founder_story"] && (
            <>
              <h2>Meet the maker</h2>
              <p className="preserve-lines">{settings["founder_story"]}</p>
            </>
          )}
          <Link className="btn btn-primary" to="/" hash="customise" search={true}>
            Build a bouquet <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <section className="section-space">
        <h2>From stem to keepsake</h2>
        <div className="values-grid">
          <article>
            <h3>Choose the stems</h3>
            <p>Start with the flowers and colours that suit the person you have in mind.</p>
          </article>
          <article>
            <h3>Make it personal</h3>
            <p>Pick the wrap, ribbon, and a note to go with your bouquet.</p>
          </article>
          <article>
            <h3>Give a little joy</h3>
            <p>Browse the gallery for inspiration or share your design idea with us.</p>
          </article>
        </div>
      </section>
    </Container>
  );
}

export function Contact({ embedded = false }: { embedded?: boolean } = {}) {
  const { settings } = useBloom();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const link = whatsapp(settings["whatsapp"], "Hi! I have a question about a gift.");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      await sendEnquiry({
        data: {
          customer_name: String(form.get("name")),
          email: String(form.get("email")),
          phone: String(form.get("phone")),
          subject: String(form.get("subject")),
          message: String(form.get("message")),
        },
      });
      setSent(true);
    } catch {
      setError("Your enquiry couldn’t be saved. Please try again or message us on Instagram.");
    } finally {
      setPending(false);
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
      <div className="split-page">
        <div className="panel">
          <h2>Send an enquiry</h2>
          {sent ? (
            <p role="status">Your message has been sent.</p>
          ) : (
            <form className="form-stack" onSubmit={submit}>
              <label>
                Name
                <input name="name" required minLength={2} maxLength={120} autoComplete="name" />
              </label>
              <label>
                Email
                <input required type="email" name="email" maxLength={254} autoComplete="email" />
              </label>
              <label>
                Phone
                <input
                  required
                  name="phone"
                  type="tel"
                  minLength={7}
                  maxLength={26}
                  autoComplete="tel"
                />
              </label>
              <label>
                What’s it about?
                <select name="subject">
                  <option>General enquiry</option>
                  <option>Gift enquiry</option>
                  <option>Custom gift enquiry</option>
                </select>
              </label>
              <label>
                Message
                <textarea name="message" required minLength={5} maxLength={2000} rows={4} />
              </label>
              {error && (
                <p role="alert" className="error-note">
                  {error}
                </p>
              )}
              <button className="btn btn-primary" disabled={pending}>
                {pending ? "Sending…" : "Send enquiry"}
              </button>
            </form>
          )}
        </div>
        <aside className="panel">
          <h2>Find us</h2>
          <div className="form-stack">
            <a
              href={settings["instagram"] || instagram}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              <Instagram size={18} /> @the_gifting_bloom11 <ArrowUpRight size={15} />
            </a>
            {link && (
              <a href={link} target="_blank" rel="noreferrer" className="text-link">
                Message on WhatsApp <ArrowUpRight size={15} />
              </a>
            )}
            {settings["contact_email"] && (
              <a href={"mailto:" + settings["contact_email"]} className="text-link">
                {settings["contact_email"]}
              </a>
            )}
          </div>
          <h2 className="section-space">Frequently asked</h2>
          <details>
            <summary>Can I make a custom bouquet?</summary>
            <p>
              Use the{" "}
              <Link className="text-link" to="/" hash="customise" search={true}>
                bouquet builder
              </Link>{" "}
              to choose your stems, colours, and packaging.
            </p>
          </details>
        </aside>
      </div>
    </Container>
  );
}

const policies = {
  privacy: [
    "Privacy Policy",
    "We use the contact details you submit to respond to your enquiry. WhatsApp and Instagram handle messages under their own privacy policies.",
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
    <main className="wrap inner-page">
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
