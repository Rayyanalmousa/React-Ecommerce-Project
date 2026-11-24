import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../data/store";
import { useStore } from "../context/StoreContext";
import type { PaymentMethod } from "../context/storeReducer";
import { Button, Icon } from "../components/primitives";
import { EmptyState } from "../components/StoreComponents";
import {
  CardPaymentForm,
  type CardPaymentErrors,
  type CardPaymentField,
  type CardPaymentValues,
} from "../components/CardPaymentForm";
import {
  CHECKOUT_FIELDS,
  EMPTY_CHECKOUT,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutValues,
} from "../schemas/checkout";
import { detectBrand, luhnCheck, validateExpiry } from "../utils/card";
import { formatPrice } from "../utils/pricing";

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

export function Checkout() {
  const navigate = useNavigate();
  const { items, totals, placeOrder } = useStore();
  const [values, setValues] = useState<CheckoutValues>(EMPTY_CHECKOUT);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [cardValues, setCardValues] = useState<CardPaymentValues>(EMPTY_CARD);
  const [cardErrors, setCardErrors] = useState<CardPaymentErrors>({});
  const cardInputRefs = useRef<Partial<Record<CardPaymentField, HTMLInputElement>>>({});
  const fieldRefs = useRef<Partial<Record<CheckoutField, HTMLInputElement | HTMLTextAreaElement>>>(
    {},
  );
  const registerCardInput = useCallback(
    (field: CardPaymentField, input: HTMLInputElement | null) => {
      if (input) cardInputRefs.current[field] = input;
      else delete cardInputRefs.current[field];
    },
    [],
  );
  const registerField = useCallback(
    (field: CheckoutField, input: HTMLInputElement | HTMLTextAreaElement | null) => {
      if (input) fieldRefs.current[field] = input;
      else delete fieldRefs.current[field];
    },
    [],
  );

  if (!items.length)
    return (
      <main className="container empty-page">
        <EmptyState
          kind="bag"
          title="Nothing to check out yet"
          text="Choose a book or two before heading to checkout."
          action={() => navigate(ROUTES.products)}
          label="Back to books"
        />
      </main>
    );

  const changeField = (field: CheckoutField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const blurField = (field: CheckoutField) => {
    const error = validateCheckout(values).errors[field];
    setErrors((current) => {
      const next = { ...current };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

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

  const place = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const delivery = validateCheckout(values);
    setErrors(delivery.errors);
    const cardValid = payment === "cash" || validateCardForm();

    if (!delivery.success) {
      const firstInvalid = CHECKOUT_FIELDS.find((field) => delivery.errors[field]);
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
      return;
    }
    if (!cardValid) return;

    placeOrder(delivery.data, payment);
    setCardValues(EMPTY_CARD);
    setCardErrors({});
    navigate(ROUTES.confirmation);
  };

  const hasErrors = Object.keys(errors).length > 0 || Object.keys(cardErrors).length > 0;

  return (
    <main className="container checkout-page">
      <button type="button" className="back-link" onClick={() => navigate(ROUTES.cart)}>
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
            <Field
              name="fullName"
              label="Full name"
              placeholder="Jane Austen"
              autoComplete="name"
              required
              value={values.fullName}
              error={errors.fullName}
              onValueChange={changeField}
              onFieldBlur={blurField}
              inputRef={registerField}
            />
            <Field
              name="email"
              label="Email address"
              type="email"
              placeholder="jane@example.com"
              autoComplete="email"
              required
              value={values.email}
              error={errors.email}
              onValueChange={changeField}
              onFieldBlur={blurField}
              inputRef={registerField}
            />
            <Field
              name="phone"
              label="Phone number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              required
              value={values.phone}
              error={errors.phone}
              onValueChange={changeField}
              onFieldBlur={blurField}
              inputRef={registerField}
            />
            <Field
              name="city"
              label="City"
              placeholder="Bath"
              autoComplete="address-level2"
              required
              value={values.city}
              error={errors.city}
              onValueChange={changeField}
              onFieldBlur={blurField}
              inputRef={registerField}
            />
            <div className="span-2">
              <Field
                name="street"
                label="Street address"
                placeholder="42 Milsom Street"
                autoComplete="street-address"
                required
                value={values.street}
                error={errors.street}
                onValueChange={changeField}
                onFieldBlur={blurField}
                inputRef={registerField}
              />
            </div>
            <Field
              name="postalCode"
              label="Postal code"
              placeholder="BA1 1DN"
              autoComplete="postal-code"
              required
              value={values.postalCode}
              error={errors.postalCode}
              onValueChange={changeField}
              onFieldBlur={blurField}
              inputRef={registerField}
            />
            <label className={`field span-2${errors.notes ? " invalid" : ""}`}>
              <span>
                Delivery notes <small>Optional</small>
              </span>
              <textarea
                ref={(element) => registerField("notes", element)}
                placeholder="Anything our courier should know?"
                rows={3}
                value={values.notes}
                aria-invalid={Boolean(errors.notes)}
                aria-describedby={errors.notes ? "notes-error" : undefined}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  changeField("notes", event.target.value)
                }
                onBlur={() => blurField("notes")}
              />
              {errors.notes && (
                <small className="error-msg" id="notes-error">
                  {errors.notes}
                </small>
              )}
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
            {items.map(({ product, quantity, lineTotal }) => (
              <div key={product.id}>
                <div className="mini-cover">
                  <img src={product.image} alt="" />
                  <span style={{ background: product.color }} />
                </div>
                <span>
                  <b>{product.title}</b>
                  <small>Qty {quantity}</small>
                </span>
                <strong>{formatPrice(lineTotal)}</strong>
              </div>
            ))}
          </div>
          <div className="summary-line">
            <span>Subtotal</span>
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
          <Button type="submit" className="full">
            Place order <Icon name="arrow" />
          </Button>
          {submitted && hasErrors && (
            <p className="form-error" role="alert">
              Please fix the highlighted fields.
            </p>
          )}
          <p className="secure-note">By placing your order, you agree to our terms.</p>
        </aside>
      </form>
    </main>
  );
}

type FieldProps = {
  name: CheckoutField;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  value: string;
  error?: string;
  onValueChange: (field: CheckoutField, value: string) => void;
  onFieldBlur: (field: CheckoutField) => void;
  inputRef: (field: CheckoutField, input: HTMLInputElement | null) => void;
};

export function Field({
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  required,
  value,
  error,
  onValueChange,
  onFieldBlur,
  inputRef,
}: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <label className={`field${error ? " invalid" : ""}`}>
      <span>
        {label}
        {required && <b aria-hidden="true">*</b>}
      </span>
      <input
        ref={(element) => inputRef(name, element)}
        id={`checkout-${name}`}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onValueChange(name, event.target.value)}
        onBlur={() => onFieldBlur(name)}
      />
      {error && (
        <small className="error-msg" id={errorId}>
          {error}
        </small>
      )}
    </label>
  );
}