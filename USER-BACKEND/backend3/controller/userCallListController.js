const conn = require('../database/config');
const express = require('express');
//app.use(express.json());
const app = express();

;

module.exports = {
  //-------------------------------------------------- Create a new callList ---------------------------------------------------------------------//
  createCallList: (req, res) => {
    const {
      user_id,
      astrologer_id,
      user_phone_no,
      astrologer_phone_no,
      call_duration,
      date_of_call,
      call_direction
    } = req.body;

    const callData = {
      user_id,
      astrologer_id,
      user_phone_no,
      astrologer_phone_no,
      call_duration,
      date_of_call,
      call_direction
    };

    conn.query('INSERT INTO astrologercalllist SET ?', callData, (error, results) => {
      if (error) {
        console.error('Failed to create call list:', error);
        res.status(500).json({ error: 'Failed to create call list' });
      } else {
        res.json({ success: true });
      }
    });
  },
  
  //------------------------------------------------ Get by Caller_Id ----------------------------------------------------------------------//
  getCallerId: (req, res) => {
    const caller_id = req.params.caller_id;

    const selectQuery = `SELECT * FROM astrologercalllist WHERE caller_id = ?`;
    conn.query(selectQuery, [caller_id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve call details by caller ID' });
      } else {
        res.status(200).json({ call_details: result });
      }
    });
  },
  
  //------------------------------------------------ Get user call list ----------------------------------------------------------------------//
  getUserCallList: (req, res) => {
    const user_id = req.params.user_id;

    const selectQuery = `SELECT * FROM astrologercalllist WHERE user_id = ?`;
    conn.query(selectQuery, [user_id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve user call list' });
      } else {
        res.status(200).json({ call_list: result });
      }
    });
  }
};
