import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Sale from "../models/Sale.js";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to CSV file
const csvPath = path.join(__dirname, "../truestate_assignment_dataset.csv");

function parseDateDDMMYYYY(str) {
  const [d, m, y] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const BATCH_SIZE = 2000;

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
}

async function importCsv() {
  await connectDB();
  await Sale.deleteMany({});
  console.log("Cleared old data");

  let batch = [];
  let totalInserted = 0;

  console.log("Starting CSV import...");

  const stream = fs.createReadStream(csvPath).pipe(csv());

  return new Promise((resolve, reject) => {
    stream
      .on("data", async (row) => {
        // Convert CSV row → MongoDB document
        const doc = {
          transactionId: Number(row["Transaction ID"]),
          date: parseDateDDMMYYYY(row["Date"]),
          customerId: row["Customer ID"],
          customerName: row["Customer Name"],
          phoneNumber: row["Phone Number"],
          gender: row["Gender"],
          age: Number(row["Age"]),
          customerRegion: row["Customer Region"],
          customerType: row["Customer Type"],
          productId: row["Product ID"],
          productName: row["Product Name"],
          brand: row["Brand"],
          productCategory: row["Product Category"],
          tags: row["Tags"] ? row["Tags"].split(",").map((t) => t.trim()) : [],
          quantity: Number(row["Quantity"]),
          pricePerUnit: Number(row["Price per Unit"]),
          discountPercentage: Number(row["Discount Percentage"]),
          totalAmount: Number(row["Total Amount"]),
          finalAmount: Number(row["Final Amount"]),
          paymentMethod: row["Payment Method"],
          orderStatus: row["Order Status"],
          deliveryType: row["Delivery Type"],
          storeId: row["Store ID"],
          storeLocation: row["Store Location"],
          salespersonId: row["Salesperson ID"],
          employeeName: row["Employee Name"],
        };

        batch.push(doc);

        // Batch insert when needed
        if (batch.length >= BATCH_SIZE) {
          stream.pause(); // <-- FIXED
          try {
            await Sale.insertMany(batch);
            totalInserted += batch.length;
            console.log(`Inserted ${totalInserted} records...`);
            batch = [];
          } catch (err) {
            return reject(err);
          }
          stream.resume(); // <-- FIXED
        }
      })
      .on("end", async () => {
        // insert remaining docs
        if (batch.length > 0) {
          await Sale.insertMany(batch);
          totalInserted += batch.length;
        }

        console.log(`🎉 Import finished. Total inserted: ${totalInserted}`);
        await mongoose.disconnect();
        resolve();
      })
      .on("error", reject);
  });
}

importCsv().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
