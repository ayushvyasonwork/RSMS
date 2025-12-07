import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI is missing in .env file");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(uri, {
      // No need for extra options in Mongoose v7+
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }

  // Handle unexpected disconnects
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected");
  });

  // Handle connection errors
  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err.message);
  });

  // Optional: Close DB gracefully when Node process stops
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed due to app termination");
    process.exit(0);
  });
}
