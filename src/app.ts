import express from "express"; 
import { bucket } from "./db/firebase";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

// Firebase Storage health check
app.get("/api/storage-health", async (_req, res) => {
  try {
    const [exists] = await bucket.exists();

    res.status(exists ? 200 : 500).json({
      success: exists,
      service: "Firebase Storage",
      bucket: bucket.name,
    });
  } catch (error) {
    console.error("Firebase Storage check failed:", error);

    res.status(500).json({
      success: false,
      service: "Firebase Storage",
    });
  }
});

export default app;
