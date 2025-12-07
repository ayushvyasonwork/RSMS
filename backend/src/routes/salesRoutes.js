import express from 'express';
import { getSales, getSaleById, getFilters } from '../controllers/salesController.js';
const router = express.Router();
router.get('/sales', getSales);
router.get('/sales/:id', getSaleById);
router.get('/filters', getFilters);
export default router;

