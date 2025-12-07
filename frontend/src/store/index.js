import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
