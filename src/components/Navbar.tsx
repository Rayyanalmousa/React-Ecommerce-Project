import { useState } from "react"; //tracks whether the mobile menu is open.
import { useLocation, useNavigate } from "react-router-dom"; //read the current URL and change pages without a reload.
import { ROUTES } from "../data/store"; //one object holding all paths, so you never type "/cart" by hand.
import { useStore } from "../context/StoreContext"; //reads cartCount and wishlistCount from the global store.
import { Icon, Logo } from "./primitives";

const navLinks = [
  ["Home", ROUTES.home],
  ["Books", ROUTES.products],
  ["Wishlist", ROUTES.wishlist],
  ["Cart", ROUTES.cart],
] as const;

function AnimatedLink({ //3 props
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`navbar-link${active ? " active" : ""}`}
      aria-label={label}
      aria-current={active ? "page" : undefined}
    >
      <span className="navbar-link-track">
        <span>{label}</span>
        <span aria-hidden="true">{label}</span>
      </span>
    </button>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, wishlistCount } = useStore();
  const { pathname } = useLocation();
  const routerNavigate = useNavigate();

  const isActive = (target: string) =>
    target === ROUTES.home ? pathname === ROUTES.home : pathname.startsWith(target);

  const navigate = (target: string) => {
    routerNavigate(target);
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`bookish-navbar${menuOpen ? " menu-open" : ""}`}>
        <nav className="navbar-main" aria-label="Primary navigation">
          <Logo onClick={() => navigate(ROUTES.home)} />
          <div className="navbar-links">
            {navLinks.map(([label, target]) => (
              <AnimatedLink
                key={target}
                label={label}
                active={isActive(target)}
                onClick={() => navigate(target)}
              />
            ))}
          </div>
          <div className="navbar-actions">
            <button
              className="icon-btn navbar-desktop-action"
              aria-label="Search books"
              onClick={() => navigate(ROUTES.products)}
            >
              <Icon name="search" size={18} />
            </button>
            <button
              className={`icon-btn${isActive(ROUTES.wishlist) ? " active" : ""}`}
              aria-label={
                wishlistCount > 0 ? `Wishlist, ${wishlistCount} saved items` : "Wishlist"
              }
              onClick={() => navigate(ROUTES.wishlist)}
            >
              <Icon name="heart" size={18} />
              {wishlistCount > 0 && (
                <span className="navbar-count" aria-hidden="true">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              className={`icon-btn${isActive(ROUTES.cart) ? " active" : ""}`}
              aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
              onClick={() => navigate(ROUTES.cart)}
            >
              <Icon name="bag" size={18} />
              {cartCount > 0 && (
                <span className="navbar-count" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="icon-btn navbar-menu-toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? "x" : "menu"} size={19} />
            </button>
          </div>
        </nav>
        <div
          className={`navbar-mobile-panel${menuOpen ? " open" : ""}`}
          aria-label="Mobile navigation"
          inert={!menuOpen}
        >
          {navLinks.map(([label, target]) => (
            <button
              type="button"
              key={target}
              className={isActive(target) ? "active" : ""}
              aria-current={isActive(target) ? "page" : undefined}
              onClick={() => navigate(target)}
            >
              {label}
              <Icon name="arrow" size={16} />
            </button>
          ))}
          <button type="button" onClick={() => navigate(ROUTES.products)}>
            Search books
            <Icon name="search" size={16} />
          </button>
        </div>
      </header>
      <div className="navbar-spacer" aria-hidden="true" />
    </>
  );
}