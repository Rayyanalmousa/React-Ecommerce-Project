import { useState } from "react";
import type { Page } from "../data/store";
import { Icon, Logo } from "./primitives";

export function Header({
  page,
  go,
  cartCount,
  wishCount,
}: {
  page: Page;
  go: (p: Page) => void;
  cartCount: number;
  wishCount: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = [
    ["Home", "home"],
    ["Books", "products"],
    ["Wishlist", "wishlist"],
    ["Cart", "cart"],
  ] as const;
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Logo onClick={() => go("home")} />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {nav.map(([label, target]) => (
              <button
                key={target}
                className={page === target ? "active" : ""}
                onClick={() => go(target)}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-btn hide-mobile"
              aria-label="Search"
              onClick={() => go("products")}
            >
              <Icon name="search" />
            </button>
            <button
              className="icon-btn hide-mobile"
              aria-label="Wishlist"
              onClick={() => go("wishlist")}
            >
              <Icon name="heart" />
              {wishCount > 0 && <span className="count">{wishCount}</span>}
            </button>
            <button className="icon-btn" aria-label="Cart" onClick={() => go("cart")}>
              <Icon name="bag" />
              {cartCount > 0 && <span className="count">{cartCount}</span>}
            </button>
            <button
              className="icon-btn mobile-only"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>
      {menuOpen && (
        <div className="drawer-backdrop" onClick={() => setMenuOpen(false)}>
          <aside className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <Logo
                onClick={() => {
                  go("home");
                  setMenuOpen(false);
                }}
              />
              <button className="icon-btn" onClick={() => setMenuOpen(false)}>
                <Icon name="x" />
              </button>
            </div>
            <p className="eyebrow">Explore Bookish</p>
            <nav>
              {nav.map(([label, target]) => (
                <button
                  key={target}
                  onClick={() => {
                    go(target);
                    setMenuOpen(false);
                  }}
                >
                  {label}
                  <Icon name="arrow" size={18} />
                </button>
              ))}
            </nav>
            <div className="drawer-quote">
              “A room without books is like a body without a soul.”
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
export function Footer({ go }: { go: (p: Page) => void }) {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Logo onClick={() => go("home")} />
          <p className="footer-tagline">
            Thoughtfully chosen stories and objects for slower, cozier days.
          </p>
          <div className="socials">
            <button aria-label="Instagram">
              <Icon name="instagram" />
            </button>
            <button aria-label="Pinterest">P</button>
            <button aria-label="Facebook">f</button>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <button onClick={() => go("products")}>All books</button>
          <button onClick={() => go("wishlist")}>Wishlist</button>
          <button onClick={() => go("style")}>Style guide</button>
        </div>
        <div>
          <h4>Categories</h4>
          <button onClick={() => go("products")}>Fiction</button>
          <button onClick={() => go("products")}>Fantasy</button>
          <button onClick={() => go("products")}>Accessories</button>
        </div>
        <div className="newsletter">
          <h4>Notes from the stacks</h4>
          <p>New arrivals and quiet recommendations, twice a month.</p>
          <div>
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Email for newsletter"
            />
            <button aria-label="Subscribe">
              <Icon name="arrow" />
            </button>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Bookish. All stories reserved.</span>
        <span>Made for readers, with care.</span>
      </div>
    </footer>
  );
}
