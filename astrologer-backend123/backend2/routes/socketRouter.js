const express = require("express")
const router = express.Router()
const astrologerLiveCall = require("../controller/astrologerLiveController")
const auth = require("../middlewares/auth")
router.get("/join",auth,astrologerLiveCall.astrologerLiveCall)


module.exports = router