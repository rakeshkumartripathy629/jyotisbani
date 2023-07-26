const conn = require('../database/config');
const express = require('express');
const app = express();

// ------------------------------------------------------Create a new payment---------------------------------------------------------//
const creatastroPayment = (req, res) => {
  const { astrologer_id, payment_gateway	, payment_amount, status_of_payment, date_of_payment,month,year } = req.body;

  // Check if astrologer_id is provided
  if (!astrologer_id) {
    res.status(400).json({ error: 'Astrologer ID is required' });
    return;
  }

  const payment = {
    astrologer_id,
    payment_gateway	,
  
    payment_amount,
    status_of_payment,
    date_of_payment,
    month,
    year,
  };

  // Insert payment into the database
  conn.query('INSERT INTO astrologer_payments SET ?', payment, (err, result) => {
    if (err) {
      console.error('Error creating payment:', err);
      res.status(500).json({ error: 'Failed to create payment' });
    } else {
      console.log('Payment created successfully!');
      res.status(200).json({ message: 'Payment created successfully' });
    }
  });
};

//---------------------------------- Get all user payments-----------------------------------------------------------------//
const getastroPayments = (req, res) => {
  // Fetch all payments from the database
  conn.query('SELECT * FROM astrologer_payments', (err, results) => {
    if (err) {
      console.error('Error fetching payments:', err);
      res.status(500).json({ error: 'Failed to fetch payments' });
    } else {
      res.status(200).json(results);
    }
  });
};

// -------------------------------------------Get user payments by ID------------------------------------------------------------//
const getastroPaymentsbyId = (req, res) => {
  const { astrologer_id } = req.params;
  const query = `SELECT payment_getway, astrologer_id payment_amount, status_of_payment, date_of_payment FROM astrologer_payments WHERE astrologer_id = ?`;
  conn.query(query, astrologer_id, (error, results) => {
    if (error) {
      console.error('Error fetching astrologer payment details by ID:', error);
      res.status(500).json({ error: 'Failed to fetch user payment details' });
    } else {
      res.status(200).json(results);
    }
  });
};

//------------------------------------------------ Filter user payments by date------------------------------------------------------//
const filterastropaymentbyDate = (req, res) => {
  const { astrologer_id } = req.params;
  // Fetch date-wise payment details of the user
  const query = `SELECT payment_getway, astrologer_id, payment_amount, status_of_payment, date_of_payment FROM astrologer_payments.
   WHERE astrologer_id = ? AND date_of_payment BETWEEN '2023-06-01 00:00:00' AND '2024-12-31 12:00:00'`;
  conn.query(query, astrologer_id, (err, results) => {
    if (err) {
      console.error('Error fetching payments:', err);
      res.status(500).json({ error: 'Failed to fetch payments' });
    } else {
      res.status(200).json(results);
    }
  });
};

//----------------------------------------- Total earnings of the astrologer----------------------------------------------------//
const totalEarnings = (req, res) => {
  const { astrologer_id } = req.params;
  const query = `SELECT SUM(payment_amount) AS total_earnings FROM astrologer_payments WHERE astrologer_id = ? AND date_of_payment BETWEEN '2023-06-01 00:00:00' AND '2024-12-31 12:00:00'`;
  conn.query(query, astrologer_id, (err, results) => {
    if (err) {
      console.error('Error fetching user payments:', err);
      res.status(500).json({ error: 'Failed to fetch payments' });
    } else {
      res.status(200).json(results);
    }
  });
};
// ----------------------Retrieve astrologer payment report by astrologer ID, month, and year---------------------------------------//
const getAstrologerPaymentReport = (req, res) => {
  const { astrologer_id, month, year } = req.query;

  // Check if astrologer_id, month, and year are provided
  if (!astrologer_id || !month || !year) {
    res.status(400).json({ error: 'Astrologer ID, month, and year are required' });
    return;
  }

  // Construct the query
  const query = `
    SELECT *
    FROM astrologer_payments
    WHERE astrologer_id = ${astrologer_id}
      AND MONTH(date_of_payment) = ${month}
      AND YEAR(date_of_payment) = ${year}
  `;

  // Execute the query
  conn.query(query, (err, result) => {    // Execute the query
  
    if (err) {
      console.error('Error fetching astrologer payment report:', err);
      res.status(500).json({ error: 'Failed to fetch astrologer payment report' });
    } else {
      res.status(200).json(result);
    }
  });
};




module.exports = {
    creatastroPayment,
    getastroPayments,
    getastroPaymentsbyId,
    filterastropaymentbyDate,
  totalEarnings,
  getAstrologerPaymentReport
  
};
