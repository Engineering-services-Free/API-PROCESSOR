import type { ErrorRequestHandler } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ZodError } from "zod";

import { ApplicationError } from "./application.error.js";
import type { ErrorDetail, ErrorResponse } from "./error.types.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error("Application error:", error);

  if (error instanceof jwt.TokenExpiredError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication token has expired",
      },
    };

    res.status(401).json(response);

    return;
  }

  if (error instanceof jwt.JsonWebTokenError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid authentication token",
      },
    };

    res.status(401).json(response);

    return;
  }

  // Application Error

  if (error instanceof ApplicationError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details && {
          details: error.details,
        }),
      },
    };

    res.status(error.statusCode).json(response);

    return;
  }

  // Zod validation errors

  if (error instanceof ZodError) {
    const details: ErrorDetail[] = error.issues.map((issue) => ({
      field: issue.path.join(".") || "request",
      message: issue.message,
    }));

    const response: ErrorResponse = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details,
      },
    };

    res.status(400).json(response);

    return;
  }

  // Mongoose Validation Error

  if (error instanceof mongoose.Error.ValidationError) {
    const details: ErrorDetail[] = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));

    const response: ErrorResponse = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details,
      },
    };

    res.status(400).json(response);

    return;
  }

  // Invalid MongoDB ObjectId

  if (error instanceof mongoose.Error.CastError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: "INVALID_ID",
        message: "Invalid resource ID",
      },
    };

    res.status(400).json(response);

    return;
  }

  // MongoDB Duplicate Key

  if (error instanceof Error && "code" in error && error.code === 11000) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: "DUPLICATE_RESOURCE",
        message: "A resource with the same value already exists",
      },
    };

    res.status(409).json(response);

    return;
  }

  // Unknown / Unexpected Error

  const response: ErrorResponse = {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  };

  res.status(500).json(response);
};
