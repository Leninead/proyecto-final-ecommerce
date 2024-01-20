const axios = require('axios');

async function performStressTesting() {
  try {
    // Array to store promises for concurrent requests
    const requests = [];

    // Number of requests you want to perform
    const numberOfRequests = 10;

    // API endpoint you want to stress test
    const apiEndpoint = 'http://your-api-endpoint';

    // Sending multiple requests concurrently
    for (let i = 0; i < numberOfRequests; i++) {
      // Push each request promise into the array
      requests.push(axios.get(apiEndpoint));
    }

    // Wait for all requests to complete
    const responses = await Promise.all(requests);

    // Log the responses or perform any other desired action
    responses.forEach((response, index) => {
      console.log(`Response from request ${index + 1}:`, response.data);
    });
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { performStressTesting };
