const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config/config');
const { UnauthorizedError, ForbiddenError } = require('../core/ApiError');
const tokenService = require('../modules/auth/service/token.service');

/**
 * Middleware to authenticate using JWT token
 */
const auth = () => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw UnauthorizedError('Missing or invalid authentication token');
    }

    const payload = await tokenService.verifyToken(token);
    
    if (await tokenService.isTokenBlacklisted(token)) {
      throw UnauthorizedError('Token has been revoked');
    }

    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw UnauthorizedError('Token expired');
    }

    if (!payload.sub) {
      throw UnauthorizedError('Invalid token');
    }

    req.user = payload;
    next();
  } catch (error) {
    if (error.statusCode) {
      next(error);
    } else {
      next(UnauthorizedError('Authentication failed'));
    }
  }
};

/**
 * Middleware to check if user has required roles
 * @param {...string} roles - Required roles
 * @returns {Function} Express middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw UnauthorizedError('User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw ForbiddenError('Insufficient permissions');
    }

    next();
  };
};

module.exports = {
  auth,
  authorize,
}; 