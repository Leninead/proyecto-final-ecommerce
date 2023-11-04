const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  // Fields specific to the Ticket model
  event: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // Add more fields as needed

  // Reference to the user who purchased the ticket
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
