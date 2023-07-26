const conn = require('../database/config');





const insertEarnings = (req, res) => {
    const { astrologer_id, total_earnings, varta_earnings, total_affiliate_earnings, report_affiliate_earnings, service_earnings } = req.body;
  
    // Calculate the astrologer's earnings
    const astrologer_earnings = total_earnings - (varta_earnings + total_affiliate_earnings + report_affiliate_earnings + service_earnings);
  
    const insertQuery = "INSERT INTO affiliate (astrologer_id, total_earnings, varta_earnings, total_affiliate_earnings, report_affiliate_earnings, service_earnings, astrologer_earnings) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [astrologer_id, total_earnings, varta_earnings, total_affiliate_earnings, report_affiliate_earnings, service_earnings, astrologer_earnings];
  
    conn.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error("Error inserting earnings data:", error);
        return res.status(500).json({ error: "Failed to insert earnings data." });
      }
  
      const insertedId = results.insertId;
  
      // Fetch total earnings after successful insertion
      const totalEarningsQuery = "SELECT SUM(total_earnings) AS total_earnings FROM affiliate WHERE astrologer_id = ?";
      conn.query(totalEarningsQuery, [astrologer_id], (error, results) => {
        if (error) {
          console.error("Error fetching total earnings:", error);
          return res.status(500).json({ error: "Failed to fetch total earnings." });
        }
  
        const totalEarnings = results[0].total_earnings;
        res.status(201).json({ insertedId, totalEarnings });
      });
    });
  };
  
  module.exports={
    insertEarnings
  }