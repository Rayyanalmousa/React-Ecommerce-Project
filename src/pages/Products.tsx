import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categoryNames, products } from "../data/store";
import { useStore } from "../context/StoreContext";
import { Button, Icon } from "../components/primitives";
import { EmptyState, ProductCard } from "../components/StoreComponents";
import {
  filterProducts,
  PRICE_MAX,
  PRICE_MIN,
  type SortOption,
} from "../utils/filterProducts";

type FiltersPanelProps = {
  selected: string[];
  maxPrice: number;
  onToggleCategory: (category: string) => void;
  onMaxPriceChange: (price: number) => void;
  onClear: () => void;
};

function FiltersPanel({
  selected,
  maxPrice,
  onToggleCategory,
  onMaxPriceChange,
  onClear,
}: FiltersPanelProps) {
  return (
    <div className="filters-content">
      <div className="filter-title">
        <h3>Filter by</h3>
        <button type="button" onClick={onClear}>
          Clear all
        </button>
      </div>
      <fieldset>
        <legend>Category</legend>
        {categoryNames.map((category) => (
          <label className="check-row" key={category}>
            <input
              type="checkbox"
              checked={selected.includes(category)}
              onChange={() => onToggleCategory(category)}
            />
            <span>{category}</span>
            <small>{products.filter((product) => product.category === category).length}</small>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Price range</legend>
        <input
          className="range"
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={maxPrice}
          aria-label="Maximum price"
          onChange={(event) => onMaxPriceChange(Number(event.target.value))}
        />
        <div className="price-inputs">
          <span>${PRICE_MIN}</span>
          <span>to</span>
          <span>${maxPrice}</span>
        </div>
      </fieldset>
    </div>
  );
}

export function Products() {
  const { isWished, toggleWishlist, addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [filterOpen, setFilterOpen] = useState(false);

  // The selected categories live in the URL (?category=Fiction) so links from
  // the home page and footer can open a pre-filtered list.
  const selected = useMemo(
    () => searchParams.getAll("category").filter((name) => categoryNames.includes(name)),
    [searchParams],
  );

  const filtered = useMemo(
    () => filterProducts(products, { query, categories: selected, maxPrice, sort }),
    [query, selected, maxPrice, sort],
  );

  const toggleCategory = (category: string) => {
    const next = selected.includes(category)
      ? selected.filter((name) => name !== category)
      : [...selected, category];
    const params = new URLSearchParams();
    next.forEach((name) => params.append("category", name));
    setSearchParams(params, { replace: true });
  };

  const clear = () => {
    setQuery("");
    setSort("featured");
    setMaxPrice(PRICE_MAX);
    setSearchParams({}, { replace: true });
  };

  const panelProps: FiltersPanelProps = {
    selected,
    maxPrice,
    onToggleCategory: toggleCategory,
    onMaxPriceChange: setMaxPrice,
    onClear: clear,
  };

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
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <button type="button" className="filter-mobile" onClick={() => setFilterOpen(true)}>
          <Icon name="filter" /> Filters
        </button>
        <label className="select-box">
          <span>Sort by:</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </label>
      </div>
      <div className="shop-layout">
        <aside className="filters">
          <FiltersPanel {...panelProps} />
        </aside>
        <section className="results">
          <div className="results-line">
            <span>{filtered.length} thoughtful finds</span>
            <i />
          </div>
          {filtered.length ? (
            <div className="product-grid listing-grid">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  wished={isWished(product.id)}
                  onWish={() => toggleWishlist(product.id)}
                  onCart={() => addToCart(product.id)}
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
          <aside className="filter-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              <h2>Filters</h2>
              <button
                type="button"
                className="icon-btn"
                aria-label="Close filters"
                onClick={() => setFilterOpen(false)}
              >
                <Icon name="x" />
              </button>
            </div>
            <FiltersPanel {...panelProps} />
            <Button className="full" onClick={() => setFilterOpen(false)}>
              Show {filtered.length} results
            </Button>
          </aside>
        </div>
      )}
    </main>
  );
}