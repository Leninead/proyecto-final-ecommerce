const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Sample product data
    const products = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
        // Add more products as needed
    ];

    // Render the Handlebars template with the product data
    res.render('products', { products });
});

module.exports = router;
