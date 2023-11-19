const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const authenticationMiddleware = require('../middlewares/authentication');

// Authentication middleware
const jwtAuthMiddleware = passport.authenticate('jwt', { session: false });

// Define the route for the /current endpoint
router.get('/current', authenticationMiddleware, (req, res) => userController.getCurrentUser(req, res));

// Home route
router.get('/', (req, res) => {
  res.render('home'); // Renders views/home.ejs
});
// Define a route for the user profile
router.get('/profile', (req, res) => {
  // Render the "User Profile" view and pass user data
  res.render('profile', { user: req.user }); // Assuming user data is available in req.user
});


// Register a user (POST /register)
router.post('/register', async (req, res) => {
  await userController.registerUser(req, res);
});

// Log in a user (POST /login)
router.post('/login', (req, res) => userController.loginUser(req, res));

// Log out a user (POST /logout)
router.post('/logout', (req, res) => userController.logoutUser(req, res));

// Admin dashboard route (GET /admin)
router.get('/admin', jwtAuthMiddleware, (req, res) => userController.adminDashboard(req, res));

// Protected route to get the current user (GET /user)
router.get('/user', jwtAuthMiddleware, (req, res) => userController.getCurrentUser(req, res));

// Protected route for the admin dashboard (GET /admin-dashboard)
router.get('/admin-dashboard', jwtAuthMiddleware, (req, res) => userController.adminDashboard(req, res));

// Protected route to get the current user (GET /api/sessions/current)
router.get('/api/sessions/current', jwtAuthMiddleware, (req, res) => userController.getCurrentUser(req, res));

module.exports = router;
