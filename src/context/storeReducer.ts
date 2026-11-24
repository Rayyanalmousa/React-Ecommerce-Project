import { MAX_QUANTITY, products } from "../data/store";
import type { CheckoutValues } from "../schemas/checkout";

export type PaymentMethod = "cash" | "card";

export type CartItem = { id: number; quantity: number };

export type OrderItem = {
  id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
};

export type Order = {
  reference: string;
  placedAt: string;
  customer: CheckoutValues;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

export type StoreState = {
  cart: CartItem[];
  wishlist: number[];
  lastOrder: Order | null;
};

export type StoreAction =
  | { type: "ADD_TO_CART"; id: number }
  | { type: "SET_QUANTITY"; id: number; quantity: number }
  | { type: "REMOVE_FROM_CART"; id: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_WISHLIST"; id: number }
  | { type: "REMOVE_FROM_WISHLIST"; id: number }
  | { type: "PLACE_ORDER"; order: Order };

export const STORAGE_KEY = "bookish:store:v1";

export const initialState: StoreState = {
  cart: [],
  wishlist: [],
  lastOrder: null,
};

const isKnownProduct = (id: number) => products.some((product) => product.id === id);

export function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "ADD_TO_CART": {
      if (!isKnownProduct(action.id)) return state;
      const existing = state.cart.find((item) => item.id === action.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.id
              ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + 1) }
              : item,
          ),
        };
      }
      return { ...state, cart: [...state.cart, { id: action.id, quantity: 1 }] };
    }
    case "SET_QUANTITY": {
      if (action.quantity < 1) {
        return { ...state, cart: state.cart.filter((item) => item.id !== action.id) };
      }
      const quantity = Math.min(MAX_QUANTITY, Math.floor(action.quantity));
      return {
        ...state,
        cart: state.cart.map((item) => (item.id === action.id ? { ...item, quantity } : item)),
      };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((item) => item.id !== action.id) };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "TOGGLE_WISHLIST": {
      if (!isKnownProduct(action.id)) return state;
      const wishlist = state.wishlist.includes(action.id)
        ? state.wishlist.filter((id) => id !== action.id)
        : [...state.wishlist, action.id];
      return { ...state, wishlist };
    }
    case "REMOVE_FROM_WISHLIST":
      return { ...state, wishlist: state.wishlist.filter((id) => id !== action.id) };
    case "PLACE_ORDER":
      // The cart is cleared, the wishlist is intentionally left untouched.
      return { ...state, cart: [], lastOrder: action.order };
    default:
      return state;
  }
}

function sanitizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<number>();
  const cart: CartItem[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const { id, quantity } = entry as Record<string, unknown>;
    if (typeof id !== "number" || typeof quantity !== "number") continue;
    if (!isKnownProduct(id) || seen.has(id)) continue;
    if (!Number.isFinite(quantity) || quantity < 1) continue;
    seen.add(id);
    cart.push({ id, quantity: Math.min(MAX_QUANTITY, Math.floor(quantity)) });
  }
  return cart;
}

function sanitizeWishlist(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  const ids = value.filter((id): id is number => typeof id === "number" && isKnownProduct(id));
  return [...new Set(ids)];
}

function sanitizeOrder(value: unknown): Order | null {
  if (!value || typeof value !== "object") return null;
  const order = value as Partial<Order>;
  if (
    typeof order.reference !== "string" ||
    !Array.isArray(order.items) ||
    !order.customer ||
    typeof order.total !== "number"
  ) {
    return null;
  }
  return order as Order;
}

export function loadState(): StoreState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    return {
      cart: sanitizeCart(parsed.cart),
      wishlist: sanitizeWishlist(parsed.wishlist),
      lastOrder: sanitizeOrder(parsed.lastOrder),
    };
  } catch {
    return initialState;
  }
}

export function saveState(state: StoreState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be full or blocked (private mode). The app keeps working without it.
  }
}