const Joi = require('joi');
const httpStatus = require('http-status');
const { BadRequestError } = require('../core/ApiError');

/**
 * Middleware for request validation using Joi schemas
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(', ');
      
    return next(new BadRequestError(errorMessage, error.details));
  }
  
  // Replace request with validated values
  Object.assign(req, value);
  
  return next();
};

/**
 * Create an object with only the specified keys
 * @param {Object} object - Source object
 * @param {string[]} keys - Keys to pick
 * @returns {Object} Object with only picked keys
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = {
  validate,
  pick,
}; 