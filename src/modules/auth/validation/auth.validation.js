const Joi = require('joi');
const { password } = require('../../../utils/validation');

/**
 * Register validation schema
 */
const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
  }),
};

/**
 * Login validation schema
 */
const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

/**
 * Refresh tokens validation schema
 */
const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

/**
 * Logout validation schema
 */
const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  refreshTokens,
  logout,
}; 