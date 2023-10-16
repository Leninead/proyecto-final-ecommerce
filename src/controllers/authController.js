// controllers/authController.js
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res) => {
  const { username, password } = req.body;

  // Check username and password (you'll replace this with your own logic)
  if (username === 'example_user' && password === 'password123') {
    // Generate a JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token in the response
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = {
  authenticateUser,
};
