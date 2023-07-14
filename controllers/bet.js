const betModel = require("../models/bet");
const User = require("../models/user");


const bet = async(req,res)=>{
try {
let {userId,game_id,betType,betAmount,selectedNumber} = req.body;

if (!game_id) return res.send({ status: 400, message: "Invalid input.Please provide a valid game ID", successData:""})
if (!userId) return res.send({ status: 400, message: "Invalid input.Please provide a valid user ID", successData:""})
if (!betType) return res.send({ status: 400, message: "betType input.Please provide a valid betType" ,successData:""})
if (!betAmount) return res.send({ status: 400, message: "betAmount input.Please provide a valid betAmount" ,successData:""})
if (!selectedNumber) return res.send({ status: 400, message: "selectedNumbers input.Please provide a valid selectedNumber",successData:""})

const userAC = await User.findById(userId).populate({path:"accountId",select:{userTotalAmount:1}})

if(!userAC) return res.status(404).send({status:400,message:"invalid input :> user detail not present in database"})

if(+userAC.accountId.userTotalAmount<betAmount)
return res.status(400).send({status:false,message:"invalid bet ammount"})

let createdBet = await betModel.create(req.body)
return res.send({status:200,message : "createdBet", successData:{
    betId : createdBet
}})

}
catch (err){
    return res.send({ status: 400, message:err.message+"Internal server error. Please try again later."})
}
}


module.exports = bet;