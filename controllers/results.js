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

        let usersData_succ = [{ status: true }];
        let usersData_unsucc = [{ status: false }];
        let userNotFound = [];

        for (let a = 0; a < allBetData.length; a++) {

            let betData = allBetData[a];
            let userId = betData.userId;
            var isUser = await User.findById(userId).populate({ path: "accountId", select: { userTotalAmount: 1 } })
            if (!isUser) {
                userNotFound.push({ status: 400, message: "user data is not present", successData: "" })
                continue;
            }
            let json = path.resolve('data.json')
            const readFile = fs.readFileSync(json, "utf-8")

            if (betData.betType == "ANK") {

                let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

                if (+cardData == betData.selectedNumbers[0]) {

                    let updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                        userTotalAmount: +isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 9)
                    }, { new: true })

                    usersData_succ.push({ status: 200, message: "success", "Winning Amount": (betData.betAmount.reduce((a, b) => a + b) * 9), betId: betData._id })
                }
                else {
                    usersData_unsucc.push({ status: false, message: "card data invalid", "Winning Amount": "0", betId: betData._id })
                    continue;
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

                        usersData_succ.push({ status: 200, message: "success", "Winning Amount": (betData.betAmount.reduce((a, b) => a + b) * 140), betId: betData._id })
                    }
                    else {
                        usersData_unsucc.push({ status: false, message: "card data invalid", "Winning Amount": "0", betId: betData._id })
                        continue;
                    }
                }
                else if (betData.selectedNumbers.length > 1) {

                    let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                        if (a == 10) return 0
                        else return +a
                    }).join("")

                    var updatedData;
                    let priviousAmmount = isUser.accountId.userTotalAmount;
                    for (let b = 0; b < betData.selectedNumbers.length; b++) {

                        if (cardData == betData.selectedNumbers[b]) {

                            let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 12);

                            updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                                userTotalAmount: userTotalNewAmount
                            }, { new: true })

                            isUser.accountId.userTotalAmount += (betData.betAmount.reduce((a, b) => a + b) * 12);
                        }

                    }
                    if (updatedData) {
                        usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                    }
                    else {
                        usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                    }
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

                        usersData_succ.push({ status: 200, message: "success", "Winning Amount": betData.betAmount.reduce((a, b) => a + b) * 270, betId: betData._id })
                    }
                    else {
                        usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                    }
                }
                else if (betData.selectedNumbers.length > 1) {
                    let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                        if (a == 10) return 0
                        else return +a
                    }).join("")

                    var updatedData;
                    let priviousAmmount = isUser.accountId.userTotalAmount;
                    for (let c = 0; c < betData.selectedNumbers.length; c++) {

                        if (cardData == betData.selectedNumbers[c]) {

                            let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 40);

                            updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                                userTotalAmount: userTotalNewAmount
                            }, { new: true })

                            isUser.accountId.userTotalAmount += (betData.betAmount.reduce((a, b) => a + b) * 40);

                        }
                    }
                    if (updatedData) {
                        usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                    }
                    else {
                        usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                    }
                }
            }

            if (betData.betType == "TP") {

                let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                    if (a == 10) return 0
                    else return +a
                }).join("")

                let updatedData;
                let priviousAmmount = isUser.accountId.userTotalAmount;
                for (let d = 0; d < betData.selectedNumbers.length; d++) {

                    let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 700);
                    if (betData.selectedNumbers[a] == cardData) {

                        updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: userTotalNewAmount
                        }, { new: true })

                    }
                    if (updatedData) {
                        usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                    }
                    else {
                        usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                    }
                }
            }

            if (betData.betType == "low-line") {

                let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

                let updatedData;
                let priviousAmmount = isUser.accountId.userTotalAmount;

                for (let e = 0; e < betData.selectedNumbers.length; e++) {
                    if (cardData == betData.selectedNumbers[e]) {
                        let userTotalNewAmount = isUser.accountId.userTotalAmount
                        updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: userTotalNewAmount * 1.90
                        }, { new: true })
                        isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;
                    }
                }
                if (updatedData) {
                    usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                }
                else {
                    usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                }
            }

            if (betData.betType == "high-line") {

                let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

                let updatedData;

                let priviousAmmount = isUser.accountId.userTotalAmount;

                for (let e = 0; e < betData.selectedNumbers.length; e++) {
                    if (cardData == betData.selectedNumbers[e]) {

                        let userTotalNewAmount = isUser.accountId.userTotalAmount
                        updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: userTotalNewAmount * 1.90
                        }, { new: true })

                        isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;
                    }
                }
                if (updatedData) {
                    usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                }
                else {
                    usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                }
            }

            if (betData.betType == "odd") {

                let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

                let updatedData;

                let priviousAmmount = isUser.accountId.userTotalAmount;

                for (let e = 0; e < betData.selectedNumbers.length; e++) {
                    if (cardData == betData.selectedNumbers[e]) {
                        let userTotalNewAmount = isUser.accountId.userTotalAmount
                        updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: userTotalNewAmount * 1.90
                        }, { new: true })
                        isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;

                    }
                }
                if (updatedData) {
                    usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                }
                else {
                    usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                }
            }

            if (betData.betType == "even") {
                let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

                let updatedData;
                let priviousAmmount = isUser.accountId.userTotalAmount;
                for (let e = 0; e < betData.selectedNumbers.length; e++) {
                    if (cardData == betData.selectedNumbers[e]) {
                        let userTotalNewAmount = isUser.accountId.userTotalAmount
                        updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: userTotalNewAmount * 1.90
                        }, { new: true })
                        isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;

                    }
                }
                if (updatedData) {
                    usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                }
                else {
                    usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                }
            }
        }
        res.send({ status: 400, message: false, usersData_succ, usersData_unsucc, userNotFound });
    }
    catch (err) {

        return res.status(400).send({ message: err.message })
    }
}

const resultPerUser = async (req, res) => {

    const { userId, betId } = req.params;
    if (!userId) return res.send({ status: 400, message: "Invalid input.Please provide a valid user ID", successData: "" })

    if (!betId) return res.send({ status: 400, message: "Invalid input.Please provide a valid betId ID", successData: "" });

    const betData = await bet.findById(betId)
    if (!betData) {
        return res.send({ status: 400, message: "Invalid input.Please provide a valid user ID", successData: "" })
    }

    var isUser = await User.findById(userId).populate({ path: "accountId", select: { userTotalAmount: 1 } })
    if (!isUser) {
        res.send({ status: 400, message: "user data is not present", successData: "" })
    }

    let json = path.resolve('data.json')
    const readFile = fs.readFileSync(json, "utf-8")

    if (betData.betType == "ANK") {
        let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

        if (+cardData == betData.selectedNumbers[0]) {
            let updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                userTotalAmount: +isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 9)
            }, { new: true })
            res.send({ status: 200, message: "success", "Winning Amount ": (betData.betAmount.reduce((a, b) => a + b) * 9), betId: betData._id })
        } else {
            res.send({ status: 200, message: "success", "Winning Amount ": 0, betId: betData._id })
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
                return res.send({ status: 200, message: "success", "Winning Amount": (betData.betAmount.reduce((a, b) => a + b) * 140), betId: betData._id })
            }
            else {
                return res.send({ status: false, message: "success", "winning Amount": 0, betId: betData._id })
            }
        }
        else if (betData.selectedNumbers.length > 1) {

            let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                if (a == 10) return 0
                else return +a
            }).join("")

            var updatedData;
            let priviousAmmount = isUser.accountId.userTotalAmount
            for (let b = 0; b < betData.selectedNumbers.length; b++) {

                if (cardData == betData.selectedNumbers[b]) {

                    let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 12);

                    updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                        userTotalAmount: userTotalNewAmount
                    }, { new: true })

                    isUser.accountId.userTotalAmount += (betData.betAmount.reduce((a, b) => a + b) * 12);
                }
            }
            if (updatedData) {
                usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
            }
            else {
                usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
            }
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
                return res.send({ status: 200, message: "success", "Winning Amount": +(betData.betAmount.reduce((a, b) => a + b) * 270), betId: betData._id })
            }
            else {
                return res.send({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
            }
        }
        else if (betData.selectedNumbers.length > 1) {
            let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                if (a == 10) return 0
                else return +a
            }).join("")

            var updatedData;
            let priviousAmmount = isUser.accountId.userTotalAmount;
            for (let c = 0; c < betData.selectedNumbers.length; c++) {

                if (cardData == betData.selectedNumbers[c]) {

                    let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 40);

                    updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                        userTotalAmount: userTotalNewAmount
                    }, { new: true })

                    isUser.accountId.userTotalAmount += (betData.betAmount.reduce((a, b) => a + b) * 40);
                }

            }
            if (updatedData) {
                usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
            }
            else {
                usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
            }
        }
    }

    if (betData.betType == "TP") {

        let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
            if (a == 10) return 0
            else return +a
        }).join("")

        let updatedData;
        let priviousAmmount = isUser.accountId.userTotalAmount;

        for (let d = 0; d < betData.selectedNumbers.length; d++) {

            if (betData.selectedNumbers[d] == cardData) {

                let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 700);

                updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                    userTotalAmount: userTotalNewAmount
                }, { new: true })

                isUser.accountId.userTotalAmount = userTotalNewAmount
            }

        }
        if (updatedData) {
            usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
        }
        else {
            usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
        }
    }

    if (betData.betType == "low-line") {

        let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]
        let updatedData;
        let priviousAmmount = isUser.accountId.userTotalAmount;
        for (let e = 0; e < betData.selectedNumbers.length; e++) {

            if (cardData == betData.selectedNumbers[e]) {
                let userTotalNewAmount = isUser.accountId.userTotalAmount
                updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                    userTotalAmount: userTotalNewAmount * 1.90
                }, { new: true })
                isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;
            }
        }
        if (updatedData) {
            usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
        }
        else {
            usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
        }
    }

    if (betData.betType == "high-line") {

        let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

        let updatedData
        let priviousAmmount = isUser.accountId.userTotalAmount;

        for (let e = 0; e < betData.selectedNumbers.length; e++) {
            if (cardData == betData.selectedNumbers[e]) {
                let userTotalNewAmount = isUser.accountId.userTotalAmount
                updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                    userTotalAmount: userTotalNewAmount * 1.90
                }, { new: true })
                isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;
                res.send({ status: 200, message: "success", userData: updatedData })
            }
        }
        if (updatedData) {
            usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
        }
        else {
            usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
        }
    }

    if (betData.betType == "odd") {

        let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

        let updatedData
        let priviousAmmount = isUser.accountId.userTotalAmount;

        for (let e = 0; e < betData.selectedNumbers.length; e++) {
            if (cardData == betData.selectedNumbers[e]) {
                let userTotalNewAmount = isUser.accountId.userTotalAmount
                updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                    userTotalAmount: userTotalNewAmount * 1.90
                }, { new: true })
                isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;
            }
        }
        if (updatedData) {
            usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
        }
        else {
            usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
        }
    }

    if (betData.betType == "even") {
        let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0];
        let updatedData;
        let priviousAmmount = isUser.accountId.userTotalAmount;
        for (let e = 0; e < betData.selectedNumbers.length; e++) {
            if (cardData == betData.selectedNumbers[e]) {
                let userTotalNewAmount = isUser.accountId.userTotalAmount
                updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                    userTotalAmount: userTotalNewAmount * 1.90
                }, { new: true })
                isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;
            }
        }
        if (updatedData) {
            usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
        }
        else {
            usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
        }
    }
}


const wsResults = async (req, ws) => {

    try {
        const { id } = req.params;
        if (!id) ws.send(JSON.stringify({ status: 400, message: "Invalid input.Please provide a valid game ID", successData: "" }))

        const allBetData = await bet.find({ round_id: id })
        if (allBetData.length == 0) return ws.send(JSON.stringify({ status: 404, message: "bet data is not present", successData: "" }))

        let usersData_succ = [{ status: true }];
        let usersData_unsucc = [{ status: false }];
        let userNotFound = [];

        for (let a = 0; a < allBetData.length; a++) {

            let betData = allBetData[a];
            let userId = betData.userId;
            var isUser = await User.findById(userId).populate({ path: "accountId", select: { userTotalAmount: 1 } })
            if (!isUser) {
                userNotFound.push({ status: 400, message: `user data ${userId} is not present` })
                continue;
            }
            let json = path.resolve('data.json')
            const readFile = fs.readFileSync(json, "utf-8")

            if (betData.betType == "ANK") {

                let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

                if (+cardData == betData.selectedNumbers[0]) {
                    let updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                        userTotalAmount: +isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 9)
                    }, { new: true })
                    usersData_succ.push({ status: 200, message: "success", "Winning Amount": (betData.betAmount.reduce((a, b) => a + b) * 9), betId: betData._id })
                }
                else {
                    usersData_unsucc.push({ status: false, message: "card data invalid", "Winning Amount": "0", betId: betData._id })
                    continue;
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
                        usersData_succ.push({ status: 200, message: "success", winAmount: (betData.betAmount.reduce((a, b) => a + b) * 140), betId: betData._id })
                    }
                    else {
                        usersData_unsucc.push({ status: false, message: "card data invalid", "Winning Amount": "0", betId: betData._id })
                        continue;
                    }
                }
                else if (betData.selectedNumbers.length > 1) {
                    let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                        if (a == 10) return 0;
                        else return +a
                    }).join("")

                    var updatedData
                    let priviousAmmount = +isUser.accountId.userTotalAmount;
                    for (let b = 0; b < betData.selectedNumbers.length; b++) {
                        if (cardData == betData.selectedNumbers[b]) {

                            let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 12);

                            updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                                userTotalAmount: userTotalNewAmount
                            }, { new: true })

                            isUser.accountId.userTotalAmount += (betData.betAmount.reduce((a, b) => a + b) * 12);
                            continue;
                        }
                    }
                    if (updatedData) {
                        usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                    }
                    else {
                        usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                    }
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
                        if (updatedData)
                            usersData_succ.push({ status: 200, message: "success", userData: updatedData })
                    }
                }
                else if (betData.selectedNumbers.length > 1) {
                    let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                        if (a == 10) return 0
                        else return +a
                    }).join("")

                    var updatedData;
                    let priviousAmmount = isUser.accountId.userTotalAmount;
                    for (let c = 0; c < betData.selectedNumbers.length; c++) {

                        if (cardData == betData.selectedNumbers[c]) {

                            let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 40);

                            updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                                userTotalAmount: userTotalNewAmount
                            }, { new: true })

                            isUser.accountId.userTotalAmount += (betData.betAmount.reduce((a, b) => a + b) * 40);
                            continue;
                        }
                    }
                    if (updatedData) {
                        usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                    }
                    else {
                        usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                    }
                }
            }

            if (betData.betType == "TP") {

                let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                    if (a == 10) return 0
                    else return +a
                }).join("")

                let updatedData;
                let priviousAmmount = isUser.accountId.userTotalAmount;

                for (let d = 0; d < betData.selectedNumbers.length; d++) {

                    if (betData.selectedNumbers[a] == cardData) {

                        let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 700);

                        updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: userTotalNewAmount
                        }, { new: true })
                    }
                }
                if (updatedData) {
                    usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                }
                else {
                    usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                }
            }

            if (betData.betType == "low-line") {

                let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

                let updatedData;
                let priviousAmmount = isUser.accountId.userTotalAmount;

                for (let e = 0; e < betData.selectedNumbers.length; e++) {
                    if (cardData == betData.selectedNumbers[e]) {

                        let userTotalNewAmount = isUser.accountId.userTotalAmount

                        updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: userTotalNewAmount * 1.90
                        }, { new: true })

                        isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;

                        continue;
                    }
                }

                if (updatedData) {
                    usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                }
                else {
                    usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                }
            }

            if (betData.betType == "high-line") {

                let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]
                let updatedData;
                let priviousAmmount = isUser.accountId.userTotalAmount;
                for (let e = 0; e < betData.selectedNumbers.length; e++) {
                    if (cardData == betData.selectedNumbers[e]) {

                        let userTotalNewAmount = isUser.accountId.userTotalAmount

                        updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: userTotalNewAmount * 1.90
                        }, { new: true })

                        isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;

                        continue;
                    }

                }

                if (updatedData) {
                    usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                }
                else {
                    usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                }
            }

            if (betData.betType == "odd") {
                let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

                let updatedData;
                let priviousAmmount = isUser.accountId.userTotalAmount;

                for (let e = 0; e < betData.selectedNumbers.length; e++) {
                    if (cardData == betData.selectedNumbers[e]) {

                        let userTotalNewAmount = isUser.accountId.userTotalAmount

                        updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: userTotalNewAmount * 1.90
                        }, { new: true })

                        isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;
                    }

                    if (updatedData) {
                        usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                    }
                    else {
                        usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                    }
                }
            }

            if (betData.betType == "even") {
                let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

                let priviousAmmount = isUser.accountId.userTotalAmount;
                let updatedData;

                for (let e = 0; e < betData.selectedNumbers.length; e++) {
                    if (cardData == betData.selectedNumbers[e]) {

                        let userTotalNewAmount = isUser.accountId.userTotalAmount

                        updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                            userTotalAmount: userTotalNewAmount * 1.90
                        }, { new: true })

                        isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;

                    }
                }

                if (updatedData) {
                    usersData_succ.push({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount, betId: betData._id })
                }
                else {
                    usersData_unsucc.push({ status: 200, message: "success", "Winning Amount": 0, betId: betData._id })
                }
            }
        }
        ws.send(JSON.stringify({ status: 400, message: false, usersData_succ, usersData_unsucc, userNotFound }));
    }
    catch (err) {

        return ws.send(JSON.stringify({ message: err.message }));
    }
}

const wsResultPerUser = async (req, ws) => {

    const { userId, betId } = req;

    if (!userId) return ws.send(JSON.stringify({ status: 400, message: "Invalid input.Please provide a valid user ID", successData: "" }))

    if (!betId) return ws.send(JSON.stringify({ status: 400, message: "Invalid input.Please provide a valid betId ID", successData: "" }));

    const betData = await bet.findById(betId)

    if (!betData) {
        return res.send(JSON.stringify({ status: 400, message: "Invalid input.Please provide a valid user ID", successData: "" }))
    }

    var isUser = await User.findById(userId).populate({ path: "accountId", select: { userTotalAmount: 1 } })
    if (!isUser) {
        ws.send(JSON.stringify({ status: 400, message: "user data is not present", successData: "" }))
    }

    let json = path.resolve('data.json')
    const readFile = fs.readFileSync(json, "utf-8")

    if (betData.betType == "ANK") {
        let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

        if (+cardData == betData.selectedNumbers[0]) {
            let updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                userTotalAmount: +isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 9)
            }, { new: true })
            ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": betData.betAmount.reduce((a, b) => a + b) * 9 }))
        } else {
            ws.send(JSON.stringify({ status: 200, message: "success", "Winning Ammount": 0 }));
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
                ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": betData.betAmount.reduce((a, b) => a + b) * 140 }))
            }
            else {
                ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": "0" }))
            }
        }
        else if (betData.selectedNumbers.length > 1) {

            let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                if (a == 10) return 0
                else return +a
            }).join("")

            let priviousAmmount = isUser.accountId.userTotalAmount;
            let updatedData
            for (let b = 0; b < betData.selectedNumbers.length; b++) {

                if (cardData == betData.selectedNumbers[b]) {

                    let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 12);

                    updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                        userTotalAmount: userTotalNewAmount
                    }, { new: true })

                    isUser.accountId.userTotalAmount += (betData.betAmount.reduce((a, b) => a + b) * 12);
                }
            }
            if (updatedData) {
                ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount }))
            }
            else {
                ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": 0 }))
            }

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

                ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": betData.betAmount.reduce((a, b) => a + b) * 270 }))
            }
        }
        else if (betData.selectedNumbers.length > 1) {
            let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
                if (a == 10) return 0
                else return +a
            }).join("")

            var updatedData;
            let priviousAmmount = isUser.accountId.userTotalAmount;
            for (let c = 0; c < betData.selectedNumbers.length; c++) {

                if (cardData == betData.selectedNumbers[c]) {

                    let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 40);

                    updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                        userTotalAmount: userTotalNewAmount
                    }, { new: true })

                    isUser.accountId.userTotalAmount += (betData.betAmount.reduce((a, b) => a + b) * 40);
                }
            }
            if (updatedData) {
                ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount }))
            }
            else {
                ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": 0 }))
            }
        }
    }

    if (betData.betType == "TP") {
        let cardData = JSON.parse(readFile).cards.map((a) => +a.match(/\d+/)).sort((a, b) => a - b).map((a) => {
            if (a == 10) return 0;
            else return +a
        }).join("")

        let updatedData;
        let priviousAmmount = isUser.accountId.userTotalAmount;
        for (let d = 0; d < betData.selectedNumbers.length; d++) {
            if (betData.selectedNumbers[a] == cardData) {

                let userTotalNewAmount = isUser.accountId.userTotalAmount + (betData.betAmount.reduce((a, b) => a + b) * 700);

                updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                    userTotalAmount: userTotalNewAmount
                }, { new: true })

                isUser.accountId.userTotalAmount = userTotalNewAmount;

            }
        }
        if (updatedData) {
            ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount }))
        }
        else {
            ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": 0 }))
        }
    }

    if (betData.betType == "low-line") {

        let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]
        let updatedData
        let priviousAmmount = isUser.accountId.userTotalAmount;
        for (let e = 0; e < betData.selectedNumbers.length; e++) {
            if (cardData == betData.selectedNumbers[e]) {
                let userTotalNewAmount = isUser.accountId.userTotalAmount
                updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                    userTotalAmount: userTotalNewAmount * 1.90
                }, { new: true })
                isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;
            }
        }
        if (updatedData) {
            ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount }))
        }
        else {
            ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": 0 }))
        }
    }

    if (betData.betType == "high-line") {

        let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

        let updatedData;
        let priviousAmmount = isUser.accountId.userTotalAmount;

        for (let e = 0; e < betData.selectedNumbers.length; e++) {
            if (cardData == betData.selectedNumbers[e]) {
                let userTotalNewAmount = isUser.accountId.userTotalAmount
                updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                    userTotalAmount: userTotalNewAmount * 1.90
                }, { new: true })
                isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;
            }
        }
        if (updatedData) {
            ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount }))
        }
        else {
            ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": 0 }))
        }
    }

    if (betData.betType == "odd") {

        let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

        updatedData
        let priviousAmmount = isUser.accountId.userTotalAmount;

        for (let e = 0; e < betData.selectedNumbers.length; e++) {
            if (cardData == betData.selectedNumbers[e]) {
                let userTotalNewAmount = isUser.accountId.userTotalAmount
                updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                    userTotalAmount: userTotalNewAmount * 1.90
                }, { new: true })
                isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;

            }
        }
        if (updatedData) {
            ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount }))
        }
        else {
            ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": 0 }))
        }
    }

    if (betData.betType == "even") {
        let cardData = JSON.parse(readFile).cards.map((a) => +a.slice(0, 1)).reduce((a, b) => a + b).toString().split("").slice(-1)[0]

        updatedData
        let priviousAmmount = isUser.accountId.userTotalAmount;
        for (let e = 0; e < betData.selectedNumbers.length; e++) {
            if (cardData == betData.selectedNumbers[e]) {
                let userTotalNewAmount = isUser.accountId.userTotalAmount
                updatedData = await userAccount.findOneAndUpdate({ userId: betData.userId }, {
                    userTotalAmount: userTotalNewAmount * 1.90
                }, { new: true })
                isUser.accountId.userTotalAmount = isUser.accountId.userTotalAmount * 1.90;
            }
        }
        if (updatedData) {
            ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": updatedData.userTotalAmount - priviousAmmount }))
        }
        else {
            ws.send(JSON.stringify({ status: 200, message: "success", "Winning Amount": 0 }))
        }
    }
}

module.exports = { results, resultPerUser, wsResults, wsResultPerUser };