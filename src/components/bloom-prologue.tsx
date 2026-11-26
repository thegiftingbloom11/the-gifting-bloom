import { Check, Heart, PackageCheck } from "lucide-react";
import type { Product } from "@/lib/bloom";
import { ease } from "@/lib/bloom-timing";
import actors from "@/assets/story-prologue-cast.webp";
import entrance from "@/assets/story-prologue-entrance.webp";
import bouquet from "@/assets/story-sunflower-bouquet.webp";
import { ProductImage } from "./bloom-products";
import { BloomLogo } from "./bloom-logo";

export function updatePrologue(prologue: HTMLElement, time: number) {
  const delivery = ease(time, 5.66, 6.15);
  const detail = ease(time, 3.77, 4.04);
  const confirmation = ease(time, 4.66, 4.93);
  const lift = ease(time, 6.86, 7.53);
  const properties = {
    "prologue-end": ease(time, 7.9, 8.62),
    "phone-zoom": ease(time, 1.02, 2.47) * (1 - ease(time, 5.2, 5.94)),
    "phone-ui": 0.92 + 0.08 * ease(time, 1.04, 1.85),
    "opening-caption": 1 - ease(time, 0.82, 1.51),
    "profile-scroll": ease(time, 2.49, 3.5),
    "bouquet-focus": ease(time, 3.26, 3.69),
    "phone-profile": 1 - detail,
    "phone-detail": detail * (1 - confirmation),
    "phone-confirmation": confirmation,
    "screen-tap": ease(time, 3.59, 3.76) * (1 - ease(time, 3.76, 3.98)),
    "order-tap": ease(time, 4.37, 4.51) * (1 - ease(time, 4.51, 4.65)),
    "delivery-shot": delivery,
    "parcel-arrival": ease(time, 5.94, 6.45),
    "parcel-lid": ease(time, 6.52, 7.02),
    "parcel-away": ease(time, 7.12, 7.55),
    "gift-lift": lift,
    "reaction-nod": Math.sin(lift * Math.PI),
    "gift-caption": ease(time, 7.1, 7.49) * (1 - ease(time, 7.86, 8.43)),
  };
  for (const [name, value] of Object.entries(properties)) {
    const property = `--${name}`;
    const rounded = value.toFixed(4);
    if (prologue.style.getPropertyValue(property) !== rounded) {
      prologue.style.setProperty(property, rounded);
    }
  }
}

function BouquetArt() {
  return (
    <span className="prologue-bouquet-art" aria-hidden="true">
      <img src={bouquet} alt="" fetchPriority="low" decoding="async" draggable={false} />
    </span>
  );
}

type PreviewProps = {
  logo: string | undefined;
  gifts: Product[];
  sunflower: Product | undefined;
};

function PhoneScreen({ logo, gifts, sunflower }: PreviewProps) {
  return (
    <div className="prologue-phone" aria-hidden="true">
      <div className="prologue-screen">
        <div className="prologue-phone-bar">
          <span>Instagram</span>
          <span>Demo preview</span>
        </div>
        <div className="prologue-phone-panel prologue-profile">
          <div className="prologue-profile-header">
            <span className="prologue-avatar">
              <BloomLogo src={logo} />
            </span>
            <div>
              <strong>The Gifting Bloom</strong>
              <span>@the_gifting_bloom11</span>
            </div>
          </div>
          <div
            className="prologue-feed"
            style={{
              transform: `translateY(calc(-${gifts.length * 77}cqw * var(--profile-scroll, 0)))`,
            }}
          >
            {gifts.map((gift) => (
              <div className="prologue-feed-card" key={gift.id}>
                <ProductImage src={gift.image_url} alt="" />
                <span>{gift.name}</span>
              </div>
            ))}
            <div className="prologue-feed-card prologue-feed-bouquet">
              {sunflower ? <ProductImage src={sunflower.image_url} alt="" /> : <BouquetArt />}
              <span>{sunflower?.name ?? "Sunflower Bouquet"}</span>
              <i className="prologue-tap" />
            </div>
          </div>
        </div>
        <div className="prologue-phone-panel prologue-product">
          {sunflower ? (
            <span className="prologue-product-photo">
              <ProductImage src={sunflower.image_url} alt="" />
            </span>
          ) : (
            <BouquetArt />
          )}
          <strong>Sunflower Bouquet</strong>
          <span>That’s the one!</span>
          <span className="prologue-order-button">Order Now</span>
        </div>
        <div className="prologue-phone-panel prologue-confirmation">
          <span className="prologue-order-icon">
            <PackageCheck />
            <Heart />
          </span>
          <strong>Your Bloom Is On Its Way!</strong>
          <span>
            <Check /> Demo order confirmed
          </span>
        </div>
      </div>
    </div>
  );
}

export const storyHeading = "Every Beautiful Gift Begins With a Thought.";

export function BloomPrologue({ logo, gifts, sunflower }: PreviewProps) {
  return (
    <div className="bloom-prologue">
      <div className="prologue-phone-shot">
        <div className="prologue-camera prologue-opening-actor">
          <div className="prologue-actor prologue-browsing">
            <img src={actors} alt="" fetchPriority="high" draggable={false} />
            <span className="prologue-blink" aria-hidden="true" />
          </div>
        </div>
        <PhoneScreen logo={logo} gifts={gifts} sunflower={sunflower} />
        <div className="prologue-camera" aria-hidden="true">
          <div className="prologue-actor prologue-browsing">
            <img className="prologue-thumb" src={actors} alt="" draggable={false} />
          </div>
        </div>
        <div className="prologue-caption prologue-opening-caption">
          <span className="prologue-title" aria-hidden="true">
            {storyHeading}
          </span>
          <p>A little surprise. A beautiful smile. A memory forever.</p>
        </div>
      </div>
      <div className="prologue-delivery">
        <img
          className="prologue-entrance"
          src={entrance}
          alt=""
          fetchPriority="low"
          decoding="async"
          draggable={false}
        />
        <div className="prologue-receiving">
          <div className="prologue-actor prologue-smile">
            <img className="prologue-reaction-body" src={actors} alt="" draggable={false} />
            <img className="prologue-reaction-head" src={actors} alt="" draggable={false} />
          </div>
          <div className="prologue-delivered-bouquet">
            <BouquetArt />
          </div>
          <div className="prologue-parcel" aria-hidden="true">
            <div className="prologue-parcel-inside" />
            <div className="prologue-parcel-lid" />
            <div className="prologue-parcel-front">
              <BloomLogo src={logo} />
            </div>
          </div>
        </div>
        <div className="prologue-caption prologue-smile-caption">
          <p>Some Surprises Are Worth Every Smile.</p>
        </div>
      </div>
    </div>
  );
}
