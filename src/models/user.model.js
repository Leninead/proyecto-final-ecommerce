const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

userSchema.methods.generateJWT = function () {
  try {
    const token = jwt.sign({ id: this._id }, JWT_SECRET, { expiresIn: '1h' });
    return token;
  } catch (error) {
    throw new Error('Error generating JWT: ' + error.message);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
