import type { RequestHandler } from "express";
import { connectDatabase } from "../../db/connect.js";

export const databaseMiddleware: RequestHandler = async (_req, _res, next) => {
  if (_req.path.startsWith("/api/v1/uploads/")) {
    next();
    return;
  }

  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
};
