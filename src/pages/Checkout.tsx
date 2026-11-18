import { useCallback, useRef, useState } from "react";
import type { FormEvent } from "react";
import { FREE_SHIPPING_THRESHOLD, type Page, type Product } from "../data/store";
import { Button, Icon } from "../components/primitives";
import { EmptyState } from "../components/StoreComponents";
import {
  CardPaymentForm,
  type CardPaymentErrors,
  type CardPaymentField,
  type CardPaymentValues,
} from "../components/CardPaymentForm";
import { detectBrand, luhnCheck, validateExpiry } from "../utils/card";

const EMPTY_CARD: CardPaymentValues = {
  name: "",
  number: "",
  expiry: "",
  cvv: "",
};

const CARD_FIELDS: CardPaymentField[] = ["name", "number", "expiry", "cvv"];

function validateCardField(field: CardPaymentField, values: CardPaymentValues): string | undefined {
  if (field === "name") {
    const name = values.name.trim();
    if (!name) return "Enter the name on your card.";
    if (name.length < 3) return "Name must be at least 3 characters.";
    if (!/^[\p{L} ]+$/u.test(name)) return "Use letters and spaces only.";
    return undefined;
  }

  if (field === "number") {
    const digits = values.number.replace(/\D/g, "");
    const brand = detectBrand(digits);
    if (!brand) return "Enter a Visa, Mastercard, or Amex card number.";
    const expectedLength = brand === "Amex" ? 15 : 16;
    if (digits.length !== expectedLength) return "Enter the complete card number.";
    if (!luhnCheck(digits)) return "Enter a valid card number.";
    return undefined;
  }

  if (field === "expiry") {
    if (!values.expiry) return "Enter your card’s expiry date.";
    if (!validateExpiry(values.expiry)) return "Enter a valid future date.";
    return undefined;
  }

  const expectedLength = detectBrand(values.number) === "Amex" ? 4 : 3;
  if (!values.cvv) return "Enter the card security code.";
  if (!new RegExp(`^\\d{${expectedLength}}$`).test(values.cvv)) {
    return `Security code must be ${expectedLength} digits.`;
  }
  return undefined;
}

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
  const [payment, setPayment] = useState<"cash" | "card">("cash");
  const [cardValues, setCardValues] = useState<CardPaymentValues>(EMPTY_CARD);
  const [cardErrors, setCardErrors] = useState<CardPaymentErrors>({});
  const cardInputRefs = useRef<Partial<Record<CardPaymentField, HTMLInputElement>>>({});
  const registerCardInput = useCallback(
    (field: CardPaymentField, input: HTMLInputElement | null) => {
      if (input) cardInputRefs.current[field] = input;
      else delete cardInputRefs.current[field];
    },
    [],
  );
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
  const changeCardField = (field: CardPaymentField, value: string) => {
    setCardValues((current) => {
      const next = { ...current, [field]: value };
      if (field === "number") {
        const cvvLength = detectBrand(value) === "Amex" ? 4 : 3;
        next.cvv = next.cvv.slice(0, cvvLength);
      }
      return next;
    });
    setCardErrors((current) => {
      const next = { ...current };
      delete next[field];
      if (field === "number") delete next.cvv;
      return next;
    });
  };
  const validateCardForm = () => {
    const nextErrors: CardPaymentErrors = {};
    for (const field of CARD_FIELDS) {
      const error = validateCardField(field, cardValues);
      if (error) nextErrors[field] = error;
    }
    setCardErrors(nextErrors);

    const firstInvalid = CARD_FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) cardInputRefs.current[firstInvalid]?.focus();
    return firstInvalid === undefined;
  };
  const blurCardField = (field: CardPaymentField) => {
    const error = validateCardField(field, cardValues);
    setCardErrors((current) => {
      const next = { ...current };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };
  const place = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const form = e.currentTarget;
    const cardValid = payment === "cash" || validateCardForm();
    if (form.checkValidity() && cardValid) {
      setCardValues(EMPTY_CARD);
      setCardErrors({});
      go("confirmation");
    }
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
            <label className={payment === "cash" ? "selected" : ""}>
              <input
                type="radio"
                name="payment"
                checked={payment === "cash"}
                onChange={() => setPayment("cash")}
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
          <div
            className={`card-payment-reveal${payment === "card" ? " is-visible" : ""}`}
            aria-hidden={payment !== "card"}
            inert={payment !== "card"}
          >
            <CardPaymentForm
              value={cardValues}
              onChange={changeCardField}
              errors={cardErrors}
              onBlur={blurCardField}
              onInputRef={registerCardInput}
            />
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
