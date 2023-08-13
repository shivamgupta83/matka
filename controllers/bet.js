const betModel = require("../models/bet");
const User = require("../models/user");
const userAccount = require("../models/userAccount");


const bet = async(req,res)=>{
try {
let {userId,round_id,betType,betAmount,selectedNumbers} = req.body;

if (!round_id) return res.send({ status: 400, message: "Invalid input.Please provide a valid round_id", successData:""})
if (!userId) return res.send({ status: 400, message: "Invalid input.Please provide a valid user ID", successData:""})
if (!betType) return res.send({ status: 400, message: "betType input.Please provide a valid betType" ,successData:""})
if (betAmount.length==0) return res.send({ status: 400, message: "betAmount input.Please provide a valid betAmount" ,successData:""})
if (!selectedNumbers) return res.send({ status: 400, message: "selectedNumbers input.Please provide a valid selectedNumber",successData:""})

const userAC = await User.findById(userId).populate({path:"accountId",select:{userTotalAmount:1}})

if(!userAC) return res.status(404).send({status:400,message:"invalid input :> user detail not present in database"})
 betAmount=await betAmount.reduce((a,b)=>a+b)
// console.log(betAmount)
if(+userAC.accountId.userTotalAmount<betAmount)
return res.status(400).send({status:false,message:"Less User ammount",data:userAC.accountId.userTotalAmount})

const userTotalAmmount = await userAccount.findOneAndUpdate({userId},{userTotalAmount:userAC.accountId.userTotalAmount-betAmount},{new:true})

let createdBet = await betModel.create(req.body)
return res.send({status:200,message : "createdBet", successData:{
    bet : createdBet,
    userTotalAmmount : userTotalAmmount.userTotalAmount
}})
}
catch (err){
    return res.send({ status: 400, message:err.message+"Internal server error. Please try again later."})
}
}

const wssBet = async(req,ws)=>{
    try {
    let {userId,round_id,betType,betAmount,selectedNumbers} = req;
    if (!round_id)  ws.send(JSON.stringify({ status: 400, message: "Invalid input.Please provide a valid round_id", successData:""}))
    if (!userId||userId.trim().length==0)  ws.send(JSON.stringify({ status: 400, message: "Invalid input.Please provide a valid user ID", successData:""}))
    if (!betType)  ws.send(JSON.stringify({ status: 400, message: "betType input.Please provide a valid betType" ,successData:""}))
    if (betAmount.length==0)  ws.send(JSON.stringify({ status: 400, message: "betAmount input.Please provide a valid betAmount" ,successData:""}))
    if (!selectedNumbers)  ws.send(JSON.stringify({ status: 400, message: "selectedNumbers input.Please provide a valid selectedNumber",successData:""}))
    
    const userAC = await User.findById(userId).populate({path:"accountId",select:{userTotalAmount:1}})
    
    if(!userAC)  ws.status(404).send(JSON.stringify({status:400,message:"invalid input :> user detail not pwsent in database"}))
     betAmount=await betAmount.reduce((a,b)=>a+b)
    // console.log(betAmount)
    if(+userAC.accountId.userTotalAmount<betAmount)
     ws.status(400).send({status:false,message:"Less User ammount",data:userAC.accountId.userTotalAmount})
    
    const userTotalAmmount = await userAccount.findOneAndUpdate({userId},{userTotalAmount:userAC.accountId.userTotalAmount-betAmount},{new:true})
    
    let createdBet = await betModel.create(req)
     ws.send(JSON.stringify({status:200,message : "createdBet", successData:{
        bet : createdBet,
        userTotalAmmount : userTotalAmmount.userTotalAmount
    }}))
    }
    catch (err){
         ws.send(JSON.stringify({ status: 400, message:err.message+"Internal server error. Please try again later."}))
    }
    }
module.exports = {bet,wssBet};