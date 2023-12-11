const jwt = require('jsonwebtoken'); // Add this line
const userRepository = require('../Repository/userRepository');
const userRepositoryInstance = new userRepository();
const UserService = require('../services/userService');
const userService = new UserService();

class UserController {

  
  async registerUser(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      if (!firstName || !lastName || !email || !password) {
        console.log('Incomplete registration data');
        return res.status(400).json({ message: 'Incomplete registration data' });
      }

      const existingUser = await userRepositoryInstance.getUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const user = await userRepositoryInstance.createUser({
        firstName,
        lastName,
        email,
        password,
      });

      // Generate a JWT token for the user
      const payload = { userId: user._id, username: user.username };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      if (!token) {
        console.error('Error generating JWT token');
        return res.status(500).json({ message: 'Error registering user. Could not generate token.' });
      }

      console.log('Generated Token:', token);

      // Return a response to the client with the token
      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  }

  
  async loginUser(req, res) {
    try {
      // 1. Validate the user's login data
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Incomplete login data' });
      }
  
      // 2. Check if the user with the provided email exists
      const user = await userService.getUserByEmail(email);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // 3. Verify the provided password against the hashed password in the database
      const passwordMatch = await userService.verifyPassword(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      // 4. If the verification is successful, generate a JWT token for the user
      const token = await userService.generateJWT(user);
      console.log('Generated Token:', token);
  
      // 5. Return a response to the client with the token
      res.status(200).json({ message: 'Authentication successful', token });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error authenticating user', error: error.message });
    }
  }
  
  async logoutUser(req, res) {
    try {
      // If you're using JWT tokens, you can have a blacklist of tokens or simply remove the token from the client's side to invalidate it.
  
      // Assuming you're using a token blacklist, you might add the token to the blacklist on logout.
      const tokenToInvalidate = req.token; // Assuming you have a way to access the user's token
  
      // Invalidate the token, for example, by adding it to a token blacklist
      // Your implementation may vary depending on your system.
      // Example: blacklist.add(tokenToInvalidate)
  
      // Respond with a success message
      res.json({ message: 'User logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out user', error: error.message });
    }
  }
  
  

  async adminDashboard(req, res) {
    try {
      // Implement the logic for rendering the admin dashboard. Ensure that you check for user authentication.
      // You might restrict access to this route to admin users.
  
      // Check if the user has admin privileges (you can use the user's role or other criteria)
      const user = req.user; // Assuming you have user information available through authentication middleware
      if (user && user.role === 'admin') {
        // User is an admin, so render the admin dashboard
        res.render('admin-dashboard'); // Example rendering of an admin dashboard view.
      } else {
        // User does not have admin privileges, respond with an error
        res.status(403).json({ message: 'Access forbidden. Admin privileges required.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
  

  
  async getCurrentUser(req, res) {
    try {
      // Check if the user is authenticated (you can use your authentication middleware)
      const user = req.user; // Assuming you have user information available through authentication middleware

      if (user) {
        // User is authenticated, return user data in the response
        const userDto = {
          username: user.username,
          email: user.email,
          // Include other necessary data in the DTO
        };
        res.json(userDto);
      } else {
        // No user is authenticated, respond with a message
        res.status(401).json({ message: 'No user is authenticated' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
  // Add other user-related HTTP request handling here, such as updating user profiles, resetting passwords, etc.
}

module.exports = UserController;
