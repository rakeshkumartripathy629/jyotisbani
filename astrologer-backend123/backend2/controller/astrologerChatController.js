const conn = require("../database/config")

module.exports = {
//............................... ASTROLOGER CONVERSATION with USER using ASTROLOGER ID........................//
astrologerChatHistory : function (req, res) {
    const astrologerId = req.params.chat_id;
    
    if (astrologerId) {
              const sql = "select user_message,astrologer_message,time,user_id from user_chat where chat_id = ?";
              conn.query(sql, [astrologerId], (error, result) => {
                        if (error) console.error(error)
                        res.json(result)
              })
    }
},
//............................... when astrologer send message to user..............................//
astrologerChatPost : function (req, res) {
    const { user_id, astrologer_message } = req.body;
    const astrologer_id  = req.astrologerId;
    console.log(req.astrologerId)
    const date = new Date();
    const m = date.getMonth();
    const y = date.getFullYear();
    const d = date.getDate();
    const dd = `${y}-${d}-${m}`
    const sql = "INSERT INTO user_chat ( astrologer_id, astrologer_message, user_id, date) VALUES (?,?,?,?)"
    conn.query(sql, [astrologer_id, astrologer_message, user_id, dd], (error, result) => {
              if (error) console.error(error);
              const getReceiverName = "select name from users where id = ?"
              conn.query(getReceiverName, [user_id], (error, result) => {
                        if (error) console.error(error);
                        res.status(200).json({ message: `message sent to ${result[0].name}` })
              })
    })
},
}