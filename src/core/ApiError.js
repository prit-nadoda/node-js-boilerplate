const httpStatus = require('http-status');

const createApiError = (statusCode, message, isOperational = true, stack = '') => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  
  if (stack) {
    error.stack = stack;
  } else {
    Error.captureStackTrace(error, createApiError);
  }
  
  return error;
};

const ApiError = createApiError;

const BadRequestError = (message = 'Bad request', isOperational = true) => 
  createApiError(httpStatus.BAD_REQUEST, message, isOperational);

const UnauthorizedError = (message = 'Authentication required', isOperational = true) => 
  createApiError(httpStatus.UNAUTHORIZED, message, isOperational);

const ForbiddenError = (message = 'Forbidden', isOperational = true) => 
  createApiError(httpStatus.FORBIDDEN, message, isOperational);

const NotFoundError = (message = 'Resource not found', isOperational = true) => 
  createApiError(httpStatus.NOT_FOUND, message, isOperational);

const ConflictError = (message = 'Conflict', isOperational = true) => 
  createApiError(httpStatus.CONFLICT, message, isOperational);

const InternalServerError = (message = 'Internal server error', isOperational = false) => 
  createApiError(httpStatus.INTERNAL_SERVER_ERROR, message, isOperational);

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
}; 