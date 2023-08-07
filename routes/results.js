const {results} = require("../controllers/results");

const router = require("express").Router();


router.post("/:id/results",results);

router.post("/:id/:userId/result",resultPerUser);

module.exports=router;