import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StoreProvider, useStore } from "../context/StoreContext";
import { initialState } from "../context/storeReducer";
import { Checkout } from "./Checkout";
import { Confirmation } from "./Confirmation";

function CartCount() {
  const { cartCount, wishlistCount } = useStore();
  return <p data-testid="counts">{`${cartCount}/${wishlistCount}`}</p>;
}

function renderCheckout(cart = [{ id: 1, quantity: 2 }]) {
  return render(
    <MemoryRouter initialEntries={["/checkout"]}>
      <StoreProvider initialState={{ ...initialState, cart, wishlist: [3] }}>
        <CartCount />
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/" element={<p>Home page</p>} />
        </Routes>
      </StoreProvider>
    </MemoryRouter>,
  );
}

const type = (label: RegExp, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

function fillValidForm() {
  type(/^Full name/, "Jane Austen");
  type(/^Email address/, "jane@example.com");
  type(/^Phone number/, "+1 555 123 4567");
  type(/^City/, "Bath");
  type(/^Street address/, "42 Milsom Street");
  type(/^Postal code/, "BA1 1DN");
}

describe("Checkout validation", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it("shows an error next to every empty required field and does not submit", () => {
    renderCheckout();
    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(screen.getByText("Please enter your full name.")).toBeVisible();
    expect(screen.getByText("Please enter your email address.")).toBeVisible();
    expect(screen.getByText("Please enter your phone number.")).toBeVisible();
    expect(screen.getByText("Please enter your city.")).toBeVisible();
    expect(screen.getByText("Please enter your street address.")).toBeVisible();
    expect(screen.getByText("Please enter your postal code.")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Checkout" })).toBeVisible();
    expect(screen.getByTestId("counts")).toHaveTextContent("2/1");
  });

  it("rejects badly formatted values", () => {
    renderCheckout();
    fillValidForm();
    type(/^Email address/, "not-an-email");
    type(/^Phone number/, "12");
    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(screen.getByText("Enter a valid email address, like jane@example.com.")).toBeVisible();
    expect(screen.getByText("Phone number must have 7 to 15 digits.")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Checkout" })).toBeVisible();
  });

  it("does not allow checkout with an empty cart", () => {
    renderCheckout([]);
    expect(screen.getByText("Nothing to check out yet")).toBeVisible();
    expect(screen.queryByRole("button", { name: /place order/i })).toBeNull();
  });

  it("completes the order, clears the cart and keeps the wishlist", () => {
    renderCheckout();
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(screen.getByText("Order confirmed")).toBeVisible();
    expect(screen.getByText(/^BK-\d{8}-\d{4}$/)).toBeVisible();
    expect(screen.getByText(/your order, Jane/)).toBeVisible();
    expect(screen.getByTestId("counts")).toHaveTextContent("0/1");
  });
});