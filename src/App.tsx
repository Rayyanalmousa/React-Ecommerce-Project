import { useMemo, useState } from "react";

type Page = "home" | "products" | "cart" | "wishlist" | "checkout" | "confirmation" | "style";
type Product = {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  image: string;
  color: string;
};

const products: Product[] = [
  { id: 1, title: "The Secret Garden", author: "Frances Hodgson Burnett", category: "Fiction", price: 18, color: "#486354", image: "https://images.unsplash.com/photo-1600818797017-d6e5027210bb?auto=format&fit=crop&w=700&q=85" },
  { id: 2, title: "A Room of One’s Own", author: "Virginia Woolf", category: "Classics", price: 16, color: "#8b4d41", image: "https://images.unsplash.com/photo-1680444257344-e9eb152fb116?auto=format&fit=crop&w=700&q=85" },
  { id: 3, title: "The Night Circus", author: "Erin Morgenstern", category: "Fantasy", price: 22, color: "#24323b", image: "https://images.unsplash.com/photo-1517148892120-4d2da39c8dc1?auto=format&fit=crop&w=700&q=85" },
  { id: 4, title: "The Art of Stillness", author: "Pico Iyer", category: "Self-Growth", price: 19, color: "#a36b43", image: "https://images.unsplash.com/photo-1638657527755-ca3e0d217260?auto=format&fit=crop&w=700&q=85" },
  { id: 5, title: "Little Women", author: "Louisa May Alcott", category: "Classics", price: 20, color: "#6B1E2E", image: "https://images.unsplash.com/photo-1721775999121-7be73ba0e29f?auto=format&fit=crop&w=700&q=85" },
  { id: 6, title: "The Wildwood Tales", author: "M. L. Hawthorne", category: "Kids", price: 14, color: "#647457", image: "https://images.unsplash.com/photo-1605787050388-845c63b60920?auto=format&fit=crop&w=700&q=85" },
  { id: 7, title: "Brass Reading Lamp", author: "The Bookish Collection", category: "Accessories", price: 34, color: "#9d7441", image: "https://images.unsplash.com/photo-1698935004292-47fb4d7e0b73?auto=format&fit=crop&w=700&q=85" },
  { id: 8, title: "Midnight Reading Candle", author: "Cedar, fig & old paper", category: "Accessories", price: 24, color: "#3b3032", image: "https://images.unsplash.com/photo-1711185900579-359240b69257?auto=format&fit=crop&w=700&q=85" },
];

const categories = [
  ["Fiction", "Stories that stay with you", "✦"],
  ["Non-Fiction", "Curiosity, beautifully bound", "¶"],
  ["Fantasy", "Other worlds await", "☾"],
  ["Self-Growth", "Pages for becoming", "↑"],
  ["Kids", "Little readers, big dreams", "☆"],
  ["Accessories", "For your reading ritual", "◇"],
];

function Icon({ name, size = 20, filled = false }: { name: string; size?: number; filled?: boolean }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    bag: <><path d="M6 8h12l1 13H5L6 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    x: <path d="m6 6 12 12M18 6 6 18" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" /><path d="M10 11v6M14 11v6" /></>,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
    check: <path d="m5 12 4 4L19 6" />,
    book: <><path d="M4 5c3-1 6 0 8 2v13c-2-2-5-3-8-2V5Z" /><path d="M20 5c-3-1-6 0-8 2v13c2-2 5-3 8-2V5Z" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".5" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Logo({ onClick }: { onClick?: () => void }) {
  return <button className="logo" onClick={onClick} aria-label="Bookish home"><span className="logo-mark"><Icon name="book" size={20} /></span><span>Bookish</span></button>;
}

function Button({ children, variant = "primary", onClick, disabled, type = "button", className = "" }: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; onClick?: () => void; disabled?: boolean; type?: "button" | "submit"; className?: string }) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`btn btn-${variant} ${className}`}>{children}</button>;
}

function Header({ page, go, cartCount, wishCount }: { page: Page; go: (p: Page) => void; cartCount: number; wishCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = [["Home", "home"], ["Books", "products"], ["Wishlist", "wishlist"], ["Cart", "cart"]] as const;
  return <>
    <header className="site-header">
      <div className="container header-inner">
        <Logo onClick={() => go("home")} />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([label, target]) => <button key={target} className={page === target ? "active" : ""} onClick={() => go(target)}>{label}</button>)}
        </nav>
        <div className="header-actions">
          <button className="icon-btn hide-mobile" aria-label="Search" onClick={() => go("products")}><Icon name="search" /></button>
          <button className="icon-btn hide-mobile" aria-label="Wishlist" onClick={() => go("wishlist")}><Icon name="heart" />{wishCount > 0 && <span className="count">{wishCount}</span>}</button>
          <button className="icon-btn" aria-label="Cart" onClick={() => go("cart")}><Icon name="bag" />{cartCount > 0 && <span className="count">{cartCount}</span>}</button>
          <button className="icon-btn mobile-only" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Icon name="menu" /></button>
        </div>
      </div>
    </header>
    {menuOpen && <div className="drawer-backdrop" onClick={() => setMenuOpen(false)}>
      <aside className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head"><Logo onClick={() => { go("home"); setMenuOpen(false); }} /><button className="icon-btn" onClick={() => setMenuOpen(false)}><Icon name="x" /></button></div>
        <p className="eyebrow">Explore Bookish</p>
        <nav>{nav.map(([label, target]) => <button key={target} onClick={() => { go(target); setMenuOpen(false); }}>{label}<Icon name="arrow" size={18} /></button>)}</nav>
        <div className="drawer-quote">“A room without books is like a body without a soul.”</div>
      </aside>
    </div>}
  </>;
}

function Footer({ go }: { go: (p: Page) => void }) {
  return <footer>
    <div className="container footer-grid">
      <div><Logo onClick={() => go("home")} /><p className="footer-tagline">Thoughtfully chosen stories and objects for slower, cozier days.</p><div className="socials"><button aria-label="Instagram"><Icon name="instagram" /></button><button aria-label="Pinterest">P</button><button aria-label="Facebook">f</button></div></div>
      <div><h4>Explore</h4><button onClick={() => go("products")}>All books</button><button onClick={() => go("wishlist")}>Wishlist</button><button onClick={() => go("style")}>Style guide</button></div>
      <div><h4>Categories</h4><button onClick={() => go("products")}>Fiction</button><button onClick={() => go("products")}>Fantasy</button><button onClick={() => go("products")}>Accessories</button></div>
      <div className="newsletter"><h4>Notes from the stacks</h4><p>New arrivals and quiet recommendations, twice a month.</p><div><input type="email" placeholder="Your email address" aria-label="Email for newsletter" /><button aria-label="Subscribe"><Icon name="arrow" /></button></div></div>
    </div>
    <div className="container footer-bottom"><span>© 2026 Bookish. All stories reserved.</span><span>Made for readers, with care.</span></div>
  </footer>;
}

function ProductCard({ product, wished, onWish, onCart }: { product: Product; wished: boolean; onWish: () => void; onCart: () => void }) {
  return <article className="product-card">
    <div className="product-image">
      <img src={product.image} alt={`${product.title} cover`} />
      <div className="cover-tint" style={{ background: product.color }} />
      <div className="cover-type"><span>{product.category}</span><strong>{product.title}</strong><small>{product.author}</small></div>
      <button className={`heart-btn ${wished ? "wished" : ""}`} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} onClick={onWish}><Icon name="heart" filled={wished} /></button>
    </div>
    <div className="product-info"><span className="tag">{product.category}</span><h3>{product.title}</h3><p>{product.author}</p><div className="product-bottom"><strong>${product.price.toFixed(2)}</strong><button onClick={onCart}>Add to cart</button></div></div>
  </article>;
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action}</div>;
}

function Home({ go, wished, toggleWish, addCart }: { go: (p: Page) => void; wished: number[]; toggleWish: (id: number) => void; addCart: (id: number) => void }) {
  return <>
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy"><p className="eyebrow">The autumn edit · 2026</p><h1>Find your next<br /><em>favorite chapter.</em></h1><p className="hero-text">A considered collection of timeless stories, beautiful editions, and thoughtful things for the reading life.</p><div className="hero-actions"><Button onClick={() => go("products")}>Shop the collection <Icon name="arrow" size={18} /></Button><button className="text-link" onClick={() => go("products")}>Browse new arrivals</button></div><div className="reader-note"><span className="avatars"><i>JM</i><i>AK</i><i>SR</i></span><span><b>Loved by 12,000+ readers</b><small>Independent, thoughtful, bookish.</small></span></div></div>
          <div className="hero-art">
            <div className="arch-image"><img src="https://images.unsplash.com/photo-1510568192-5cd6e7a47edd?auto=format&fit=crop&w=1100&q=90" alt="A cozy reading chair beside bookshelves" /></div>
            <div className="floating-book book-one"><span>A quiet life</span></div><div className="floating-book book-two"><span>The<br />Collected<br />Poems</span></div>
            <div className="hero-seal">Est.<br /><b>2018</b><br />For readers</div>
          </div>
        </div>
      </section>
      <div className="gold-rule"><span>Curated with intention</span><span>Beautiful editions</span><span>Wrapped with care</span></div>
      <section className="section container">
        <SectionHeading eyebrow="On our shelves" title="Books worth lingering over" action={<button className="text-link" onClick={() => go("products")}>View all books <Icon name="arrow" size={16} /></button>} />
        <div className="product-grid featured-grid">{products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} wished={wished.includes(p.id)} onWish={() => toggleWish(p.id)} onCart={() => addCart(p.id)} />)}</div>
      </section>
      <section className="category-section">
        <div className="container"><SectionHeading eyebrow="Find your shelf" title="Shop by category" /><div className="category-grid">{categories.map(([name, sub, symbol], i) => <button key={name} onClick={() => go("products")} className={`category-tile c${i}`}><span className="category-symbol">{symbol}</span><span><strong>{name}</strong><small>{sub}</small></span><Icon name="arrow" /></button>)}</div></div>
      </section>
      <section className="container editorial">
        <div className="editorial-image"><img src="https://images.unsplash.com/photo-1638657527755-ca3e0d217260?auto=format&fit=crop&w=1200&q=90" alt="A book and candle in a warm reading nook" /></div>
        <div className="editorial-copy"><p className="eyebrow">The reading ritual</p><h2>Make a little room<br />for wonder.</h2><p>Dim the lights, put the kettle on, and let the rest of the world wait. Our reading accessories are chosen to make every chapter feel like an occasion.</p><Button variant="secondary" onClick={() => go("products")}>Shop reading accessories</Button></div>
      </section>
      <section className="promo"><div className="promo-star">✦</div><div><p>On the house</p><h2>A free reading bookmark with every order.</h2></div><Button variant="secondary" onClick={() => go("products")}>Start shopping</Button></section>
    </main>
    <Footer go={go} />
  </>;
}

function EmptyState({ kind, title, text, action, label }: { kind: "book" | "heart" | "bag"; title: string; text: string; action: () => void; label: string }) {
  return <div className="empty-state"><div className="empty-art"><Icon name={kind === "book" ? "book" : kind === "heart" ? "heart" : "bag"} size={48} /><span>✦</span></div><h2>{title}</h2><p>{text}</p><Button onClick={action}>{label}</Button></div>;
}

function Products({ wished, toggleWish, addCart }: { wished: number[]; toggleWish: (id: number) => void; addCart: (id: number) => void }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(40);
  const filtered = useMemo(() => products.filter(p => (!query || `${p.title} ${p.author}`.toLowerCase().includes(query.toLowerCase())) && (!selected.length || selected.includes(p.category)) && p.price <= maxPrice).sort((a,b) => sort === "low" ? a.price-b.price : sort === "high" ? b.price-a.price : a.id-b.id), [query, selected, sort, maxPrice]);
  const clear = () => { setQuery(""); setSelected([]); setMaxPrice(40); };
  const FilterContent = () => <div className="filters-content">
    <div className="filter-title"><h3>Filter by</h3><button onClick={clear}>Clear all</button></div>
    <fieldset><legend>Category</legend>{["Fiction", "Classics", "Fantasy", "Self-Growth", "Kids", "Accessories"].map(c => <label className="check-row" key={c}><input type="checkbox" checked={selected.includes(c)} onChange={() => setSelected(s => s.includes(c) ? s.filter(x => x !== c) : [...s, c])} /><span>{c}</span><small>{products.filter(p => p.category === c).length}</small></label>)}</fieldset>
    <fieldset><legend>Price range</legend><input className="range" type="range" min="10" max="40" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} /><div className="price-inputs"><span>$10</span><span>to</span><span>${maxPrice}</span></div></fieldset>
    <fieldset><legend>Availability</legend><label className="radio-row"><input type="radio" name="stock" defaultChecked /> In stock</label><label className="radio-row"><input type="radio" name="stock" /> All items</label></fieldset>
  </div>;
  return <main className="container listing-page">
    <div className="page-intro"><p className="eyebrow">The collection</p><h1>Books & lovely things</h1><p>Stories to get lost in, and objects to make the journey sweeter.</p></div>
    <div className="shop-toolbar"><label className="search-box"><Icon name="search" /><input placeholder="Search by title or author…" value={query} onChange={e => setQuery(e.target.value)} /></label><button className="filter-mobile" onClick={() => setFilterOpen(true)}><Icon name="filter" /> Filters</button><label className="select-box"><span>Sort by:</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option></select></label></div>
    <div className="shop-layout"><aside className="filters"><FilterContent /></aside><section className="results"><div className="results-line"><span>{filtered.length} thoughtful finds</span><i /></div>{filtered.length ? <div className="product-grid listing-grid">{filtered.map(p => <ProductCard key={p.id} product={p} wished={wished.includes(p.id)} onWish={() => toggleWish(p.id)} onCart={() => addCart(p.id)} />)}</div> : <EmptyState kind="book" title="No books match your filters" text="Try widening your search, or clear the filters to browse every shelf." action={clear} label="Clear filters" />}</section></div>
    {filterOpen && <div className="drawer-backdrop" onClick={() => setFilterOpen(false)}><aside className="filter-drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><h2>Filters</h2><button className="icon-btn" onClick={() => setFilterOpen(false)}><Icon name="x" /></button></div><FilterContent /><Button className="full" onClick={() => setFilterOpen(false)}>Show {filtered.length} results</Button></aside></div>}
  </main>;
}

function Quantity({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return <div className="quantity"><button onClick={() => onChange(Math.max(1, value - 1))}>−</button><span>{value}</span><button onClick={() => onChange(value + 1)}>+</button></div>;
}

function Cart({ cart, quantities, setQty, remove, clear, go }: { cart: Product[]; quantities: Record<number, number>; setQty: (id: number, n: number) => void; remove: (id: number) => void; clear: () => void; go: (p: Page) => void }) {
  const subtotal = cart.reduce((s, p) => s + p.price * (quantities[p.id] || 1), 0);
  if (!cart.length) return <main className="container empty-page"><EmptyState kind="bag" title="Your cart is waiting" text="It’s a little quiet in here. Find a story you’ll love and bring it home." action={() => go("products")} label="Continue shopping" /></main>;
  return <main className="container cart-page"><div className="page-title-row"><div><p className="eyebrow">Your selection</p><h1>Shopping cart</h1></div><button className="clear-cart" onClick={clear}>Clear cart</button></div><div className="cart-layout"><section className="cart-list"><div className="cart-labels"><span>Item</span><span>Quantity</span><span>Total</span></div>{cart.map(p => <article className="cart-item" key={p.id}><div className="cart-product"><div className="cart-thumb"><img src={p.image} alt="" /><span style={{background:p.color}} /></div><div><span className="tag">{p.category}</span><h3>{p.title}</h3><p>{p.author}</p><strong>${p.price.toFixed(2)}</strong></div></div><Quantity value={quantities[p.id] || 1} onChange={n => setQty(p.id,n)} /><div className="line-total"><strong>${(p.price*(quantities[p.id]||1)).toFixed(2)}</strong><button aria-label={`Remove ${p.title}`} onClick={() => remove(p.id)}><Icon name="trash" size={18} /></button></div></article>)}</section><OrderSummary subtotal={subtotal} go={go} /></div></main>;
}

function OrderSummary({ subtotal, go }: { subtotal: number; go: (p: Page) => void }) {
  return <aside className="order-summary"><p className="eyebrow">Your order</p><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="summary-line"><span>Shipping</span><span className="sage">Complimentary</span></div><div className="total-line"><span>Total</span><strong>${subtotal.toFixed(2)} <small>USD</small></strong></div><Button className="full" onClick={() => go("checkout")}>Proceed to checkout <Icon name="arrow" /></Button><Button className="full" variant="secondary" onClick={() => go("products")}>Continue shopping</Button><p className="secure-note">Secure checkout · Beautifully wrapped</p></aside>;
}

function Wishlist({ wished, toggleWish, addCart, go }: { wished: number[]; toggleWish: (id: number) => void; addCart: (id: number) => void; go: (p: Page) => void }) {
  const items = products.filter(p => wished.includes(p.id));
  return <main className="container wishlist-page"><div className="page-intro"><p className="eyebrow">Saved for later</p><h1>Your wishlist</h1><p>{items.length ? `${items.length} ${items.length === 1 ? "treasure" : "treasures"} tucked away for you.` : "A shelf of stories you hope to return to."}</p></div>{items.length ? <div className="product-grid listing-grid wish-grid">{items.map(p => <div className="wish-wrap" key={p.id}><ProductCard product={p} wished onWish={() => toggleWish(p.id)} onCart={() => addCart(p.id)} /><button className="remove-link" onClick={() => toggleWish(p.id)}>Remove</button></div>)}</div> : <EmptyState kind="heart" title="Your wishlist is empty" text="Save the books that catch your eye and they’ll be waiting here when you return." action={() => go("products")} label="Browse books" />}</main>;
}

function Checkout({ cart, quantities, go }: { cart: Product[]; quantities: Record<number, number>; go: (p: Page) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [payment, setPayment] = useState("cod");
  const subtotal = cart.reduce((s,p) => s + p.price*(quantities[p.id]||1),0);
  if (!cart.length) return <main className="container empty-page"><EmptyState kind="bag" title="Nothing to check out yet" text="Choose a book or two before heading to checkout." action={() => go("products")} label="Back to books" /></main>;
  const place = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setSubmitted(true); const form = e.currentTarget; if (form.checkValidity()) go("confirmation"); };
  return <main className="container checkout-page"><button className="back-link" onClick={() => go("cart")}>← Back to cart</button><div className="page-intro compact"><p className="eyebrow">Nearly yours</p><h1>Checkout</h1></div><form className="checkout-layout" onSubmit={place} noValidate><section className="checkout-form"><div className="form-section-head"><span>01</span><div><h2>Delivery details</h2><p>Where shall we send your new stories?</p></div></div><div className="form-grid"><Field label="Full name" placeholder="Jane Austen" required submitted={submitted} /><Field label="Email address" type="email" placeholder="jane@example.com" required submitted={submitted} /><Field label="Phone number" type="tel" placeholder="+1 (555) 000-0000" required submitted={submitted} /><Field label="City" placeholder="Bath" required submitted={submitted} /><div className="span-2"><Field label="Street address" placeholder="42 Milsom Street" required submitted={submitted} /></div><Field label="Postal code" placeholder="BA1 1DN" required submitted={submitted} /><label className="field span-2"><span>Delivery notes <small>Optional</small></span><textarea placeholder="Anything our courier should know?" rows={3} /></label></div><div className="form-section-head payment-head"><span>02</span><div><h2>Payment method</h2><p>Choose how you’d like to pay.</p></div></div><div className="payment-options"><label className={payment==="cod"?"selected":""}><input type="radio" name="payment" checked={payment==="cod"} onChange={() => setPayment("cod")} /><span><b>Cash on delivery</b><small>Pay when your parcel arrives</small></span><i>Cash</i></label><label className={payment==="card"?"selected":""}><input type="radio" name="payment" checked={payment==="card"} onChange={() => setPayment("card")} /><span><b>Card payment</b><small>Display only for this prototype</small></span><i>Card</i></label></div></section><aside className="checkout-summary"><p className="eyebrow">In your parcel</p><h2>Order summary</h2><div className="checkout-items">{cart.map(p => <div key={p.id}><div className="mini-cover"><img src={p.image} alt="" /><span style={{background:p.color}} /></div><span><b>{p.title}</b><small>Qty {quantities[p.id]||1}</small></span><strong>${(p.price*(quantities[p.id]||1)).toFixed(2)}</strong></div>)}</div><div className="summary-line"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="summary-line"><span>Delivery</span><span className="sage">Free</span></div><div className="total-line"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div><Button type="submit" className="full">Place order <Icon name="arrow" /></Button>{submitted && <p className="form-error">Please complete the highlighted fields.</p>}<p className="secure-note">By placing your order, you agree to our terms.</p></aside></form></main>;
}

function Field({ label, placeholder, type="text", required, submitted }: { label:string; placeholder:string; type?:string; required?:boolean; submitted?:boolean }) {
  const [value, setValue] = useState("");
  const invalid = submitted && required && !value;
  return <label className={`field ${invalid ? "invalid" : ""}`}><span>{label}{required && <b>*</b>}</span><input type={type} placeholder={placeholder} value={value} onChange={e => setValue(e.target.value)} required={required} />{invalid && <small className="error-msg">Please enter your {label.toLowerCase()}.</small>}</label>;
}

function Confirmation({ cart, quantities, go }: { cart: Product[]; quantities: Record<number,number>; go: (p: Page) => void }) {
  const total = cart.reduce((s,p)=>s+p.price*(quantities[p.id]||1),0);
  return <main className="confirmation"><div className="confirmation-card"><div className="success-icon"><Icon name="check" size={34} /></div><p className="eyebrow">Order confirmed</p><h1>Thank you for<br />your order.</h1><p>Your parcel is being prepared with care. We’ve sent all the details to your inbox.</p><div className="order-ref"><span>Order reference</span><strong>BK-20260518-4821</strong></div><div className="confirmation-list">{cart.map(p=><div key={p.id}><span>{p.title} <small>× {quantities[p.id]||1}</small></span><strong>${(p.price*(quantities[p.id]||1)).toFixed(2)}</strong></div>)}<div className="confirmation-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div></div><Button onClick={()=>go("products")}>Continue shopping</Button><small className="confirmation-help">Questions? Write to hello@bookish.co</small></div></main>;
}

function StyleGuide() {
  return <main className="container style-page"><div className="page-intro"><p className="eyebrow">Bookish system</p><h1>Style guide</h1><p>A warm, literary visual language built for thoughtful browsing.</p></div><section><h2>Colour palette</h2><div className="swatches">{[["Burgundy","#6B1E2E"],["Gold","#C9A24B"],["Paper","#F7F1E3"],["Parchment","#EADFC8"],["Ink","#2A1B1F"],["Sage","#7A8B6F"]].map(([n,c])=><div key={n}><i style={{background:c}} /><b>{n}</b><small>{c}</small></div>)}</div></section><section><h2>Typography</h2><div className="type-samples"><div><small>Display · Playfair Display</small><h1>Stories worth keeping.</h1></div><div><small>Editorial · Lora</small><h3>A beautiful book is a place to return to.</h3></div><div><small>Interface · Inter</small><p>Clear, warm, and quietly useful for every reader.</p></div></div></section><section><h2>Components</h2><div className="component-row"><Button>Primary button</Button><Button variant="secondary">Secondary button</Button><Button variant="ghost">Ghost button</Button><span className="tag">Fiction</span><Quantity value={1} onChange={()=>{}} /></div><div className="input-showcase"><label className="field"><span>Default input</span><input placeholder="Your name" /></label><label className="field success"><span>Success state</span><input value="hello@bookish.co" readOnly /><small>Lovely, you’re all set.</small></label><label className="field invalid"><span>Error state</span><input value="Not an email" readOnly /><small className="error-msg">Please enter a valid email.</small></label></div></section></main>;
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [wished, setWished] = useState<number[]>([2, 4]);
  const [cartIds, setCartIds] = useState<number[]>([1, 3]);
  const [quantities, setQuantities] = useState<Record<number, number>>({1:1,3:1});
  const [toast, setToast] = useState("");
  const go = (p: Page) => { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); };
  const notify = (message:string) => { setToast(message); window.setTimeout(()=>setToast(""),2600); };
  const addCart = (id:number) => { if (!cartIds.includes(id)) setCartIds([...cartIds,id]); setQuantities(q=>({...q,[id]:(q[id]||0)+1})); notify("Added to your cart"); };
  const toggleWish = (id:number) => { const removing=wished.includes(id); setWished(removing?wished.filter(x=>x!==id):[...wished,id]); notify(removing?"Removed from wishlist":"Saved to your wishlist"); };
  const cart = products.filter(p=>cartIds.includes(p.id));
  return <div className="app-shell">
    {page !== "confirmation" && <Header page={page} go={go} cartCount={cartIds.length} wishCount={wished.length} />}
    {page==="home"&&<Home go={go} wished={wished} toggleWish={toggleWish} addCart={addCart}/>}
    {page==="products"&&<Products wished={wished} toggleWish={toggleWish} addCart={addCart}/>}
    {page==="cart"&&<Cart cart={cart} quantities={quantities} setQty={(id,n)=>setQuantities({...quantities,[id]:n})} remove={id=>setCartIds(cartIds.filter(x=>x!==id))} clear={()=>setCartIds([])} go={go}/>}
    {page==="wishlist"&&<Wishlist wished={wished} toggleWish={toggleWish} addCart={addCart} go={go}/>}
    {page==="checkout"&&<Checkout cart={cart} quantities={quantities} go={go}/>}
    {page==="confirmation"&&<Confirmation cart={cart} quantities={quantities} go={go}/>}
    {page==="style"&&<StyleGuide/>}
    {page!=="home"&&page!=="confirmation"&&<Footer go={go}/>}
    {toast&&<div className="toast"><span><Icon name="check" size={16}/></span>{toast}</div>}
  </div>;
}
