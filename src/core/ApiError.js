const httpStatus = require('http-status');

/**
 * Base class for API Errors
 * @extends Error
 */
class ApiError extends Error {
  /**
   * Creates an API error.
   * @param {number} statusCode - HTTP status code of error
   * @param {string} message - Error message
   * @param {boolean} isOperational - Whether the error is operational or programming
   * @param {string} stack - Error stack trace
   */
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Class for Bad Request Error (400)
 * @extends ApiError
 */
class BadRequestError extends ApiError {
  constructor(message = 'Bad request', isOperational = true) {
    super(httpStatus.BAD_REQUEST, message, isOperational);
  }
}

/**
 * Class for Unauthorized Error (401)
 * @extends ApiError
 */
class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required', isOperational = true) {
    super(httpStatus.UNAUTHORIZED, message, isOperational);
  }
}

/**
 * Class for Forbidden Error (403)
 * @extends ApiError
 */
class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', isOperational = true) {
    super(httpStatus.FORBIDDEN, message, isOperational);
  }
}

/**
 * Class for Not Found Error (404)
 * @extends ApiError
 */
class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', isOperational = true) {
    super(httpStatus.NOT_FOUND, message, isOperational);
  }
}

/**
 * Class for Conflict Error (409)
 * @extends ApiError
 */
class ConflictError extends ApiError {
  constructor(message = 'Conflict', isOperational = true) {
    super(httpStatus.CONFLICT, message, isOperational);
  }
}

/**
 * Class for Internal Server Error (500)
 * @extends ApiError
 */
class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', isOperational = false) {
    super(httpStatus.INTERNAL_SERVER_ERROR, message, isOperational);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
}; 