const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const astroCallListController = require("../controller/astroCallListController");


//.......................................... astrologer calllist controller ........................................................//
router.post('/astrologer-calls',auth,astroCallListController.astrologerCalls);

module.exports=router;