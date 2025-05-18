const Joi = require('joi');
const { objectId } = require('../../../utils/validation');

/**
 * Create user validation schema
 */
const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('user', 'admin').default('user'),
    isEmailVerified: Joi.boolean().default(false),
  }),
};

/**
 * Get users validation schema
 */
const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string(),
    isEmailVerified: Joi.boolean(),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc'),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
  }),
};

/**
 * Get user validation schema
 */
const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

/**
 * Update user validation schema
 */
const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().min(8),
      role: Joi.string().valid('user', 'admin'),
      isEmailVerified: Joi.boolean(),
    })
    .min(1),
};

/**
 * Delete user validation schema
 */
const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
}; 