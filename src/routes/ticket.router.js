const express = require('express');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

// Define the routes
router.post('/create', ticketController.createTicket);
router.get('/list', ticketController.getTickets);

module.exports = router;
