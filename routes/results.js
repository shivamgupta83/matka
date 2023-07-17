const {results} = require("../controllers/results");

const router = require("express").Router();


router.post("/:id/results",results)



module.exports=router;