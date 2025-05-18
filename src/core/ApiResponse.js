const httpStatus = require('http-status');

/**
 * Base API Response class
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {*} data - Response data
   */
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode >= 200 && statusCode < 300;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Send the response to the client
   * @param {object} res - Express response object
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp
    });
  }
}

/**
 * Success Response Class (200)
 * @extends ApiResponse
 */
class SuccessResponse extends ApiResponse {
  /**
   * @param {string} message - Success message
   * @param {*} data - Response data
   */
  constructor(message = 'Success', data = null) {
    super(httpStatus.OK, message, data);
  }
}

/**
 * Created Response Class (201)
 * @extends ApiResponse
 */
class CreatedResponse extends ApiResponse {
  /**
   * @param {string} message - Success message
   * @param {*} data - Response data
   */
  constructor(message = 'Created successfully', data = null) {
    super(httpStatus.CREATED, message, data);
  }
}

/**
 * No Content Response Class (204)
 * @extends ApiResponse
 */
class NoContentResponse extends ApiResponse {
  /**
   * @param {string} message - Success message
   */
  constructor(message = 'No content') {
    super(httpStatus.NO_CONTENT, message);
  }
}

/**
 * Bad Request Response Class (400)
 * @extends ApiResponse
 */
class BadRequestResponse extends ApiResponse {
  /**
   * @param {string} message - Error message
   * @param {*} errors - Validation errors
   */
  constructor(message = 'Bad request', errors = null) {
    super(httpStatus.BAD_REQUEST, message, errors);
    this.success = false;
  }
}

/**
 * Not Found Response Class (404)
 * @extends ApiResponse
 */
class NotFoundResponse extends ApiResponse {
  /**
   * @param {string} message - Error message
   */
  constructor(message = 'Resource not found') {
    super(httpStatus.NOT_FOUND, message);
    this.success = false;
  }
}

/**
 * Internal Server Error Response Class (500)
 * @extends ApiResponse
 */
class InternalErrorResponse extends ApiResponse {
  /**
   * @param {string} message - Error message
   */
  constructor(message = 'Internal server error') {
    super(httpStatus.INTERNAL_SERVER_ERROR, message);
    this.success = false;
  }
}

module.exports = {
  ApiResponse,
  SuccessResponse,
  CreatedResponse,
  NoContentResponse,
  BadRequestResponse,
  NotFoundResponse,
  InternalErrorResponse
}; 