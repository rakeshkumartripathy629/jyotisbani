const conn = require('../database/config');
const express = require('express');
//app.use(express.json());
const app = express();


// Create a new payment
const createuserPayment = (req, res) => {
    const { payment_getway, user_id, payment_amount, status_of_payment,date_of_payment } = req.body;

    const payment = {
        payment_getway,
        user_id,
        payment_amount,
        status_of_payment,
        date_of_payment,
    };

    // Insert payment into the database
    conn.query('INSERT INTO userpayments SET ?', payment, (err, result) => {
        if (err) {
            console.error('Error creating payment:', err);
            res.status(500).json({ error: 'Failed to create payment' });
        } else {
            console.log('Payment created successfully!');
            res.status(200).json({ message: 'Payment created successfully' });
        }
    });
};


// Get all user payments
const getuserPayments = (req, res) => {
    // Fetch all payments from the database
    conn.query('SELECT * FROM userpayments', (err, results) => {
        if (err) {
            console.error('Error fetching payments:', err);
            res.status(500).json({ error: 'Failed to fetch payments' });
        } else {
            res.status(200).json(results);
        }
    }); 
};

// Get User Payments By ID
const getuserPaymentsbyId = (req, res) => {
    const {user_id} = req.params;
    const query = `SELECT payment_getway,payment_amount,status_of_payment,date_of_payment FROM userpayments WHERE user_id = ?`
    const values = {user_id};
    conn.query(query, values,(error, results) =>{
        if(error){
          console.error('Error fetching User Payment Details by id:', error);
          return res.sendStatus(500);
        }
        res.status(200).json(results);
      })
}

//Get User Payment By filtering Date
const filteruserpaymentbyDate = (req, res) => {
    //Fetch Date wise Payment Details of User
    conn.query(`SELECT payment_getway,user_id,payment_amount,status_of_payment,date_of_payment FROM userpayments WHERE date_of_payment BETWEEN
    '2023-06-01 00:00:00' AND '2024-12-31 12:00:00'`,(err, results) => {
        if (err) {
            console.error('Error fetching payments:', err);
            res.status(500).json({ error: 'Failed to fetch payments' });
        } else {
            res.status(200).json(results);
        }
    });
}

//Total Earning of admin
const totalEarnings = (req,res) => {
    conn.query(`SELECT SUM(payment_amount) AS "Total Earnings" FROM userpayments WHERE date_of_payment BETWEEN
    '2023-06-01 00:00:00' AND '2024-12-31 12:00:00'`,(err, results) => {
        if (err) {
            console.error('Error fetching User payments:', err);
            res.status(500).json({ error: 'Failed to fetch payments' });
        } else {
            res.status(200).json(results);
        }
    });
}
module.exports ={
    createuserPayment,
    getuserPayments,
    getuserPaymentsbyId,
    filteruserpaymentbyDate,
    totalEarnings,
}