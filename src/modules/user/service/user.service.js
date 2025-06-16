const userRepository = require('../repository/user.repository');
const { BadRequestError, NotFoundError } = require('../../../core/ApiError');

/**
 * User Service with business logic
 */
const createUser = async (userData) => {
  if (await userRepository.isEmailTaken(userData.email)) {
    throw BadRequestError('Email already taken');
  }
  
  return userRepository.create(userData);
};

const getUserById = async (id) => {
  return userRepository.getById(id);
};

const getUserByEmail = async (email) => {
  return userRepository.getByEmail(email);
};

const updateUserById = async (id, updateData) => {
  if (updateData.email && await userRepository.isEmailTaken(updateData.email, id)) {
    throw BadRequestError('Email already taken');
  }
  
  return userRepository.updateById(id, updateData);
};

const deleteUserById = async (id) => {
  return userRepository.deleteById(id);
};

const queryUsers = async (filter, options) => {
  return userRepository.query(filter, options);
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  queryUsers
}; 