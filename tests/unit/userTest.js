const expect = chai.expect;
const request = supertest(app);
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');

describe('Users Router Tests', () => {
  let userId; // Declare userId outside the tests to use it across multiple tests
  let sessionId; // Declare sessionId to use it across multiple tests

  // Register a user before running tests
  before(async () => {
    const registerResponse = await request
      .post('/api/users/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'securepassword',
      });

    userId = registerResponse.body._id;
  });

  // Login and create a session for the user before running tests
  before(async () => {
    const loginResponse = await request
      .post('/api/users/login')
      .send({
        email: 'john.doe@example.com',
        password: 'securepassword',
      });

    sessionId = loginResponse.body.token;
  });

  // Test 1: Retrieve current user
  it('should retrieve current user', async () => {
    const retrieveCurrentUserResponse = await request
      .get('/api/users/current')
      .set('Authorization', `Bearer ${sessionId}`);

    // Check the response status code
    expect(retrieveCurrentUserResponse.status).to.equal(200);

    // Check the response body properties
    expect(retrieveCurrentUserResponse.body).to.have.property('_id', userId);
    expect(retrieveCurrentUserResponse.body).to.have.property('firstName', 'John');
    expect(retrieveCurrentUserResponse.body).to.have.property('lastName', 'Doe');
    // Add more checks based on your user model
  });

  // Test 2: Retrieve user profile
  it('should retrieve user profile', async () => {
    const retrieveUserProfileResponse = await request
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${sessionId}`);

    // Check the response status code
    expect(retrieveUserProfileResponse.status).to.equal(200);

    // Add more checks based on your user profile response
  });

  // ... (other tests)

  // Cleanup: Remove the test user and session after all tests are done
  after(async () => {
    try {
      // Remove the test user
      await User.deleteOne({ _id: userId });

      // Remove the test session (if required)
      // Implement your session cleanup logic based on your authentication setup

      console.log('Cleanup: Removed test user and session from the database');
    } catch (error) {
      console.error('Error during cleanup:', error.message);
    }
  });
});
