const Ticket = require('../models/ticket.model');

async function createTicket(req, res) {
    try {
        // 1. Input Validation
        const { event, price, userId } = req.body;

        if (!event || typeof price !== 'number' || !userId) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        // 2. Create a New Ticket
        const ticket = new Ticket({
            event,
            price,
            user: userId, // Assuming you have user information available in the request
        });

        // 3. Save Ticket to the Database
        await ticket.save();

        // 4. Response
        res.status(201).json({ message: 'Ticket created successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

async function getTickets(req, res) {
    try {
        
        // Fetch all tickets from the database
        const tickets = await Ticket.find();

        // Respond with the retrieved tickets
        res.status(200).json(tickets);
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

module.exports = {
    createTicket,
    getTickets,
};
