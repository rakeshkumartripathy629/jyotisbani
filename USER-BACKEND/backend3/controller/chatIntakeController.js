const conn = require('../database/config');
const express = require('express');
//app.use(express.json());
const app = express();


// Handle user input and store data in MySQL
const chatIntakeForm = function (req, res) {
          const { user_id, name, gender, date_of_birth, time_of_birth, place_of_birth, marital_status, occupation, topic_of_concern } = req.body;

          // Insert the form data into the MySQL database
          const sql =
                    'INSERT INTO chatintake_form (user_id, name, gender, date_of_birth, time_of_birth, place_of_birth, marital_status, occupation, topic_of_concern) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    conn.query(
                    sql,
                    [
                              user_id,
                              name,
                              gender,
                              date_of_birth,
                              time_of_birth,
                              place_of_birth,
                              marital_status,
                              occupation,
                              topic_of_concern,
                    ],
                    (err, result) => {
                              if (err) {
                                        console.error('Error inserting data into MySQL: ', err);
                                        res.sendStatus(500);
                              } else {
                                        console.log('Form data inserted into MySQL!');
                                        res.sendStatus(200);
                              }
                    }
          );
};


const getFormById = function (req, res) {
          const userId = req.params.id;

          // Retrieve chatform information from the database based on the  ID
          const selectQuery = `SELECT * FROM chatintake_form WHERE id = ?`;
          conn.query(selectQuery, [userId], (err, result) => {
                    if (err) {
                              throw err;
                    } else {
                              res.send(result);
                    }
          });
}
const getFormAll = function(req,res){
                    // Retrieve all chatform data from the database
                    const query = 'SELECT * FROM chatintake_form';
                  
                    conn.query(query, (error, results) => {
                      if (error) {
                        console.error('Error fetching chatform data: ', error);
                        return res.sendStatus(500);
                      }
                  
                      res.status(200).json(results);
                    });              
};

module.exports =  {
          chatIntakeForm,
          getFormById,
          getFormAll
}