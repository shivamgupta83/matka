const {bet} = require("../controllers/bet");

const router = require("express").Router();


router.post("/bet",bet);


module.exports=router;