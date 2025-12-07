import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  filters: {
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    payment: [],
    ageRanges: [], // Store selected age range strings like ["20-30", "30-40"]
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
      
      // Handle array filters (regions, genders, categories, tags, payment, ageRanges)
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
        
        // Special handling for age ranges - convert to ageMin/ageMax
        if (key === 'ageRanges') {
          const ranges = state.filters.ageRanges;
          if (ranges.length === 0) {
            state.filters.ageMin = '';
            state.filters.ageMax = '';
          } else {
            // Find the minimum ageMin and maximum ageMax from all selected ranges
            let minAge = Infinity;
            let maxAge = -Infinity;
            
            ranges.forEach(range => {
              if (range === '<20') {
                minAge = Math.min(minAge, 0);
                maxAge = Math.max(maxAge, 19);
              } else if (range === '40+') {
                minAge = Math.min(minAge, 40);
                maxAge = Math.max(maxAge, 200); // Use a large number for max
              } else {
                // Parse ranges like "20-30"
                const [min, max] = range.split('-').map(Number);
                minAge = Math.min(minAge, min);
                maxAge = Math.max(maxAge, max);
              }
            });
            
            state.filters.ageMin = minAge === Infinity ? '' : String(minAge);
            state.filters.ageMax = maxAge === -Infinity ? '' : String(maxAge);
          }
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
        ageRanges: [],
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
