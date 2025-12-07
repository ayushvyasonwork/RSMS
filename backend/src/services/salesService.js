import Sale from '../models/Sale.js';
import mongoose from 'mongoose';

function parseCSVParam(param) {
  if (!param) return null;
  return param.split(',').map(p => p.trim()).filter(Boolean);
}

export async function fetchSales(query) {
  // Destructure and set defaults
  const {
    search,
    region,
    gender,
    ageMin,
    ageMax,
    category,
    tags,
    payment,
    startDate,
    endDate,
    sortBy = 'date',
    sortOrder = 'desc',
    page = 1,
    limit = 10
  } = query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.max(1, parseInt(limit, 10) || 10);

  const mongoQuery = {};

  // Search (full text-ish: text index or regex fallback)
  if (search) {
    // prefer text search if configured, fall back to regex
    mongoQuery.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { phoneNumber: { $regex: search, $options: 'i' } }
    ];
  }

  // Filters
  if (region) {
    const arr = parseCSVParam(region);
    if (arr) mongoQuery.customerRegion = { $in: arr };
  }
  if (gender) {
    const arr = parseCSVParam(gender);
    if (arr) mongoQuery.gender = { $in: arr };
  }
  if (ageMin || ageMax) {
    mongoQuery.age = {};
    if (ageMin) mongoQuery.age.$gte = parseInt(ageMin, 10);
    if (ageMax) mongoQuery.age.$lte = parseInt(ageMax, 10);
    // guard: if invalid range, remove age filter
    if (mongoQuery.age.$gte && mongoQuery.age.$lte && mongoQuery.age.$gte > mongoQuery.age.$lte) {
      delete mongoQuery.age;
    }
  }
  if (category) {
    const arr = parseCSVParam(category);
    if (arr) mongoQuery.productCategory = { $in: arr };
  }
  if (tags) {
    const arr = parseCSVParam(tags);
    if (arr) mongoQuery.tags = { $in: arr };
  }
  if (payment) {
    const arr = parseCSVParam(payment);
    if (arr) mongoQuery.paymentMethod = { $in: arr };
  }
  if (startDate || endDate) {
    mongoQuery.date = {};
    if (startDate) {
      const sd = new Date(startDate);
      if (!isNaN(sd)) mongoQuery.date.$gte = sd;
    }
    if (endDate) {
      const ed = new Date(endDate);
      if (!isNaN(ed)) {
        // include entire day
        ed.setHours(23,59,59,999);
        mongoQuery.date.$lte = ed;
      }
    }
    if (Object.keys(mongoQuery.date).length === 0) delete mongoQuery.date;
  }

  // Build sort
  const sortMap = {
    date: 'date',
    quantity: 'quantity',
    customerName: 'customerName'
  };
  const sortField = sortMap[sortBy] || 'date';
  const sortDir = (sortOrder === 'asc' ? 1 : -1);
  const sortObj = { [sortField]: sortDir };

  // Count and fetch
  const totalItems = await Sale.countDocuments(mongoQuery);
  const totalPages = Math.ceil(totalItems / pageSize);

  const data = await Sale.find(mongoQuery)
    .sort(sortObj)
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return {
    page: pageNum,
    limit: pageSize,
    totalItems,
    totalPages,
    data
  };
}

export async function fetchSaleById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // accept transactionId-string lookup as well
    return await Sale.findOne({ transactionId: id }).lean();
  }
  return await Sale.findById(id).lean();
}

export async function fetchFilters() {
  // Return unique values for dropdowns
  const regions = await Sale.distinct('customerRegion');
  const genders = await Sale.distinct('gender');
  const categories = await Sale.distinct('productCategory');
  const tags = await Sale.distinct('tags');
  const paymentMethods = await Sale.distinct('paymentMethod');

  return {
    regions: regions.filter(Boolean).sort(),
    genders: genders.filter(Boolean).sort(),
    categories: categories.filter(Boolean).sort(),
    tags: tags.filter(Boolean).sort(),
    paymentMethods: paymentMethods.filter(Boolean).sort()
  };
}
