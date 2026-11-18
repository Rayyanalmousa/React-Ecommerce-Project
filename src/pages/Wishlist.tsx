import type { Page } from "../data/store";
import { products } from "../data/store";
import { EmptyState, ProductCard } from "../components/StoreComponents";

export function Wishlist({
  wished,
  toggleWish,
  addCart,
  go,
}: {
  wished: number[];
  toggleWish: (id: number) => void;
  addCart: (id: number) => void;
  go: (p: Page) => void;
}) {
  const items = products.filter((p) => wished.includes(p.id));
  return (
    <main className="container wishlist-page">
      <div className="page-intro">
        <p className="eyebrow">Saved for later</p>
        <h1>Your wishlist</h1>
        <p>
          {items.length
            ? `${items.length} ${items.length === 1 ? "treasure" : "treasures"} tucked away for you.`
            : "A shelf of stories you hope to return to."}
        </p>
      </div>
      {items.length ? (
        <div className="product-grid listing-grid wish-grid">
          {items.map((p) => (
            <div className="wish-wrap" key={p.id}>
              <ProductCard
                product={p}
                wished
                onWish={() => toggleWish(p.id)}
                onCart={() => addCart(p.id)}
              />
              <button className="remove-link" onClick={() => toggleWish(p.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          kind="heart"
          title="Your wishlist is empty"
          text="Save the books that catch your eye and they’ll be waiting here when you return."
          action={() => go("products")}
          label="Browse books"
        />
      )}
    </main>
  );
}
