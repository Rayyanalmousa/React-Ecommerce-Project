import { describe, it, expect } from "vitest";
import { products } from "../data/store";
import { DEFAULT_FILTERS, filterProducts } from "./filterProducts";

describe("filterProducts", () => {
  it("returns every product with the default filters", () => {
    expect(filterProducts(products, DEFAULT_FILTERS)).toHaveLength(products.length);
  });

  it("searches by title, ignoring case", () => {
    const result = filterProducts(products, { ...DEFAULT_FILTERS, query: "SECRET garden" });
    expect(result.map((product) => product.title)).toEqual(["The Secret Garden"]);
  });

  it("returns nothing when no product matches the search", () => {
    expect(filterProducts(products, { ...DEFAULT_FILTERS, query: "zzzz-no-match" })).toEqual([]);
  });

  it("filters by one or more categories", () => {
    const classics = filterProducts(products, { ...DEFAULT_FILTERS, categories: ["Classics"] });
    expect(classics.length).toBeGreaterThan(0);
    expect(classics.every((product) => product.category === "Classics")).toBe(true);

    const two = filterProducts(products, {
      ...DEFAULT_FILTERS,
      categories: ["Classics", "Fantasy"],
    });
    expect(two.every((product) => ["Classics", "Fantasy"].includes(product.category))).toBe(true);
  });

  it("filters by maximum price", () => {
    const result = filterProducts(products, { ...DEFAULT_FILTERS, maxPrice: 18 });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((product) => product.price <= 18)).toBe(true);
  });

  it("sorts by price in both directions", () => {
    const low = filterProducts(products, { ...DEFAULT_FILTERS, sort: "low" }).map((p) => p.price);
    const high = filterProducts(products, { ...DEFAULT_FILTERS, sort: "high" }).map((p) => p.price);
    expect(low).toEqual([...low].sort((a, b) => a - b));
    expect(high).toEqual([...high].sort((a, b) => b - a));
  });

  it("does not change the original products array", () => {
    const before = products.map((product) => product.id);
    filterProducts(products, { ...DEFAULT_FILTERS, sort: "high" });
    expect(products.map((product) => product.id)).toEqual(before);
  });
});