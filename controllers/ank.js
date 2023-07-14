const bet = require("../models/bet");
const User = require("../models/user");
const fs = require("fs");
const path = require("path")
const userAccount = require("../models/userAccount");

const ank = async (req, res) => {


    try {
        const { id } = req.params;
        if (!id) return res.send({ status: 400, message: "Invalid input.Please provide a valid game ID", successData: "" })

        const betData = await bet.find({ round_id: id })
        if (betData.length == 0) return res.send({ status: 404, message: "bet data is not present", successData: "" })
        betData.map(async (betData) => {

            let isUser = await User.findById(betData.userId).populate({ path: "accountId", select: { userTotalAmount: 1 }})

            if (!isUser) return res.send({ status: 400, message: "user data is not present", successData: "" })

            if (betData.betType != "ANK") res.send({ status: 404, message: "bet type is not valid", successData: "" })

            let json = path.resolve('data.json')
            const readFile = fs.readFileSync(json, "utf-8")
            let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b)
console.log(isUser.accountId.userTotalAmount)
            if (cardData == 6 || betData.selectedNumber) {
                let updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                    "userTotalAmount":+isUser.accountId.userTotalAmount + betData.betAmount.reduce((a,b)=>a+b) * 9
                }, { new: true })
                console.log(updatedData)
            }
            else {
                return res.status(400).send({status:false,message:"something invalid"})
            }
        })
    }
    catch (err) {
        return res.status(400).send({ message: err.message })
    }
}

module.exports.ank = ank;
