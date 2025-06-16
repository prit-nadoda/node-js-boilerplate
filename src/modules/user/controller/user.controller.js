const httpStatus = require('http-status');
const userService = require('../service/user.service');
const { pick } = require('../../../middlewares/validate');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse, responses } = require('../../../core/ApiResponse');

/**
 * Create a new user
 * @route POST /api/v1/users
 */
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  sendResponse(res, responses.created('User created successfully', user));
});

/**
 * Get all users
 * @route GET /api/v1/users
 */
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'email', 'role', 'isEmailVerified']);
  const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  sendResponse(res, responses.success('Users retrieved successfully', result));
});

/**
 * Get user by id
 * @route GET /api/v1/users/:userId
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  sendResponse(res, responses.success('User retrieved successfully', user));
});

/**
 * Update user by id
 * @route PATCH /api/v1/users/:userId
 */
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  sendResponse(res, responses.success('User updated successfully', user));
});

/**
 * Delete user by id
 * @route DELETE /api/v1/users/:userId
 */
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  sendResponse(res, responses.noContent('User deleted successfully'));
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
}; 