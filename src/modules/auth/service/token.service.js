const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../../../config/config');
const { UnauthorizedError } = require('../../../core/ApiError');

// In-memory token blacklist for demonstration purposes
// In production, use Redis or a database
const tokenBlacklist = new Set();

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in the token
 * @param {string} secret - Secret key for signing
 * @param {string} expiration - Token expiration time
 * @returns {string} JWT token
 */
const generateToken = (payload, secret = config.jwt.secret, expiration = config.jwt.accessExpirationMinutes) => {
  return jwt.sign(payload, secret, {
    expiresIn: expiration,
  });
};

/**
 * Generate access token
 * @param {User} user - User object
 * @returns {string} Access token
 */
const generateAccessToken = (user) => {
  const payload = {
    sub: user._id,
    role: user.role,
    iat: moment().unix(),
  };
  
  return generateToken(payload, config.jwt.secret, config.jwt.accessExpirationMinutes);
};

/**
 * Generate refresh token
 * @param {User} user - User object
 * @returns {string} Refresh token
 */
const generateRefreshToken = (user) => {
  const payload = {
    sub: user._id,
    iat: moment().unix(),
    type: 'refresh',
  };
  
  return generateToken(payload, config.jwt.secret, config.jwt.refreshExpirationDays);
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  if (tokenBlacklist.has(token)) {
    throw new UnauthorizedError('Token has been revoked');
  }
  
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expired');
    }
    throw new UnauthorizedError('Invalid token');
  }
};

/**
 * Blacklist a token (for logout or token rotation)
 * @param {string} token - Token to blacklist
 */
const blacklistToken = (token) => {
  tokenBlacklist.add(token);
  
  // In a real implementation, you'd also want to add an expiry to the blacklisted token
  // based on the token's original expiry. This would require a more sophisticated
  // storage mechanism like Redis.
};

/**
 * Generate auth tokens for a user
 * @param {User} user - User object
 * @returns {Object} Access and refresh tokens
 */
const generateAuthTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  return {
    access: {
      token: accessToken,
      expires: moment().add(config.jwt.accessExpirationMinutes, 'minutes').toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: moment().add(config.jwt.refreshExpirationDays, 'days').toDate(),
    },
  };
};

module.exports = {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  blacklistToken,
  generateAuthTokens,
}; 