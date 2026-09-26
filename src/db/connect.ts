import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

const MONGO_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, MONGO_OPTIONS);

    isConnected = true;

    console.log("MongoDB connected successfully");
    console.log(`MongoDB pool max size: ${MONGO_OPTIONS.maxPoolSize}`);
  } catch (error) {
    isConnected = false;

    console.error("MongoDB connection failed:", error);

    throw error;
  }
};
