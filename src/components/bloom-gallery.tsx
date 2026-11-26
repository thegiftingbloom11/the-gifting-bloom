import { Link, useNavigate } from "./bloom-navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Cake,
  Flower2,
  Gem,
  Gift,
  GraduationCap,
  Heart,
  HeartHandshake,
  PartyPopper,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState, type CSSProperties } from "react";
import {
  colourValue,
  matchesProductCategory,
  matchesProductColours,
  occasions,
  type Product,
} from "@/lib/bloom";
import anniversaryWallpaper from "@/assets/gift-finder-anniversary-wallpaper.jpg";
import anyOccasionWallpaper from "@/assets/gift-finder-any-occasion-wallpaper.jpg";
import birthdayWallpaper from "@/assets/gift-finder-birthday-wallpaper.jpg";
import congratulationsWallpaper from "@/assets/gift-finder-congratulations-wallpaper.jpg";
import festiveWallpaper from "@/assets/gift-finder-festive-gifting-wallpaper.jpg";
import friendshipWallpaper from "@/assets/gift-finder-friendship-wallpaper.jpg";
import graduationWallpaper from "@/assets/gift-finder-graduation-wallpaper.jpg";
import justBecauseWallpaper from "@/assets/gift-finder-just-because-wallpaper.jpg";
import valentineWallpaper from "@/assets/gift-finder-valentine-wallpaper.jpg";
import { useBloom } from "./bloom-shell";
import {
  PageHeading,
  ProductGrid,
  ProductImage,
  ProductPhotos,
  GiftDetails,
} from "./bloom-products";

export function Gallery({
  category,
  initialOccasion = "",
  initialCategory = "",
  embedded = false,
}: {
  category?: string;
  initialOccasion?: string;
  initialCategory?: string;
  embedded?: boolean;
}) {
  const { products, categories, settings } = useBloom();
  const navigate = useNavigate();
  const currentCategory = categories.find(({ slug }) => slug === category);
  const categoryImage = currentCategory && settings["category-image:" + currentCategory.id];
  const filterCategory = category || initialCategory;
  function selectCategory(slug: string) {
    void navigate({
      to: "/",
      search: slug ? { category: slug, occasion: initialOccasion || undefined } : {},
      hash: true,
      resetScroll: false,
      replace: true,
    });
  }
  const options = new Map(
    products
      .filter((item) => item.category)
      .map(({ category, categoryName }) => [category, categoryName]),
  );
  if (filterCategory === "mini-gifts") {
    options.set("mini-gifts", "Mini gifts");
  }
  const matches = products.filter(
    (item) =>
      matchesProductCategory(item.category, filterCategory) &&
      (!initialOccasion || item.occasions.includes(initialOccasion)),
  );
  const Container = embedded ? "section" : "main";

  return (
    <Container
      id={embedded ? "collection" : undefined}
      data-category={filterCategory || undefined}
      className={embedded ? "wrap home-section" : "wrap inner-page"}
    >
      <PageHeading
        as={embedded ? "h2" : "h1"}
        label="The collection"
        title={
          category === "bouquets"
            ? "Handmade Bouquets"
            : category === "mini-gifts"
              ? "Little gifts, big feelings."
              : "Find a bloom to give."
        }
      >
        {category === "mini-gifts"
          ? "Small keepsakes for the people who make your days brighter."
          : "Handmade flowers and thoughtful keepsakes for the moments you want to hold on to."}
      </PageHeading>
      {categoryImage && (
        <div className="category-banner">
          <ProductImage src={categoryImage} alt="" />
        </div>
      )}
      {embedded ? (
        <div className="shop-tabs" aria-label="Gift collections">
          <button
            type="button"
            aria-pressed={!filterCategory && !initialOccasion}
            onClick={() => selectCategory("")}
          >
            All gifts
          </button>
          {[...options].map(([slug, name]) => (
            <button
              key={slug}
              type="button"
              aria-pressed={filterCategory === slug}
              onClick={() => selectCategory(slug)}
            >
              {name}
            </button>
          ))}
          <Link to="/" hash="gift-finder" search={true}>
            Gift finder <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="shop-tabs">
          <Link
            to="/"
            hash="collection"
            search={{}}
            activeOptions={{ exact: true, includeSearch: false }}
          >
            All gifts
          </Link>
          <Link to="/bouquets">Bouquets</Link>
          <Link to="/mini-gifts">Mini gifts</Link>
          <Link to="/gift-finder">
            Gift finder <ArrowRight size={15} />
          </Link>
        </div>
      )}
      <p className="fine result-count" aria-live="polite">
        {matches.length} {matches.length === 1 ? "gift" : "gifts"}
      </p>
      {matches.length ? (
        <ProductGrid items={matches} embedded={embedded} />
      ) : (
        <div className="empty">
          <h2>{products.length ? "No gifts match this selection." : "No gifts available."}</h2>
          {!!products.length && (
            <Link className="btn btn-outline" to="/" hash="collection">
              View all gifts
            </Link>
          )}
        </div>
      )}
    </Container>
  );
}

export function Detail({ product }: { product: Product }) {
  const store = useBloom();
  const related = store.products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);
  const reviews = store.reviews.filter(
    (review) => review.product_name.trim().toLowerCase() === product.name.toLowerCase(),
  );
  return (
    <main className="wrap inner-page">
      <p className="breadcrumb">
        <Link to="/" hash="collection">
          Gallery
        </Link>{" "}
        / {product.categoryName} / {product.name}
      </p>
      <div className="detail-layout">
        <div>
          <ProductPhotos key={product.id} product={product} detail />
          {product.video && (
            <video
              className="product-video"
              controls
              playsInline
              preload="none"
              src={product.video}
            />
          )}
        </div>
        <div>
          <p className="eyebrow">{product.categoryName}</p>
          <h1>{product.name}</h1>
          <GiftDetails product={product} />
        </div>
      </div>
      <section className="section-space">
        <h2>Little notes from customers</h2>
        {reviews.length ? (
          <div className="review-strip">
            {reviews.map((review) => (
              <blockquote key={review.id}>
                <p>{review.review}</p>
                <cite>
                  {review.customer_name}
                  {review.rating && " · " + review.rating + "/5"}
                </cite>
              </blockquote>
            ))}
          </div>
        ) : (
          <p>No customer notes for this gift yet.</p>
        )}
      </section>
      {!!related.length && (
        <section className="section-space">
          <h2>You might also like</h2>
          <ProductGrid items={related} />
        </section>
      )}
    </main>
  );
}
const recipients = ["Partner", "Friend", "Family", "Colleague", "Anyone"] as const;
const finderSteps = ["Recipient", "Occasion", "Colour"] as const;
const recipientArt = {
  Partner: { icon: Heart, accent: "#b84d69" },
  Friend: { icon: HeartHandshake, accent: "#ae99cc" },
  Family: { icon: Users, accent: "#ad8f54" },
  Colleague: { icon: BriefcaseBusiness, accent: "#8ba684" },
  Anyone: { icon: Gift, accent: "#c47765" },
};
const occasionArt: Record<
  (typeof occasions)[number] | "Any occasion",
  { icon: LucideIcon; accent: string; edge: string; wallpaper: string; position?: string }
> = {
  "Valentine's Day": {
    icon: Heart,
    accent: "#b12c47",
    edge: "#e87788",
    wallpaper: valentineWallpaper,
  },
  Birthdays: {
    icon: Cake,
    accent: "#b65175",
    edge: "#e5b9e3",
    wallpaper: birthdayWallpaper,
    position: "center 78%",
  },
  Anniversaries: { icon: Gem, accent: "#a85881", edge: "#ebbecf", wallpaper: anniversaryWallpaper },
  "Friendship Day": {
    icon: HeartHandshake,
    accent: "#8260ac",
    edge: "#d6c6ee",
    wallpaper: friendshipWallpaper,
    position: "center 72%",
  },
  Graduation: {
    icon: GraduationCap,
    accent: "#45678a",
    edge: "#b9d8ed",
    wallpaper: graduationWallpaper,
    position: "right center",
  },
  Congratulations: {
    icon: PartyPopper,
    accent: "#ac661c",
    edge: "#f2cf8b",
    wallpaper: congratulationsWallpaper,
    position: "center top",
  },
  "Festive Gifting": {
    icon: Sparkles,
    accent: "#b4672c",
    edge: "#edbd87",
    wallpaper: festiveWallpaper,
    position: "center 75%",
  },
  "Just Because": {
    icon: Flower2,
    accent: "#517b52",
    edge: "#c6d8b4",
    wallpaper: justBecauseWallpaper,
    position: "center 68%",
  },
  "Any occasion": {
    icon: Gift,
    accent: "#a65f51",
    edge: "#efcaba",
    wallpaper: anyOccasionWallpaper,
  },
};

function GiftFinderPreview({
  step,
  answers,
  manualColour,
}: {
  step: number;
  answers: [string, string, string];
  manualColour: boolean;
}) {
  const [recipient, occasion, colour] = answers;
  const recipientIndex = recipients.findIndex((value) => value === recipient);
  const scene = step === 2 ? 5 : recipientIndex < 0 ? 4 : recipientIndex;
  const person = recipientArt[recipients[recipientIndex] ?? "Anyone"];
  const event = occasionArt[occasion as keyof typeof occasionArt] ?? occasionArt["Any occasion"];
  const themed = step === 1 && !!occasion;
  const selected = answers[step];
  const { icon: Icon, accent } =
    step === 0
      ? person
      : step === 1
        ? event
        : {
            icon: Flower2,
            accent: colour && colour !== "Any colour" ? colourValue(colour) : "#b97a9a",
          };

  return (
    <div
      className="gift-finder-preview"
      aria-hidden="true"
      data-occasion={themed ? occasion : undefined}
      style={
        {
          "--finder-accent": accent,
          "--finder-edge": themed ? event.edge : undefined,
        } as CSSProperties
      }
    >
      {themed && (
        <div
          className="gift-finder-wallpaper"
          key={occasion}
          style={{ backgroundImage: `url(${event.wallpaper})`, backgroundPosition: event.position }}
        />
      )}
      <div
        className="gift-finder-scene"
        key={step + ":" + (step === 2 && manualColour ? "manual" : selected)}
      >
        <div className="gift-finder-art" data-scene={scene} />
        <div className="gift-finder-caption">
          <span className="gift-finder-symbol">
            <Icon size={20} />
          </span>
          {selected && <span>{selected}</span>}
        </div>
      </div>
    </div>
  );
}

export function GiftFinder({ embedded = false }: { embedded?: boolean } = {}) {
  const { products } = useBloom();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<[string, string, string]>(["", "", ""]);
  const [manualColour, setManualColour] = useState(false);
  const palette = [...new Set(products.flatMap(({ colors }) => colors))];
  const enteredColour = answers[2].trim();
  const anyColour = enteredColour.toLowerCase() === "any colour";
  const selectedColour =
    palette.find((colour) => colour.toLowerCase() === enteredColour.toLowerCase()) ?? enteredColour;
  function selectAnswer(value: string) {
    setAnswers((current) => {
      const next: typeof current = [...current];
      next[step] = value;
      return next;
    });
  }
  const colourRequest = manualColour && enteredColour && (
    <Link className="btn btn-outline" to="/contact" search={{ giftColour: enteredColour }}>
      Send colour request <ArrowRight size={16} />
    </Link>
  );
  const questions = [
    ["Who are you gifting?", recipients],
    ["What’s the occasion?", [...occasions, "Any occasion"]],

    ["Which colours do they love?", [...palette, "Any colour"]],
  ] as const;

  const rank = (item: Product) =>
    Number(item.occasions.includes(answers[1])) * 4 +
    Number(item.colors.includes(selectedColour)) * 2 +
    Number(
      answers[0] === "Partner"
        ? item.category === "bouquets"
        : ["Friend", "Colleague"].includes(answers[0]) &&
            matchesProductCategory(item.category, "mini-gifts"),
    );
  const matches = products
    .filter((item) =>
      anyColour
        ? answers[1] === "Any occasion" || item.occasions.includes(answers[1])
        : matchesProductColours(item, selectedColour),
    )
    .sort((a, b) => rank(b) - rank(a));
  const Container = embedded ? "section" : "main";
  return (
    <Container
      id={embedded ? "gift-finder" : undefined}
      className={embedded ? "wrap home-section" : "wrap inner-page"}
    >
      <PageHeading
        as={embedded ? "h2" : "h1"}
        label="Gift finder"
        title="Find something that feels like them."
      />
      {step < 3 ? (
        <div className="question-panel gift-finder-quiz">
          <div className="gift-finder-form">
            <ol className="gift-finder-steps" aria-label="Gift finder progress">
              {finderSteps.map((label, index) => (
                <li
                  key={label}
                  data-complete={index < step}
                  aria-current={index === step ? "step" : undefined}
                >
                  <span aria-hidden="true">{index + 1}</span>
                  {label}
                </li>
              ))}
            </ol>
            <h2 id="gift-finder-question">{questions[step]![0]}</h2>
            <div className="choice-grid" role="group" aria-labelledby="gift-finder-question">
              {questions[step]![1].map((value) => (
                <button
                  type="button"
                  key={value}
                  className="choice"
                  aria-pressed={answers[step] === value && (step !== 2 || !manualColour)}
                  onClick={() => {
                    if (step === 2) setManualColour(false);
                    selectAnswer(value);
                  }}
                >
                  {step === 2 && value !== "Any colour" && (
                    <span
                      className="swatch"
                      aria-hidden="true"
                      style={{ backgroundColor: colourValue(value) }}
                    />
                  )}
                  {value}
                </button>
              ))}
            </div>
            {step === 2 && (
              <label className="gift-finder-colour-input">
                Type a colour or combination
                <input
                  type="text"
                  name="gift-colour"
                  value={manualColour ? answers[2] : ""}
                  maxLength={80}
                  placeholder="e.g. Peach and ivory"
                  onChange={(event) => {
                    setManualColour(true);
                    selectAnswer(event.target.value);
                  }}
                />
              </label>
            )}
            <div className="button-row">
              {step > 0 && (
                <button className="btn btn-outline" onClick={() => setStep(step - 1)}>
                  Back
                </button>
              )}
              <button
                className="btn btn-primary"
                disabled={!answers[step]?.trim()}
                onClick={() => setStep(step + 1)}
              >
                {step === 2 ? "See matches" : "Continue"} <ArrowRight size={16} />
              </button>
              {step === 2 && colourRequest}
            </div>
          </div>
          <GiftFinderPreview
            step={step}
            answers={[answers[0], answers[1], selectedColour]}
            manualColour={manualColour}
          />
        </div>
      ) : (
        <div>
          <h2>{matches.length ? "Blooms picked for you" : "No exact matches this time."}</h2>
          {matches.length ? (
            <>
              <p className="fine result-count">
                {matches.length} {matches.length === 1 ? "gift" : "gifts"}
                {!anyColour && ` in ${selectedColour}`}
              </p>
              <ProductGrid items={matches} embedded={embedded} />
            </>
          ) : (
            <p>
              {anyColour
                ? "Try a different occasion."
                : "Try another colour or request a custom gift."}
            </p>
          )}
          <div className="button-row section-space">
            <button className="btn btn-outline" onClick={() => setStep(0)}>
              Change answers
            </button>
            {colourRequest}
            <button
              className="btn btn-primary"
              onClick={() => void navigate({ to: "/", hash: "collection", search: {} })}
            >
              View the gallery
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}
