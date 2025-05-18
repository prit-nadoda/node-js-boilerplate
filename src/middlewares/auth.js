const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config/config');
const { UnauthorizedError, ForbiddenError } = require('../core/ApiError');
const catchAsync = require('../utils/catchAsync');

/**
 * Middleware to authenticate using JWT token
 */
const auth = catchAsync(async (req, res, next) => {
  // Get the token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authentication token');
  }

  const token = authHeader.substring(7);
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Add user data to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expired');
    }
    
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid token');
    }
    
    throw new UnauthorizedError('Authentication failed');
  }
});

/**
 * Middleware to check if user has required roles
 * @param {...string} roles - Required roles
 * @returns {Function} Express middleware
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }
  
  if (!roles.includes(req.user.role)) {
    throw new ForbiddenError('Insufficient permissions');
  }
  
  next();
};

module.exports = {
  auth,
  authorize,
}; 