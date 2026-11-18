import type { Page, Product } from "../data/store";
import { Button, Icon } from "../components/primitives";

export function Confirmation({
  cart,
  quantities,
  go,
}: {
  cart: Product[];
  quantities: Record<number, number>;
  go: (p: Page) => void;
}) {
  const total = cart.reduce((s, p) => s + p.price * (quantities[p.id] || 1), 0);
  return (
    <main className="confirmation">
      <div className="confirmation-card">
        <div className="success-icon">
          <Icon name="check" size={34} />
        </div>
        <p className="eyebrow">Order confirmed</p>
        <h1>
          Thank you for
          <br />
          your order.
        </h1>
        <p>Your parcel is being prepared with care. We’ve sent all the details to your inbox.</p>
        <div className="order-ref">
          <span>Order reference</span>
          <strong>BK-20260518-4821</strong>
        </div>
        <div className="confirmation-list">
          {cart.map((p) => (
            <div key={p.id}>
              <span>
                {p.title} <small>× {quantities[p.id] || 1}</small>
              </span>
              <strong>${(p.price * (quantities[p.id] || 1)).toFixed(2)}</strong>
            </div>
          ))}
          <div className="confirmation-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>
        <Button onClick={() => go("products")}>Continue shopping</Button>
        <small className="confirmation-help">Questions? Write to hello@bookish.co</small>
      </div>
    </main>
  );
}
