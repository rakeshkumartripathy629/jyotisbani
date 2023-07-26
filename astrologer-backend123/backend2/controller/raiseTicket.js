const conn = require('../database/config');


// ------------------------------------------------------Create a new ticket------------------------------------------------------//
const createTicket = (req, res) => {
  const { subject, description } = req.body;
  const ticket = { subject, description, status: 'open' };

  conn.query('INSERT INTO support_tickets SET ?', ticket, (err, result) => {
    if (err) throw err;

    res.status(201).json({ ticketId: result.insertId });
  });
};

// Get ticket by ID
const getTicketById = (req, res) => {
  const { id } = req.params;

  conn.query('SELECT * FROM support_tickets WHERE id = ?', id, (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  });
};

module.exports = {
  createTicket,
  getTicketById,
};
