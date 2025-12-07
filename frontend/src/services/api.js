// src/services/api.js
import axios from 'axios';
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  timeout: 15000,
});

export const getSales = (params) => api.get('/sales', { params });

export const getSaleById = (id) => api.get(`/sales/${id}`);

export const getFilters = () => api.get('/filters');

export default api;