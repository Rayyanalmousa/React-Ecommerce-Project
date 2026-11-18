import type { ReactNode } from "react";
import type { Product } from "../data/store";
import { Button, Icon } from "./primitives";

export function ProductCard({
  product,
  wished,
  onWish,
  onCart,
}: {
  product: Product;
  wished: boolean;
  onWish: () => void;
  onCart: () => void;
}) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={`${product.title} cover`} />
        <div className="cover-tint" style={{ background: product.color }} />
        <div className="cover-type">
          <span>{product.category}</span>
          <strong>{product.title}</strong>
          <small>{product.author}</small>
        </div>
        <button
          className={`heart-btn ${wished ? "wished" : ""}`}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={onWish}
        >
          <Icon name="heart" filled={wished} />
        </button>
      </div>
      <div className="product-info">
        <span className="tag">{product.category}</span>
        <h3>{product.title}</h3>
        <p>{product.author}</p>
        <div className="product-bottom">
          <strong>${product.price.toFixed(2)}</strong>
          <button onClick={onCart}>Add to cart</button>
        </div>
      </div>
    </article>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}
export function EmptyState({
  kind,
  title,
  text,
  action,
  label,
}: {
  kind: "book" | "heart" | "bag";
  title: string;
  text: string;
  action: () => void;
  label: string;
}) {
  return (
    <div className="empty-state">
      <div className="empty-art">
        <Icon name={kind === "book" ? "book" : kind === "heart" ? "heart" : "bag"} size={48} />
        <span>✦</span>
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      <Button onClick={action}>{label}</Button>
    </div>
  );
}
export function Quantity({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="quantity">
      <button onClick={() => onChange(Math.max(1, value - 1))}>−</button>
      <span>{value}</span>
      <button onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}
