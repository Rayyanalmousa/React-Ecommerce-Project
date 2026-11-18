import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { FREE_SHIPPING_THRESHOLD, type Page, type Product } from "../data/store";
import { Icon } from "../components/primitives";

const formatPrice = (amount: number) => `$${amount.toFixed(2)}`;

export function Cart({
  open,
  cart,
  quantities,
  setQty,
  remove,
  clear,
  onClose,
  go,
}: {
  open: boolean;
  cart: Product[];
  quantities: Record<number, number>;
  setQty: (id: number, quantity: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  onClose: () => void;
  go: (page: Page) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const itemCount = cart.reduce((count, product) => count + (quantities[product.id] || 1), 0);
  const subtotal = cart.reduce(
    (sum, product) => sum + product.price * (quantities[product.id] || 1),
    0,
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingUnlocked = remainingForFreeShipping === 0;
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (!open) {
      setConfirmClear(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open, onClose]);

  const containFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;

    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) {
      event.preventDefault();
      closeRef.current?.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <div
        className={`cart-drawer-overlay${open ? " open" : ""}`}
        aria-hidden="true"
        inert={!open}
        onClick={onClose}
      />
      <aside
        ref={drawerRef}
        className={`cart-drawer${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        aria-hidden={!open}
        inert={!open}
        onKeyDown={containFocus}
      >
        <div className="cart-drawer-header">
          <h2>
            Your bag <span aria-live="polite">({itemCount})</span>
          </h2>
          <div className="cart-drawer-header-actions">
            {cart.length > 0 &&
              (confirmClear ? (
                <div className="cart-clear-confirm">
                  <span>Clear all items?</span>
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setConfirmClear(false);
                    }}
                  >
                    Confirm
                  </button>
                  <button type="button" onClick={() => setConfirmClear(false)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="cart-clear-button"
                  onClick={() => setConfirmClear(true)}
                >
                  Clear all
                </button>
              ))}
            <button
              ref={closeRef}
              type="button"
              className="cart-close-button"
              onClick={onClose}
              aria-label="Close cart"
            >
              <Icon name="x" size={18} />
            </button>
          </div>
        </div>

        {cart.length > 0 && (
          <div className="cart-shipping-progress">
            <p>
              {shippingUnlocked
                ? "You qualify for complimentary shipping."
                : `Add ${formatPrice(remainingForFreeShipping)} more for complimentary shipping.`}
            </p>
            <div
              className="cart-shipping-track"
              role="progressbar"
              aria-label="Progress toward complimentary shipping"
              aria-valuemin={0}
              aria-valuemax={FREE_SHIPPING_THRESHOLD}
              aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}
            >
              <span style={{ width: `${shippingProgress}%` }} />
            </div>
          </div>
        )}

        <div className="cart-drawer-items">
          {cart.length === 0 ? (
            <div className="cart-drawer-empty">
              <p>Your bag is empty.</p>
              <button type="button" onClick={onClose}>
                Continue shopping
              </button>
            </div>
          ) : (
            cart.map((product) => {
              const quantity = quantities[product.id] || 1;
              return (
                <article className="cart-drawer-item" key={product.id}>
                  <div className="cart-drawer-image" style={{ backgroundColor: product.color }}>
                    <img src={product.image} alt={product.title} loading="lazy" />
                  </div>
                  <div className="cart-drawer-item-details">
                    <div className="cart-drawer-item-heading">
                      <div>
                        <span className="tag">{product.category}</span>
                        <h3>{product.title}</h3>
                        <p>{product.author}</p>
                      </div>
                      <button
                        type="button"
                        className="cart-remove-button"
                        aria-label={`Remove ${product.title}`}
                        onClick={() => remove(product.id)}
                      >
                        <Icon name="trash" size={17} />
                      </button>
                    </div>
                    <div className="cart-drawer-item-footer">
                      <div className="cart-drawer-quantity" aria-label="Quantity">
                        <button
                          type="button"
                          aria-label={`Decrease ${product.title} quantity`}
                          disabled={quantity <= 1}
                          onClick={() => setQty(product.id, quantity - 1)}
                        >
                          <Icon name="minus" size={12} />
                        </button>
                        <span aria-live="polite">{quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${product.title} quantity`}
                          onClick={() => setQty(product.id, quantity + 1)}
                        >
                          <Icon name="plus" size={12} />
                        </button>
                      </div>
                      <div className="cart-drawer-price">
                        <strong>{formatPrice(product.price * quantity)}</strong>
                        {quantity > 1 && <small>{formatPrice(product.price)} each</small>}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-total-row">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="cart-drawer-total-row secondary">
              <span>Shipping</span>
              <span>{shippingUnlocked ? "Complimentary" : "Calculated at checkout"}</span>
            </div>
            <div className="cart-drawer-total-row grand-total">
              <span>Total</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <button type="button" className="cart-checkout-button" onClick={() => go("checkout")}>
              Checkout <Icon name="arrow" size={17} />
            </button>
            <button type="button" className="cart-continue-button" onClick={onClose}>
              Continue shopping
            </button>
            <p className="cart-secure-note">Secure checkout · Beautifully wrapped</p>
          </div>
        )}
      </aside>
    </>
  );
}
