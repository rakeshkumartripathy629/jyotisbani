const express = require("express")
const router = express.Router()
const validate=require('../helper/validation')

const astrologerController = require("../controller/astrologerController");
const shortcutController = require("../controller/shortcutController");
const astrologercalllist = require("../controller/astrologercalllist");
const astroCallListController = require("../controller/astroCallListController");
const loginhourController = require('../controller/loginhourController');

const SetRateController = require("../controller/SetRateController");
const astrologerChatController = require("../controller/astrologerChatController");
const kundli = require("../controller/KundliController");
const astrologerWallet = require ('../controller/astrologerWallet');
const astrologer_payments = require('../controller/astropayment');
const  callrecord=require('../controller/callrecord');
const availability = require('../controller/availability');
const { createTicket, getTicketById } = require('../controller/raiseTicket');
const articles  = require('../controller/articles');
const affiliatearnings = require('../controller/affliate');
const livechat = require('../controller/livechat');
const shedule = require ('../controller/VCshedule');
const auth = require("../middlewares/auth")


//............................................... astrologer controller ...........................................................//
router.post("/signup",astrologerController.signupAstrologer);
router.post("/signin",astrologerController.signinAstrologer);
router.get("/astrologer/:id",astrologerController.getAstrologerById);
router.get("/astrologers",astrologerController.allAstrologer);
router.post("/delete-astrologer/:id",astrologerController.deleteAstrologer);
router.post("/update-astrologer/:id",astrologerController.updateAstrologer);
router.get("/profile",auth,astrologerController.profile);
//router.post("/profileupdate",auth,astrologerController.  updateAstrologerType);
router.post('/createLeave', astrologerController.createLeave);//leave application

//.......................................... astrologercalllist.....................................................................//
router.post('/createCalls',auth,astrologercalllist.createCallList)
router.get('/getCallerId/:caller_id',astrologercalllist.getCallerId);


//.......................................... shortcut controller ................................................................//
router.post('/shortcuts',auth, shortcutController.createMessage);
router.get('/shortcuts',auth, shortcutController.getMessage);
router.get('/shortcutss',auth, shortcutController.getMessage);
router.post('/shortcutsid/:id',auth, shortcutController.updateMessage);
router.delete('/astrologer/shortcuts/:id',auth, shortcutController.deleteMessage);

//.........................................astrologer chat controller .............................................................//
// astrologerRouter.get("/user_chat/:chat_id",astrologerChatController.userChatHistory)//checking user is talking to which astro
// astrologerRouter.post("/user_send",astrologerChatController.userChatPost)//user sending data to astrologer
router.get("/astrologer_chat/:chat_id",auth,astrologerChatController.astrologerChatHistory)//checking astrologer is talking to which user
router.post("/astrologer_send",auth,astrologerChatController.astrologerChatPost)//user sending data to astrologer

//------------------------------------------------------------kundali create---------------------------------------------------------//

router.post('/kundlis_create',auth,  kundli.createKundliBoysGirls);



//----------------------------------------------------------subhg---------------------------------------------------------------------//
//---------------------------------------------Get Profile details Of the Astrologers-------------------------------------------------//
// router.post('/astrologers', astrologerprofileDetails,createAstrologerProfile);
// router.get('/getAstrologer', auth,astrologerprofileDetails.getAstrologerDetails);
// //Get Profile details Of the Astrologers By Id
// router.get('/getAstrologer/:astrologer_id', auth,astrologerprofileDetails.getAstrologerDetailsbyId);


//astrologer wallet Create
router.post('/createastrologerWallet',auth, astrologerWallet.astrologerWalletDetails);
//wallet



//.......................................... set rate controller ................. .................................................//
router.post('/createrate',  auth, SetRateController.createAstrologerRate);
router.post('/astrologers/discount',auth, SetRateController.calculateDiscountedRates);
router.get('/astrologers', auth, SetRateController.getAstrologers);
router.post('/astrologers/rate', auth,SetRateController.setAstrologerRate);

//.......................................... astrologer calllist controller ........................................................//
router.post('/astrologer-calls',auth,astroCallListController.astrologerCalls);
//-------------------------------------------------------astrologer login hour--------------------------------------------------------..//
router.post('/loginhours',auth,loginhourController.insertLoginHours);
router.post('/getloginhours',auth,loginhourController.getTotalLoginHours);
router.get('/summary-login-hours/:astrologerId',loginhourController.getSummaryLoginHours);


//..............................................................astrologer paymeny...................................................//
router.post('/astropayment',auth,astrologer_payments. creatastroPayment)
router.get('/getastropayment',auth,astrologer_payments.getastroPayments),
router.get('/getastropayment/:astrologer_id',auth,astrologer_payments.getastroPayments),
router.get('/filterastropaymentbyDate/:astrologer_id',auth,astrologer_payments. filterastropaymentbyDate),
router.get('/totalEarnings/:astrologer_id',auth,astrologer_payments. totalEarnings),
// API endpoint for getting astrologer payment report
router.get('/astropaymentreport',auth,astrologer_payments. getAstrologerPaymentReport);
//-------------------------------------------------live call rate--------------------------------------------------------------------//
router.post('/live-call', auth,  callrecord. call_records);
router.get('/getlive-call/:id', auth,  callrecord. call_records);

//------------------------------------------------availability-------------------------------------------------------------------------//
router.post('/availability', auth,  availability. availability);

// ---------------------------------------------Create a new ticket-------------------------------------------------------------------//
router.post('/tickets', createTicket);

// Get ticket by ID
router.get('/tickets/:id', getTicketById);

//--------------------------------------------------articles------------------------------------------------------------------------//
router.post('/submit',auth,articles.submit)
router.get('/get-title-description',auth,articles.getTilteDescription)
router.post('/update-title-description',auth,articles.updateTilteDescription);

//-------------------------------------------------------draft-----------------------------------------------------------------------//
router.post("/save-draft",auth,articles.saveDraft)
router.post("/delete-draft",auth,articles.deleteDraft)
router.post("/update-draft",auth,articles.updateDraft),
//-------------------------------------------------------------affleate earnings---------------------------------------------------//
router.post("/affleate",auth,affiliatearnings.  insertEarnings)
//-------------------------------------------------------------Live Chat------------------------------------------------------------//
router.post("/caht",auth,livechat. handleIncomingMessages);

//--------------------------------------------------------------VC shedule---------------------------------------------------------//
router.post("/vcshedule",auth,shedule.schedule);
router.get("/vcshedules",auth,shedule.schedules);
module.exports = router;



