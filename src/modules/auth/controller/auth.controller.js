const authService = require('../service/auth.service');
const tokenService = require('../service/token.service');
const catchAsync = require('../../../utils/catchAsync');
const { SuccessResponse, CreatedResponse } = require('../../../core/ApiResponse');

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 */
const register = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.register(req.body);
  new CreatedResponse('Registration successful', { user, tokens }).send(res);
});

/**
 * Login with email and password
 * @route POST /api/v1/auth/login
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.login(email, password);
  new SuccessResponse('Login successful', { user, tokens }).send(res);
});

/**
 * Logout the user
 * @route POST /api/v1/auth/logout
 */
const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  new SuccessResponse('Logout successful').send(res);
});

/**
 * Refresh auth tokens
 * @route POST /api/v1/auth/refresh-tokens
 */
const refreshTokens = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAuth(refreshToken);
  new SuccessResponse('Token refresh successful', { tokens }).send(res);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
}; 