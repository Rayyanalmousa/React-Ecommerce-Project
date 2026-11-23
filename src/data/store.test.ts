import { describe, it, expect } from "vitest";
import { products, categories, categoryNames, FREE_SHIPPING_THRESHOLD } from "./store";

describe("store data", () => {
  it("has products with a title and an image", () => {
    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      expect(product.title).toBeTruthy();
      expect(product.image).toBeTruthy();
    }
  });

  it("has categories with a name, a subtitle and an image", () => {
    expect(categories.length).toBeGreaterThan(0);
    for (const [name, sub, image] of categories) {
      expect(name).toBeTruthy();
      expect(sub).toBeTruthy();
      expect(image).toBeTruthy();
    }
  });

  it("only lists categories that have at least one product", () => {
    for (const name of categoryNames) {
      expect(products.some((product) => product.category === name)).toBe(true);
    }
  });

  it("has a positive free shipping threshold", () => {
    expect(FREE_SHIPPING_THRESHOLD).toBe(150);
  });
});