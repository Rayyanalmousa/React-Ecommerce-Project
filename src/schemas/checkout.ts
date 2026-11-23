import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your full name.")
    .min(3, "Full name must be at least 3 characters.")
    .regex(/^[\p{L}][\p{L} .'-]*$/u, "Use letters and spaces only."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Enter a valid email address, like jane@example.com."),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone number.")
    .regex(/^\+?[\d\s().-]+$/, "Use digits, spaces, + ( ) and - only.")
    .refine((value) => {
      const digits = value.replace(/\D/g, "").length;
      return digits >= 7 && digits <= 15;
    }, "Phone number must have 7 to 15 digits."),
  city: z
    .string()
    .trim()
    .min(1, "Please enter your city.")
    .min(2, "City name looks too short."),
  street: z
    .string()
    .trim()
    .min(1, "Please enter your street address.")
    .min(5, "Street address looks too short."),
  postalCode: z
    .string()
    .trim()
    .min(1, "Please enter your postal code.")
    .regex(/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/, "Enter a valid postal code."),
  notes: z.string().trim().max(300, "Notes must be 300 characters or less."),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
export type CheckoutField = keyof CheckoutValues;
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export const CHECKOUT_FIELDS: CheckoutField[] = [
  "fullName",
  "email",
  "phone",
  "city",
  "street",
  "postalCode",
  "notes",
];

export const EMPTY_CHECKOUT: CheckoutValues = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  street: "",
  postalCode: "",
  notes: "",
};

export type CheckoutValidation =
  | { success: true; data: CheckoutValues; errors: CheckoutErrors }
  | { success: false; data?: undefined; errors: CheckoutErrors };

export function validateCheckout(values: CheckoutValues): CheckoutValidation {
  const result = checkoutSchema.safeParse(values);
  if (result.success) return { success: true, data: result.data, errors: {} };

  const errors: CheckoutErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as CheckoutField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return { success: false, errors };
}