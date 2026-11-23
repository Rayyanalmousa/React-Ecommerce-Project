import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "../data/store";
import type { CheckoutValues } from "../schemas/checkout";
import { generateOrderReference } from "../utils/order";
import { getTotals, type Totals } from "../utils/pricing";
import {
  loadState,
  saveState,
  storeReducer,
  type Order,
  type PaymentMethod,
  type StoreState,
} from "./storeReducer";

export type CartLine = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

type StoreContextValue = {
  items: CartLine[];
  cartCount: number;
  totals: Totals;
  wishlist: number[];
  wishlistProducts: Product[];
  wishlistCount: number;
  lastOrder: Order | null;
  toast: string;
  addToCart: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  isWished: (id: number) => boolean;
  toggleWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
  placeOrder: (customer: CheckoutValues, paymentMethod: PaymentMethod) => Order;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: StoreState;
}) {
  const [state, dispatch] = useReducer(storeReducer, undefined, () => initialState ?? loadState());
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);

  const items = useMemo<CartLine[]>(
    () =>
      state.cart.flatMap(({ id, quantity }) => {
        const product = products.find((entry) => entry.id === id);
        return product ? [{ product, quantity, lineTotal: product.price * quantity }] : [];
      }),
    [state.cart],
  );

  const cartCount = useMemo(() => items.reduce((sum, line) => sum + line.quantity, 0), [items]);
  const totals = useMemo(
    () => getTotals(items.reduce((sum, line) => sum + line.lineTotal, 0)),
    [items],
  );
  const wishlistProducts = useMemo(
    () => state.wishlist.flatMap((id) => products.filter((product) => product.id === id)),
    [state.wishlist],
  );

  const addToCart = useCallback(
    (id: number) => {
      dispatch({ type: "ADD_TO_CART", id });
      notify("Added to your cart");
    },
    [notify],
  );

  const toggleWishlist = useCallback(
    (id: number) => {
      const removing = state.wishlist.includes(id);
      dispatch({ type: "TOGGLE_WISHLIST", id });
      notify(removing ? "Removed from wishlist" : "Saved to your wishlist");
    },
    [notify, state.wishlist],
  );

  const placeOrder = useCallback(
    (customer: CheckoutValues, paymentMethod: PaymentMethod): Order => {
      const order: Order = {
        reference: generateOrderReference(),
        placedAt: new Date().toISOString(),
        customer,
        paymentMethod,
        items: items.map(({ product, quantity }) => ({
          id: product.id,
          title: product.title,
          author: product.author,
          price: product.price,
          quantity,
          image: product.image,
          color: product.color,
        })),
        ...totals,
      };
      dispatch({ type: "PLACE_ORDER", order });
      return order;
    },
    [items, totals],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      items,
      cartCount,
      totals,
      wishlist: state.wishlist,
      wishlistProducts,
      wishlistCount: state.wishlist.length,
      lastOrder: state.lastOrder,
      toast,
      addToCart,
      setQuantity: (id, quantity) => dispatch({ type: "SET_QUANTITY", id, quantity }),
      removeFromCart: (id) => dispatch({ type: "REMOVE_FROM_CART", id }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      isWished: (id) => state.wishlist.includes(id),
      toggleWishlist,
      removeFromWishlist: (id) => dispatch({ type: "REMOVE_FROM_WISHLIST", id }),
      placeOrder,
    }),
    [
      items,
      cartCount,
      totals,
      state.wishlist,
      state.lastOrder,
      wishlistProducts,
      toast,
      addToCart,
      toggleWishlist,
      placeOrder,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside <StoreProvider>");
  return context;
}