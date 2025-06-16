const Joi = require('joi');
const httpStatus = require('http-status');
const { BadRequestError } = require('../core/ApiError');

/**
 * Validate request against Joi schema
 * @param {Object} schema - Joi schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.object(validSchema).validate(object, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(BadRequestError(errorMessage, error.details));
  }

  Object.assign(req, value);
  return next();
};

/**
 * Pick properties from object
 * @param {Object} object - Source object
 * @param {string[]} keys - Keys to pick
 * @returns {Object} New object with picked properties
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