import { describe, it, expect } from "vitest";
import { luhnCheck, formatExpiry, validateExpiry } from "../src/utils/card";

describe("card utils", () => {
  it("validates card numbers with the Luhn check", () => {
    expect(luhnCheck("4242424242424242")).toBe(true);
    expect(luhnCheck("4242424242424241")).toBe(false);
    expect(luhnCheck("")).toBe(false);
  });

  it("formats and validates the expiry date", () => {
    expect(formatExpiry("1228")).toBe("12/28");
    const now = new Date(2026, 10, 20);
    expect(validateExpiry("12/27", now)).toBe(true);
    expect(validateExpiry("10/26", now)).toBe(false);
    expect(validateExpiry("13/27", now)).toBe(false);
  });
});