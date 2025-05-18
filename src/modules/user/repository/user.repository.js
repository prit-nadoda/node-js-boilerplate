const User = require('../model/user.model');
const { NotFoundError } = require('../../../core/ApiError');

/**
 * User Repository for data access operations
 */
class UserRepository {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<User>} Created user
   */
  async create(userData) {
    return User.create(userData);
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<User>} User document
   * @throws {NotFoundError} If user not found
   */
  async getById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<User>} User document
   */
  async getByEmail(email) {
    return User.findOne({ email });
  }

  /**
   * Update user by ID
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<User>} Updated user
   * @throws {NotFoundError} If user not found
   */
  async updateById(id, updateData) {
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    return user;
  }

  /**
   * Delete user by ID
   * @param {string} id - User ID
   * @returns {Promise<User>} Deleted user
   * @throws {NotFoundError} If user not found
   */
  async deleteById(id) {
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    return user;
  }

  /**
   * Get all users with pagination
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (sort, paginate, etc.)
   * @returns {Promise<Object>} Paginated result with users
   */
  async query(filter, options) {
    const { page = 1, limit = 10, sortBy, sortOrder = 'asc' } = options;
    const skip = (page - 1) * limit;
    
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by creation date, newest first
    }
    
    const query = filter ? { ...filter } : {};
    
    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await User.countDocuments(query);
    
    return {
      results: users,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    };
  }

  /**
   * Check if email is taken
   * @param {string} email - Email to check
   * @param {string} [excludeUserId] - User ID to exclude from the check
   * @returns {Promise<boolean>} True if email is taken
   */
  async isEmailTaken(email, excludeUserId) {
    return User.isEmailTaken(email, excludeUserId);
  }
}

module.exports = new UserRepository(); 