const expect = chai.expect;
const request = supertest(app);
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');

describe('Cart Router Tests', () => {
  let userId; // Declare userId outside the tests to use it across multiple tests
  let cartId; // Declare cartId to use it across multiple tests

  // Retrieve the user ID from the registered user
  before(async () => {
    const registerResponse = await request
      .post('/api/users/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        age: 25,
        password: 'securepassword',
        role: 'user',
      });

    userId = registerResponse.body._id;
  });

  // Create a cart for the user before running tests
  before(async () => {
    const createCartResponse = await request
      .post('/api/cart')
      .send({
        userId: userId,
      });

    cartId = createCartResponse.body._id;
  });

  // Test 2: Retrieve cart contents
  it('should retrieve cart contents', async () => {
    // Make a request to retrieve the contents of the cart
    const retrieveCartContentsResponse = await request.get(`/api/cart/${cartId}`);

    // Check the response status code
    expect(retrieveCartContentsResponse.status).to.equal(200);

    // Check the response body properties
    expect(retrieveCartContentsResponse.body).to.have.property('_id', cartId);
    expect(retrieveCartContentsResponse.body).to.have.property('userId', userId);
    expect(retrieveCartContentsResponse.body).to.have.property('products').that.is.an('array');
  });

  // ... (other tests)

  // Cleanup: Remove the test user and cart after all tests are done
  after(async () => {
    try {
      // Find the test cart and associated products
      const testCart = await Cart.findOne({ user: userId });
  
      if (testCart) {
        // Remove associated products
        await Product.deleteMany({ _id: { $in: testCart.products.map(product => product.product) } });
  
        // Remove the test cart
        await Cart.deleteOne({ _id: testCart._id });
  
        console.log('Cleanup: Removed test cart and associated products from the database');
      }
  
      // Remove the test user
      await User.deleteOne({ email: 'john.doe@example.com' });
  
      console.log('Cleanup: Removed test user from the database');
    } catch (error) {
      console.error('Error during cleanup:', error.message);
    }
  });
});
