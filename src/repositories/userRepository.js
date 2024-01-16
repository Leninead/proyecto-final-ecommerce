// src/repositories/user.repository.js
const User = require('../models/user.model');

const UserRepository = {
  getAllUsers: async () => {
    return User.find({}, 'firstName lastName email age');
  },

  getUserById: async (userId) => {
    return User.findById(userId, 'firstName lastName email age');
  },

  updateUser: async (userId, updatedUserData) => {
    return User.findByIdAndUpdate(userId, updatedUserData, { new: true });
  },

  deleteInactiveUsers: async () => {
    try {
      // Example: Delete users inactive for the last 2 days
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const result = await User.deleteMany({ lastActive: { $lt: twoDaysAgo } });

      // 'result' will contain information about the operation (e.g., number of deleted documents)
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete inactive users');
    }
  },

};

module.exports = UserRepository;