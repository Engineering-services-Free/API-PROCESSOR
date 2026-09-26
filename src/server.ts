import "dotenv/config";

import app from "./app.js"; 
import { connectDatabase } from "./db/connect.js";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    // Only start the HTTP server when running locally.
    // Vercel imports the Express app directly.
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;