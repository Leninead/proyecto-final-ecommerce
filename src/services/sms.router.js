const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Log Twilio configuration values
console.log(`TWILIO_ACCOUNT_SID: ${process.env.TWILIO_ACCOUNT_SID}`);
console.log(`TWILIO_AUTH_TOKEN: ${process.env.TWILIO_AUTH_TOKEN}`);
console.log(`TWILIO_PHONE_NUMBER: ${process.env.TWILIO_PHONE_NUMBER}`);

// Create the Twilio client only if the required environment variables are set
let client;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  console.log('Twilio client will be created.');
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
} else {
  console.log('Twilio client will not be created because environment variables are missing.');
}

// Define a route to send a thank you SMS
router.post('/sendThankYouSMS', (req, res) => {
  // Check if the Twilio client is properly configured
  if (!client) {
    console.error('Twilio client not properly configured. Check your environment variables.');
    return res.status(500).json({ message: 'Twilio client not properly configured' });
  }

  const phoneNumber = process.env.TWILIO_PHONE_NUMBER || '+541137819989'; // Replace with the user's phone number
  const message = 'Thank you for your purchase!'; // Your thank you message

  // Send the SMS
  client.messages.create({
    body: message,
    to: phoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER || '+541137819989', // Use the environment variable if available, otherwise, use the hardcoded number
  })
  .then((message) => {
    console.log(`SMS sent with SID: ${message.sid}`);
    res.json({ message: 'Thank you SMS sent successfully' });
  })
  .catch((error) => {
    console.error(`Error sending SMS: ${error.message}`);
    res.status(500).json({ message: 'Error sending SMS' });
  });
});

module.exports = router;
