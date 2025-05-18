const httpStatus = require('http-status');
const userService = require('../service/user.service');
const { pick } = require('../../../middlewares/validate');
const catchAsync = require('../../../utils/catchAsync');
const { SuccessResponse, CreatedResponse, NoContentResponse } = require('../../../core/ApiResponse');

/**
 * Create a new user
 * @route POST /api/v1/users
 */
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  new CreatedResponse('User created successfully', user).send(res);
});

/**
 * Get all users
 * @route GET /api/v1/users
 */
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'email', 'role', 'isEmailVerified']);
  const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  new SuccessResponse('Users retrieved successfully', result).send(res);
});

/**
 * Get user by id
 * @route GET /api/v1/users/:userId
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  new SuccessResponse('User retrieved successfully', user).send(res);
});

/**
 * Update user by id
 * @route PATCH /api/v1/users/:userId
 */
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  new SuccessResponse('User updated successfully', user).send(res);
});

/**
 * Delete user by id
 * @route DELETE /api/v1/users/:userId
 */
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  new NoContentResponse('User deleted successfully').send(res);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
}; 