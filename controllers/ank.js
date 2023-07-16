const bet = require("../models/bet");
const User = require("../models/user");
const fs = require("fs");
const path = require("path")
const userAccount = require("../models/userAccount");

const bet = async (req, res) => {

    try {
        const { id } = req.params;
        if (!id) return res.send({ status: 400, message: "Invalid input.Please provide a valid game ID", successData: "" })

        const betData = await bet.find({ round_id: id })
        if (betData.length == 0) return res.send({ status: 404, message: "bet data is not present", successData: "" })
        betData.map(async (betData) => {

            let isUser = await User.findById(betData.userId).populate({ path: "accountId", select: { userTotalAmount: 1 } })
            if (!isUser) return res.send({ status: 400, message: "user data is not present", successData: "" })

            let json = path.resolve('data.json')
            const readFile = fs.readFileSync(json, "utf-8")

            if (betData.betType != "ANK") {

                let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b)
                if (cardData == betData.selectedNumbers) {
                    let updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                        "userTotalAmount": +isUser.accountId.userTotalAmount + betData.betAmount.reduce((a, b) => a + b) * 9
                    }, { new: true })
                    console.log(updatedData)
                }
                else {
                    return res.status(400).send({ status: false, message: "something invalid" })
                }

            }

            if (betData.betType != "SP") {
                if (betData.selectedNumbers.length == 1) {

                    let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).sort((a, b) => a - b).join("")
                    if (cardData == betData.selectedNumbers[0]) {
                        let updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            "userTotalAmount": +isUser.accountId.userTotalAmount + betData.betAmount.reduce((a, b) => a + b) * 140
                        }, { new: true })
                        console.log(updatedData)
                    }
                }
               else if (betData.selectedNumbers.length > 1) {
                    let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).sort((a, b) => a - b).join("")

                    betData.selectedNumbers.map(async (selectedNumber) => {

                        if (cardData == selectedNumber) {
                            let updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                                "userTotalAmount": +isUser.accountId.userTotalAmount + betData.betAmount.reduce((a, b) => a + b) * 12
                            }, { new: true })
                            console.log(updatedData)
                        }
                    })
                }
            }
        })
    }
    catch (err) {

        return res.status(400).send({ message: err.message })
    }
}

module.exports.ank = bet;
