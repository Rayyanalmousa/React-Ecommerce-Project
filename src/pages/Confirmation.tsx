import { Navigate, useNavigate } from "react-router-dom";
import { ROUTES } from "../data/store";
import { useStore } from "../context/StoreContext";
import { Button, Icon } from "../components/primitives";
import { formatPrice } from "../utils/pricing";

export function Confirmation() {
  const navigate = useNavigate();
  const { lastOrder } = useStore();

  // Nothing to confirm (for example someone opened /confirmation directly).
  if (!lastOrder) return <Navigate to={ROUTES.home} replace />;

  const { reference, customer, items, subtotal, shipping, total, paymentMethod } = lastOrder;

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
          your order, {customer.fullName.split(" ")[0]}.
        </h1>
        <p>
          Your parcel is being prepared with care and will be delivered to {customer.street},{" "}
          {customer.city} {customer.postalCode}.
        </p>
        <div className="order-ref">
          <span>Order reference</span>
          <strong>{reference}</strong>
        </div>
        <div className="confirmation-list">
          {items.map((item) => (
            <div key={item.id}>
              <span>
                {item.title} <small>× {item.quantity}</small>
              </span>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </div>
          ))}
          <div>
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div>
            <span>Shipping</span>
            <strong>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</strong>
          </div>
          <div>
            <span>Payment</span>
            <strong>{paymentMethod === "cash" ? "Cash on delivery" : "Card"}</strong>
          </div>
          <div className="confirmation-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>
        <Button onClick={() => navigate(ROUTES.products)}>Continue shopping</Button>
        <small className="confirmation-help">
          Confirmation details for {customer.email}. Questions? Write to hello@bookish.co
        </small>
      </div>
    </main>
  );
}