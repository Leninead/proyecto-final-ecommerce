
/*
Consigna

Continuar sobre el proyecto que has trabajado para tu ecommerce y configurar los siguientes elementos:

Aspectos a incluir

*Crear un modelo User el cual contará con los campos:
-first_name:String,
-last_name:String,
-email:String (único)
-age:Number,
-password:String(Hash)
-cart:Id con referencia a Carts
-role:String(default:’user’)
*Desarrollar las estrategias de Passport para que funcionen con este modelo de usuarios
*Modificar el sistema de login del usuario para poder trabajar con session o con jwt (a tu elección). 
*(Sólo para jwt) desarrollar una estrategia “current” para extraer la cookie que contiene el token para obtener el usuario asociado a dicho token, en caso de tener el token, devolver al usuario asociado al token, caso contrario devolver un error de passport, utilizar un extractor de cookie.
*Agregar al router /api/sessions/ la ruta /current, la cual utilizará el modelo de sesión que estés utilizando, para poder devolver en una respuesta el usuario actual.







Here are the steps you can follow:

Back-End Development:
a. Create the necessary models (e.g., User) and set up the MongoDB database accordingly.
b. Implement Passport strategies to handle authentication.
c. Set up API endpoints for user authentication, sessions, and current user.

Front-End Development:
a. Once the back end is functional, start a new React project or use an existing one.
b. Set up routes in your React application to correspond with the API endpoints you've defined in the back end.
c. Use AJAX requests or a library like Axios to communicate with your back end from the React application.
d. Create React components to handle different views and interactions for login, registration, profile, etc.

Integration:
a. Integrate the front end and back end by connecting the API requests from your React application to the back-end API endpoints.

By following this approach, you'll have a well-structured back end ready to serve data and authentication services. You can then focus on creating a dynamic and interactive front end using React or any other technology you prefer.

Feel free to ask if you have any specific questions or need guidance during any stage of this process!



1)User Model:

Your User model seems to have the required fields: first_name, last_name, email, age, password, cart, and role. Good job!

2)Passport Strategies:

You have implemented the Local and JWT strategies in passport.config.js, which is great. You have also associated these strategies with the User model.

3)Login System:

You have modified the login system to support both session-based and JWT-based authentication. Users can log in using either method.


4)JWT Strategy:

You have implemented a JWT strategy and verified the JWT token. You're extracting user information from it and handling cases where the token is valid or invalid.

5)'/api/sessions/' Router:

We have not reviewed the implementation of this route yet.

6)Cookie Extraction for JWT:

You haven't included a cookie extractor specifically for JWT. This can be added to your JWT strategy configuration.
Shall we proceed with reviewing the /api/sessions/current route and implementing the cookie extraction for JWT?

practicaintegracionecommerce
{
  "firstName": "lenin",
  "lastName": "acosta",
  "email": "lenin@example.com",
  "age": 36,
  "password": "password12456"
}
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWI0NGU5N2JiNTFjYTVlYThiZTkxMCIsImlhdCI6MTY5NjI4NTkyOSwiZXhwIjoxNjk2Mjg5NTI5fQ.xdK3sN9VxBMV8nUUdEOPFtXfzxSIP3bE0J0DTZqir0c"
}

mongodb+srv://leninacosta2107:practicaintegracionecommerce@cluster0.vxjntdf.mongodb.net/?retryWrites=true&w=majority
*/
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const passport = require('passport');
const initializePassport = require('./config/passport.config');
const usersRouter = require('./routes/users.router');
const { JWT_SECRET } = require('./config/config'); // Ensure you have a config file for your JWT secret
const configurePassport = require('./config/passport.config')
const cookieParser = require('cookie-parser');

// Import the connectDB function from db.js
const connectDB = require('./db');

const path = require('path');
const app = express();


app.set('view engine', 'ejs'); // Change 'ejs' to your desired view engine

// Body parsing middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
initializePassport();

connectDB();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'coderhouse',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());

app.use(cookieParser());

// Configure Passport
configurePassport();



// Authentication Routes
app.use('/users', usersRouter);

// JWT Authentication Route
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => {
      if (req && req.cookies) {
        return req.cookies['your-cookie-name']; // Adjust your cookie name
      }
      return null;
    },
  ]),
  secretOrKey: JWT_SECRET,
};
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
)
app.get('/', (req, res) => {
  res.render('home');  // Render the home view when accessing '/'
});

// JWT Authentication Route
app.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    const token = req.user.generateJWT();
    res.json({ token });
});

app.listen(8080, () => {
    console.log('Server running on port 8080');
});
