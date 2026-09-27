import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { ApplicationError } from "../errors/index.js";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new ApplicationError(
        "Authentication token is required",
        401,
        "UNAUTHORIZED",
      );
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApplicationError(
        "Invalid authorization format",
        401,
        "UNAUTHORIZED",
      );
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new ApplicationError(
        "JWT secret is not configured",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    const decoded = jwt.verify(token, jwtSecret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.sub !== "string" ||
      typeof decoded.email !== "string" ||
      typeof decoded.role !== "string"
    ) {
      throw new ApplicationError(
        "Invalid authentication token",
        401,
        "UNAUTHORIZED",
      );
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
