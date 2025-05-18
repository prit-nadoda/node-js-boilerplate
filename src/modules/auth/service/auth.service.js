const userService = require('../../user/service/user.service');
const tokenService = require('./token.service');
const { BadRequestError, UnauthorizedError } = require('../../../core/ApiError');

/**
 * Authentication Service
 */
class AuthService {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Auth tokens and user data
   * @throws {BadRequestError} If email or password is invalid
   */
  async login(email, password) {
    const user = await userService.getUserByEmail(email);
    
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new BadRequestError('Incorrect email or password');
    }
    
    const tokens = tokenService.generateAuthTokens(user);
    
    return {
      user,
      tokens,
    };
  }

  /**
   * Logout the user
   * @param {string} refreshToken - User's refresh token
   * @returns {Promise<void>}
   */
  async logout(refreshToken) {
    // Blacklist the refresh token
    tokenService.blacklistToken(refreshToken);
  }

  /**
   * Refresh auth tokens
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New auth tokens
   * @throws {UnauthorizedError} If refresh token is invalid
   */
  async refreshAuth(refreshToken) {
    try {
      const refreshTokenDoc = tokenService.verifyToken(refreshToken);
      const userId = refreshTokenDoc.sub;
      
      // Check if user exists
      const user = await userService.getUserById(userId);
      
      if (!user) {
        throw new UnauthorizedError('User not found');
      }
      
      // Blacklist the old refresh token to prevent reuse
      tokenService.blacklistToken(refreshToken);
      
      // Generate new tokens
      const tokens = tokenService.generateAuthTokens(user);
      
      return tokens;
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user and auth tokens
   */
  async register(userData) {
    const user = await userService.createUser(userData);
    const tokens = tokenService.generateAuthTokens(user);
    
    return {
      user,
      tokens,
    };
  }
}

module.exports = new AuthService(); 