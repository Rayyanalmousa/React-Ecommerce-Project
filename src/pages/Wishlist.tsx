import type { Page } from "../data/store";
import { products } from "../data/store";
import { Icon } from "../components/primitives";
import { ProductCard } from "../components/StoreComponents";
import { Button } from "../components/primitives";

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
      <header className="wishlist-heading">
        <div>
          <p className="eyebrow">A shelf of your own</p>
          <h1>
            Saved for later<span>.</span>
          </h1>
          <p className="wishlist-description">
            Keep the books that caught your eye close until you’re ready for the next chapter.
          </p>
        </div>
        {items.length > 0 && (
          <div className="wishlist-count-card" aria-label={`${items.length} saved items`}>
            <strong>{String(items.length).padStart(2, "0")}</strong>
            <span>{items.length === 1 ? "saved book" : "saved books"}</span>
          </div>
        )}
      </header>
      {items.length ? (
        <section className="wishlist-content" aria-label="Saved products">
          <div className="wishlist-toolbar">
            <p>
              Your collection <span>({items.length})</span>
            </p>
            <button type="button" onClick={() => go("products")}>
              Discover more <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="product-grid wishlist-grid">
            {items.map((product) => (
              <div className="wishlist-item" key={product.id}>
                <ProductCard
                  product={product}
                  wished
                  onWish={() => toggleWish(product.id)}
                  onCart={() => addCart(product.id)}
                />
                <button
                  type="button"
                  className="wishlist-remove"
                  onClick={() => toggleWish(product.id)}
                  aria-label={`Remove ${product.title} from your wishlist`}
                >
                  <Icon name="x" size={14} />
                  Remove from wishlist
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="wishlist-empty">
          <div className="wishlist-empty-mark">
            <Icon name="heart" size={26} />
            <span>✦</span>
          </div>
          <p className="eyebrow">Nothing tucked away just yet</p>
          <h2>Leave room for a story.</h2>
          <p>Tap the heart on anything you love and it will be waiting here when you return.</p>
          <Button variant="secondary" onClick={() => go("products")}>
            Explore the collection <Icon name="arrow" size={17} />
          </Button>
          <small>Your saved books stay together on this shelf.</small>
        </section>
      )}
    </main>
  );
}
