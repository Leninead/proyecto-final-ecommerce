const supertest = require('supertest');
const chai = require('chai');
const app = require('../../src/app');  // Assuming your Express app is in src/app.js
const { v4: uuidv4 } = require('uuid');  
const { productIds } = require('../constants');  // Import the productIds from constants.js

const expect = chai.expect;
const request = supertest(app);

describe('Products Router Tests', () => {
  // Test 1: Add a new product
  it('should add a new product', async () => {
    const response = await request
      .post('/api/products')
      .send({
        name: 'New Test Product',
        description: 'This is a new test product.',
        price: 29.99,
        stock: 30,
        quantity: 5,
      });

    // Check the response status code
    expect(response.status).to.equal(201);

    // Check the response body properties
    expect(response.body).to.have.property('_id');
    expect(response.body).to.have.property('name', 'New Test Product');
    expect(response.body).to.have.property('description', 'This is a new test product.');
    expect(response.body).to.have.property('price', 29.99);
    expect(response.body).to.have.property('stock', 30);
    expect(response.body).to.have.property('quantity', 5);

    // Use the generated product ID for further testing
    const productId = response.body._id;

    // Use the generated user ID for further testing
    const userId = uuidv4();

    // Use one of the predefined product IDs for testing
    const predefinedProductId = productIds[0];

    // ... Perform additional tests using userId, productId, and predefinedProductId ...
  });

  // Test 2: Retrieve product information
  it('should retrieve information for a specific product', async () => {
    // Make a request to retrieve product information (assuming you have a product already created)
    const createdProductResponse = await request
      .post('/api/products')
      .send({
        name: 'Retrieval Test Product',
        description: 'This is a retrieval test product.',
        price: 39.99,
        stock: 20,
        quantity: 8,
      });

    // Extract the created product ID from the response
    const productId = createdProductResponse.body._id;

    // Now, make a request to retrieve information for the specific product
    const response = await request.get(`/api/products/${productId}`);

    // Check the response status code
    expect(response.status).to.equal(200);

    // Check the response body properties
    expect(response.body).to.have.property('_id', productId);
    expect(response.body).to.have.property('name', 'Retrieval Test Product');
    expect(response.body).to.have.property('description', 'This is a retrieval test product.');
    expect(response.body).to.have.property('price', 39.99);
    expect(response.body).to.have.property('stock', 20);
    expect(response.body).to.have.property('quantity', 8);

    // Use the productId for further testing
    // ...

    // Use one of the predefined product IDs for testing
    const predefinedProductId = productIds[1];

    // ... Perform additional tests using productId and predefinedProductId ...

    // Cleanup logic (delete the created product)
    await request.delete(`/api/products/${productId}`);
  });

  // Test 3: Update product information
  it('should update information for a specific product', async () => {
    // Create a product to be updated
    const createdProductResponse = await request
      .post('/api/products')
      .send({
        name: 'Update Test Product',
        description: 'This is a test product for updating.',
        price: 49.99,
        stock: 15,
        quantity: 3,
      });

    // Extract the created product ID from the response
    const productId = createdProductResponse.body._id;

    // Make a request to update product information
    const updatedProductResponse = await request
      .put(`/api/products/${productId}`)
      .send({
        name: 'Updated Test Product',
        description: 'This is an updated test product.',
        price: 59.99,
        stock: 10,
        quantity: 5,
      });

    // Check the response status code
    expect(updatedProductResponse.status).to.equal(200);

    // Check the response body properties
    expect(updatedProductResponse.body).to.have.property('_id', productId);
    expect(updatedProductResponse.body).to.have.property('name', 'Updated Test Product');
    expect(updatedProductResponse.body).to.have.property('description', 'This is an updated test product.');
    expect(updatedProductResponse.body).to.have.property('price', 59.99);
    expect(updatedProductResponse.body).to.have.property('stock', 10);
    expect(updatedProductResponse.body).to.have.property('quantity', 5);

    expect(updatedProductResponse.body).to.have.property('quantity', 5);

    // Use the productId for further testing
    // ...

    // Use one of the predefined product IDs for testing
    const predefinedProductId = productIds[2];

    // ... Perform additional tests using productId and predefinedProductId ...

    // Cleanup logic (delete the created product)
    await request.delete(`/api/products/${productId}`);
  });

  // Test 4: Handle a special case
  it('should handle a special case', async () => {
    const response = await request
      .post('/api/products')
      .send({
        name: 'Special Test Product',
        description: 'This is a special test product.',
        price: 99.99,
        stock: 5,
        quantity: 2,
        specialAttribute: 'Special Value', // Add a special attribute
      });

    // Check the response status code
    expect(response.status).to.equal(201);

    // Check the response body properties, including the special attribute
    expect(response.body).to.have.property('specialAttribute', 'Special Value');

    // Use the generated productId for further testing
    const productId = response.body._id;

    // Use the generated user ID for further testing
    // ...

    // Use one of the predefined product IDs for testing
    const predefinedProductId = productIds[3];

    // ... Perform additional tests using productId, predefinedProductId, and userId ...

    // Cleanup logic (delete the created product)
    await request.delete(`/api/products/${productId}`);
  });

  // Test 5: Another special case
  it('should handle another special case', async () => {
    // Implement another special case test logic here

    // Use the generated productId for further testing
    // ...

    // Use the generated user ID for further testing
    // ... Perform additional tests using userId and productId ...
  });
});

    
  
