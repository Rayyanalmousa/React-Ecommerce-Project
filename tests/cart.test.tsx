import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StoreProvider, useStore } from "../src/context/StoreContext";
import { initialState, loadState, STORAGE_KEY, storeReducer } from "../src/context/storeReducer";
import { Products } from "../src/pages/Products";
import { Cart } from "../src/pages/Cart";

describe("storeReducer (cart)", () => {
  it("adds a product to the cart", () => {
    const state = storeReducer(initialState, { type: "ADD_TO_CART", id: 1 });
    expect(state.cart).toEqual([{ id: 1, quantity: 1 }]);
  });

  it("increases the quantity when the same product is added again", () => {
    let state = storeReducer(initialState, { type: "ADD_TO_CART", id: 1 });
    state = storeReducer(state, { type: "ADD_TO_CART", id: 1 });
    expect(state.cart).toEqual([{ id: 1, quantity: 2 }]);
  });

  it("ignores unknown products", () => {
    expect(storeReducer(initialState, { type: "ADD_TO_CART", id: 9999 })).toBe(initialState);
  });

});

describe("storeReducer (wishlist)", () => {
  it("never creates duplicate wishlist entries", () => {
    let state = storeReducer(initialState, { type: "TOGGLE_WISHLIST", id: 3 });
    expect(state.wishlist).toEqual([3]);
    state = storeReducer(state, { type: "TOGGLE_WISHLIST", id: 3 });
    expect(state.wishlist).toEqual([]);
  });
});

function Badge() {
  const { cartCount, wishlistCount } = useStore();
  return (
    <p>
      <span data-testid="cart-count">{cartCount}</span>
      <span data-testid="wish-count">{wishlistCount}</span>
    </p>
  );
}

function renderShop() {
  return render(
    <MemoryRouter initialEntries={["/products"]}>
      <StoreProvider>
        <Badge />
        <Products />
        <Cart />
      </StoreProvider>
    </MemoryRouter>,
  );
}

describe("shopping cart", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it("updates the cart immediately when a product is added", () => {
    renderShop();
    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
    expect(screen.getByText("Your cart is empty")).toBeVisible();

    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);

    expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
    expect(screen.getByText("Shopping cart")).toBeVisible();
    expect(screen.getByText("Subtotal (1 item)")).toBeVisible();
  });

  it("lets visitors change quantity, remove items and clear the cart", () => {
    renderShop();
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByTestId("cart-count")).toHaveTextContent("2");

    fireEvent.click(screen.getByRole("button", { name: "−" }));
    expect(screen.getByTestId("cart-count")).toHaveTextContent("1");

    fireEvent.click(screen.getByRole("button", { name: /Remove .* from your cart/ }));
    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
  });

  it("keeps the cart and wishlist after a page refresh", () => {
    const first = renderShop();
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[1]);
    fireEvent.click(screen.getAllByRole("button", { name: "Add to wishlist" })[0]);
    first.unmount();

    expect(loadState().cart).toHaveLength(1);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeTruthy();

    renderShop();
    expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
    expect(screen.getByTestId("wish-count")).toHaveTextContent("1");
  });
});