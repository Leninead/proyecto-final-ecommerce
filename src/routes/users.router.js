const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = require('../config/config'); // Adjust this according to your structure
const User = require('../models/User');


const bcrypt = require('bcrypt');



router.get('/', (req, res) => {
  res.render('home'); // Renders views/home.ejs
});


// Registration Page
router.post('/register', async (req, res) => {
  try {
      const { firstName, lastName, email, age, password, role } = req.body;

      if (!firstName || !lastName || !email || !age || !password) {
          return res.status(400).send('Missing data.');
      }

      // Validate role
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
          role: selectedRole  // Use the selected role
      });

      // Generate JWT token after successfully creating the user
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({ token });
  } catch (error) {
      console.error('Error during registration: ', error);
      return res.status(500).send('Internal server error');
  }
});



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request for email:', email);
  
  try {
      const user = await User.findOne({ email });

      if (!user) {
          console.log('User not found for email:', email);
          return res.status(401).json({ message: 'User not found.' });
      }

      // Compare the provided password with the hashed password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
          console.log('Incorrect password for email:', email);
          return res.status(401).json({ message: 'Incorrect password.' });
      }

      console.log('Login successful for email:', email);
      return res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});



// User Logout
router.get('/logout', async (req, res) => {
    console.log('Logout initiated.');
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal server error');
        }
        console.log('Session destroyed.');
        res.redirect('/');
    });
});

// Example route where only admins can access
router.get('/admin-dashboard', passport.authenticate('jwt', { session: false }), async (req, res) => {
  console.log('Requesting admin dashboard:', req.user);
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('User role:', user.role); // Add this line to log the user's role

    if (user.role === 'admin') {
      return res.status(200).send('Welcome to the admin dashboard.');
    } else {
      return res.status(403).send('Access denied. Only admins allowed.');
    }
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).send('Internal server error.');
  }
});


// API endpoint to get the current user based on JWT token

router.get('/api/sessions/current', (req, res) => {
  // Extract the JWT token from the Authorization header
  const token = req.header('Authorization');

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'No JWT token found' });
  }

  // Verify the JWT token and fetch the user based on the decoded token
  jwt.verify(token.split(' ')[1], JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid JWT token' });
    }

    // Fetch the user based on the decoded token
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
});

module.exports = router;
