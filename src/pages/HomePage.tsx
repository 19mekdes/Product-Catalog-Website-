import React, { useState, useMemo } from 'react';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { products } from '../data/products';
import type { FilterState } from '../types';

const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    searchQuery: '',
    sortBy: 'price-asc'
  });

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query)
      );
    }

    
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Our Products</h1>
        <SearchBar 
          onSearch={(query) => setFilters(prev => ({ ...prev, searchQuery: query }))}
          initialValue={filters.searchQuery}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <FilterPanel filters={filters} onFilterChange={setFilters} />
        </aside>

        <main className="flex-1">
          <p className="text-gray-600 mb-4">
            {filteredProducts.length} products found
          </p>
          <ProductGrid products={filteredProducts} />
        </main>
      </div>
    </div>
  );
};

export default HomePage;