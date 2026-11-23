import { describe, it, expect } from "vitest";
import {
  detectBrand,
  formatCardNumber,
  luhnCheck,
  formatExpiry,
  validateExpiry,
} from "./card";

describe("card utils", () => {
  it("detects the card brand", () => {
    expect(detectBrand("4242 4242 4242 4242")).toBe("Visa");
    expect(detectBrand("5555555555554444")).toBe("Mastercard");
    expect(detectBrand("378282246310005")).toBe("Amex");
    expect(detectBrand("9999")).toBeNull();
  });

  it("formats card numbers", () => {
    expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242");
    expect(formatCardNumber("378282246310005")).toBe("3782 822463 10005");
  });

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