const conn = require('../database/config');
const express = require('express');
//app.use(express.json());
const app = express();



module.exports = {
    submitCallIntake: (req, res) => {
      const {
        user_id,
        Name,
        Phone,
        Gender,
        DateOfBirth,
        TimeOfBirth,
        PlaceOfBirth,
        MaritalStatus,
        Occupation,
        TopicOfConcern,
      } = req.body;
  
      const callData = {
        user_id,
        Name,
        Phone,
        Gender,
        DateOfBirth,
        TimeOfBirth,
        PlaceOfBirth,
        MaritalStatus,
        Occupation,
        TopicOfConcern,
      };
  
      const insertQuery = 'INSERT INTO call_intake SET ?';
      conn.query(insertQuery, callData, (err, result) => {
        if (err) {
          console.error('Error inserting call intake data into MySQL: ', err);
          res.status(500).json({ message: 'Failed to submit call intake form' });
          return;
        }
        res.status(200).json({ message: 'Call intake form submitted successfully' });
      });
    },

    //----------------------------------------------------------------get_CallIntake-----} = req.params;
    
    getCallIntake: (req, res) => {
        const { UserID } = req.params;
    
        const selectQuery = 'SELECT * FROM call_intake WHERE UserID = ?';
    
        conn.query(selectQuery, [UserID], (err, result) => {
          if (err) {
            console.error('Error retrieving call intake data from MySQL: ', err);
            res.status(500).json({ message: 'Failed to retrieve call intake form' });
            return;
          }
    
          if (result.length === 0) {
            res.status(404).json({ message: 'Call intake form not found' });
            return;
          }
    
          const callIntakeData = result[0];
          res.status(200).json({ callIntakeData });
        });
      },

      getCallIntake: (req, res) => {
        const { user_id } = req.params;
    
        const selectQuery = 'SELECT * FROM call_intake WHERE user_id = ?';
    
        conn.query(selectQuery, [user_id], (err, result) => {
          if (err) {
            console.error('Error retrieving call intake data from MySQL: ', err);
            res.status(500).json({ message: 'Failed to retrieve call intake form' });
            return;
          }
    
          if (result.length === 0) {
            res.status(404).json({ message: 'Call intake form not found' });
            return;
          }
    
          const callIntakeData = result[0];
          res.status(200).json({ callIntakeData });
        });
      },
    };
    
   