import { detectBrand, formatCardNumber, formatExpiry } from "../utils/card";

export type CardPaymentField = "name" | "number" | "expiry" | "cvv";

export type CardPaymentValues = {
  name: string;
  number: string;
  expiry: string;
  cvv: string;
};

export type CardPaymentErrors = Partial<Record<CardPaymentField, string>>;

export function CardPaymentForm({
  value,
  onChange,
  errors,
  onBlur,
  onInputRef,
}: {
  value: CardPaymentValues;
  onChange: (field: CardPaymentField, value: string) => void;
  errors: CardPaymentErrors;
  onBlur: (field: CardPaymentField) => void;
  onInputRef: (field: CardPaymentField, input: HTMLInputElement | null) => void;
}) {
  const brand = detectBrand(value.number);

  return (
    <div className="card-payment-form">
      <label
        className={`field card-payment-field card-payment-field-full${errors.name ? " invalid" : ""}`}
      >
        <span>
          Name on card <b aria-hidden="true">*</b>
        </span>
        <input
          ref={(input) => onInputRef("name", input)}
          id="card-name"
          type="text"
          autoComplete="cc-name"
          placeholder="Jane Austen"
          value={value.name}
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "card-name-error" : undefined}
          onChange={(event) => onChange("name", event.target.value.replace(/[^\p{L} ]/gu, ""))}
          onBlur={() => onBlur("name")}
        />
        {errors.name && (
          <small className="error-msg" id="card-name-error">
            {errors.name}
          </small>
        )}
      </label>

      <label
        className={`field card-payment-field card-payment-field-full${errors.number ? " invalid" : ""}`}
      >
        <span>
          <span>
            Card number <b aria-hidden="true">*</b>
          </span>
          <small className="card-payment-brand" aria-live="polite">
            {brand ?? "Card"}
          </small>
        </span>
        <input
          ref={(input) => onInputRef("number", input)}
          id="card-number"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          value={value.number}
          aria-required="true"
          aria-invalid={Boolean(errors.number)}
          aria-describedby={errors.number ? "card-number-error" : undefined}
          onChange={(event) => onChange("number", formatCardNumber(event.target.value))}
          onBlur={() => onBlur("number")}
        />
        {errors.number && (
          <small className="error-msg" id="card-number-error">
            {errors.number}
          </small>
        )}
      </label>

      <label className={`field card-payment-field${errors.expiry ? " invalid" : ""}`}>
        <span>
          Expiry (MM/YY) <b aria-hidden="true">*</b>
        </span>
        <input
          ref={(input) => onInputRef("expiry", input)}
          id="card-expiry"
          type="text"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/YY"
          maxLength={5}
          value={value.expiry}
          aria-required="true"
          aria-invalid={Boolean(errors.expiry)}
          aria-describedby={errors.expiry ? "card-expiry-error" : undefined}
          onChange={(event) => onChange("expiry", formatExpiry(event.target.value))}
          onBlur={() => onBlur("expiry")}
        />
        {errors.expiry && (
          <small className="error-msg" id="card-expiry-error">
            {errors.expiry}
          </small>
        )}
      </label>

      <label className={`field card-payment-field${errors.cvv ? " invalid" : ""}`}>
        <span>
          CVV <b aria-hidden="true">*</b>
        </span>
        <input
          ref={(input) => onInputRef("cvv", input)}
          id="card-cvv"
          type="password"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder={brand === "Amex" ? "4 digits" : "3 digits"}
          maxLength={brand === "Amex" ? 4 : 3}
          value={value.cvv}
          aria-required="true"
          aria-invalid={Boolean(errors.cvv)}
          aria-describedby={errors.cvv ? "card-cvv-error" : undefined}
          onChange={(event) =>
            onChange(
              "cvv",
              event.target.value.replace(/\D/g, "").slice(0, brand === "Amex" ? 4 : 3),
            )
          }
          onBlur={() => onBlur("cvv")}
        />
        {errors.cvv && (
          <small className="error-msg" id="card-cvv-error">
            {errors.cvv}
          </small>
        )}
      </label>
    </div>
  );
}
