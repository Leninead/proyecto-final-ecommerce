// src/utils/emailSender.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const emailSender = nodemailer.createTransport({
  
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = emailSender;
