import type { RequestHandler } from "express";
import { ApplicationError } from "./application.error.js";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(
    new ApplicationError(
      `Route not found: ${req.method} ${req.originalUrl}`,
      404,
      "ROUTE_NOT_FOUND",
    ),
  );
};
