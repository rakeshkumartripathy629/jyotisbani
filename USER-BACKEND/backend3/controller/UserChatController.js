const conn = require('../database/config');
const express = require('express');
//app.use(express.json());
const app = express();





//............................... USER CONVERSATION with ASTROLOGER using USER ID  ........................//

const userChatHistory = function (req, res) {
  const userId = req.params.chat_id;
  if (userId) {
            const sql = "select user_message,astrologer_message,time,astrologer_id from user_chat where chat_id = ?"
            conn.query(sql, [userId], (error, result) => {
                      if (error) console.error(error)
                      res.json(result)
            })
  }
}
//............................... USER CONVERSATION with ASTROLOGER using USER ID  ........................//

//................................ when USER send message to Astrologer  ................................//
// const userChatPost= (req, res) => {
//   // const user_id = 32;
//   // const astro_id = 52;
//   // const message = "hellloooothere"
//   const { user_id, astro_id, message } = req.body;
//   console.log(req.body//)
//   const sql1 = "select * from users where phone_number=?"
//   conn.query(sql1, [req.userPhone_number], (error, result) => {
//     if (error) console.error(error);
//     console.log(result[0])
//     if (result[0]) {
//       const date = new Date();
//       const m = date.getMonth();
//       const y = date.getFullYear();
//       const d = date.getDate();
//       const dd = `${y}-${d}-${m}`;
//       const chatsql =
//         "INSERT INTO user_chat ( user_id, user_message, astrologer_id, date) VALUES (?,?,?,?)";
//       conn.query(chatsql, [user_id, message, astro_id, dd], (error, result) => {
//         if (error) console.error(error);
//         const getReceiverName = "select name from astrologer where id = ?";
//         conn.query(getReceiverName, [astro_id], (error, result) => {
//           if (error) console.error(error);
//           console.log(result)
//           res
//             .send("message sentt" );
//         });
//       });
//     }else{
//       res.status(400).json({message:"not valid user"})
//     }
//   });
// }
//............................... ASTROLOGER CONVERSATION with USER using ASTROLOGER ID........................//
// const astrologerChatHistory = function (req, res) {
//     const astrologerId = req.params.chat_id;
    
//     if (astrologerId) {
//               const sql = "select user_message,astrologer_message,time,user_id from user_chat where chat_id = ?";
//               conn.query(sql, [astrologerId], (error, result) => {
//                         if (error) console.error(error)
//                         res.json(result)
//               })
//     }
// }
//............................... when USER send message to Astrologer..............................//
// const astrologerChatPost = function (req, res) {
//     const { astrologer_id, user_id, astrologer_message } = req.body;
//     const date = new Date();
//     const m = date.getMonth();
//     const y = date.getFullYear();
//     const d = date.getDate();
//     const dd = `${y}-${d}-${m}`
//     const sql = "INSERT INTO user_chat ( astrologer_id, astrologer_message, user_id, date) VALUES (?,?,?,?)"
//     conn.query(sql, [astrologer_id, astrologer_message, user_id, dd], (error, result) => {
//               if (error) console.error(error);
//               const getReceiverName = "select name from users where id = ?"
//               conn.query(getReceiverName, [user_id], (error, result) => {
//                         if (error) console.error(error);
//                         res.status(200).json({ message: `message sent to ${result[0].name}` })
//               })
//     })
// }
//...................................need user id and receiver id to get their data only....................//

const getParticularChat = function (req, res) {
    const {user_id} = req.params;
    const {astrologer_id} = req.params;
    const sql = "SELECT user_message, astrologer_message FROM user_chat WHERE user_id = ? AND astrologer_id = ? ORDER BY time ASC";
    conn.query(sql, [user_id, astrologer_id], (error, result) => {
    if (error) {
              console.error(error);
              res.status(500).json({ message: "Error occurred while retrieving chat" });
              return;
            }
            if (result && result.length > 0) {
              const chat = result.map(row => ({
                user_message: row.user_message,
                astrologer_message: row.astrologer_message
              }));
              res.status(200).json({ chat });
            } else {
              res.status(200).json({ chat: "Empty chat box" });
            }
          });
    
  };

module.exports = {
    userChatHistory,
    //userChatPost,
    // astrologerChatHistory,
    // astrologerChatPost,
    getParticularChat
}