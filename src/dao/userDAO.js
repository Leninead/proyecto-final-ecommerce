const User = require('../models/user.model');

const createUser = async (user) => {
  try {
    if (!user || !user.email || !user.password) {
      throw new Error('Invalid user data');
    }

    const createdUser = await User.create(user);
    return createdUser;
  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
};

const getUserByEmail = async (email) => {
  try {
    if (!email) {
      throw new Error('Invalid email');
    }

    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    throw new Error('Error getting user: ' + error.message);
  }
};

module.exports = {
  createUser,
  getUserByEmail,
};
