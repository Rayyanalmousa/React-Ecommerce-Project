import { describe, expect, it } from "vitest";
import { generateOrderReference } from "./order";
import { getTotals } from "./pricing";

describe("generateOrderReference", () => {
  it("uses the date and a four digit suffix", () => {
    const reference = generateOrderReference(new Date(2026, 4, 18), () => 0);
    expect(reference).toBe("BK-20260518-1000");
  });

  it("matches the expected format with the default random source", () => {
    expect(generateOrderReference()).toMatch(/^BK-\d{8}-\d{4}$/);
  });
});

describe("getTotals", () => {
  it("adds shipping below the free shipping threshold", () => {
    expect(getTotals(40)).toEqual({ subtotal: 40, shipping: 5, total: 45 });
  });

  it("has no shipping for an empty cart or above the threshold", () => {
    expect(getTotals(0)).toEqual({ subtotal: 0, shipping: 0, total: 0 });
    expect(getTotals(150)).toEqual({ subtotal: 150, shipping: 0, total: 150 });
  });
});