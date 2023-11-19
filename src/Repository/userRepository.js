const User = require('../models/user.model');
const bcrypt = require('bcrypt');

class UserRepository {
  async createUser(user) {
    try {
      // Hash the user's password before storing it
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;

      return await User.create(user);
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password);
  }

  async getUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new Error('Error getting user by email: ' + error.message);
    }
  }

  // Add other user-related database operations here
}

module.exports = UserRepository;
