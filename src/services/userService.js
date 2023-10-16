const userDAO = require('../dao/userDAO');

const createUser = async (user) => {
  try {
    const createdUser = await userDAO.createUser(user);
    return createdUser;
  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await userDAO.getUserByEmail(email);
    return user;
  } catch (error) {
    throw new Error('Error getting user: ' + error.message);
  }
};

module.exports = {
  createUser,
  getUserByEmail,
};
