const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { createHash, isValidatePassword } = require('../utils');

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

    const { first_name, last_name, email, age } = req.session.user;

    res.render('profile', { first_name, last_name, age, email });
});

// User Registration
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send('Missing data.');
    }

    const hashedPassword = createHash(password);

    const user = await User.create({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
    });

    console.log('User registered successfully: ' + user);

    // Redirect to login page after registration
    res.redirect('/login');
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render('login', { error: 'Invalid values' });
    }

    const user = await User.findOne(
        { email },
        { first_name: 1, last_name: 1, age: 1, password: 1, email: 1 }
    );

    if (!user) {
        return res.status(400).render('login', { error: 'User not found' });
    }

    if (!isValidatePassword(user.password, password)) {
        return res.status(401).render('login', { error: 'Incorrect password' });
    }

    // Set the user in the session
    req.session.user = user;

    // Redirect to the profile page upon successful login
    res.redirect('/users/profile');
});

// User Logout
router.get('/logout', async (req, res) => {
    delete req.session.user;
    res.redirect('/login');
});

module.exports = router;
