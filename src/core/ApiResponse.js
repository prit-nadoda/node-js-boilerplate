const httpStatus = require('http-status');

const createResponse = (statusCode, message, data = null) => ({
  statusCode,
  message,
  data,
  success: statusCode >= 200 && statusCode < 300,
  timestamp: new Date().toISOString()
});

const sendResponse = (res, response) => {
  return res.status(response.statusCode).json({
    success: response.success,
    message: response.message,
    data: response.data,
    timestamp: response.timestamp
  });
};

const ApiResponse = createResponse;

const SuccessResponse = (message = 'Success', data = null) => 
  createResponse(httpStatus.OK, message, data);

const CreatedResponse = (message = 'Created successfully', data = null) => 
  createResponse(httpStatus.CREATED, message, data);

const NoContentResponse = (message = 'No content') => 
  createResponse(httpStatus.NO_CONTENT, message);

const BadRequestResponse = (message = 'Bad request', errors = null) => {
  const response = createResponse(httpStatus.BAD_REQUEST, message, errors);
  response.success = false;
  return response;
};

const NotFoundResponse = (message = 'Resource not found') => {
  const response = createResponse(httpStatus.NOT_FOUND, message);
  response.success = false;
  return response;
};

const InternalErrorResponse = (message = 'Internal server error') => {
  const response = createResponse(httpStatus.INTERNAL_SERVER_ERROR, message);
  response.success = false;
  return response;
};

const responses = {
  success: SuccessResponse,
  created: CreatedResponse,
  noContent: NoContentResponse,
  badRequest: BadRequestResponse,
  notFound: NotFoundResponse,
  internalError: InternalErrorResponse
};

module.exports = {
  ApiResponse,
  SuccessResponse,
  CreatedResponse,
  NoContentResponse,
  BadRequestResponse,
  NotFoundResponse,
  InternalErrorResponse,
  sendResponse,
  responses
}; 