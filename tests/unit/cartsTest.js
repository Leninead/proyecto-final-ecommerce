const supertest = require('supertest');
const chai = require('chai');
const app = require('../src/app');  // Assuming your Express app is in src/app.js
const { productIds } = require('../constants');  // Import the productIds from constants.js
const { v4: uuidv4 } = require('uuid');  

const expect = chai.expect;
const request = supertest(app);

describe('Cart Router Tests', () => {
    // Test 1: Add a product to the cart
    it('should add a product to the cart', async () => {
      const userId = uuidv4();  // Generate a unique user ID for each test run
      const productId = productIds[0];  // You can still use a predefined product ID or generate a dynamic one
  
      const response = await request
        .post('/api/cart/addToCart')
        .send({
          userId,  // Add the userId to the request payload
          productId,
          quantity: 3,
        });

    // Check the response status code
    expect(response.status).to.equal(201);

    // Check the response body properties
    expect(response.body).to.have.property('userId').that.is.a('string'); // Assuming userId is a string
    expect(response.body).to.have.property('cartItems').that.is.an('array');

    // Add more assertions as needed...
  });

  // Test 2: Retrieve cart contents
  it('should retrieve cart contents', async () => {
    const userId = uuidv4();

    const createCartResponse = await request
      .post('/api/cart')
      .send({
        userId,
      });

    // Extract the created cart ID from the response
    const cartId = createCartResponse.body._id;

    // Make a request to retrieve the contents of the cart
    const retrieveCartContentsResponse = await request.get(`/api/cart/${cartId}`);

    // Check the response status code
    expect(retrieveCartContentsResponse.status).to.equal(200);

    // Check the response body properties
    expect(retrieveCartContentsResponse.body).to.have.property('_id', cartId);
    expect(retrieveCartContentsResponse.body).to.have.property('userId', userId);

    expect(retrieveCartContentsResponse.body).to.have.property('products').that.is.an('array');

    // Add more assertions as needed...
  });

  // Test 3: Update product quantity in the cart
  it('should update product quantity in the cart', async () => {
    // Step 1: Create a new cart with a product
    const createCartResponse = await request
      .post('/api/cart')
      .send({
        userId: 'testUserId', // Replace with a valid user ID
      });

    const cartId = createCartResponse.body._id;

    // Use the first product ID and an initial quantity
    const addProductResponse = await request
      .post(`/api/cart/${cartId}/products`)
      .send({
        productId: productIds[0],
        quantity: 5, // Initial quantity
      });

    expect(addProductResponse.status).to.equal(200);

    // Step 2: Update the product quantity
    const updateQuantityResponse = await request
      .put(`/api/cart/${cartId}/products/${productIds[0]}`)
      .send({
        newQuantity: 10, // Replace with the desired updated quantity
      });

    // Check the response status code
    expect(updateQuantityResponse.status).to.equal(200);

    // Step 3: Retrieve the updated cart and verify the changes
    const retrieveCartContentsResponse = await request.get(`/api/cart/${cartId}`);

    // Check the response status code
    expect(retrieveCartContentsResponse.status).to.equal(200);

    // Check the response body properties
    expect(retrieveCartContentsResponse.body).to.have.property('_id', cartId);
    expect(retrieveCartContentsResponse.body).to.have.property('userId', userId);

    expect(retrieveCartContentsResponse.body).to.have.property('products').that.is.an('array');

    // Verify that the product quantity has been updated
    const updatedProduct = retrieveCartContentsResponse.body.products.find(product => product.productId === productIds[0]);
    expect(updatedProduct).to.exist;
    expect(updatedProduct).to.have.property('quantity', 10); // Adjust with the expected updated quantity
  });

  // Test 4: Remove a product from the cart
  it('should remove a product from the cart', async () => {
    // Step 1: Create a new cart with a product
    const createCartResponse = await request
      .post('/api/cart')
      .send({
        userId: 'testUserId', // Replace with a valid user ID
      });

    const cartId = createCartResponse.body._id;

    // Use the first product ID and an initial quantity
    const addProductResponse = await request
      .post(`/api/cart/${cartId}/products`)
      .send({
        productId: productIds[0],
        quantity: 5, // Initial quantity
      });

    expect(addProductResponse.status).to.equal(200);

    // Step 2: Remove the product from the cart
    const removeProductResponse = await request
      .delete(`/api/cart/${cartId}/products/${productIds[0]}`);

    // Check the response status code
    expect(removeProductResponse.status).to.equal(200);

    // Step 3: Retrieve the updated cart and verify the removal
    const retrieveCartContentsResponse = await request.get(`/api/cart/${cartId}`);

    // Check the response status code
    expect(retrieveCartContentsResponse.status).to.equal(200);

    // Check the response body properties
    expect(retrieveCartContentsResponse.body).to.have.property('_id', cartId);
    expect(retrieveCartContentsResponse.body).to.have.property('userId', userId);
    ;
    expect(retrieveCartContentsResponse.body).to.have.property('products').that.is.an('array');

    // Verify that the product has been removed
    const removedProduct = retrieveCartContentsResponse.body.products.find(product => product.productId === productIds[0]);
    expect(removedProduct).to.not.exist;
  });

  // Special Cart Cases
  describe('Special Cart Cases', () => {
    // Test 5: Handle a special case - Removing a product from an empty cart
    it('should handle removing a product from an empty cart', async () => { 
        const userId = uuidv4();

    const createEmptyCartResponse = await request
        .post('/api/cart')
        .send({
          userId,
        });
      const emptyCartId = createEmptyCartResponse.body._id;

      // Attempt to remove a product from the empty cart
      const removeProductFromEmptyCartResponse = await request
        .delete(`/api/cart/${emptyCartId}/products/${productIds[0]}`);

      // Check the response status code
      expect(removeProductFromEmptyCartResponse.status).to.equal(404);
      // Adjust the expectation based on your error handling logic
         // Optionally, you can check the response body for an error message
         expect(removeProductFromEmptyCartResponse.body).to.have.property('error');
        });
    
        // Test 6: Another special case - Handle a scenario specific to your application 

        it('should handle adding a negative quantity to the cart', async () => {
            const userId = uuidv4();

       const createCartResponse = await request
        .post('/api/cart')
        .send({
          userId,
        });
          const cartId = createCartResponse.body._id;
    
          // Attempt to add a product with a negative quantity to the cart
          const addNegativeQuantityResponse = await request
            .post(`/api/cart/${cartId}/products`)
            .send({
              productId: productIds[0], // Replace with a valid product ID
              quantity: -1, // Attempting to add a negative quantity
            });
    
          // Check the response status code
          expect(addNegativeQuantityResponse.status).to.equal(400);
          // Adjust the expectation based on your error handling logic
    
          // Optionally, check the response body for an error message
          expect(addNegativeQuantityResponse.body).to.have.property('error');
        });
      });
    });
    