import { useCallback, useState } from "react";
import { products, type Page } from "./data/store";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/SiteChrome";
import { Icon } from "./components/primitives";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Confirmation } from "./pages/Confirmation";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { StyleGuide } from "./pages/StyleGuide";
import { Wishlist } from "./pages/Wishlist";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [wished, setWished] = useState<number[]>([]);
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [toast, setToast] = useState("");

  const go = (nextPage: Page) => {
    if (nextPage === "cart") {
      setCartOpen(true);
      return;
    }
    setCartOpen(false);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeCart = useCallback(() => setCartOpen(false), []);
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const addCart = (id: number) => {
    setCartIds((current) => (current.includes(id) ? current : [...current, id]));
    setQuantities((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    notify("Added to your cart");
  };
  const toggleWish = (id: number) => {
    const removing = wished.includes(id);
    setWished(removing ? wished.filter((item) => item !== id) : [...wished, id]);
    notify(removing ? "Removed from wishlist" : "Saved to your wishlist");
  };
  const cart = products.filter((product) => cartIds.includes(product.id));
  const cartCount = cart.reduce((count, product) => count + (quantities[product.id] || 1), 0);
  const removeFromCart = (id: number) => {
    setCartIds((current) => current.filter((item) => item !== id));
    setQuantities((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };
  const clearCart = () => {
    setCartIds([]);
    setQuantities({});
  };

  return (
    <div className="app-shell">
      {page !== "confirmation" && (
        <Navbar page={page} go={go} cartOpen={cartOpen} cartCount={cartCount} />
      )}
      {page === "home" && (
        <Home go={go} wished={wished} toggleWish={toggleWish} addCart={addCart} />
      )}
      {page === "products" && (
        <Products wished={wished} toggleWish={toggleWish} addCart={addCart} />
      )}
      {page === "wishlist" && (
        <Wishlist wished={wished} toggleWish={toggleWish} addCart={addCart} go={go} />
      )}
      {page === "checkout" && <Checkout cart={cart} quantities={quantities} go={go} />}
      {page === "confirmation" && <Confirmation cart={cart} quantities={quantities} go={go} />}
      {page === "style" && <StyleGuide />}
      {page !== "home" && page !== "confirmation" && <Footer go={go} />}
      <Cart
        open={cartOpen}
        cart={cart}
        quantities={quantities}
        setQty={(id, quantity) => setQuantities((current) => ({ ...current, [id]: quantity }))}
        remove={removeFromCart}
        clear={clearCart}
        onClose={closeCart}
        go={go}
      />
      {toast && (
        <div className="toast">
          <span>
            <Icon name="check" size={16} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}
