# Redux Implementation Guide

## Overview
The application now uses Redux Toolkit to manage global state for filters, sorting, search, and pagination.

## Architecture

### Store Structure
```
src/
  store/
    index.js                    # Redux store configuration
    slices/
      filtersSlice.js          # Filters, sorting, search, pagination state
```

### State Schema
```javascript
{
  filters: {
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
    }
  }
}
```

## Available Actions

### Search
- `setSearch(value)` - Update search query and reset to page 1

### Filters
- `toggleFilter({ key, value })` - Toggle array-based filters (regions, genders, etc.)
- `setFilterValue({ key, value })` - Set a specific filter value
- `setMultipleFilters(object)` - Set multiple filter values at once (for date ranges)

### Sorting
- `setSorting({ sortBy, sortOrder })` - Update sorting and reset to page 1

### Pagination
- `setPage(pageNumber)` - Navigate to specific page
- `setLimit(limitNumber)` - Change items per page (resets to page 1)

### Reset
- `resetAllFilters()` - Reset all filters, search, sorting to initial state

## Selectors
- `selectSearch` - Get search query
- `selectFilters` - Get all filter values
- `selectSorting` - Get sorting configuration
- `selectPagination` - Get pagination state
- `selectAllFilterState` - Get entire filters state

## Component Updates

### index.jsx (Main Page)
- Uses Redux selectors to read state
- Uses `dispatch` to update search and pagination
- Passes filter values to child components

### TopBar.jsx
- Uses Redux dispatch for all filter operations
- Handles reset functionality
- Manages sorting changes

### Key Benefits
1. **Centralized State** - All filter/sort/search state in one place
2. **Automatic Page Reset** - Page automatically resets to 1 when filters change
3. **No Prop Drilling** - Components can access state directly via Redux
4. **Persistence Ready** - Easy to add state persistence if needed
5. **Debugging** - Redux DevTools support for time-travel debugging

## Usage Example

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { setSearch, selectFilters } from '../store/slices/filtersSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  
  const handleSearch = (query) => {
    dispatch(setSearch(query));
  };
  
  return <div>...</div>;
}
```

## Future Enhancements
- Add state persistence with localStorage
- Add filter presets/bookmarks
- Add undo/redo functionality
- Add loading states to Redux
