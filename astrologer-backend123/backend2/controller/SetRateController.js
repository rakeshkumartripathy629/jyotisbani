const conn = require('../database/config');


//-------------------------------------------------- Create rate details for astrologers-------------------------------------------//

const createAstrologerRate = (req, res) => {
  const { astrologerId, callRate, chatRate, privateCallRate, discount,callRateAfterDiscount, chatRateAfterDiscount, privateCallRateAfterDiscount} = req.body;

  conn.query(
    'INSERT INTO `set_rate` (astrologerId, callRate, chatRate, privateCallRate, discount,callRateAfterDiscount, chatRateAfterDiscount,privateCallRateAfterDiscount) VALUES (?, ?, ?, ?, ?,?,?,?)',
    [astrologerId, callRate, chatRate, privateCallRate, discount,callRateAfterDiscount,chatRateAfterDiscount,privateCallRateAfterDiscount],
    (error, results) => {
      if (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to create astrologer rate' });
      } else {
        res.json({ message: 'Astrologer rate created successfully' });
      }
    }
  );
};


// //-------------------------------------------------Get astrologer rates----------------------------------------------------------//
const getAstrologers = (req, res) => {
  conn.query('SELECT * FROM `set_rate`', (error, results) => {
    if (error) {
      console.error('Failed to fetch astrologer rates:', error);
      res.status(500).json({ error: 'Failed to fetch astrologer rates' });
    } else {
      res.json(results);
    }
  });
};

//-------------------------------------------------------------calculateDiscountedRates---------------------------------------//


  const calculateDiscountedRates = (req, res) => {
    const { astrologerId } = req.body;
  
    conn.query(
      'SELECT * FROM `set_rate` WHERE astrologerId = ?',
      [astrologerId],
      (error, results) => {
        if (error) {
          res.status(500).json({ error: 'Failed to fetch astrologer' });
        } else if (results.length === 0) {
          res.status(404).json({ error: 'Astrologer not found' });
        } else {
          const astrologer = results[0];
          let callRateAfterDiscount = null;
          let chatRateAfterDiscount = null;
          let privateCallRateAfterDiscount = null;
  
          if (astrologer.callRate && astrologer.discount) {
            callRateAfterDiscount = astrologer.callRate * (1 - astrologer.discount / 100);
          }
  
          if (astrologer.chatRate && astrologer.discount) {
            chatRateAfterDiscount = astrologer.chatRate * (1 - astrologer.discount / 100);
          }
  
          if (astrologer.privateCallRate && astrologer.discount) {
            privateCallRateAfterDiscount = astrologer.privateCallRate * (1 - astrologer.discount / 100);
          }
  
          res.json({
            astrologerId: astrologer.astrologerId,
            name: astrologer.name,
            callRate: astrologer.callRate,
            chatRate: astrologer.chatRate,
            privateCallRate: astrologer.privateCallRate,
            discount: astrologer.discount,
            callRateAfterDiscount,
            chatRateAfterDiscount,
            privateCallRateAfterDiscount,
          });
        }
      }
    );
  };
  
  // -------------------------------------------------Update astrologer rate-----------------------------------------------------------//
const setAstrologerRate = (req, res) => {
  const { astrologerId, callRate, chatRate, privateCallRate ,discount} = req.body;
  const update="UPDATE set_rate SET callRate = ?, chatRate = ?,  privateCallRate = ? ,discount=? WHERE astrologerId = (?)"
  conn.query(
    update,
    [callRate, chatRate, privateCallRate,discount, astrologerId],
    (error, results) => {
      if (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to update astrologer rate' });
      } else if (results.affectedRows === 0) {
        console.log(results)
        res.status(404).json({ error: 'Astrologer not found' });
      } else {
        res.json({ message: 'Astrologer rate updated successfully' });
      }
    }
  );
};
  
  // Export the functions
  module.exports = {
    createAstrologerRate,
    getAstrologers,
    calculateDiscountedRates,
    setAstrologerRate
  };