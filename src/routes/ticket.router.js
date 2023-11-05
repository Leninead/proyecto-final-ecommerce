const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/create', ticketController.createTicket);
router.get('/list', ticketController.getTickets);

module.exports = router;
