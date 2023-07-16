const {bet} = require("../controllers/ank");

const router = require("express").Router();


router.post("/:id/results",bet)



module.exports=router;