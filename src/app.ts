import express from "express";

import { bucket } from "./db/firebase";
import { errorHandler, notFoundHandler } from "./common/errors/index.js";
import { databaseMiddleware } from "./common/middleware/database.middleware.js";

const app = express();

app.use(express.json());

/*
 * Infrastructure routes
 * These do not require MongoDB.
 */
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

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

/*
 * Database connection middleware
 *
 * Everything below this point can safely use MongoDB.
 */
app.use(databaseMiddleware);

// Application routes go here
// app.use("/api/services", serviceRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/blogs", blogRoutes);
// app.use("/api/clients", clientRoutes);

/*
 * Must be after all routes
 */
app.use(notFoundHandler);

/*
 * Must be the LAST middleware
 */
app.use(errorHandler);

export default app;
