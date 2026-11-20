import type { Page } from "../data/store";
import { categories, products } from "../data/store";
import { Footer } from "../components/SiteChrome";
import { Button, Icon } from "../components/primitives";
import { ProductCard, SectionHeading } from "../components/StoreComponents";

export function Home({
  go,
  wished,
  toggleWish,
  addCart,
}: {
  go: (p: Page) => void;
  wished: number[];
  toggleWish: (id: number) => void;
  addCart: (id: number) => void;
}) {
  return (
    <>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">The autumn edit · 2026</p>
              <h1>
                Find your next
                <br />
                <em>favorite chapter.</em>
              </h1>
              <p className="hero-text">
                A considered collection of timeless stories, beautiful editions, and thoughtful
                things for the reading life.
              </p>
              <div className="hero-actions">
                <Button onClick={() => go("products")}>
                  Shop the collection <Icon name="arrow" size={18} />
                </Button>
                <button className="text-link" onClick={() => go("products")}>
                  Browse new arrivals
                </button>
              </div>
              <div className="reader-note">
                <span className="avatars">
                  <i>JM</i>
                  <i>AK</i>
                  <i>SR</i>
                </span>
                <span>
                  <b>Loved by 12,000+ readers</b>
                  <small>Independent, thoughtful, bookish.</small>
                </span>
              </div>
            </div>
            <div className="hero-art">
              <div className="arch-image">
                <img
                  src="https://images.unsplash.com/photo-1510568192-5cd6e7a47edd?auto=format&fit=crop&w=1100&q=90"
                  alt="A cozy reading chair beside bookshelves"
                />
              </div>
              <div className="floating-book book-one">
                <span>A quiet life</span>
              </div>
              <div className="floating-book book-two">
                <span>
                  The
                  <br />
                  Collected
                  <br />
                  Poems
                </span>
              </div>
              <div className="hero-seal">
                Est.
                <br />
                <b>2018</b>
                <br />
                For readers
              </div>
            </div>
          </div>
        </section>
        <div className="gold-rule">
          <span>Curated with intention</span>
          <span>Beautiful editions</span>
          <span>Wrapped with care</span>
        </div>
        <section className="section container">
          <SectionHeading
            eyebrow="On our shelves"
            title="Books worth lingering over"
            action={
              <button className="text-link" onClick={() => go("products")}>
                View all books <Icon name="arrow" size={16} />
              </button>
            }
          />
          <div className="product-grid featured-grid">
            {products.slice(0, 4).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                wished={wished.includes(p.id)}
                onWish={() => toggleWish(p.id)}
                onCart={() => addCart(p.id)}
              />
            ))}
          </div>
        </section>






        <section className="category-section">
          <div className="container">
            <SectionHeading eyebrow="Find your shelf" title="Shop by category" />
            <div className="category-showcase">
              {categories.map(([name, sub, image]) => (
                <div key={name} className="category-card">
                  <img src={image} alt={name} loading="lazy" />
                  <div className="category-card-overlay">
                    <strong>{name}</strong>
                    <small>{sub}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="container">
          <div className="editorial-banner">
            <img
              src="https://images.unsplash.com/photo-1638657527755-ca3e0d217260?auto=format&fit=crop&w=1600&q=90"
              alt="A book and candle in a warm reading nook"
            />
            <div className="editorial-banner-frame" />
            <div className="editorial-banner-copy">
              <p className="eyebrow">The reading ritual</p>
              <h2>
                Make a little room
                <br />
                for wonder.
              </h2>
              <p className="editorial-banner-text">
                Dim the lights, put the kettle on, and let the rest of the world wait. Our reading
                accessories are chosen to make every chapter feel like an occasion.
              </p>
              <Button variant="secondary" onClick={() => go("products")}>
                Shop reading accessories
              </Button>
            </div>
          </div>
        </section>














        <section className="promo">
          <div className="promo-star">✦</div>
          <div>
            <p>On the house</p>
            <h2>A free reading bookmark with every order.</h2>
          </div>
          <Button variant="secondary" onClick={() => go("products")}>
            Start shopping
          </Button>
        </section>
      </main>
      <Footer go={go} />
    </>
  );
}
