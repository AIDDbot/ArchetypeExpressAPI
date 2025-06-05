export type ErrorDetails = Record<string, any>;

export class BaseError extends Error {
  public message: string;
  public statusCode: number;
  public errorCode: string;
  public details?: ErrorDetails;

  constructor(
    message: string,
    statusCode = 500,
    errorCode = "INTERNAL_ERROR",
    details?: ErrorDetails
  ) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 404, "NOT_FOUND", details);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 403, "FORBIDDEN", details);
  }
}

export class BusinessLogicError extends BaseError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 400, "BUSINESS_ERROR", details);
  }
}
