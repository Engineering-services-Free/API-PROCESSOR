import type { ErrorCode, ErrorDetail } from "./error.types.js";

export class ApplicationError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode | string;
  public readonly isOperational: boolean;
  public readonly details?: ErrorDetail[];

  constructor(
    message: string,
    statusCode = 500,
    code: ErrorCode | string = "INTERNAL_SERVER_ERROR",
    isOperational = true,
    details?: ErrorDetail[],
  ) {
    super(message);

    this.name = "ApplicationError";
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, ApplicationError);
  }
}
