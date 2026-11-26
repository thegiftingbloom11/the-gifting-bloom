import { Link, useNavigate } from "./bloom-navigation";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { matchesProductCategory, occasions, type Product } from "@/lib/bloom";
import { useBloom } from "./bloom-shell";
import { PageHeading, ProductGrid, ProductImage, GiftDetails } from "./bloom-products";

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
  const [active, setActive] = useState(0);
  const gallery = [...new Set([product.image_url, ...product.images].filter(Boolean))];
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
          <div className="detail-image">
            <ProductImage src={gallery[active]} alt={product.image_alt || product.name} eager />
          </div>
          {gallery.length > 1 && (
            <div className="gallery-thumbs">
              {gallery.map((url, index) => (
                <button
                  type="button"
                  aria-label={"View photo " + (index + 1)}
                  aria-pressed={active === index}
                  key={url}
                  onClick={() => setActive(index)}
                >
                  <ProductImage src={url} alt="" />
                </button>
              ))}
            </div>
          )}
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
export function GiftFinder({ embedded = false }: { embedded?: boolean } = {}) {
  const { products } = useBloom();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<[string, string, string]>(["", "", ""]);
  const palette = [...new Set(products.flatMap(({ colors }) => colors))];
  const questions = [
    ["Who are you gifting?", ["Partner", "Friend", "Family", "Colleague", "Anyone"]],
    ["What’s the occasion?", [...occasions, "Any occasion"]],

    ["Which colours do they love?", [...palette, "Any colour"]],
  ] as const;

  const rank = (item: Product) =>
    Number(item.occasions.includes(answers[1])) * 3 +
    Number(item.colors.includes(answers[2])) * 2 +
    Number(
      answers[0] === "Partner"
        ? item.category === "bouquets"
        : ["Friend", "Colleague"].includes(answers[0]) &&
            matchesProductCategory(item.category, "mini-gifts"),
    );
  const matches = products
    .filter(
      (item) =>
        (answers[2] === "Any colour" || item.colors.includes(answers[2])) &&
        (answers[1] === "Any occasion" || item.occasions.includes(answers[1])),
    )
    .sort((a, b) => rank(b) - rank(a))
    .slice(0, 4);
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
        <div className="question-panel">
          <p className="eyebrow">Question {step + 1} of 3</p>
          <progress value={step + 1} max={3} aria-label="Gift finder progress" />
          <h2>{questions[step]![0]}</h2>
          <div className="choice-grid">
            {questions[step]![1].map((value) => (
              <button
                key={value}
                className="choice"
                aria-pressed={answers[step] === value}
                onClick={() =>
                  setAnswers((current) => {
                    const next: typeof current = [...current];
                    next[step] = value;
                    return next;
                  })
                }
              >
                {value}
              </button>
            ))}
          </div>
          <div className="button-row">
            {step > 0 && (
              <button className="btn btn-outline" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            <button
              className="btn btn-primary"
              disabled={!answers[step]}
              onClick={() => setStep(step + 1)}
            >
              {step === 2 ? "See matches" : "Continue"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2>{matches.length ? "Blooms picked for you" : "No exact matches this time."}</h2>
          {matches.length ? (
            <ProductGrid items={matches} embedded={embedded} />
          ) : (
            <p>Try a different occasion or colour to see more gifts.</p>
          )}
          <div className="button-row section-space">
            <button className="btn btn-outline" onClick={() => setStep(0)}>
              Change answers
            </button>
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
