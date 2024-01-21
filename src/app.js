const express = require('express');
const mongoose = require('./dao/mongoDB');
const config = require('./config');
const authenticateUser = require('./middleware/authMiddleware'); // Import the middleware

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(authenticateUser);
// Routes
const userRoutes = require('../src/routes/users.router');
const productRoutes = require('../src/routes/products.router');
const cartRoutes = require('../src/routes/cart.router');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/checkout', (req, res) => {
  // Render the checkout.ejs file
  res.render('purchase/checkout');
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
