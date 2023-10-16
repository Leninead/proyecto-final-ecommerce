const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

router.get('/', (req, res) => {
  res.render('home'); // Renders views/home.ejs
});

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.get('/admin-dashboard', passport.authenticate('jwt', { session: false }), userController.adminDashboard);
router.get('/api/sessions/current', userController.getCurrentUser);

module.exports = router;
