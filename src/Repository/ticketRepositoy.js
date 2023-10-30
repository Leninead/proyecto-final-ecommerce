
const Ticket = require('../models/ticket.model');

module.exports = {
  createTicket: async (ticketData) => {
    const newTicket = new Ticket(ticketData);
    return newTicket.save();
  },
  getTicketById: async (ticketId) => {
    return Ticket.findById(ticketId);
  },
  // Add other CRUD operations as needed for the Ticket model
};
