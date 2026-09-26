import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

const MONGO_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDatabase = async (): Promise<typeof mongoose> => {
  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Connection is already in progress
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(MONGODB_URI, MONGO_OPTIONS)
    .then((connection) => {
      console.log("MongoDB connected successfully");
      console.log(`MongoDB pool max size: ${MONGO_OPTIONS.maxPoolSize}`);

      return connection;
    })
    .catch((error) => {
      connectionPromise = null;

      console.error("MongoDB connection failed:", error);

      throw error;
    });

  return connectionPromise;
};
