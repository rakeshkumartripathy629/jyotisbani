const express = require('express');
 const { check , validationResult } = require('express-validator');
 const app = express();

 app.use(express.json());

 exports.signupValidation = [
   //----------------------------------------------------------------NAME-----------------------------------------------------------// 
   check('name', 'Name is required').not().isEmpty(),
    //----------------------------------------------------------------PASSWORD-----------------------------------------------------------//
    check('password', 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character').matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})'),
   //----------------------------------------------------------------PHONE NUMBER-----------------------------------------------------------//
   check('phone', 'Mobile number should contain 10 digits').isLength({ min: 10, max: 10 }),
   //bail()

  
    // .custom(async (value, { req }) => {
    //   const astrologerId = req.body.astrologerId; // Assuming astrologerId is provided in the request body
    //   const isUnique = await isPhoneNumberUnique(value, astrologerId);
    //   if (!isUnique) {
    //     throw new Error('Phone number is already in use');
    //   }
    //   return true;
    // }),
   //----------------------------------------------------------------MAIL-----------------------------------------------------------------------------------------------------//
  
  check('email', 'Please include a valid email')
  .isEmail()
  .custom((value, { req }) => {
    if (!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(value)) {
      throw new Error('Invalid email address');
    }
    return true;
  }),


   
     
      //-----------------------------------------------------------------GENDER-----------------------------------------------------------------------------------------------------//
    check('gender', 'Gender is required').not().isEmpty().isIn(['male', 'female', 'other']),
    //----------------------------------------------------------------ASTROLOGY TYPE----------------------------------------------------------------------------------------------------------//
    check('astrologer_type', 'Astrologer type is required').not().isEmpty().isIn(['Horoscope Reading', 'Tarot Reading','vedic' ,'Numerology', 'Palmistry', 'VastuShastra', 'AstrologyConsultation', 'Psychic Reading', 'Kundli Matching', 'Career Guidance', 'Love and Relationship Advice']),

    // (req, res, next) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(422).json({ errors: errors.array() });
    //     }
    //     else next();
    // }
];
//----------------------------------------------------------------THE END VALIDATION-----------------------------------------------------------//

