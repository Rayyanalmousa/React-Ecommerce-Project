export type CardBrand = "Visa" | "Mastercard" | "Amex";

export function detectBrand(value: string): CardBrand | null {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("4")) return "Visa";
  if (digits.startsWith("34") || digits.startsWith("37")) return "Amex";

  const firstTwo = Number(digits.slice(0, 2));
  const firstFour = Number(digits.slice(0, 4));
  if ((firstTwo >= 51 && firstTwo <= 55) || (firstFour >= 2221 && firstFour <= 2720)) {
    return "Mastercard";
  }

  return null;
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  const brand = detectBrand(digits);
  const limitedDigits = digits.slice(0, brand === "Amex" ? 15 : 16);

  if (brand === "Amex") {
    return [limitedDigits.slice(0, 4), limitedDigits.slice(4, 10), limitedDigits.slice(10, 15)]
      .filter(Boolean)
      .join(" ");
  }

  return limitedDigits.match(/.{1,4}/g)?.join(" ") ?? "";
}

export function luhnCheck(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return false;

  let sum = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }

  return sum % 10 === 0;
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 || value.includes("/")
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;
}

export function validateExpiry(value: string, now = new Date()): boolean {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}
