import type { ErrorCode } from "./error.types.js";

export class ApplicationError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode | string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    code: ErrorCode | string = "INTERNAL_SERVER_ERROR",
    isOperational = true,
  ) {
    super(message);

    this.name = "ApplicationError";
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, ApplicationError);
  }
}
