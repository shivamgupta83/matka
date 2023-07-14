const ank = require("../controllers/ank");

const router = require("express").Router();


router.post("/:id/results",ank.ank)



module.exports=router;