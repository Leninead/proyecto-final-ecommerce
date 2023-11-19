const fs = require('fs');
const path = require('path');

// Placeholder function for generating a new JWT secret
function generateNewJWTSecret() {
  // Replace this with your actual logic to generate the JWT secret
  return 'your_generated_jwt_secret_here';
}

const newlyGeneratedJWTSecret = generateNewJWTSecret();

// Your existing code to generate secrets...

const envPath = path.resolve(__dirname, '../.env');

// Read the existing content of the .env file
const existingEnvContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';

// Update or add the JWT_SECRET line
const updatedEnvContent = existingEnvContent.replace(
  /^JWT_SECRET=.*/m,
  `JWT_SECRET=${newlyGeneratedJWTSecret}`
);

// Write the updated content back to the .env file
fs.writeFileSync(envPath, updatedEnvContent);

console.log('JWT_SECRET has been updated in .env');
