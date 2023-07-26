const connection = require("../database/config");
const express = require('express');
// Create Express app
const app = express();
// Middleware to parse JSON requests
app.use(express.json());

// API endpoint to get wallet balance
const WalletDetails = (req, res) => {
  const user_id = req.params.user_id;
  const query = 'SELECT wallet_balance FROM wallet WHERE user_id = ?';
  connection.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const balance = results[0].balance;
    res.json({ balance });
  });
};

//Route to Get All wallet Details of the astrologer List
const getAstrologerWalletDetails = (req, res) =>{
  const {astrologer_id} = req.params;
  const query = `SELECT payment_amount,wallet_balance,date_of_payment,astrologer_id FROM wallet`;
  const values = [astrologer_id];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error fetching  Astrologer Wallet list details:', error);
      return res.sendStatus(500);
    }

    res.status(200).json(results);
  });
};

//Route to Get astrologer wallet Details By ID
const getAstrologerWalletDetailsbyId = (req, res) =>{
  const {astrologer_id} = req.params;
  const query = `SELECT wallet_balance,date_of_payment,payment_amount FROM wallet WHERE astrologer_id = ?`
  const values = [astrologer_id];
  connection.query(query, values,(error, results) =>{
    if(error){
      console.error('Error fetching Astrologer Wallet Details by id:', error);
      return res.sendStatus(500);
    }
    res.status(200).json(results);
  })
};


//Route to Get User wallet Details By ID
const getUserWalletDetails = (req, res)=> {
  const {user_id} = req.params;
  const query = `SELECT payment_gateway, payment_amount, wallet_balance, date_of_payment, promo_balance, user_id, expiry_date FROM wallet`
  const values = [user_id];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error fetching  User Wallet list details:', error);
      return res.sendStatus(500);
    }

    res.status(200).json(results);
  });
}

//Route to Get USer Wallet By ID
const getUserWalletDetailsbyId = (req, res) => {
  const {user_id} = req.params;
  const query = `SELECT payment_gateway, payment_amount, wallet_balance, date_of_payment, promo_balance, expiry_date FROM wallet WHERE user_id = ?`
  const values = [user_id];
  connection.query(query,values,(error, results) => {
    if(error){
      console.error('Error fetching User wallet Details By id:', error);
      res.status(200).json(results);
    }
  })
}

// API endpoint to update wallet balance
// app.post('/wallet/:user_id/update', (req, res) => {
//   const userId = req.params.userId;
//   const { amount } = req.body;

//   if (!amount || typeof amount !== 'number' || amount <= 0) {
//     res.status(400).json({ error: 'Invalid amount' });
//     return;
//   }

//   const query = 'UPDATE wallet SET wallet_balance = wallet_balance + ? WHERE user_id = ?';
//   connection.query(query, [amount, userId], (err, results) => {
//     if (err) {
//       console.error('Error executing MySQL query:', err);
//       res.status(500).json({ error: 'Internal server error' });
//       return;
//     }
//     if (results.affectedRows === 0) {
//       res.status(404).json({ error: 'User not found' });
//       return;
//     }
//     res.json({ message: 'Balance updated successfully' });
//   });
// });
//create User Wallet
const userWalletDetails =  (req, res) => {
  const {payment_gateway, payment_amount, wallet_balance, date_of_payment, promo_balance,user_id, expiry_date} = req.body;

  const query = `INSERT INTO wallet (payment_gateway, payment_amount, wallet_balance, date_of_payment, promo_balance, user_id, expiry_date)
  VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  const values = [payment_gateway, payment_amount, wallet_balance, date_of_payment, promo_balance, user_id, expiry_date];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error creating User Wallet:', error);
      return res.sendStatus(500);
    }
    console.log('User Wallet is created successfully');
    res.sendStatus(200);
  });
};

//create astrologer Wallet
const astrologerWalletDetails = (req, res) => {
  const {payment_amount, wallet_balance, date_of_payment, astrologer_id} = req.body;
  const query = `INSERT INTO wallet (payment_amount, wallet_balance, date_of_payment, astrologer_id) VALUES (?, ?, ?, ?)`;

  const values = [payment_amount, wallet_balance, date_of_payment, astrologer_id];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error creating Astrologer Wallet:', error);
      return res.sendStatus(500);
    }    
    console.log('Astrologer Wallet is created successfully');
    res.sendStatus(200);
  });
}

//Admin payments for Astrologer
const adminPaymentstoAstrologer = (req,res) => {
  connection.query(`SELECT astrologer_id,date_of_payment,SUM(payment_amount) AS "Total Payment to Astrologer" FROM wallet GROUP BY astrologer_id `,(err, results) => {
      if (err) {
          console.error('Error fetching astrologer payments:', err);
          res.status(500).json({ error: 'Failed to fetch payments' });
      } else {
          res.status(200).json(results);
      }
  })
}




module.exports = {
  getAstrologerWalletDetails,
  getAstrologerWalletDetailsbyId,
  userWalletDetails,
  astrologerWalletDetails,
  getUserWalletDetails,
  getUserWalletDetailsbyId,
  WalletDetails,
  adminPaymentstoAstrologer,
};