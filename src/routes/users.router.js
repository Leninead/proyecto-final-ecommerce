const express = require('express');
const router = express.Router();
const passport = require('passport'); 
const authenticationMiddleware = require('../middlewares/authentication'); // Add this line
const UserController = require('../controllers/userController');
const userController = new UserController(); 
const { generateToken } = require('../routes/auth');
// Authentication middleware
const jwtAuthMiddleware = passport.authenticate('jwt', { session: false });

/**
 * @swagger
 * /users/current:
 *   get:
 *     summary: Get the current user
 *     description: Retrieve information about the currently authenticated user.
 *     responses:
 *       200:
 *         description: Successful response with the current user data.
 *       401:
 *         description: No user is authenticated.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/current', authenticationMiddleware, (req, res) => userController.getCurrentUser(req, res));

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Get home route
 *     description: Retrieve the home route.
 *     responses:
 *       200:
 *         description: Successful response rendering home view.
 */

router.get('/', (req, res) => {
  res.render('home'); // Renders views/home.ejs
});

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the user profile view and pass user data.
 *     responses:
 *       200:
 *         description: Successful response rendering user profile view.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/profile', (req, res) => {
  // Render the "User Profile" view and pass user data
  res.render('profile', { user: req.user }); // Assuming user data is available in req.user
});



/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Incomplete registration data or Email already registered.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/register', async (req, res) => {
  await userController.registerUser(req, res);
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticate a user based on provided credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Authentication successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Incomplete login data.
 *       404:
 *         description: User not found.
 *       401:
 *         description: Authentication failed.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/login', generateToken, (req, res) => {
  res.json({ token: req.token });
});




/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out a user
 *     description: Log out a user by invalidating the user's token.
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/logout', (req, res) => userController.logoutUser(req, res));

/**
 * @swagger
 * /users/admin:
 *   get:
 *     summary: Admin dashboard route
 *     description: Get the admin dashboard. Requires admin privileges.
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the admin dashboard.
 *       403:
 *         description: Access forbidden. Admin privileges required.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/admin', jwtAuthMiddleware, (req, res) => userController.adminDashboard(req, res));

/**
 * @swagger
 * /users/user:
 *   get:
 *     summary: Protected route to get the current user
 *     description: Get the details of the currently authenticated user.
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the current user's details.
 *       401:
 *         description: No user is authenticated.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/user', jwtAuthMiddleware, (req, res) => userController.getCurrentUser(req, res));

/**
 * @swagger
 * /users/admin-dashboard:
 *   get:
 *     summary: Protected route for the admin dashboard
 *     description: Get the admin dashboard. Requires admin privileges.
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the admin dashboard.
 *       403:
 *         description: Access forbidden. Admin privileges required.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/admin-dashboard', jwtAuthMiddleware, (req, res) => userController.adminDashboard(req, res));

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Protected route to get the current user
 *     description: Get the details of the currently authenticated user.
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the current user's details.
 *       401:
 *         description: No user is authenticated.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/api/sessions/current', jwtAuthMiddleware, (req, res) => userController.getCurrentUser(req, res));

module.exports = router;
