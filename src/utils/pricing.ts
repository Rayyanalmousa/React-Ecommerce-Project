import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "../data/store";

export type Totals = {
  subtotal: number;
  shipping: number;
  total: number;
};

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function getTotals(subtotal: number): Totals {
  const rounded = Math.round(subtotal * 100) / 100;
  const shipping = rounded === 0 || rounded >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return {
    subtotal: rounded,
    shipping,
    total: Math.round((rounded + shipping) * 100) / 100,
  };
}