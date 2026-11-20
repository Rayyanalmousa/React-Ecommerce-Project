import { useState } from "react";
import type { Page } from "../data/store";
import { Icon, Logo } from "./primitives";

const navLinks = [
  ["Home", "home"],
  ["Books", "products"],
  ["Wishlist", "wishlist"],
  ["Cart", "cart"],
] as const;

function AnimatedLink({
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

export function Navbar({
  page,
  go,
  cartOpen,
  cartCount,
}: {
  page: Page;
  go: (page: Page) => void;
  cartOpen: boolean;
  cartCount: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (target: Page) => {
    go(target);
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`bookish-navbar${menuOpen ? " menu-open" : ""}`}>
        <nav className="navbar-main" aria-label="Primary navigation">
          <Logo onClick={() => navigate("home")} />
          <div className="navbar-links">
            {navLinks.map(([label, target]) => (
              <AnimatedLink
                key={target}
                label={label}
                active={page === target || (target === "cart" && cartOpen)}
                onClick={() => navigate(target)}
              />
            ))}
          </div>
          <div className="navbar-actions">
            <button
              className="icon-btn navbar-desktop-action"
              aria-label="Search books"
              onClick={() => navigate("products")}
            >
              <Icon name="search" size={18} />
            </button>
            <button
              className={`icon-btn${cartOpen ? " active" : ""}`}
              aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
              onClick={() => navigate("cart")}
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
              className={page === target ? "active" : ""}
              aria-current={page === target ? "page" : undefined}
              onClick={() => navigate(target)}
            >
              {label}
              <Icon name="arrow" size={16} />
            </button>
          ))}
          <button type="button" onClick={() => navigate("products")}>
            Search books
            <Icon name="search" size={16} />
          </button>
        </div>
      </header>
      <div className="navbar-spacer" aria-hidden="true" />
    </>
  );
}
