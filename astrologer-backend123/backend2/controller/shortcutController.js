const conn = require('../database/config');

  
  
  const createMessage = (req, res) => {
    const { astrologer_id, shortcut, message } = req.body;
  
    const query = 'INSERT INTO shortcut (astrologer_id, shortcut, message) VALUES (?, ?, ?)';
    conn.query(query, [astrologer_id, shortcut, message], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: 'An error occurred while creating the shortcut message.' });
      } else {
        res.status(200).json({ message: 'Shortcut message created successfully!' });
      }
    });
  };
  //-------------------------------------------------------getMessagesByAstrologerId-----------------------------------------------//
  const getMessages = (req, res) => {
    const {astrologer_id} = req.body;
    const query = 'SELECT * FROM shortcut where astrologer_id=?';
    conn.query(query,[astrologer_id], (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
  };
  
  //------------------------------------------------------------Get Message----------------------------------------------------------//
  const getMessage = (req, res) => {
    const query = 'SELECT * FROM shortcut';
    conn.query(query, (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
  };
  //------------------------------------------------------------update Message----------------------------------------------------------//
  const updateMessage = (req, res) => {
    const {id } = req.params;
    const { shortcut, message } = req.body;
  
    const query = 'UPDATE shortcut SET shortcut = ?, message = ? id = ?';
    conn.query(query, [shortcut, message, id], (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) {
        res.status(404).send('Shortcut message not found');
      } else {
        res.send('Shortcut message updated successfully!');
      }
    });
  };

  const deleteMessage = (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM shortcut WHERE id = ?';
    conn.query(query, [id], (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) {
        res.status(404).send('Shortcut message not found!');
      } else {
        res.send('Shortcut message deleted successfully!');
      }
    });
  };
  module.exports = {
    createMessage,
    getMessage,
    updateMessage,
    deleteMessage,
    getMessages
  };