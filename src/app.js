
/*
TASK REQUIREMENT: Implementación de login. Consigna

Ajustar nuestro servidor principal para trabajar con un sistema de login.

Aspectos a incluir

-Deberá contar con todas las vistas realizadas en el hands on lab, así también como las rutas de router para procesar el registro y el login. 
-Una vez completado el login, realizar la redirección directamente a la vista de productos.                  
-Agregar a la vista de productos un mensaje de bienvenida con los datos del usuario

-Agregar un sistema de roles, de manera que si colocamos en el login como correo adminCoder@coder.com, y la contraseña adminCod3r123, el usuario de la sesión además tenga un campo 
-Todos los usuarios que no sean admin deberán contar con un rol “usuario”.
-Implementar botón de “logout” para destruir la sesión y redirigir a la vista de login                             Formato

Link al repositorio de Github sin node_modules

Sugerencias

Recuerda que las vistas son importantes, más no el diseño, concéntrate en la funcionalidad de las sesiones antes que en la presentación.
Cuida las redirecciones a las múltiples vistas.   

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
