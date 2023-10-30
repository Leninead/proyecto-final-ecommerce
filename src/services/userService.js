const UserRepository = require('../Repository/userRepository');
const jwt = require('jsonwebtoken');


class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async authenticateUser(email, password) {
    try {
      const user = await this.userRepository.getUserByEmail(email);

      if (!user) {
        return null; // User not found
      }

      // Verify the user's password
      const isPasswordValid = await this.userRepository.verifyPassword(user, password);

      if (!isPasswordValid) {
        return null; // Password is incorrect
      }

      // Create a JWT for the user
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

      return token;
    } catch (error) {
      throw new Error('Error authenticating user: ' + error.message);
    }
  }
  async createUser(user) {
    try {
      return await this.userRepository.createUser(user);
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  async getUserByEmail(email) {
    try {
      return await this.userRepository.getUserByEmail(email);
    } catch (error) {
      throw new Error('Error getting user by email: ' + error.message);
    }
  }

  // Add other user-related business logic here
}

module.exports = UserService;
