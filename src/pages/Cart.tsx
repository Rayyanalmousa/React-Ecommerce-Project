import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FREE_SHIPPING_THRESHOLD, ROUTES } from "../data/store";
import { useStore } from "../context/StoreContext";
import { Button, Icon } from "../components/primitives";
import { EmptyState, Quantity } from "../components/StoreComponents";
import { formatPrice } from "../utils/pricing";

export function Cart() {
  const navigate = useNavigate();
  const { items, cartCount, totals, setQuantity, removeFromCart, clearCart } = useStore();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!items.length) {
    return (
      <main className="container empty-page">
        <EmptyState
          kind="bag"
          title="Your cart is empty"
          text="Your next favorite story is waiting. Add a book or two and it will appear here."
          action={() => navigate(ROUTES.products)}
          label="Continue shopping"
        />
      </main>
    );
  }

  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totals.subtotal;

  return (
    <main className="container cart-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Your bag</p>
          <h1>Shopping cart</h1>
        </div>
        {confirmClear ? (
          <span>
            Remove everything?{" "}
            <button
              type="button"
              className="clear-cart"
              onClick={() => {
                clearCart();
                setConfirmClear(false);
              }}
            >
              Yes, clear cart
            </button>{" "}
            <button type="button" className="clear-cart" onClick={() => setConfirmClear(false)}>
              Keep items
            </button>
          </span>
        ) : (
          <button type="button" className="clear-cart" onClick={() => setConfirmClear(true)}>
            Clear cart
          </button>
        )}
      </div>

      <div className="cart-layout">
        <section aria-label="Items in your cart">
          <div className="cart-labels">
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>
          {items.map(({ product, quantity, lineTotal }) => (
            <article className="cart-item" key={product.id}>
              <div className="cart-product">
                <div className="cart-thumb">
                  <img src={product.image} alt={`${product.title} cover`} />
                  <span style={{ background: product.color }} />
                </div>
                <div>
                  <span className="tag">{product.category}</span>
                  <h3>{product.title}</h3>
                  <p>{product.author}</p>
                  <strong>{formatPrice(product.price)}</strong>
                </div>
              </div>
              <Quantity value={quantity} onChange={(next) => setQuantity(product.id, next)} />
              <div className="line-total">
                <strong>{formatPrice(lineTotal)}</strong>
                <button
                  type="button"
                  aria-label={`Remove ${product.title} from your cart`}
                  onClick={() => removeFromCart(product.id)}
                >
                  <Icon name="trash" size={17} />
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="order-summary">
          <h2>Order summary</h2>
          <div className="summary-line">
            <span>Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})</span>
            <span>{formatPrice(totals.subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <span className="sage">
              {totals.shipping === 0 ? "Complimentary" : formatPrice(totals.shipping)}
            </span>
          </div>
          <div className="total-line">
            <span>Total</span>
            <strong>{formatPrice(totals.total)}</strong>
          </div>
          <Button className="full" onClick={() => navigate(ROUTES.checkout)}>
            Proceed to checkout <Icon name="arrow" size={17} />
          </Button>
          <Button variant="ghost" className="full" onClick={() => navigate(ROUTES.products)}>
            Continue shopping
          </Button>
          <p className="secure-note">
            {remainingForFreeShipping > 0
              ? `Add ${formatPrice(remainingForFreeShipping)} more for complimentary shipping.`
              : "You’ve unlocked complimentary shipping."}
          </p>
        </aside>
      </div>
    </main>
  );
}