import { Link } from "./bloom-navigation";
import { ArrowRight, Flower2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { colours, type Product } from "@/lib/bloom";

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
        const value =
          colours[name as keyof typeof colours] || (/^#[\da-f]{6}$/i.test(name) ? name : "#e9d1c4");
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

export function GiftDetails({
  product,
  inDialog = false,
}: {
  product: Product;
  inDialog?: boolean;
}) {
  const contact = (
    <Link className="text-link" to="/" hash="contact" search={true}>
      Ask about this gift <ArrowRight size={16} />
    </Link>
  );
  return (
    <div className="gift-details">
      {product.is_demo && <span className="pill">Illustration</span>}
      <p>{product.description}</p>
      {!!product.colors.length && <Swatches values={product.colors} />}
      {!!product.variants.length && <p>Styles: {product.variants.join(", ")}</p>}
      {inDialog ? <DialogClose asChild>{contact}</DialogClose> : contact}
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
  const gallery = [...new Set([product.image_url, ...product.images].filter(Boolean))];
  const [photo, selectPhoto] = useState(0);
  return (
    <DialogContent className="bloom-dialog quick-view">
      <DialogTitle>{product.name}</DialogTitle>
      <div>
        <div className="quick-view-photos">
          <ProductImage src={gallery[photo]} alt={product.image_alt || product.name} />
          {embedded && gallery.length > 1 && (
            <div className="gallery-thumbs">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  aria-label={"View photo " + (index + 1)}
                  aria-pressed={index === photo}
                  onClick={() => selectPhoto(index)}
                >
                  <ProductImage src={image} alt="" />
                </button>
              ))}
            </div>
          )}
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
        <GiftDetails product={product} inDialog />
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
          <Swatches values={product.colors} />
          <div className="product-actions">
            <DialogTrigger asChild>
              <button type="button" className="text-link">
                {embedded ? "View gift" : "Quick view"}
              </button>
            </DialogTrigger>
            {product.category === "bouquets" ? (
              <Link className="text-link" to="/" hash="customise" search={true}>
                Customise <ArrowRight size={14} />
              </Link>
            ) : (
              !embedded && (
                <Link className="text-link" to="/product/$slug" params={{ slug: product.slug }}>
                  View gift <ArrowRight size={14} />
                </Link>
              )
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
