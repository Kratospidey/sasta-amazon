import { createContext, useContext, useState, ReactNode } from 'react';

export interface FilterState {
  searchTerm: string;
  selectedGenres: string[];
  priceRange: [number, number];
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating' | 'popular';
  showFreeOnly: boolean;
  showOnSaleOnly: boolean;
}

interface FilterContextType {
  filters: FilterState;
  setSearchTerm: (term: string) => void;
  toggleGenre: (genre: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  toggleFreeOnly: () => void;
  toggleOnSaleOnly: () => void;
  clearFilters: () => void;
}

const defaultFilters: FilterState = {
  searchTerm: '',
  selectedGenres: [],
  priceRange: [0, 100],
  sortBy: 'popular',
  showFreeOnly: false,
  showOnSaleOnly: false,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setSearchTerm = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };

  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      selectedGenres: prev.selectedGenres.includes(genre)
        ? prev.selectedGenres.filter(g => g !== genre)
        : [...prev.selectedGenres, genre]
    }));
  };

  const setPriceRange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  const setSortBy = (sort: FilterState['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy: sort }));
  };

  const toggleFreeOnly = () => {
    setFilters(prev => ({ ...prev, showFreeOnly: !prev.showFreeOnly }));
  };

  const toggleOnSaleOnly = () => {
    setFilters(prev => ({ ...prev, showOnSaleOnly: !prev.showOnSaleOnly }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider value={{
      filters,
      setSearchTerm,
      toggleGenre,
      setPriceRange,
      setSortBy,
      toggleFreeOnly,
      toggleOnSaleOnly,
      clearFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};