const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ejs = require('ejs'); // Import the EJS library
const path = require('path');

// Define your Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'leninacosta5@gmail.com', // Your Gmail email
    pass: 'ytoxxjninhopanqy', // The app password you generated
  },
});

router.post('/mail', (req, res) => {
  // Define the data you want to pass to the email template
  const userData = {
    name: 'John Doe',
    // Add other user-related data here
  };

  const orderData = {
    products: [
        {
            name: 'Product 1', // Replace with the actual name of the product from your database
            quantity: 2, // The quantity purchased
            category: 'Category 1', // The category of the product
            price: 10.99, // The price of the product
            image: 'product1.jpg', // The image URL of the product
          },
          
    ],
    totalAmount: 21.98, // Replace with the actual total amount
  };

  // Render the email template with the data
  ejs.renderFile(path.join(__dirname, 'views', 'email-template.ejs'), {
    user: userData,
    order: orderData,
  }, (err, emailHTML) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error rendering email' });
    } else {
      const mailOptions = {
        from: 'leninacosta5@gmail.com', // Your Gmail email
        to: 'leninacosta2107@gmail.com',
        subject: 'Coder House Project',
        html: emailHTML, // Use the rendered HTML content
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Error sending email' });
        } else {
          console.log('Email sent: ' + info.response);
          res.json({ message: 'Email sent successfully' });
        }
      });
    }
  });
});

module.exports = router;
