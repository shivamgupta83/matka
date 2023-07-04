const betModel = require("../models/bet");


const bet = async(req,res)=>{
try {
let {userId,betType,betAmount,selectedNumbers} = req.body;


if (!userId) return res.send({ status: 400, message: "Invalid input.Please provide a valid user ID", successData:""})
if (!betType) return res.send({ status: 400, message: "betType input.Please provide a valid betType" ,successData:""})
if (!betAmount) return res.send({ status: 400, message: "betAmount input.Please provide a valid betAmount" ,successData:""})
if (selectedNumbers.length==0) return res.send({ status: 400, message: "selectedNumbers input.Please provide a valid selectedNumber",successData:""})

let createdBet = await betModel.create(req.body)

return res.send({status:200,message : "createdBet", successData:{
    betId : createdBet._id
}})
}
catch (err){
    return res.send({ status: 400, message: "Internal server error. Please try again later."})
}
}


module.exports = bet;