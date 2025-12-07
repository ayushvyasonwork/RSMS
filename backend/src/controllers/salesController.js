import * as service from '../services/salesService.js';

export async function getSales(req, res) {
  try {
    const result = await service.fetchSales(req.query);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getSaleById(req, res) {
  try {
    const id = req.params.id;
    const sale = await service.fetchSaleById(id);
    if (!sale) return res.status(404).json({ error: 'Not found' });
    res.json(sale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getFilters(req, res) {
  try {
    const filters = await service.fetchFilters();
    res.json(filters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
