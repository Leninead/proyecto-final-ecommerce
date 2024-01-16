const User = require('../models/user.model');
const UserRepository = require('../repositories/user.repository');

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}, 'firstName lastName email age');
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteInactiveUsers: async (req, res) => {
    try {
      const result = await UserRepository.deleteInactiveUsers();

      res.json({
        message: `Deleted ${result.deletedCount} inactive users`,
        result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await UserRepository.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const updatedUser = req.body;
      const result = await UserRepository.updateUser(userId, updatedUser);
      if (!result) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = UserController;
