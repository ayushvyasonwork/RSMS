import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema(
  {
    // CSV: "1", "2", ...
    transactionId: {
      type: Number,
      index: true,
    },

    // CSV format: "23-03-2023" -> must be parsed as Date when importing
    date: {
      type: Date,
    },

    customerId: String,
    customerName: String,
    phoneNumber: String,
    gender: String,
    age: Number,
    customerRegion: String,
    customerType: String,

    productId: String,
    productName: String,
    brand: String,
    productCategory: String,

    // CSV: "organic,skincare" -> import as ["organic","skincare"]
    tags: [String],

    quantity: Number,
    pricePerUnit: Number,
    discountPercentage: Number,
    totalAmount: Number,
    finalAmount: Number,

    paymentMethod: String,
    orderStatus: String,
    deliveryType: String,
    storeId: String,
    storeLocation: String,
    salespersonId: String,
    employeeName: String,
  },
  { collection: 'sales' }
);

// for search on name + phone
SaleSchema.index({ customerName: 'text', phoneNumber: 'text' });

export default mongoose.model('Sale', SaleSchema);
