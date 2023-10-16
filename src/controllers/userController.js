const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config/config');
const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, age, password, role } = req.body;

    if (!firstName || !lastName || !email || !age || !password) {
      return res.status(400).send('Missing data.');
    }

    const validRoles = ['user', 'admin'];
    const selectedRole = validRoles.includes(role) ? role : 'user';

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send('User with this email already exists.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      firstName,
      lastName,
      email,
      age,
      password: hashedPassword,
      role: selectedRole
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during registration: ', error);
    return res.status(500).send('Internal server error');
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    return res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const logoutUser = async (req, res) => {
  console.log('Logout initiated.');
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Internal server error');
    }
    console.log('Session destroyed.');
    res.redirect('/');
  });
};

const adminDashboard = async (req, res) => {
  console.log('Requesting admin dashboard:', req.user);

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('User role:', user.role);

    if (user.role === 'admin') {
      return res.status(200).send('Welcome to the admin dashboard.');
    } else {
      return res.status(403).send('Access denied. Only admins allowed.');
    }
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).send('Internal server error.');
  }
};

const getCurrentUser = (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No JWT token found' });
  }

  jwt.verify(token.split(' ')[1], JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid JWT token' });
    }

    try {
      const user = await User.findById(decoded.id);
      if (user) {
        return res.status(200).json({ user });
      } else {
        return res.status(401).json({ message: 'User not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  adminDashboard,
  getCurrentUser
};
