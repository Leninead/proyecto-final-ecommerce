const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Rest of your code...


function generateNewJWTSecret() {
  // Generate a random string as the JWT secret
  const secretLength = 32; // You can adjust the length as needed
  const randomBytes = crypto.randomBytes(secretLength);
  const jwtSecret = randomBytes.toString('hex');

  return jwtSecret;
}

const envPath = path.resolve(__dirname, '../.env');

// Read the existing content of the .env file
const existingEnvContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';

// Update or add the JWT_SECRET line
const updatedEnvContent = existingEnvContent.replace(
  /^JWT_SECRET=.*/m,
  `JWT_SECRET=${generateNewJWTSecret()}`
);

// Write the updated content back to the .env file
fs.writeFileSync(envPath, updatedEnvContent);

console.log('JWT_SECRET has been updated in .env');
