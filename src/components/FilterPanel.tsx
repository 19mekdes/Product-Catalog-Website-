import React from 'react';
import type { FilterState, SortOption } from '../types';
import { products } from '../data/products';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const categories = ['All', ...new Set(products.map(p => p.category))];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
];

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: category === 'All' ? null : category
    });
  };

  const handleSortChange = (sortBy: SortOption) => {
    onFilterChange({ ...filters, sortBy });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold text-gray-800 mb-4">Filters</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center">
              <input
                type="radio"
                id={`category-${category}`}       
                name="category"                     
                value={category}
                checked={filters.category === category || (category === 'All' && !filters.category)}
                onChange={() => handleCategoryChange(category)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label 
                htmlFor={`category-${category}`}    
                className="ml-2 text-sm text-gray-600 cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Sort By</h4>
        <select
          id="sort-select"                          
          name="sortBy"                             
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;