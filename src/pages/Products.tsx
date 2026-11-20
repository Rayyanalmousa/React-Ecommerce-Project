import { useMemo, useState } from "react";
import { products } from "../data/store";
import { Button, Icon } from "../components/primitives";
import { EmptyState, ProductCard } from "../components/StoreComponents";

export function Products({
  wished,
  toggleWish,
  addCart,
}: {
  wished: number[];
  toggleWish: (id: number) => void;
  addCart: (id: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(40);
  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (!query || `${p.title} ${p.author}`.toLowerCase().includes(query.toLowerCase())) &&
            (!selected.length || selected.includes(p.category)) &&
            p.price <= maxPrice,
        )
        .sort((a, b) =>
          sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : a.id - b.id,
        ),
    [query, selected, sort, maxPrice],
  );
  const clear = () => {
    setQuery("");
    setSelected([]);
    setMaxPrice(40);
  };
  const FilterContent = () => (
    <div className="filters-content">
      <div className="filter-title">
        <h3>Filter by</h3>
        <button onClick={clear}>Clear all</button>
      </div>
      <fieldset>
        <legend>Category</legend>
        {["Fiction", "Classics", "Fantasy", "Self-Growth", "Kids", "Accessories"].map((c) => (
          <label className="check-row" key={c}>
            <input
              type="checkbox"
              checked={selected.includes(c)}
              onChange={() =>
                setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))
              }
            />
            <span>{c}</span>
            <small>{products.filter((p) => p.category === c).length}</small>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Price range</legend>
        <input
          className="range"
          type="range"
          min="10"
          max="40"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
        <div className="price-inputs">
          <span>$10</span>
          <span>to</span>
          <span>${maxPrice}</span>
        </div>
      </fieldset>
      <fieldset>
        <legend>Availability</legend>
        <label className="radio-row">
          <input type="radio" name="stock" defaultChecked /> In stock
        </label>
        <label className="radio-row">
          <input type="radio" name="stock" /> All items
        </label>
      </fieldset>
    </div>
  );
  return (
    <main className="container listing-page">
      <div className="page-intro">
        <p className="eyebrow">The collection</p>
        <h1>Books & lovely things</h1>
        <p>Stories to get lost in, and objects to make the journey sweeter.</p>
      </div>
      <div className="shop-toolbar">
        <label className="search-box">
          <Icon name="search" />
          <input
            placeholder="Search by title or author…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button className="filter-mobile" onClick={() => setFilterOpen(true)}>
          <Icon name="filter" /> Filters
        </button>
        <label className="select-box">
          <span>Sort by:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </label>
      </div>
      <div className="shop-layout">
        <aside className="filters">
          <FilterContent />
        </aside>
        <section className="results">
          <div className="results-line">
            <span>{filtered.length} thoughtful finds</span>
            <i />
          </div>
          {filtered.length ? (
            <div className="product-grid listing-grid">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  wished={wished.includes(p.id)}
                  onWish={() => toggleWish(p.id)}
                  onCart={() => addCart(p.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              kind="book"
              title="No books match your filters"
              text="Try widening your search, or clear the filters to browse every shelf."
              action={clear}
              label="Clear filters"
            />
          )}
        </section>
      </div>
      {filterOpen && (
        <div className="drawer-backdrop" onClick={() => setFilterOpen(false)}>
          <aside className="filter-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <h2>Filters</h2>
              <button className="icon-btn" onClick={() => setFilterOpen(false)}>
                <Icon name="x" />
              </button>
            </div>
            <FilterContent />
            <Button className="full" onClick={() => setFilterOpen(false)}>
              Show {filtered.length} results
            </Button>
          </aside>
        </div>
      )}
    </main>
  );
}
