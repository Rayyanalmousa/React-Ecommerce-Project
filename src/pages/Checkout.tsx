import { useState } from "react";
import type { FormEvent } from "react";
import { FREE_SHIPPING_THRESHOLD, type Page, type Product } from "../data/store";
import { Button, Icon } from "../components/primitives";
import { EmptyState } from "../components/StoreComponents";

export function Checkout({
  cart,
  quantities,
  go,
}: {
  cart: Product[];
  quantities: Record<number, number>;
  go: (p: Page) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [payment, setPayment] = useState("cod");
  const subtotal = cart.reduce((s, p) => s + p.price * (quantities[p.id] || 1), 0);
  if (!cart.length)
    return (
      <main className="container empty-page">
        <EmptyState
          kind="bag"
          title="Nothing to check out yet"
          text="Choose a book or two before heading to checkout."
          action={() => go("products")}
          label="Back to books"
        />
      </main>
    );
  const place = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const form = e.currentTarget;
    if (form.checkValidity()) go("confirmation");
  };
  return (
    <main className="container checkout-page">
      <button className="back-link" onClick={() => go("cart")}>
        ← Back to cart
      </button>
      <div className="page-intro compact">
        <p className="eyebrow">Nearly yours</p>
        <h1>Checkout</h1>
      </div>
      <form className="checkout-layout" onSubmit={place} noValidate>
        <section className="checkout-form">
          <div className="form-section-head">
            <span>01</span>
            <div>
              <h2>Delivery details</h2>
              <p>Where shall we send your new stories?</p>
            </div>
          </div>
          <div className="form-grid">
            <Field label="Full name" placeholder="Jane Austen" required submitted={submitted} />
            <Field
              label="Email address"
              type="email"
              placeholder="jane@example.com"
              required
              submitted={submitted}
            />
            <Field
              label="Phone number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              required
              submitted={submitted}
            />
            <Field label="City" placeholder="Bath" required submitted={submitted} />
            <div className="span-2">
              <Field
                label="Street address"
                placeholder="42 Milsom Street"
                required
                submitted={submitted}
              />
            </div>
            <Field label="Postal code" placeholder="BA1 1DN" required submitted={submitted} />
            <label className="field span-2">
              <span>
                Delivery notes <small>Optional</small>
              </span>
              <textarea placeholder="Anything our courier should know?" rows={3} />
            </label>
          </div>
          <div className="form-section-head payment-head">
            <span>02</span>
            <div>
              <h2>Payment method</h2>
              <p>Choose how you’d like to pay.</p>
            </div>
          </div>
          <div className="payment-options">
            <label className={payment === "cod" ? "selected" : ""}>
              <input
                type="radio"
                name="payment"
                checked={payment === "cod"}
                onChange={() => setPayment("cod")}
              />
              <span>
                <b>Cash on delivery</b>
                <small>Pay when your parcel arrives</small>
              </span>
              <i>Cash</i>
            </label>
            <label className={payment === "card" ? "selected" : ""}>
              <input
                type="radio"
                name="payment"
                checked={payment === "card"}
                onChange={() => setPayment("card")}
              />
              <span>
                <b>Card payment</b>
                <small>Display only for this prototype</small>
              </span>
              <i>Card</i>
            </label>
          </div>
        </section>
        <aside className="checkout-summary">
          <p className="eyebrow">In your parcel</p>
          <h2>Order summary</h2>
          <div className="checkout-items">
            {cart.map((p) => (
              <div key={p.id}>
                <div className="mini-cover">
                  <img src={p.image} alt="" />
                  <span style={{ background: p.color }} />
                </div>
                <span>
                  <b>{p.title}</b>
                  <small>Qty {quantities[p.id] || 1}</small>
                </span>
                <strong>${(p.price * (quantities[p.id] || 1)).toFixed(2)}</strong>
              </div>
            ))}
          </div>
          <div className="summary-line">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <span className="sage">
              {subtotal >= FREE_SHIPPING_THRESHOLD ? "Complimentary" : "Calculated at checkout"}
            </span>
          </div>
          <div className="total-line">
            <span>Total</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <Button type="submit" className="full">
            Place order <Icon name="arrow" />
          </Button>
          {submitted && <p className="form-error">Please complete the highlighted fields.</p>}
          <p className="secure-note">By placing your order, you agree to our terms.</p>
        </aside>
      </form>
    </main>
  );
}
export function Field({
  label,
  placeholder,
  type = "text",
  required,
  submitted,
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  submitted?: boolean;
}) {
  const [value, setValue] = useState("");
  const invalid = submitted && required && !value;
  return (
    <label className={`field ${invalid ? "invalid" : ""}`}>
      <span>
        {label}
        {required && <b>*</b>}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
      />
      {invalid && <small className="error-msg">Please enter your {label.toLowerCase()}.</small>}
    </label>
  );
}
