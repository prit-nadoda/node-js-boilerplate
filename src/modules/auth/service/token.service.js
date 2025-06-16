const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../../../config/config');
const { UnauthorizedError } = require('../../../core/ApiError');

// In-memory token blacklist for demonstration purposes
// In production, use Redis or a database
const tokenBlacklist = new Set();

/**
 * Parse time string to seconds
 * @param {string} timeStr - Time string (e.g. '15m', '7d')
 * @returns {number} Seconds
 */
const parseTimeToSeconds = (timeStr) => {
  const unit = timeStr.slice(-1);
  const value = parseInt(timeStr.slice(0, -1), 10);
  
  switch (unit) {
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return value;
  }
};

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in the token
 * @param {string} secret - Secret key for signing
 * @param {string} expiration - Token expiration time
 * @returns {string} JWT token
 */
const generateToken = (userId, expires, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: expires,
  };
  return jwt.sign(payload, secret);
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
    iat: Math.floor(Date.now() / 1000),
  };
  
  const expiresIn = parseTimeToSeconds(config.jwt.accessExpirationMinutes);
  return generateToken(user._id, Math.floor(Date.now() / 1000) + expiresIn, config.jwt.secret);
};

/**
 * Generate refresh token
 * @param {User} user - User object
 * @returns {string} Refresh token
 */
const generateRefreshToken = (user) => {
  const payload = {
    sub: user._id,
    iat: Math.floor(Date.now() / 1000),
    type: 'refresh',
  };
  
  const expiresIn = parseTimeToSeconds(config.jwt.refreshExpirationDays);
  return generateToken(user._id, Math.floor(Date.now() / 1000) + expiresIn, config.jwt.refreshSecret);
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token - JWT token
 * @param {string} secret - Secret key for verification
 * @returns {Object} Decoded token payload
 */
const verifyToken = async (token, secret = config.jwt.secret) => {
  try {
    const payload = jwt.verify(token, secret);
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw UnauthorizedError('Token has been revoked');
    }
    return payload;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw UnauthorizedError('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw UnauthorizedError('Invalid token');
    }
    throw error;
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
  const accessTokenExpires = Math.floor(Date.now() / 1000) + parseTimeToSeconds(config.jwt.accessExpirationMinutes);
  const refreshTokenExpires = Math.floor(Date.now() / 1000) + parseTimeToSeconds(config.jwt.refreshExpirationDays);
  
  const accessToken = generateToken(user._id, accessTokenExpires, config.jwt.secret);
  const refreshToken = generateToken(user._id, refreshTokenExpires, config.jwt.refreshSecret);
  
  return {
    access: {
      token: accessToken,
      expires: new Date(accessTokenExpires * 1000),
    },
    refresh: {
      token: refreshToken,
      expires: new Date(refreshTokenExpires * 1000),
    },
  };
};

const isTokenBlacklisted = async (token) => {
  return tokenBlacklist.has(token);
};

module.exports = {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  blacklistToken,
  generateAuthTokens,
  isTokenBlacklisted,
}; 