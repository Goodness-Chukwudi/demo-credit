import HttpStatus from 'http-status-codes';
import { ErrorMessage } from '../../data/interfaces/interface';

abstract class AppError extends Error {
  status_code: number;
  custom_code: number | undefined;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

class InternalServerError extends AppError {
  constructor(error?: ErrorMessage) {
    super(error?.message || "Internal server error. Please try again later or contact support if issue persists");
    this.status_code = HttpStatus.INTERNAL_SERVER_ERROR;
    this.custom_code = error?.code;
  }
}

class UnprocessableEntityError extends AppError {
  constructor(error: ErrorMessage) {
    super(error.message);
    this.status_code = HttpStatus.UNPROCESSABLE_ENTITY;
    this.custom_code = error.code;
  }
}

class BadRequestError extends AppError {
  constructor(error: ErrorMessage) {
    super(error.message);
    this.status_code = HttpStatus.BAD_REQUEST;
    this.custom_code = error.code;
  }
}

class UnauthorizedError extends AppError {
  constructor(error: ErrorMessage) {
    super(error.message);
    this.status_code = HttpStatus.UNAUTHORIZED;
    this.custom_code = error.code;
  }
}

class ForbiddenError extends AppError {
  constructor(error: ErrorMessage) {
    super(error.message);
    this.status_code = HttpStatus.FORBIDDEN;
    this.custom_code = error.code;
  }
}

class NotFoundError extends AppError {
  constructor(error: ErrorMessage) {
    super(error.message);
    this.status_code = HttpStatus.NOT_FOUND;
    this.custom_code = error.code;
  }
}

export {
    AppError,
    InternalServerError,
    UnprocessableEntityError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError
}