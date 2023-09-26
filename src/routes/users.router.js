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
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, age, password } = req.body;

        if (!firstName || !lastName || !email || !age || !password) {
            return res.status(400).send('Missing data.');
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send('User with this email already exists.');
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

        res.redirect('/login');
    } catch (error) {
        console.error('Error during registration: ', error);
        return res.status(500).send('Internal server error');
    }
});




// User Login
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

        console.log('Hashed Password from DB:', user.password);
        console.log('Provided Password:', password);

        const isPasswordValid = await bcrypt.compare(password, user.password);

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
