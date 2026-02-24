export interface Product {
  title: string | undefined;
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating-desc';

export interface FilterState {
  category: string | null;
  searchQuery: string;
  sortBy: SortOption;
}