const { register } = require("../controllers/user");

const router = require("express").Router();


router.post("/register",register)



module.exports=router;