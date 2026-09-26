import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { ApplicationError } from "../errors/application.error.js";

export const validate = (
  schema: ZodType,
  source: "body" | "params" | "query",
): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || source,
        message: issue.message,
      }));

      next(
        new ApplicationError(
          "Invalid request data",
          400,
          "VALIDATION_ERROR",
          true,
          details,
        ),
      );

      return;
    }

    req[source] = result.data;

    next();
  };
};