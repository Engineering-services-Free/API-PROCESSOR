import type { NextFunction, Response } from "express";

import { ApplicationError } from "../errors/index.js";
import type { AuthenticatedRequest } from "./auth.middleware.js";

export const authorize = (...allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): void => {
    try {
      if (!req.user) {
        throw new ApplicationError(
          "Authentication is required",
          401,
          "UNAUTHORIZED",
        );
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ApplicationError(
          "You do not have permission to perform this action",
          403,
          "FORBIDDEN",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
