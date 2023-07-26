const conn = require('../database/config');
const express = require('express');
//app.use(express.json());
const app = express();


const astroprofile = (req, res) => {
    const astrologerId = req.params.id;
  
    // Fetch astrologer details from the database
    conn.query(
      'SELECT name, email, phone, password, astrologer_type, gender FROM astrologer WHERE id = ?',
      [astrologerId],
      (error, results) => {
        if (error) {
          throw error;
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: 'Astrologer not found' });
        }
  
        const astrologer = results[0];
  
        // Extract required details from the astrologer object
        const { name, email, phone, password, astrologer_type, gender } = astrologer;
  
        // Render the astrologer profile view with the extracted details
        res.send(`
          <h1>${name}</h1>
          <p>Email: ${email}</p>
          <p>Phone: ${phone}</p>
          <p>Password: ${password}</p>
          <p>Astrologer Type: ${astrologer_type}</p>
          <p>Gender: ${gender}</p>
         
        `);
      }
    );
  };
  
  module.exports = {
    astroprofile
  };
  