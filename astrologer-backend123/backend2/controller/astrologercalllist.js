const conn = require('../database/config');



//-------------------------------------------------- Create a new callList---------------------------------------------------------------------//
module.exports = {
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
          res.status(500).json({ error: 'Failed to create callList' });
        } else {
          res.json({ success: true });
        }
      });
    },
    //------------------------------------------------Get by Caller_Id----------------------------------------------------------------------//
 getCallerId : (req, res) =>{
    const caller_id = req.params.caller_id;

    // Retrieve AstrologerCallDetails information from the database based on the caller ID
    const selectQuery = `SELECT * FROM astrologercalllist WHERE caller_id = ?`;
    conn.query(selectQuery, [caller_id], (err, result) => {
              if (err) {
                        throw err;
              } else {
                        res.send(result);
              }
    });
}
  };
  