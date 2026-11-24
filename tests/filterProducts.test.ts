import { describe, it, expect } from "vitest";
import { products } from "../src/data/store";
import { DEFAULT_FILTERS, filterProducts } from "../src/utils/filterProducts";

describe("filterProducts", () => {
  it("searches by title, ignoring case", () => {
    const result = filterProducts(products, { ...DEFAULT_FILTERS, query: "SECRET garden" });
    expect(result.map((product) => product.title)).toEqual(["The Secret Garden"]);
  });

  it("filters by one or more categories", () => {
    const classics = filterProducts(products, { ...DEFAULT_FILTERS, categories: ["Classics"] });
    expect(classics.length).toBeGreaterThan(0);
    expect(classics.every((product) => product.category === "Classics")).toBe(true);
  });

  it("sorts by price in both directions", () => {
    const low = filterProducts(products, { ...DEFAULT_FILTERS, sort: "low" }).map((p) => p.price);
    const high = filterProducts(products, { ...DEFAULT_FILTERS, sort: "high" }).map((p) => p.price);
    expect(low).toEqual([...low].sort((a, b) => a - b));
    expect(high).toEqual([...high].sort((a, b) => b - a));
  });
});