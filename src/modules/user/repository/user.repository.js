const User = require('../model/user.model');
const { NotFoundError } = require('../../../core/ApiError');

/**
 * User Repository for data access operations
 */
const create = async (userData) => {
  return User.create(userData);
};

const getById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw NotFoundError('User not found');
  }
  return user;
};

const getByEmail = async (email) => {
  return User.findOne({ email });
};

const updateById = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!user) {
    throw NotFoundError('User not found');
  }
  
  return user;
};

const deleteById = async (id) => {
  const user = await User.findByIdAndDelete(id);
  
  if (!user) {
    throw NotFoundError('User not found');
  }
  
  return user;
};

const query = async (filter, options) => {
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
};

const isEmailTaken = async (email, excludeUserId) => {
  return User.isEmailTaken(email, excludeUserId);
};

module.exports = {
  create,
  getById,
  getByEmail,
  updateById,
  deleteById,
  query,
  isEmailTaken
}; 