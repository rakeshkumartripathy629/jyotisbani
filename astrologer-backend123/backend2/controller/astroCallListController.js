const conn = require("../database/config")

module.exports = {
    astrologerCalls: (req, res) => {
      const { user_Id, name, phone_Number, duration } = req.body;
  
      const query = 'INSERT INTO astrocalllist (user_Id, name, phone_Number, duration) VALUES (?, ?, ?, ?)';
      const values = [user_Id, name, phone_Number, duration];
      
      conn.query(query, values, (error, results) => {
        if (error) {
          console.error('Error adding astrologer call:', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.json({ message: 'Astrologer call added successfully' });
        }
      });
    }
  };