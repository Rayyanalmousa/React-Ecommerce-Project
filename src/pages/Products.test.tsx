import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StoreProvider } from "../context/StoreContext";
import { Products } from "./Products";

function renderProducts(initialEntry = "/products") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <StoreProvider>
        <Products />
      </StoreProvider>
    </MemoryRouter>,
  );
}

const cards = () => screen.queryAllByRole("article");

describe("Products page filtering", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it("shows every product at first", () => {
    renderProducts();
    expect(cards()).toHaveLength(8);
  });

  it("shows only matching products when searching by name", () => {
    renderProducts();
    fireEvent.change(screen.getByPlaceholderText(/search by title/i), {
      target: { value: "garden" },
    });
    expect(cards()).toHaveLength(1);
    expect(within(cards()[0]).getByRole("heading", { name: "The Secret Garden" })).toBeVisible();
  });

  it("filters by category", () => {
    renderProducts();
    fireEvent.click(screen.getAllByLabelText(/^Classics/)[0]);
    expect(cards()).toHaveLength(2);
  });

  it("opens pre-filtered when the URL has a category", () => {
    renderProducts("/products?category=Accessories");
    expect(cards()).toHaveLength(2);
  });

  it("filters by maximum price", () => {
    renderProducts();
    fireEvent.change(screen.getAllByLabelText("Maximum price")[0], { target: { value: "15" } });
    expect(cards()).toHaveLength(1);
  });

  it("shows a message when nothing matches", () => {
    renderProducts();
    fireEvent.change(screen.getByPlaceholderText(/search by title/i), {
      target: { value: "no such book" },
    });
    expect(cards()).toHaveLength(0);
    expect(screen.getByText("No books match your filters")).toBeVisible();
  });

  it("sorts by price from low to high", () => {
    renderProducts();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "low" } });
    const prices = cards().map((card) =>
      Number(within(card).getByText(/^\$\d+\.\d{2}$/).textContent!.replace("$", "")),
    );
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});