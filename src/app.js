
/*
TASK REQUIREMENT: Refactor a nuestro login  
Consigna

Con base en el login de nuestro entregable anterior, refactorizar para incluir los nuevos conceptos.
Aspectos a incluir

Se deberá contar con un hasheo de contraseña utilizando bcrypt
Se deberá contar con una implementación de passport, tanto para register como para login.
Implementar el método de autenticación de GitHub a la vista de login.
ormato

Link al repositorio de GitHub con el proyecto solicitado.
Sugerencias
El testeo se realizará de manera muy similar al anterior, puedes consultar el documento de testing aquí: 








Based on the codes you've implemented, here are the next steps to complete the refactoring and incorporate the required aspects:

1)Hashing Passwords using Bcrypt:

Verify that you've integrated bcrypt to hash user passwords during registration. Make sure this is working correctly.

2)Implementing Passport for Register and Login:
Ensure that Passport.js is fully integrated for both registration and login.
In the registration route, hash the password using bcrypt before saving it to the database.
In the login route, use the LocalStrategy to authenticate users.

3)Authentication via GitHub:
Complete the GitHub authentication integration using the GitHubStrategy from Passport-GitHub.
Make sure to handle GitHub authentication callbacks and properly associate the GitHub authentication with user accounts.

4)Testing:
Thoroughly test the registration, login, and GitHub authentication functionalities to ensure they work as expected.
Use various scenarios for testing, including incorrect inputs, missing data, and successful logins via both the local strategy and GitHub authentication.

5)Clean Code and Structure:

Ensure your code is well-organized, follows a consistent style, and adheres to best practices.
Consider refactoring and restructuring code if needed to improve readability and maintainability.

6)Documentation:

Update your README file to include information about the new changes, how to register/login using the updated features, and how GitHub authentication is integrated.

7)Submission:

Once you've completed and thoroughly tested the implementation, submit the GitHub repository link as required by the task.
Go through each aspect carefully, ensure everything is functioning correctly, and organize your code and documentation appropriately. Finally, submit the GitHub repository link for review.

clave:   implementacionlogin
*/

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const { User } = require('./models/User');

const { createHash, isValidatePassword } = require('./utils');
const passport = require("passport")
const initializePassport = require("./config/passport.config")
const usersRouter = require('./routes/users.router');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
mongoose.connect('mongodb+srv://leninacosta2107:implementacionlogin@cluster0.3bpxnoe.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://leninacosta2107:implementacionlogin@cluster0.3bpxnoe.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 600,
    }),
    secret: 'coderhouse',
    resave: false,
    saveUninitialized: true,
}));
app.use('/users', usersRouter);
app.use(passport.initialize())
app.use(passport.session())

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + '/views')
app.set("view engine", "handlebars")

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect to a page.
    res.redirect('/dashboard');
  }
);



app.get("/failuregister", async (req, res) => {
    console.log("Authentication failure")
    res.send({ error: "Failure" })
})

app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const { first_name, last_name, email, age } = req.session.user;
    console.log(first_name, last_name, email, age)
    res.render('profile', { first_name, last_name, email, age });
    console.log('User logged in successfully.');
});

app.get('/login/:email/:password', async (req, res) => {
    const { email, password } = req.params;

    if (!email || !password) {
        return res.status(400).send({ status: "error", error: "Invalid values" });
    }

    const user = await User.findOne(
        { email },
        { email: 1, first_name: 1, last_name: 1, password: 1 }
    );

    if (!user) {
        return res.status(400).send({ status: "error", error: "User not found" });
    }

    if (!isValidatePassword(user.password, password)) {
        return res.status(403).send({ status: "error", error: "Incorrect password" });
    }

    delete user.password
    req.session.user = user
    res.send({ status: "success", payload: user })
});

app.listen(8080, () => {
    console.log('Server running on port 8080');
});
