const bcrypt = require('bcrypt');

const createHash = (password) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password: " + error.message);
  }
};

const isValidatePassword = (password, hashedPassword) => {
  try {
    return bcrypt.compareSync(password, hashedPassword);
  } catch (error) {
    throw new Error("Error validating password: " + error.message);
  }
};

module.exports = {
  createHash,
  isValidatePassword,
};
