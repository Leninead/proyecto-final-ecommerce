const fs = require('fs');
const crypto = require('crypto');

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');
const envContent = `SESSION_SECRET=${secretKey}\n`;

// Write the key to a .env file (overwriting if it already exists)
fs.writeFileSync('.env', envContent);

console.log(`SESSION_SECRET has been generated and saved to the .env file.`);
