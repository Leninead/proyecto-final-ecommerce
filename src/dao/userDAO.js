// dao/userDAO.js
const User = require('../models/user.model');

const UserDAO = {
  getAllUsers: async () => {
    try {
      return await User.find({}, 'firstName lastName email role');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get users');
    }
  },

  getUserById: async (userId) => {
    try {
      return await User.findById(userId, 'firstName lastName email role');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get user by ID');
    }
  },

  updateUser: async (userId, updatedUserData) => {
    try {
      return await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update user');
    }
  },

  
};

module.exports = UserDAO;
