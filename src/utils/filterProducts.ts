import type { Product } from "../data/store";

export type SortOption = "featured" | "low" | "high";

export const PRICE_MIN = 10;
export const PRICE_MAX = 40;

export type ProductFilters = {
  query: string;
  categories: string[];
  maxPrice: number;
  sort: SortOption;
};

export const DEFAULT_FILTERS: ProductFilters = {
  query: "",
  categories: [],
  maxPrice: PRICE_MAX,
  sort: "featured",
};

export function filterProducts(list: Product[], filters: ProductFilters): Product[] {
  const query = filters.query.trim().toLowerCase();

  return list
    .filter((product) => {
      const matchesQuery =
        !query || `${product.title} ${product.author}`.toLowerCase().includes(query);
      const matchesCategory =
        filters.categories.length === 0 || filters.categories.includes(product.category);
      const matchesPrice = product.price <= filters.maxPrice;
      return matchesQuery && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (filters.sort === "low") return a.price - b.price;
      if (filters.sort === "high") return b.price - a.price;
      return a.id - b.id;
    });
}