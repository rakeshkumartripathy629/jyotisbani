const conn = require('../database/config');


const schedule = (req, res) => {
    const { astrologer_id, date, time, livetopic } = req.body;
    // Insert the video call schedule into the database
    const query = 'INSERT INTO video_call_schedule (astrologer_id, date, time, livetopic) VALUES (?, ?, ?, ?)';
    conn.query(query, [astrologer_id, date, time, livetopic], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Failed to insert schedule' });
      } else {
        res.json({ message: 'Schedule inserted successfully' });
      }
    });
  }


  const schedules = (req, res) => {
   
    // Get the video call schedule from the database
    const query = 'SELECT * FROM video_call_schedule';
    conn.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  }

  module.exports={
    schedule,
    schedules
  }