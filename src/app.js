
/*
Of course! To test the endpoints in Postman, you'll need to send HTTP requests to the appropriate URLs with the correct HTTP methods and parameters. Here's a summary of the endpoints we discussed earlier and how to test them using Postman:

List Products with Pagination, Filtering, and Sorting (GET):

Method: GET
URL: http://localhost:8080/products
Parameters:
page: (Optional) Page number for pagination
limit: (Optional) Limit for pagination
View Individual Product Details (GET):

Method: GET
URL: http://localhost:8080/products/{productId}
Replace {productId} with the actual product ID
Add Product to Cart (POST):

Method: POST
URL: http://localhost:8080/products/add-to-cart
Request Body (JSON):
json
Copy code
{
  "productId": "product_id_here",
  "quantity": 1
}
Replace "product_id_here" with the actual product ID you want to add to the cart.
Update Product Quantity in Cart (PUT):

Method: PUT
URL: http://localhost:8080/products/update-cart/{productId}
Replace {productId} with the actual product ID you want to update in the cart
Request Body (JSON):
json
Copy code
{
  "quantity": 2
}
Replace 2 with the updated quantity.
Update Product Quantity in Cart using Quantity Endpoint (PUT):

Method: PUT
URL: http://localhost:8080/products/update-quantity/{productId}
Replace {productId} with the actual product ID you want to update the quantity
Request Body (JSON):
json
Copy code
{
  "quantity": 3
}
Replace 3 with the updated quantity.
View Cart Contents (GET):

Method: GET
URL: http://localhost:8080/products/view-cart
Remove Product from Cart (DELETE):

Method: DELETE
URL: http://localhost:8080/products/remove-from-cart/{productId}
Replace {productId} with the actual product ID you want to remove from the cart.
Make sure your server is running locally on port 8080 while testing these endpoints in Postman. Send the appropriate requests for each endpoint and observe the responses.

If you encounter any issues or have specific questions while testing, feel free to ask!

{
    
    "email": "leninadmin@example.com",
    "password": "adminpassword"

}

1)/ - GET Request:

Express Route: router.get('/')
Postman Path: GET http://localhost:8080/

2)/register - POST Request:

Express Route: router.post('/register', userController.registerUser)
Postman Path: POST http://localhost:8080/users/register

3)/login - POST Request:

Express Route: router.post('/login', userController.loginUser)
Postman Path: POST http://localhost:8080/users/login

4)/logout - GET Request:

Express Route: router.get('/logout', userController.logoutUser)
Postman Path: GET http://localhost:8080/users/logout

5)/admin-dashboard - GET Request:

Express Route: router.get('/admin-dashboard', jwtAuthMiddleware, userController.adminDashboard)
Postman Path: GET http://localhost:8080/users/admin-dashboard

6)/api/sessions/current - GET Request:

Express Route: router.get('/api/sessions/current', jwtAuthMiddleware, userController.getCurrentUser)
Postman Path: GET http://localhost:8080/users/api/sessions/current

*/
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const initializePassport = require('./config/passport.config');
const configurePassport = require('./config/passport.config');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const productsRouter = require('./routes/products.router');
const cartRoutes = require('./routes/cart.router');
const usersRouter = require('./routes/users.router')
require('dotenv').config();

const path = require('path');

const app = express();

const authRouter = require('./routes/auth');

const connectDB = require('./db');

connectDB();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body parsing middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
initializePassport();

// Configure Passport
configurePassport();

// Use session
app.use(
  session({
    secret: 'coderhouse',
    resave: false,
    saveUninitialized: true,
  })
);

// Use cookie parser
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// JWT Authentication Route using .env
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => {
      if (req && req.cookies) {
        return req.cookies['jwt'];
      
      }
      return null;
    },
  ]),
  secretOrKey: process.env.JWT_SECRET, // Use process.env.JWT_SECRET here
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
);

// cart route
app.use('/cart', cartRoutes);


app.use('/products', productsRouter);

// Use the user routes
app.use('/users', usersRouter);

// authentication routes
app.use('/auth', authRouter);



// JWT Authentication Route
app.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
  const token = req.user.generateJWT();
  console.log('Token:', token); // Add this line to log the token
  res.json({ token });
});


app.get('/', (req, res) => {
  res.render('home'); // Render the home view when accessing '/'
});

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
