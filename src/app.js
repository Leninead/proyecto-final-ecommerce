
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




1)User Model and Authentication:

Create a User model and ensure it has the required fields: first_name, last_name, email, age, password, cart (reference to Carts), role.

2)Passport Strategies and Authentication:

Implement Passport strategies for user authentication.
Ensure that you have strategies for local login (username and password) and JWT authentication.
Implement a "current" strategy for JWT to extract the user from the token.

3)Login System:

Modify the login system to handle both session-based and JWT-based authentication.
Update the login endpoint to issue a JWT token upon successful authentication.

4)Cart Model and Endpoints:

You've created the cart.model.js, but ensure that the Cart model has the necessary fields and associations as per the requirements (userId, products, etc.).
Implement endpoints to handle cart management: adding, updating, deleting products from the cart.

5)Database Integration:

Integrate MongoDB as the primary persistence system for your application.
Create the necessary MongoDB collections (Users, Products, Carts) to store data as per the requirements.

6)Products Endpoints:

Update the products router (products.router.js) to include endpoints for:
Handling product listing with pagination, filtering, and sorting.
Viewing individual product details.

7)Views:

Create views to display products and allow users to interact with the application (e.g., view product details, add to cart).

8)Role Implementation:

Implement a system of roles, where certain users have admin privileges.

Logout Functionality:

Implement a "logout" mechanism to destroy the session and redirect to the login view.
To summarize, ensure you have implemented the user model, authentication strategies, endpoints for cart management, integrated MongoDB with the necessary collections, and updated the products router with the required endpoints. Additionally, implement views to interact with the application and consider role-based access as needed.
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
