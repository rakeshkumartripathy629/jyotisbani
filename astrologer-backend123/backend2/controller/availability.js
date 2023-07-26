const conn = require('../database/config');
const express = require('express');
const app = express();
const moment = require('moment');


const availability=(req, res) => {
    const { astrologer_id, availability } = req.body;
  
    // Calculate the number of available days and hours in a week
    const totalDays = Object.keys(availability).length;
    let totalHours = 0;
    for (const dayOfWeek in availability) {
      const { start_time, end_time } = availability[dayOfWeek];
      const startTime = new Date(`2023-07-03 ${start_time}`);
      const endTime = new Date(`2023-07-04 ${end_time}`);
      const diffHours = (endTime - startTime) / (1000 * 60 * 60);
      totalHours += diffHours;
    }
  
    const sql = `INSERT INTO availability (astrologer_id, total_days, total_hours) 
                 VALUES (?, ?, ?)`;
  
    conn.query(sql, [astrologer_id, totalDays, totalHours], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create availability record' });
      }
  
      res.status(201).json({ message: 'Availability record created successfully' });
    });
  }

  module.exports={
    availability
  }
  