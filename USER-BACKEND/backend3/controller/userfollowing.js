const conn = require('../database/config');
const express = require('express');
//app.use(express.json());
const app = express();

//----------------------------------------------------------- createFollowing-----------------------------------------------------------//
const createFollowing = (req, res) => {
    const { astrologer_id, user_id,status } = req.body;
  
    // Get the current date and time
    const date_of_following = new Date().toISOString().split('T')[0];
    const time_of_following = new Date().toLocaleTimeString();
  
    // Insert the following information into the database
    const query = `
      INSERT INTO followings (astrologer_id, user_id, date_of_following, time_of_following, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [astrologer_id, user_id, date_of_following, time_of_following, status,'active'];
  
    conn.query(query, values, (error, results) => {
      if (error) {
        console.error('Error creating following entry:', error);
        return res.sendStatus(500);
      }
  
      console.log('Following entry created successfully');
      res.sendStatus(200);
    });
  };
  //----------------------------------------------------------------getUserFollowingList------------------------------------------------//
  const getUserFollowingList = (req, res) => {
      const { user_Id } = req.params;
  
      // Retrieve the user's following list details from the database
      const query = `
        SELECT f.id, f.astrologer_id, f.date_of_following, f.time_of_following, f.status
        FROM followings AS f
        INNER JOIN astrologer AS a ON f.astrologer_id = a.id
        WHERE f.user_id = ?
      `;
      const values = [user_Id];
    
    
  
    conn.query(query, values, (error, results) => {
      if (error) {
        console.error('Error fetching user following list details:', error);
        return res.sendStatus(500);
      }
  
      res.status(200).json(results);
    });
  };
  
  module.exports = {
    createFollowing,
    getUserFollowingList,
  };
  