import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  filters: {
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    payment: [],
    ageMin: '',
    ageMax: '',
    startDate: '',
    endDate: '',
  },
  sorting: {
    sortBy: 'date',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 10,
  },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      // Reset to page 1 when search changes
      state.pagination.page = 1;
    },
    
    toggleFilter: (state, action) => {
      const { key, value } = action.payload;
      
      // Handle array filters (regions, genders, categories, tags, payment)
      if (Array.isArray(state.filters[key])) {
        const arr = state.filters[key];
        const index = arr.indexOf(value);
        
        if (index !== -1) {
          // Remove if exists
          arr.splice(index, 1);
        } else {
          // Add if doesn't exist
          arr.push(value);
        }
      }
      
      // Reset to page 1 when filters change
      state.pagination.page = 1;
    },
    
    setFilterValue: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      
      // Reset to page 1 when filters change
      state.pagination.page = 1;
    },
    
    setMultipleFilters: (state, action) => {
      // For setting multiple filter values at once (like date ranges)
      state.filters = { ...state.filters, ...action.payload };
      
      // Reset to page 1 when filters change
      state.pagination.page = 1;
    },
    
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      if (sortBy !== undefined) state.sorting.sortBy = sortBy;
      if (sortOrder !== undefined) state.sorting.sortOrder = sortOrder;
      
      // Reset to page 1 when sorting changes
      state.pagination.page = 1;
    },
    
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // Reset to page 1 when limit changes
    },
    
    resetAllFilters: (state) => {
      state.search = '';
      state.filters = {
        regions: [],
        genders: [],
        categories: [],
        tags: [],
        payment: [],
        ageMin: '',
        ageMax: '',
        startDate: '',
        endDate: '',
      };
      state.sorting = {
        sortBy: 'date',
        sortOrder: 'desc',
      };
      state.pagination.page = 1;
    },
  },
});

export const {
  setSearch,
  toggleFilter,
  setFilterValue,
  setMultipleFilters,
  setSorting,
  setPage,
  setLimit,
  resetAllFilters,
} = filtersSlice.actions;

// Selectors
export const selectSearch = (state) => state.filters.search;
export const selectFilters = (state) => state.filters.filters;
export const selectSorting = (state) => state.filters.sorting;
export const selectPagination = (state) => state.filters.pagination;
export const selectAllFilterState = (state) => state.filters;

export default filtersSlice.reducer;
