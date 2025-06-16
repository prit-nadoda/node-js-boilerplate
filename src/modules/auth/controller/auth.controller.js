const httpStatus = require('http-status');
const authService = require('../service/auth.service');
const { sendResponse, responses } = require('../../../core/ApiResponse');
const catchAsync = require('../../../utils/catchAsync');

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 */
const register = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.register(req.body);
  sendResponse(res, responses.created('User registered successfully', { user, tokens }));
});

/**
 * Login with email and password
 * @route POST /api/v1/auth/login
 */
const login = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.login(req.body.email, req.body.password);
  sendResponse(res, responses.success('Login successful', { user, tokens }));
});

/**
 * Logout
 * @route POST /api/v1/auth/logout
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  sendResponse(res, responses.success('Logout successful'));
});

/**
 * Refresh auth tokens
 * @route POST /api/v1/auth/refresh-tokens
 */
const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  sendResponse(res, responses.success('Tokens refreshed successfully', { tokens }));
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
}; 