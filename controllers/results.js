const bet = require("../models/bet");
const User = require("../models/user");
const fs = require("fs");
const path = require("path")
const userAccount = require("../models/userAccount");

const results = async (req, res) => {

    try {
        const { id } = req.params;
        if (!id) return res.send({ status: 400, message: "Invalid input.Please provide a valid game ID", successData: "" })

        const allBetData = await bet.find({ round_id: id })
        if (allBetData.length == 0) return res.send({ status: 404, message: "bet data is not present", successData: "" })

        let usersData_succ   =[{ status: true }];
        let usersData_unsucc =[{ status: false }];
let userNotFound = [];
        for (let a = 0; a < allBetData.length; a++) {

            let betData = allBetData[a]
            var isUser = await User.findById(betData.userId).populate({ path: "accountId", select: { userTotalAmount: 1 } })
            if (!isUser) userNotFound.push({ status: 400, message: "user data is not present", successData: "" })

            let json = path.resolve('data.json')
            const readFile = fs.readFileSync(json, "utf-8")

            if (betData.betType == "ANK") {
                let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]
                if (+cardData == betData.selectedNumbers[0]) {
                    let updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                        userTotalAmount: +isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 9)
                    }, { new: true })
                    usersData_succ.push({ status: 200, message: "success", userData: updatedData })
                }
                else {
                     usersData_unsucc.push({ status: false, message: "card data invalid", winAmount: "0", betId: betData._id })
                }
            }

            if (betData.betType == "SP") {
                if (betData.selectedNumbers.length == 1) {

                    let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                        if (a == 10) return 0
                        else return +a
                    }).join("")

                    if (cardData == betData.selectedNumbers[0]) {
                        let updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: +isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 140)
                        }, { new: true })
                        usersData_succ.push({ status: 200, message: "success", userData: updatedData })
                    }

                    else {
                         usersData_unsucc.push({ status: false, message: "card data invalid", winAmount: "0", betId: betData._id })
                    }
                }
                else if (betData.selectedNumbers.length > 1) {

                    let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                        if (a == 10) return 0
                        else return +a
                    }).join("")

                    var updatedData;

                    for (let b = 0; b < betData.selectedNumbers.length; b++) {

                        if (cardData == betData.selectedNumbers[b]) {

                            let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 12);

                            updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                                userTotalAmount: userTotalNewAmount
                            }, { new: true })

                            isUser.accountId.userTotalAmount += (betData.betAmount.reduce((a, b) => a + b) * 12);
                        }
                        else {
                             usersData_unsucc.push({ status: false, message: "card data invalid", winAmount: "0", betId: betData._id })
                        }
                    }
                    // console.log(updatedData)
                    usersData_succ.push({ status: 200, message: "success", userData: updatedData })
                }
            }

            if (betData.betType == "DP") {

                if (betData.selectedNumbers.length == 1) {

                    let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                        if (a == 10) return 0
                        else return +a
                    }).join("")

                    if (cardData == betData.selectedNumbers[0]) {
                        let updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: +isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 270)
                        }, { new: true })
                        usersData_succ.push({ status: 200, message: "success", userData: updatedData })
                    }
                }
                else if (betData.selectedNumbers.length > 1) {
                    let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                        if (a == 10) return 0
                        else return +a
                    }).join("")

                    var updatedData;

                    for (let c = 0; c < betData.selectedNumbers.length; c++) {

                        if (cardData == betData.selectedNumbers[c]) {

                            let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 40);

                            updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                                userTotalAmount: userTotalNewAmount
                            }, { new: true })

                            isUser.accountId.userTotalAmount += (betData.betAmount.reduce((a, b) => a + b) * 40);
                        }
                        else {
                            usersData_unsucc.push({ status: false, message: "card data invalid", winAmount: "0", betId: betData._id })
                       }
                    }
                    usersData_succ.push({ status: 200, message: "success", userData: updatedData })
                }
            }

            if (betData.betType == "TP") {

                let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                    if (a == 10) return 0
                    else return +a
                }).join("")

                let updatedData;

                for (let d = 0; d < betData.selectedNumbers.length; d++) {

                    let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 700);
                    if (betData.selectedNumbers[a] == cardData) {

                        updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: userTotalNewAmount
                        }, { new: true })

                    }
                    else {
                        usersData_unsucc.push({ status: false, message: "card data invalid", winAmount: "0", betId: betData._id })
                   }
                }
                usersData_succ.push({ status: 200, message: "success", userData: updatedData })
            }
        }
        res.send({ status: 400, message: false, usersData_succ, usersData_unsucc })
    }
    catch (err) {

        return res.status(400).send({ message: err.message })
    }
}

module.exports = { results };