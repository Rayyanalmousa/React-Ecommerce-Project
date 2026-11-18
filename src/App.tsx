import { useState } from "react";
import { products, type Page } from "./data/store";
import { Footer, Header } from "./components/SiteChrome";
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
  const [wished, setWished] = useState<number[]>([2, 4]);
  const [cartIds, setCartIds] = useState<number[]>([1, 3]);
  const [quantities, setQuantities] = useState<Record<number, number>>({ 1: 1, 3: 1 });
  const [toast, setToast] = useState("");

  const go = (nextPage: Page) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const addCart = (id: number) => {
    if (!cartIds.includes(id)) setCartIds([...cartIds, id]);
    setQuantities((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    notify("Added to your cart");
  };
  const toggleWish = (id: number) => {
    const removing = wished.includes(id);
    setWished(removing ? wished.filter((item) => item !== id) : [...wished, id]);
    notify(removing ? "Removed from wishlist" : "Saved to your wishlist");
  };
  const cart = products.filter((product) => cartIds.includes(product.id));

  return (
    <div className="app-shell">
      {page !== "confirmation" && (
        <Header page={page} go={go} cartCount={cartIds.length} wishCount={wished.length} />
      )}
      {page === "home" && (
        <Home go={go} wished={wished} toggleWish={toggleWish} addCart={addCart} />
      )}
      {page === "products" && (
        <Products wished={wished} toggleWish={toggleWish} addCart={addCart} />
      )}
      {page === "cart" && (
        <Cart
          cart={cart}
          quantities={quantities}
          setQty={(id, quantity) => setQuantities({ ...quantities, [id]: quantity })}
          remove={(id) => setCartIds(cartIds.filter((item) => item !== id))}
          clear={() => setCartIds([])}
          go={go}
        />
      )}
      {page === "wishlist" && (
        <Wishlist wished={wished} toggleWish={toggleWish} addCart={addCart} go={go} />
      )}
      {page === "checkout" && <Checkout cart={cart} quantities={quantities} go={go} />}
      {page === "confirmation" && <Confirmation cart={cart} quantities={quantities} go={go} />}
      {page === "style" && <StyleGuide />}
      {page !== "home" && page !== "confirmation" && <Footer go={go} />}
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
