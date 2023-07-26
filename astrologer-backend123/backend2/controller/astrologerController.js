const bcrypt = require("bcrypt");
const moment = require("moment")
const jwt = require("jsonwebtoken");
const SECRET_KEY = "ASTROLOGER";
const conn = require("../database/config");
// const validate = require('../helper/validation');
// const { check , validationResult } = require('express-validator');

const Joi = require('joi');

  
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
//const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/;

  const signupAstrologerSchema = Joi.object({
   
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(8).required(),
    astrologer_type: Joi.string().required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required()
  })

expiresIn = '20d'
  
  // .......................................... ASTROLOGER signup .............................................//
  
module.exports = {
  
  
  
  signupAstrologer : (req, res) => {
    const { name, email, phone, password, astrologer_type, gender } = req.body;
  
    // Validate input fields
    const { error } = signupAstrologerSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
  
    // Validate email and phone using regex patterns
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }
  
    if (!phoneRegex.test(phone)) {
      res.status(400).json({ error: 'Invalid phone number' });
      return;
    }

    // Validate password using regex pattern
  // if (!passwordRegex.test(password)) {
  //   res.status(400).json({ error: 'Invalid password format' });
  //   return;
  // }

  
    // Check if the email already exists in the database
    const emailExistsQuery = 'SELECT id FROM astrologer WHERE email = ?';
    conn.query(emailExistsQuery, [email], (err, result) => {
      if (err) {
        console.error('Error checking email existence:', err);
        res.status(500).json({ error: 'An error occurred while creating the astrologer' });
        return;
      }
  
      if (result.length > 0) {
        res.status(409).json({ error: 'Email already exists' });
        return;
      }
  
      // Hash the password using bcrypt
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          res.status(500).json({ error: 'An error occurred while creating the astrologer' });
          return;
        }
  
        const defaultStatus = 'active'; // Set the default status as 'active'
  
        const query = 'INSERT INTO astrologer (name, email, phone, password, astrologer_type, gender, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [name, email, phone, hashedPassword, astrologer_type, gender, defaultStatus];
  
        conn.query(query, values, (err, result) => {
          if (err) {
            console.error('Error creating astrologer:', err);
            res.status(500).json({ message: 'An error occurred while creating the astrologer' });
            return;
          }
          res.status(201).json({ message: 'Astrologer created successfully', astrologerId: result.insertId });
        });
      });
    });
  },
  
// .......................................... ASTROLOGER signin .............................................//

signinAstrologer : (req, res) => {
    const {email,password} = req.body;
    try{
      const selectEmailPassword ="select email,password from astrologer where email = (?)";
        conn.query(selectEmailPassword,[email], async (error,result)=>{
            if(error) console.log(error)
            if(result[0]?.email!=email){
              return res.status(400).json({message:"user not found."})
            }
            const isMatch = await bcrypt.compare(password,result[0].password)
            if(!isMatch){
              return res.status(400).json({message:"wrong password"})
            } 
            const selectId = "select id from astrologer where email =?";
            await conn.query(selectId,[email],(error,result)=>{
                if(error) console.log(error)
                const token = jwt.sign({email:email,id:result[0].id},SECRET_KEY,{expiresIn});
                return res.status(200).json({message:"astrologer loggedin",token:token})
            });
          })
    }catch(error){
        console.log(error);
    }
},


// .......................................... ASTROLOGER delete .............................................//

deleteAstrologer:function (req, res) {
  const { id } = req.params;

  const query = 'UPDATE astrologer SET status = ? WHERE id = ?';
  const values = ['inactive', id];

  conn.query(query, values, (err, result) => {
            if (err) {
                      console.error('Error updating astrologer:', err);
                      res.status(500).json({ error: 'An error occurred while updating the astrologer' });
                      return;
            }

            if (result.affectedRows === 0) {
                      res.status(404).json({ error: 'Astrologer not found' });
                      return;
            }

            res.status(200).json({ message: 'Astrologer Deleted' });
  });
},

// .......................................... ASTROLOGER update .............................................//
updateAstrologer :async (req, res) => {
    let id = req.params.id;
    const { name, phone, password, astrologer_type, gender } = req.body;

    const hashedPassword = await bcrypt.hash(password,10);
    const updateAstrologerUser = "update astrologer set name=?, phone=?, password=?, astrologer_type=?, gender=? where id= (?)";
    conn.query(updateAstrologerUser,[name, phone, hashedPassword, astrologer_type, gender, id],(error,result)=>{
      if(error) console.log(error);
      if(name&&phone&&password&&astrologer_type&&gender&&phone.length==10){
        res.status(200).json({message:"astrologer updated..",updated:{name, phone, password, astrologer_type, gender }});
      }else{
        res.status(400).json({message:"bad request"});
      }
    })
},

// .......................................... ASTROLOGER all ................................................//
allAstrologer : (req, res) => {
  const getAstrologer = "select * from astrologer";
    conn.query(getAstrologer,(error,result)=>{
        if(error) console.log(error);
        let allAstrologers =result
        console.log(result)
        res.status(200).json({data:allAstrologers});
    })
},

astrologerByType : (req,res)=>{
  const {astrologer_type} = req.query;
  let typeArray = astrologer_type;
  const placeholders = typeArray.map(() => "?").join(",");
  const sql = "SELECT * FROM astrologer WHERE astrologer_type IN (" + placeholders + ")";
  console.log(sql)
  conn.query(sql, typeArray, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    } else {
      res.status(200).json({ result });
    }
  });
},

// .......................................... ASTROLOGER profile ................................................//

profile : (req,res)=>{
  const id = req.astrologerId;
  const email = req.astrologerEmail
  console.log(id,email);
  const profileAstrologer =
  "select * from astrologer where email = (?) and id = (?) ";
  conn.query(profileAstrologer,[email,id],(error,result)=>{
    if(error) console.log(error);
    if(result!=undefined){
      // console.log(result)
      res.status(200).json({message:"astrologer is valid",astrologer:result})
    }else{
      console.log("user does not exist");
    }
  })
},

// .......................................... ASTROLOGER by ID .................................................................//

getAstrologerById : (req,res)=>{
  let id = req.params.id;
  const getAstrologerOne = "select * from astrologer where id =?";
  conn.query(getAstrologerOne,[id],(error,result)=>{
    if(error) console.log(error);
      res.status(200).json({profile_data:result})
  })
},

//............................................. create leave astrologer ............................................//

createLeave: function (req, res) {
  const { astrologerId, startDate, endDate, reason } = req.body;

  // Validate input values
  if (!astrologerId || !startDate || !endDate || !reason) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  // Calculate total number of days for the leave
  const start = moment(startDate);
  const end = moment(endDate);
  const totalDays = end.diff(start, "days");

  const query = `INSERT INTO \`leave\` (astrologer_id, start_date, end_date, reason, total_days) VALUES (?, ?, ?, ?, ?)`;
  conn.query(
    query,
    [astrologerId, startDate, endDate, reason, totalDays],
    (err, result) => {
      if (err) {
        console.error("Error saving leave application: ", err);
        res
          .status(500)
          .json({
            error: "An error occurred while saving the leave application.",
          });
        return;
      }
      res.json({
        message: "Leave application saved successfully.",
        leaveId: result.insertId,
        totalDays,
      });
    }
  );
}
}


