const userRepository = require('../repository/user.repository');
const { BadRequestError, NotFoundError } = require('../../../core/ApiError');

/**
 * User Service with business logic
 */
class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<User>} Created user
   * @throws {BadRequestError} If email is already taken
   */
  async createUser(userData) {
    if (await userRepository.isEmailTaken(userData.email)) {
      throw new BadRequestError('Email already taken');
    }
    
    return userRepository.create(userData);
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<User>} User document
   */
  async getUserById(id) {
    return userRepository.getById(id);
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<User>} User document
   */
  async getUserByEmail(email) {
    return userRepository.getByEmail(email);
  }

  /**
   * Update user by ID
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<User>} Updated user
   * @throws {BadRequestError} If email is already taken
   */
  async updateUserById(id, updateData) {
    if (updateData.email && await userRepository.isEmailTaken(updateData.email, id)) {
      throw new BadRequestError('Email already taken');
    }
    
    return userRepository.updateById(id, updateData);
  }

  /**
   * Delete user by ID
   * @param {string} id - User ID
   * @returns {Promise<User>} Deleted user
   */
  async deleteUserById(id) {
    return userRepository.deleteById(id);
  }

  /**
   * Get all users with pagination
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (sort, paginate, etc.)
   * @returns {Promise<Object>} Paginated result with users
   */
  async queryUsers(filter, options) {
    return userRepository.query(filter, options);
  }
}

module.exports = new UserService(); 