import type { Page, Product } from "../data/store";
import { Button, Icon } from "../components/primitives";
import { EmptyState, Quantity } from "../components/StoreComponents";

export function Cart({
  cart,
  quantities,
  setQty,
  remove,
  clear,
  go,
}: {
  cart: Product[];
  quantities: Record<number, number>;
  setQty: (id: number, n: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  go: (p: Page) => void;
}) {
  const subtotal = cart.reduce((s, p) => s + p.price * (quantities[p.id] || 1), 0);
  if (!cart.length)
    return (
      <main className="container empty-page">
        <EmptyState
          kind="bag"
          title="Your cart is waiting"
          text="It’s a little quiet in here. Find a story you’ll love and bring it home."
          action={() => go("products")}
          label="Continue shopping"
        />
      </main>
    );
  return (
    <main className="container cart-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Your selection</p>
          <h1>Shopping cart</h1>
        </div>
        <button className="clear-cart" onClick={clear}>
          Clear cart
        </button>
      </div>
      <div className="cart-layout">
        <section className="cart-list">
          <div className="cart-labels">
            <span>Item</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>
          {cart.map((p) => (
            <article className="cart-item" key={p.id}>
              <div className="cart-product">
                <div className="cart-thumb">
                  <img src={p.image} alt="" />
                  <span style={{ background: p.color }} />
                </div>
                <div>
                  <span className="tag">{p.category}</span>
                  <h3>{p.title}</h3>
                  <p>{p.author}</p>
                  <strong>${p.price.toFixed(2)}</strong>
                </div>
              </div>
              <Quantity value={quantities[p.id] || 1} onChange={(n) => setQty(p.id, n)} />
              <div className="line-total">
                <strong>${(p.price * (quantities[p.id] || 1)).toFixed(2)}</strong>
                <button aria-label={`Remove ${p.title}`} onClick={() => remove(p.id)}>
                  <Icon name="trash" size={18} />
                </button>
              </div>
            </article>
          ))}
        </section>
        <OrderSummary subtotal={subtotal} go={go} />
      </div>
    </main>
  );
}
export function OrderSummary({ subtotal, go }: { subtotal: number; go: (p: Page) => void }) {
  return (
    <aside className="order-summary">
      <p className="eyebrow">Your order</p>
      <h2>Order summary</h2>
      <div className="summary-line">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="summary-line">
        <span>Shipping</span>
        <span className="sage">Complimentary</span>
      </div>
      <div className="total-line">
        <span>Total</span>
        <strong>
          ${subtotal.toFixed(2)} <small>USD</small>
        </strong>
      </div>
      <Button className="full" onClick={() => go("checkout")}>
        Proceed to checkout <Icon name="arrow" />
      </Button>
      <Button className="full" variant="secondary" onClick={() => go("products")}>
        Continue shopping
      </Button>
      <p className="secure-note">Secure checkout · Beautifully wrapped</p>
    </aside>
  );
}
