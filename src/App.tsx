import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "./data/store";
import { useStore } from "./context/StoreContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/SiteChrome";
import { Icon } from "./components/primitives";
import { EmptyState } from "./components/StoreComponents";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Confirmation } from "./pages/Confirmation";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { Wishlist } from "./pages/Wishlist";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="container empty-page">
      <EmptyState
        kind="book"
        title="This page wandered off"
        text="We couldn’t find the page you were looking for."
        action={() => navigate(ROUTES.home)}
        label="Back to home"
      />
    </main>
  );
}

export default function App() {
  const { toast } = useStore();
  const { pathname } = useLocation();
  const hideChrome = pathname === ROUTES.confirmation;

  return (
    <div className="app-shell">
      <ScrollToTop />
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.products} element={<Products />} />
        <Route path={ROUTES.wishlist} element={<Wishlist />} />
        <Route path={ROUTES.cart} element={<Cart />} />
        <Route path={ROUTES.checkout} element={<Checkout />} />
        <Route path={ROUTES.confirmation} element={<Confirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChrome && <Footer />}
      {toast && (
        <div className="toast" role="status">
          <span>
            <Icon name="check" size={16} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}