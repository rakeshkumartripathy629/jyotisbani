const conn = require('../database/config');
const express = require('express');
const app = express();
const moment = require('moment');

// --------------------------------------------------Create a new call record---------------------------------------------------------//




const call_records = (req, res) => {
  const { astrologer_id, call_type, rate, discount } = req.body;
  const rate_after_discount = rate - (rate * discount) / 100;

  const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

  conn.query(
    'INSERT INTO call_records (astrologer_id, call_type, rate, discount, rate_after_discount, call_datetime) VALUES (?, ?, ?, ?, ?, ?)',
    [astrologer_id, call_type, rate, discount, rate_after_discount, currentDateTime],
    (error, results) => {
      if (error) {
        console.error('Error creating call record:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log('Call record created successfully!');
        res.status(200).json({ message: 'Call record created successfully' });
      }
    }
  );
};

const getCallRecordsByAstrologerId = (req, res) => {
  const astrologerId = req.params.astrologer_id;

  conn.query(
    'SELECT * FROM call_records WHERE astrologer_id = ?',
    [astrologerId],
    (error, results) => {
      if (error) {
        console.error('Error retrieving call records:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json({ callRecords: results });
      }
    }
  );
};

module.exports = {
  call_records,
  getCallRecordsByAstrologerId
};
