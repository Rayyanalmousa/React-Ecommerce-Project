import { describe, expect, it } from "vitest";
import { EMPTY_CHECKOUT, validateCheckout } from "../src/schemas/checkout";

const valid = {
  fullName: "Jane Austen",
  email: "jane@example.com",
  phone: "+1 (555) 123-4567",
  city: "Bath",
  street: "42 Milsom Street",
  postalCode: "BA1 1DN",
  notes: "",
};

describe("validateCheckout", () => {
  it("accepts valid delivery details", () => {
    const result = validateCheckout(valid);
    expect(result.success).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("returns one error per required field when the form is empty", () => {
    const { errors } = validateCheckout(EMPTY_CHECKOUT);
    expect(Object.keys(errors).sort()).toEqual(
      ["city", "email", "fullName", "phone", "postalCode", "street"].sort(),
    );
  });

  it("validates the email, phone and postal code formats", () => {
    const { errors } = validateCheckout({
      ...valid,
      email: "abc",
      phone: "abc",
      postalCode: "!!",
    });
    expect(errors.email).toBeTruthy();
    expect(errors.phone).toBeTruthy();
    expect(errors.postalCode).toBeTruthy();
  });

  it("trims whitespace from valid values", () => {
    const result = validateCheckout({ ...valid, city: "  Bath  " });
    expect(result.success && result.data.city).toBe("Bath");
  });
});