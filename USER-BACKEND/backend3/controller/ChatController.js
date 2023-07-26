const conn = require('../database/config');
const express = require('express');
const app = express();



 //const redisClient = require('redis').createClient();


 module.exports = {
  astrologerByType: (req, res) => {
    const { astrologer_type } = req.query;
    
    if (!astrologer_type) {
      const getAllAstrologers = "SELECT * FROM astrologer";
      conn.query(getAllAstrologers, (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "An error occurred" });
        } else {
          res.status(200).json({ result });
        }
      });
    } else {
      let typeArray = astrologer_type;
    
      // Convert single value to an array
      if (!Array.isArray(astrologer_type)) {
        typeArray = [astrologer_type];
      }
  
      const placeholders = typeArray.map(() => "?").join(",");
      const sql = "SELECT * FROM astrologer WHERE astrologer_type IN (" + placeholders + ")";
    
      conn.query(sql, typeArray, (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "An error occurred" });
        } else {
          res.status(200).json({ result });
        }
      });
    }
  }
  
}