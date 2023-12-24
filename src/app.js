

/*
Create a Testing Folder:

In your project's root directory, create a new folder named tests or something similar to organize your testing modules.
Write Tests for Router Modules:

Create separate testing modules for the specified routers (products, carts, sessions).
Focus on developing meaningful tests that go beyond just checking status codes. Test the functionality of each router extensively.
Use Mocha, Chai, and Supertest:

Utilize Mocha as your testing framework.
Use Chai for assertions and expectations.
Employ Supertest to simulate HTTP requests and test your endpoints.
Include at Least 3 Tests for Each Router:

For each router (products, carts, sessions), create at least three tests.
Ensure that these tests cover various scenarios and functionality, not just basic status checks.
Organize Tests:

Organize your tests logically within each testing module.
Use Mocha's describe and it functions to structure your test suites and cases.
Handle Dependencies:

If your routes depend on a database or external services, consider using test databases or mocks to isolate the tests.
Test Beyond Status Codes:

Focus on testing the actual behavior and functionality of your routes.
Check responses for expected data, verify input validation, and handle edge cases.
Documentation:

Consider adding comments to your testing modules to explain the purpose of each test and any specific scenarios you're testing.
Run Tests Locally:

Before submitting, make sure to run your tests locally to ensure they are passing and provide meaningful results.
GitHub Repository:

Share the link to your GitHub repository without the node_modules folder. This ensures a cleaner and more manageable sharing of your code.
Remember, this task is an opportunity to showcase the robustness of your testing strategy. Feel free to be creative and thorough in your test scenarios. If you encounter any specific challenges or have questions while implementing the tests, feel free to ask for assistance!


*/



  
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const { jwtSecret } = require('../generate-secret');
const authenticationMiddleware = require('./middlewares/authentication');
const emailRouter = require('./services/email.router');
const smsRouter = require('./services/sms.router');
const connectDB = require('./db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUIExpress = require('swagger-ui-express');
const swaggerOptions = require('../src/swaggerOptions'); // Adjust the path accordingly
require('dotenv').config();

// Connect to the database
connectDB();

console.log(`JWT Secret: ${jwtSecret}`);
console.log(`Server is running on port ${process.env.PORT}`);
console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
console.log(`JWT Secret: ${process.env.JWT_SECRET}`);
console.log(`Twilio Account SID: ${process.env.TWILIO_ACCOUNT_SID}`);
console.log(`Twilio Auth Token: ${process.env.TWILIO_AUTH_TOKEN}`);

// Initialize the Express app
const app = express();

// Use your email router
app.use('/email', emailRouter);
app.use('/sms', smsRouter);

// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

// Set up the database connection (Use the MONGODB_URI from .env)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configure and use Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_fallback_session_secret_here',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 86400000,
      sameSite: 'strict',
    },
  })
);

// Use cookie parser
app.use(cookieParser());

// Configure view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Include your routes (Update routes to match your project structure)
const cartRoutes = require('./routes/cart.router');
const productRoutes = require('./routes/products.router');
const userRoutes = require('./routes/users.router');


app.use('/carts', authenticationMiddleware, cartRoutes)
app.use('/products', productRoutes);
app.use('/users', userRoutes);




// Example route for the home page
app.get('/', (req, res) => {
  res.render('home'); // Render the 'home.ejs' view when accessing '/'
});

// Start the Express server (Use the PORT from .env)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
