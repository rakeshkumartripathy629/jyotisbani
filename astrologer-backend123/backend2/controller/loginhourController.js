const conn = require("../database/config")


exports.insertLoginHours = (req, res) => {
    const { astrologerId, fromDate, endDate } = req.body;
  
    const query = 'INSERT INTO login_hours (astrologer_id, from_date, end_date) VALUES (?, ?, ?)';
    conn.query(query, [astrologerId, fromDate, endDate], (error, results) => {
      if (error) {
        console.error('Error inserting login hours:', error);
        res.status(500).json({ error: 'Failed to insert login hours1' });
      } else {
        res.json({ message: 'Login hours inserted successfully' });
      }
    });
  }




    exports.getTotalLoginHours = (req, res) => {
      const { astrologerId,  fromDate, endDate } = req.body;
    
      const query = 'SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_date, from_date)))) AS total_hours FROM login_hours WHERE astrologer_id = ? AND from_date >= ? AND end_date <= ?';
    //  const query= `SELECT * FROM login_hours WHERE from_date >= ? AND end_date <= ? AND astrologer_id=?`;

      conn.query(query, [ astrologerId,fromDate, endDate], (error, results) => {
        if (error) {
          console.error('Error retrieving total login hours:', error);
          res.status(500).json({ error: 'Failed to retrieve total login hours' });
        } else {
          const totalHours = results[0].total_hours;
          res.json({ totalHours });
        }
      });
    }
    
    

    exports.getSummaryLoginHours = (req, res) => {
      const { astrologerId, fromDate, endDate } = req.params;
    
      const query = `
        SELECT 
          DATE(from_date) AS date,
          SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_date, from_date)))) AS total_hours
        FROM 
          login_hours 
        WHERE 
          astrologer_id = ? 
          AND from_date >= ? 
          AND end_date <= ?
        GROUP BY 
          DATE(from_date)
        ORDER BY 
          DATE(from_date) ASC
      `;
    
      conn.query(query, [astrologerId, fromDate, endDate], (error, results) => {
        if (error) {
          console.error('Error retrieving login hours:', error);
          res.status(500).json({ error: 'Failed to retrieve login hours' });
        } else {
          const summary = results.map((row) => ({
            date: row.date,
            totalHours: row.total_hours,
          }));
          res.json({ summary });
        }
      });
    };
    
          