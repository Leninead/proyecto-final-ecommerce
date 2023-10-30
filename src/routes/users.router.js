const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// Authentication middleware
const jwtAuthMiddleware = passport.authenticate('jwt', { session: false });

router.get('/', (req, res) => {
  res.render('home'); // Renders views/home.ejs
});

router.post('/register', userController.registerUser);

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/login', (req, res) => {
  userController.loginUser(req, res);
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/logout', userController.logoutUser);

// Protected route for admin dashboard
router.get('/admin-dashboard', jwtAuthMiddleware, userController.adminDashboard);

// Protected route to get current user
router.get('/api/sessions/current', jwtAuthMiddleware, userController.getCurrentUser);

module.exports = router;
