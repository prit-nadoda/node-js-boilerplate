const { BadRequestError } = require('../core/ApiError');
const mongoose = require('mongoose');

/**
 * Custom validation for MongoDB ObjectId
 * @param {string} value - Object ID to validate
 * @param {Object} helpers - Joi helpers
 * @returns {string|Object} Validated value or error
 */
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

/**
 * Custom validation for password
 * @param {string} value - Password to validate
 * @param {Object} helpers - Joi helpers
 * @returns {string|Object} Validated value or error
 */
const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('Password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('Password must contain at least 1 letter and 1 number');
  }
  return value;
};

module.exports = {
  objectId,
  password,
};