const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { createHash, isValidatePassword } = require('../utils');
const bcrypt = require('bcrypt');
// Login Page
router.get('/login', async (req, res) => {
    res.render('login');
});

// Registration Page
router.get('/register', async (req, res) => {
    res.render('register');
});


// User Profile Page
router.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { firstName, lastName, email, age } = req.session.user;

    res.render('profile', { firstName, lastName, age, email });
});

// Handle GET request for /products
router.get('/products', async (req, res) => {
    // Sample product data
    const products = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
        // Add more products as needed
    ];
    
    // Render the Handlebars template with the product data
    res.render('products', { products });
});


// User Registration
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, age, password } = req.body;
        console.log('Received data:', req.body);

        if (!firstName || !lastName || !email || !age || !password) {
            console.log('Missing data:', req.body);
            return res.status(400).send('Missing data.');
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            age,
            password: hashedPassword,
        });

        console.log('User registered successfully:', user);

        // Redirect to login page after registration
        res.redirect('/login');
    } catch (error) {
        console.error('Error during registration: ', error);
        return res.status(500).send('Internal server error');
    }
});


// User Login
router.post('/login', async (req, res) => {
    console.log('Login request received.');
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Invalid login request. Email or password missing.');
        return res.status(400).render('login', { error: 'Invalid values' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found.');
            return res.status(400).render('login', { error: 'User not found' });
        }

        const isPasswordValid = isValidatePassword(user, password);

        if (!isPasswordValid) {
            console.log('Incorrect password.');
            return res.status(401).render('login', { error: 'Incorrect password' });
        }

        // Set the user in the session
        req.session.user = user;
        console.log('User logged in successfully:', user);
        // Redirect to the product view upon successful login
        return res.redirect('/products');
    } catch (error) {
        console.error('Error during login: ', error);
        return res.status(500).render('login', { error: 'Internal server error' });
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
        res.redirect('/login');
    });
});

module.exports = router;
