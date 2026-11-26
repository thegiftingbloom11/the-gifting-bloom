import { Link } from "./bloom-navigation";
import { ArrowRight, Flower2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { bouquetBuilderEnabled, colourValue, type Product } from "@/lib/bloom";
import { analyticsItem, trackBloomEvent } from "@/lib/bloom-analytics";

const cardImageSizes = "(max-width: 920px) 46vw, (max-width: 1416px) 23vw, 312px";
const detailImageSizes = "(max-width: 700px) 92vw, (max-width: 1416px) 43vw, 610px";

export function ProductImage({
  src,
  alt,
  eager = false,
  preview,
  sizes,
}: {
  src?: string | undefined;
  alt: string;
  eager?: boolean;
  preview?: Product["imagePreview"];
  sizes?: string;
}) {
  const [failed, setFailed] = useState("");
  const srcSet =
    preview &&
    [
      `${preview.src} 640w`,
      ...(preview.large ? [`${preview.large} 1280w`] : []),
      `${src} ${preview.originalWidth}w`,
    ].join(", ");
  return src && failed !== src ? (
    <img
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={preview ? sizes : undefined}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      onError={() => setFailed(src)}
    />
  ) : (
    <div
      className="image-fallback"
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={!alt || undefined}
    >
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
        <ProductImage
          src={active}
          alt={
            !active || active === product.image_url
              ? product.image_alt?.trim() || product.name
              : `${product.name}, product photo ${photos.indexOf(active ?? "") + 1}`
          }
          eager={detail}
          preview={active === product.image_url ? product.imagePreview : undefined}
          sizes={detail ? detailImageSizes : "(max-width: 700px) 86vw, 420px"}
        />
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
      <Link className="text-link" to="/contact" search={{ gift: product.slug }}>
        Ask about this gift <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function PreviewDetails({ product }: { product: Product }) {
  const canCustomise = bouquetBuilderEnabled && product.category === "bouquets";
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
          <Link className="btn btn-primary" to="/contact" search={{ gift: product.slug }}>
            Enquire about this gift <ArrowRight size={16} />
          </Link>
        </DialogClose>
        <DialogClose asChild>
          <Link
            className="text-link"
            to="/"
            hash={canCustomise ? "customise" : "collection"}
            search={canCustomise ? true : { category: product.category }}
          >
            {canCustomise ? "Customise a bouquet" : "See more in this category"}
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
  listId,
  index,
  eager,
}: {
  product: Product;
  embedded?: boolean;
  listId: string;
  index: number;
  eager: boolean;
}) {
  const selectItem = () =>
    trackBloomEvent("select_item", {
      ecommerce: { item_list_id: listId, items: [{ ...analyticsItem(product), index }] },
    });
  const photo = (
    <ProductImage
      src={product.image_url}
      alt={product.image_alt?.trim() || product.name}
      eager={eager}
      preview={product.imagePreview}
      sizes={cardImageSizes}
    />
  );
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) trackBloomEvent("view_item", { ecommerce: { items: [analyticsItem(product)] } });
      }}
    >
      <article className="product-card">
        <div className="product-media">
          {embedded ? (
            <DialogTrigger asChild>
              <button
                type="button"
                className="product-preview-trigger"
                aria-label={"View " + product.name}
                onClick={selectItem}
              >
                {photo}
              </button>
            </DialogTrigger>
          ) : (
            <Link
              to="/product/$slug"
              params={{ slug: product.slug }}
              aria-label={product.name}
              onClick={selectItem}
            >
              {photo}
            </Link>
          )}
          {product.is_demo && <span className="pill demo-pill">Illustration</span>}
        </div>
        <div className="product-info">
          <div className="product-title">
            <h3>
              {product.is_demo && embedded ? (
                product.name
              ) : (
                <Link to="/product/$slug" params={{ slug: product.slug }} onClick={selectItem}>
                  {product.name}
                </Link>
              )}
            </h3>
          </div>
          {!!product.colors.length && <Swatches values={product.colors} />}
          <div className="product-actions">
            <DialogTrigger asChild>
              <button type="button" className="btn btn-primary product-cta" onClick={selectItem}>
                {embedded ? "View gift" : "Quick view"}
              </button>
            </DialogTrigger>
            {bouquetBuilderEnabled && product.category === "bouquets" ? (
              <Link className="text-link" to="/" hash="customise" search={true}>
                Customise <ArrowRight size={14} />
              </Link>
            ) : embedded ? (
              <Link
                className="text-link"
                to="/contact"
                search={product.category === "bouquets" ? { gift: product.slug } : undefined}
              >
                Enquire <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                className="text-link"
                to="/product/$slug"
                params={{ slug: product.slug }}
                onClick={selectItem}
              >
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
export function ProductGrid({
  items,
  embedded = false,
  listId,
  prioritizeFirst = false,
}: {
  items: Product[];
  embedded?: boolean;
  listId: string;
  prioritizeFirst?: boolean;
}) {
  const lastList = useRef("");
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const list = items.slice(0, 200);
    const key = JSON.stringify([listId, ...list.map((product) => product.slug)]);
    if (!list.length || lastList.current === key) return;
    const recordList = () => {
      if (lastList.current === key) return;
      lastList.current = key;
      trackBloomEvent("view_item_list", {
        ecommerce: {
          item_list_id: listId,
          items: list.map((product, index) => ({ ...analyticsItem(product), index })),
        },
      });
    };
    if (!grid.current || typeof IntersectionObserver === "undefined") {
      recordList();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        recordList();
        observer.disconnect();
      }
    });
    observer.observe(grid.current);
    return () => observer.disconnect();
  }, [items, listId]);
  return (
    <div className="product-grid" ref={grid}>
      {items.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          embedded={embedded}
          listId={listId}
          index={index}
          eager={prioritizeFirst && index === 0}
        />
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
