import type { RequestHandler } from "express";
import { connectDatabase } from "../../db/connect.js";

export const databaseMiddleware: RequestHandler = async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
};
