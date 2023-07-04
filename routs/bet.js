const bet = require("../models/bet");

const router = require("express").Router();


router.post("/bet",bet)



module.exports=router;