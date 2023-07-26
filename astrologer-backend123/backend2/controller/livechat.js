const conn = require("../database/config");
// chatController.js

const handleIncomingMessages = (req, res, connection) => {
    const { message } = req.body;
  
    // Check if the user's message matches any trigger word in the auto-reply messages table
    const checkTriggerQuery = 'SELECT * FROM chat_messages  WHERE ? LIKE CONCAT("%", trigger_word, "%")';
    conn.query(checkTriggerQuery, [message], (error, results, fields) => {
      if (error) {
        console.error('Error checking trigger word:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      if (results.length > 0) {
        // If a match is found, retrieve the corresponding reply message
        const replyMessage = results[0].reply_message;
  
        // Save the user's message and the auto-reply message to the chat messages table
        const saveMessageQuery = 'INSERT INTO chat_messages (message, sender) VALUES (?, ?)';
        conn.query(saveMessageQuery, [message, 'User'], (error) => {
          if (error) {
            console.error('Error saving user message:', error);
          }
        });
  
        const saveReplyQuery = 'INSERT INTO chat_messages (message, sender) VALUES (?, ?)';
        conn.query(saveReplyQuery, [replyMessage, 'Auto-Reply'], (error, results, fields) => {
          if (error) {
            console.error('Error saving auto-reply message:', error);
          }
        });
  
        // Send the auto-reply message back to the user
        res.json({ message: replyMessage });
      } else {
        // If no match is found, send a default response or handle the situation as desired
        res.json({ message: 'Sorry, I cannot provide an auto-reply for that message.' });
      }
    });
  };
  
  module.exports = {
    handleIncomingMessages,
  };
  