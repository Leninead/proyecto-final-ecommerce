// ticketController.js
const express = require('express');
const router = express.Router();

// Assuming you have a route to generate a ticket
router.get('/generateTicket', (req, res) => {
  // Generate the ticket and get the ticketData

  // Render the ticket.ejs template with the ticket data
  res.render('ticket', { ticketData });
});

module.exports = router;
