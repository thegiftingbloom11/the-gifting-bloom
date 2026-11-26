import { Link } from "./bloom-navigation";
import { ArrowRight, Flower2 } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { colourValue, type Product } from "@/lib/bloom";

export function ProductImage({
  src,
  alt,
  eager = false,
}: {
  src?: string | undefined;
  alt: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState("");
  return src && failed !== src ? (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(src)}
    />
  ) : (
    <div className="image-fallback" role="img" aria-label={alt}>
      <Flower2 size={64} strokeWidth={1} />
    </div>
  );
}

export function ProductPhotos({ product, detail = false }: { product: Product; detail?: boolean }) {
  const photos = [...new Set([product.image_url, ...product.images].filter(Boolean))];
  const [selected, selectPhoto] = useState<string>();
  const active = selected && photos.includes(selected) ? selected : photos[0];

  return (
    <>
      <div className={detail ? "detail-image" : "quick-view-photo"}>
        <ProductImage src={active} alt={product.image_alt || product.name} eager={detail} />
      </div>
      {photos.length > 1 && (
        <div className="gallery-thumbs" role="group" aria-label="Product photos">
          {photos.map((photo, index) => (
            <button
              key={photo}
              type="button"
              aria-label={"View photo " + (index + 1)}
              aria-pressed={photo === active}
              onClick={() => selectPhoto(photo)}
            >
              <ProductImage src={photo} alt="" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export function Swatches({
  values,
  selected,
  onSelect,
}: {
  values: string[];
  selected?: string;
  onSelect?: (value: string) => void;
}) {
  return (
    <div className="swatches">
      {values.map((name) => {
        const value = colourValue(name);
        return onSelect ? (
          <button
            key={name}
            type="button"
            title={name}
            aria-label={name}
            aria-pressed={selected === name}
            className="swatch"
            style={{ backgroundColor: value }}
            onClick={() => onSelect(name)}
          />
        ) : (
          <span key={name} className="swatch" title={name} style={{ backgroundColor: value }} />
        );
      })}
    </div>
  );
}

export function GiftDetails({ product }: { product: Product }) {
  return (
    <div className="gift-details">
      {product.is_demo && <span className="pill">Illustration</span>}
      <p>{product.description}</p>
      {!!product.colors.length && <Swatches values={product.colors} />}
      {!!product.variants.length && <p>Styles: {product.variants.join(", ")}</p>}
      <Link className="text-link" to="/" hash="contact" search={{ gift: product.slug }}>
        Ask about this gift <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function PreviewDetails({ product }: { product: Product }) {
  const [search] = useSearchParams();
  const isBouquet = product.category === "bouquets";
  return (
    <div className="quick-view-details">
      {product.categoryName && <p className="eyebrow">{product.categoryName}</p>}
      {product.is_demo && <span className="pill">Illustration</span>}
      <DialogDescription className="quick-view-description">
        {product.description}
      </DialogDescription>
      <dl className="quick-view-facts">
        {!!product.colors.length && (
          <div>
            <dt>Colours shown</dt>
            <dd>
              <Swatches values={product.colors} />
              {product.colors.join(" · ")}
            </dd>
          </div>
        )}
        {!!product.variants.length && (
          <div>
            <dt>Styles</dt>
            <dd>{product.variants.join(" · ")}</dd>
          </div>
        )}
        {!!product.occasions.length && (
          <div>
            <dt>Gift for</dt>
            <dd>{product.occasions.join(" · ")}</dd>
          </div>
        )}
      </dl>
      <div className="quick-view-actions">
        <p>Ask about pricing, availability or colour options.</p>
        <DialogClose asChild>
          <Link
            className="btn btn-primary"
            to="/"
            hash="contact"
            search={{ ...Object.fromEntries(search), gift: product.slug }}
          >
            Enquire about this gift <ArrowRight size={16} />
          </Link>
        </DialogClose>
        <DialogClose asChild>
          <Link
            className="text-link"
            to="/"
            hash={isBouquet ? "customise" : "collection"}
            search={isBouquet ? true : { category: product.category }}
          >
            {isBouquet ? "Customise a bouquet" : "See more in this category"}
            <ArrowRight size={15} />
          </Link>
        </DialogClose>
      </div>
    </div>
  );
}

export function ProductPreview({
  product,
  embedded = false,
}: {
  product: Product;
  embedded?: boolean;
}) {
  return (
    <DialogContent className="bloom-dialog quick-view">
      <DialogTitle>{product.name}</DialogTitle>
      <div>
        <div className="quick-view-photos">
          <ProductPhotos product={product} />
          {embedded && product.video && (
            <video
              className="product-video"
              src={product.video}
              controls
              playsInline
              preload="none"
            />
          )}
        </div>
        <PreviewDetails product={product} />
      </div>
    </DialogContent>
  );
}

export function ProductCard({
  product,
  embedded = false,
}: {
  product: Product;
  embedded?: boolean;
}) {
  return (
    <Dialog>
      <article className="product-card">
        <div className="product-media">
          {embedded ? (
            <DialogTrigger asChild>
              <button
                type="button"
                className="product-preview-trigger"
                aria-label={"View " + product.name}
              >
                <ProductImage src={product.image_url} alt={product.image_alt || product.name} />
              </button>
            </DialogTrigger>
          ) : (
            <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name}>
              <ProductImage src={product.image_url} alt={product.image_alt || product.name} />
            </Link>
          )}
          {product.is_demo && <span className="pill demo-pill">Illustration</span>}
        </div>
        <div className="product-info">
          <div className="product-title">
            <h3>
              {embedded ? (
                product.name
              ) : (
                <Link to="/product/$slug" params={{ slug: product.slug }}>
                  {product.name}
                </Link>
              )}
            </h3>
          </div>
          {!!product.colors.length && <Swatches values={product.colors} />}
          <div className="product-actions">
            <DialogTrigger asChild>
              <button type="button" className="btn btn-primary product-cta">
                {embedded ? "View gift" : "Quick view"}
              </button>
            </DialogTrigger>
            {product.category === "bouquets" ? (
              <Link className="text-link" to="/" hash="customise" search={true}>
                Customise <ArrowRight size={14} />
              </Link>
            ) : embedded ? (
              <Link className="text-link" to="/" hash="contact" search={true}>
                Enquire <ArrowRight size={14} />
              </Link>
            ) : (
              <Link className="text-link" to="/product/$slug" params={{ slug: product.slug }}>
                View gift <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </article>
      <ProductPreview product={product} embedded={embedded} />
    </Dialog>
  );
}
export function ProductGrid({ items, embedded = false }: { items: Product[]; embedded?: boolean }) {
  return (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} embedded={embedded} />
      ))}
    </div>
  );
}
export function PageHeading({
  label,
  title,
  children,
  as: Title = "h1",
}: {
  label?: string;
  title: string;
  children?: React.ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="page-heading">
      {label && <p className="eyebrow">{label}</p>}
      <Title>{title}</Title>
      {children && <p>{children}</p>}
    </div>
  );
}
