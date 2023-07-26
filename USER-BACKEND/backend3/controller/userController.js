const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const twilio = require("twilio");
 const SECRET_KEY = "USER";
const conn = require("../database/config");
const axios = require('axios');
const { Vonage } = require('@vonage/server-sdk');
  

const vonage = new Vonage({
  apiKey: "5c3bf79d",
  apiSecret: "UKoCQM7E9aJ4GeDc"
});
// Function to generate OTP
function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

// const accountSid = "ACaed8bf43546ab97c23c35b1c000eaade"
// const authToken = "f33c6bbcced08405b43b371c3e7ea26c"
// const twilioPhoneNumber =""
// const client = twilio(accountSid,authToken)


module.exports ={
    //................................................ CREATE USER .......................................................//

    createUser : (req,res)=>{
        const {name,phone_number,place_of_birth,date_of_birth,time_of_birth,password}= req.body;
        try{
            const selectPhoneNumber = "select phone_number from users where phone_number = ?";
            conn.query(selectPhoneNumber,[phone_number],async(error,result)=>{
                if(error) console.log(error)
                console.log(result[0]);
                if(result[0]?.phone_number===phone_number){
                    return res.status(400).json({ message: "phone number already exist" });
                }else if(typeof phone_number === 'undefined'){
                    return res.status(422).json({ error: 'phone number is required' });
                }else if(phone_number.length!=10){
                    return res.status(400).json({ message: "phone number is not valid" });
                }else{
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hashSync(password,salt);
                    const insertUser = "insert into users (name,phone_number,place_of_birth,date_of_birth,time_of_birth,password) values (?,?,?,?,?,?)";
                        conn.query(insertUser,[name,phone_number,place_of_birth,date_of_birth,time_of_birth,hashedPassword],(error,result)=>{
                        if(error) console.log(error)
                        res.status(200).json({message:"user registered successful"})
                    })
                }
            })
    
        }catch(error){
            console.log(error);
            return res.status(500).json({ message: "server problem" });
        }
    
    },

   

    //..................................................... USER LOGIN ..........................................................//
    
   

 loginUser : async (req, res) => {
  const { phone_number, password } = req.body;

  try {
    const getUserQuery = "SELECT * FROM userS WHERE phone_number = ?";
    conn.query(getUserQuery, [phone_number], async (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Server problem" });
      }
      if (result.length === 0) {
        return res.status(400).json({ message: "Phone number does not exist" });
      }

      const isMatch = await bcrypt.compare(password, result[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: "Wrong password" });
      } else {
        function otpGenerator() {
          const number = "7735464131";
          let otp = "";
          for (let i = 0; i < 4; i++) {
            otp = otp + number[Math.floor(Math.random() * number.length)];
          }
          console.log(otp);
          return otp;
        }

        const otp = otpGenerator();

        // .................SENDING OTP via Infobip (SMS)...............//

        const apiKey = 'ffa80a2aadcf3ac0b75e8c7d9d80623d-97b80ff0-29df-4510-afed-945f051d248e'; // Replace with your Infobip API key
        const apiUrl = 'https://api.infobip.com/sms/2/text/single';

        const body = {
          from: '27', // Replace with your desired sender ID
          to: 7735464131,
          text: `Your OTP is ${otp}`
        };

        const response = await axios.post(apiUrl, body, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `App ${apiKey}`
          }
        });

        if (response.status === 200) {
          const updateOtpQuery = "UPDATE users SET otp = ? WHERE phone_number = ?";
          conn.query(updateOtpQuery, [otp, phone_number], (error, result) => {
            if (error) console.log(error);

            console.log("OTP sent successfully");
          });

          return res.status(200).json({ message: "OTP sent successfully" });
        } else {
          console.error("Failed to send OTP");
          res.status(500).json({ message: "Failed to send OTP via SMS" });
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server problem" });
  }
},




    //..................................................... USER profile ..........................................................//
    profileUser : (req,res)=>{
        const phone_number = req.userPhone_number;
        const sql = "select * from users where phone_number = ?"
        conn.query(sql,[phone_number],(error,result)=>{
            if(error){
                console.error(error);
            }
            if(!result[0]) res.status(404).json({message:"user not found"})
            else res.status(200).json({user :result[0]})
        })
    },
      
    //..................................................... USER verification of otp ..........................................................//
    verifyUser: (req,res)=>{
        const {phone_number,otp}= req.body;
        const storedOtp = "select * from users where phone_number = ?";
        conn.query(storedOtp,[phone_number],(error,result)=>{
            if(error) console.log(error);
            if(otp!=result[0].otp) {
                return res.status(400).json({message:"invalid otp"});
            }
            const token = jwt.sign({phone_number:phone_number,otp:result[0].otp},SECRET_KEY)
            res.status(200).json({message:"user verified using otp successfully",token:token});
        })
    },

   
      // verifyUser: async (req, res) => {
      //   const { phone_number, otp } = req.body;
      //   const storedOtp = 'SELECT * FROM users WHERE phone_number = ?';
    
      //   try {
      //     const [rows] = await promisify(conn.query).call(conn, storedOtp, [phone_number]);
    
      //     if (rows.length === 0 || otp !== rows[0].otp) {
      //       return res.status(400).json({ message: 'Invalid OTP' });
      //     }
    
      //     const payload = { phone_number, otp: rows[0].otp };
    
      //     // Generate an access token
      //     const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    
      //     // Generate a refresh token with a 10-day expiration
      //     const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '10d' });
    
      //     res.status(200).json({
      //       message: 'User verified using OTP successfully',
      //       accessToken,
      //       refreshToken,
      //     });
      //   } catch (error) {
      //     console.error(error);
      //     res.status(500).json({ error: 'Internal Server Error' });
      //   }
      // },
  
    //...............................................USER logout................................................//
    // logout:(req,res)=>{
    //     req.session.destroy((error)=>{
    //         if(!error) res.status(200).json({message:"logged out successfully"});
    //     })

    // },  
   // Vonage Verification
  vonageVerification: (req, res) => {
    const { number, brand } = req.body;
    vonage.verify
      .start({
        number: "917735464131",
        brand: "Vonage"      })
      .then(resp => {
        console.log(resp.request_id);
        res.status(200).json({ message: "Vonage verification initiated", request_id: resp.request_id });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Failed to initiate Vonage verification" });
      });
  }
}


 
