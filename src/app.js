
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

clave:   implementacionlogin
*/
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const { User } = require('./models/User');
const productsRouter = require('./routes/products.router'); // New router for products
const homeRouter = require('./routes/users.router'); 
const passport = require("passport")
const initializePassport = require('./config/passport.config')
const usersRouter = require('./routes/users.router');
const path = require('path');
const { isValidatePassword } = require('./utils');

const app = express();

// Body parsing middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


// Initialize Passport
initializePassport();

app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb+srv://leninacosta2107:refactornuestrologin@cluster0.uwfktuc.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});




app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://leninacosta2107:refactornuestrologin@cluster0.uwfktuc.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 600,
    }),
    secret: 'coderhouse',
    resave: false,
    saveUninitialized: true,
}));


app.use('/', homeRouter); 
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use(passport.initialize())
app.use(passport.session())

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")


app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));



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
