// models/user.js
const mongoose = require('../dao/mongoDB');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
