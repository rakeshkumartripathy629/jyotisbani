const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const UserChatController = require('../controller/UserChatController'); 
const astroProfilScrController =require("../controller/astroProfilScrController");
const userpaymentController= require('../controller/userpaymentController');
const UserPackegeController =require('../controller/UserPackegeController');
const userfollowing = require('../controller/userfollowing');
const ChatUserController = require ('../controller/ChatController');
const wallet = require ('../controller/wallet');
const chatintakeController =require("../controller/chatIntakeController");
const callListController = require('../controller/userCallListController');
 const callintakeController= require('../controller/callintakeController')

 const auth = require("../middleware/auth");


//.............................................................user controller....................................//
router.post("/create-user", userController.createUser);

router.get("/login-user", userController.loginUser);
router.get("/login-user/verify", userController.verifyUser);
router.get("/profile-user",auth, userController.profileUser);
router.get("/test", userController.vonageVerification);
// userRouter.get("/chat-with-astrologers",userController.chatWithAstrologer)

//.......................................................  user chat controller ..............................................//
// User conversation routes
router.get("/user-chat/:id",auth,UserChatController.userChatHistory)//checking user is talking to which astro
//router.post("/user_send",auth,UserChatController.userChatPost)//user sending data to astrologer
// Astrologer conversation routes
// router.get('/astrologer/:chat_id/history', astrologerChatHistory);
// router.post('/astrologer/chat', astrologerChatPost);

// Get particular chat between user and astrologer
//router.get('/chat/:user_id/:astrologer_id', getParticularChat);




//-----------------------------------------------------------wallet-------------------------------------------------------------------//
router.post('/createWallet',auth, wallet.createWallet);
// Assuming you are using Express.js
router.get('/getWallet/:userId',wallet. getWallet);


//................................................astrologer profil screen view user..........................................//

router.get('/astrologers/:id',auth,astroProfilScrController. astroprofile)



//---------------------------------------------------------Create User Payment---------------------------------------------------//
router.post('/createuserPayment', auth,userpaymentController.createuserPayment);

//Get User Payments
router.get('/admin/getuserPayment',auth, userpaymentController.getuserPayments);

//Get User Payment By ID
router.get('/admin/getuserPayment/:id',auth, userpaymentController.getuserPaymentsbyId);
//Datewise Filter User Payments 
router.get('/datewisefilterPayment',auth, userpaymentController.filteruserpaymentbyDate);
//Total Earnings
router.get('/totalEarnings',auth, userpaymentController.totalEarnings);


//.....................................................user package ..........................................................//
router.post("/create-package",auth,UserPackegeController.createUserPackage)
router.get("/get-user-package/:user_id",auth,UserPackegeController.getUserPackage)
router.post("/update-package/:user_id",auth,UserPackegeController.updatePackage)


//-------------------------------------------- Create a new astrologer following entry---------------------------------------------------//
router.post('/followings', auth, userfollowing.createFollowing);

// Get user's following list details
// router.get('/users/:userId/following', userfollowing.getUserFollowingList);
router.get('/followings/:user_Id', userfollowing.getUserFollowingList);


//------------------------------------------------------chat user-----------------------------------------------------------//
router.get("/astrologer", ChatUserController .astrologerByType);

//................................................... chat intake form -......................................................//
// 
//chat intake  form
router.post('/user/submit',auth, chatintakeController.chatIntakeForm);
//get by id form
router.get('/user/getAllFormId/:id',auth, chatintakeController.getFormById);
//get all form
router.get('/user/getAllFormAll', chatintakeController.getFormAll);


//.....................................................user call list.........................................................//
// Create a new call list
router.post('/call-list',auth, callListController.createCallList);

// Get call details by caller ID
router.get('/call-list/:caller_id',auth, callListController.getCallerId);

// Get user call list
router.get('/user-call-list/:user_id',auth, callListController.getUserCallList);


//------------------------------------------------------------call_intake_form-------------------------------------------------------//
router.post('/call-intake',auth,callintakeController. submitCallIntake)
router.get('/call-intake/:user_id',auth,callintakeController. getCallIntake)
module.exports = router;
