const conn = require('../database/config');

//-------------------------------------------------------------create wallet------------------------------------------------------//
const createWallet = (req, res) => {
    const { payment_gateway, payment_amount, wallet_balance, date_of_payment, promo_balance, user_id,astrologer_id, expiry_date } = req.body;


    
    const values = { payment_gateway, payment_amount, wallet_balance, date_of_payment, promo_balance, user_id,astrologer_id, expiry_date };

    conn.query('INSERT INTO wallet SET ?', values, (error, results) => {
        if (error) {
          console.error('Error creating wallet entry:', error);
          res.status(500).json({ error: 'Failed to create wallet' });
        } else {
          res.json({ success: true });
        }
      });
    }
       
  //----------------------------------------------------------------get wallet----------------------------------------------//
  const getWallet = (req, res) => {
    const userId = req.query.user_id; // Assuming you pass the user ID as a parameter
  
    conn.query('SELECT * FROM wallet WHERE user_id = ?', [userId], (error, results) => {
      if (error) {
        console.error('Error retrieving wallet:', error);
        res.status(500).json({ error: 'Failed to retrieve wallet' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: 'Wallet not found' });
        } else {
          const wallet = results[0]; // Assuming there is only one wallet per user
          res.json(wallet);
        }
      }
    });
  }
  
module.exports = {
    createWallet,
    getWallet
}