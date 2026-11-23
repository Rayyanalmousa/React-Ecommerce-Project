import { useNavigate } from "react-router-dom";
import { ROUTES } from "../data/store";
import { Icon, Logo } from "./primitives";

export function Footer() {
  const navigate = useNavigate();
  const openCategory = (category: string) =>
    navigate(`${ROUTES.products}?category=${encodeURIComponent(category)}`);

  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Logo onClick={() => navigate(ROUTES.home)} />
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
          <button onClick={() => navigate(ROUTES.products)}>All books</button>
          <button onClick={() => navigate(ROUTES.wishlist)}>Wishlist</button>
          <button onClick={() => navigate(ROUTES.cart)}>Cart</button>
        </div>
        <div>
          <h4>Categories</h4>
          <button onClick={() => openCategory("Fiction")}>Fiction</button>
          <button onClick={() => openCategory("Fantasy")}>Fantasy</button>
          <button onClick={() => openCategory("Accessories")}>Accessories</button>
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