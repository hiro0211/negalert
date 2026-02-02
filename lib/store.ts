import { create } from 'zustand';
import { FilterState } from './types';

interface FilterStore extends FilterState {
  setStatusFilter: (status: FilterState['statusFilter']) => void;
  setRatingFilter: (rating: FilterState['ratingFilter']) => void;
  setPeriodFilter: (period: FilterState['periodFilter']) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  statusFilter: 'all',
  ratingFilter: 'all',
  periodFilter: '30days',
  searchQuery: '',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...defaultFilters,
  setStatusFilter: (status) => set({ statusFilter: status }),
  setRatingFilter: (rating) => set({ ratingFilter: rating }),
  setPeriodFilter: (period) => set({ periodFilter: period }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set(defaultFilters),
}));
