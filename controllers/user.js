const userModel = require("../models/user");
const userAccount = require("../models/userAccount");


let register = async (req, res) => {
    try {
        let requestBody = req.body;
        const { name, email, password } = requestBody

        if (Object.keys(requestBody).length == 0) return res.status(400).send({ status: false, msg: "Enter some data to create user" })

        if (!name) return res.status(400).send({ status: false, msg: "name is mandatory" })
        if (!email) return res.status(400).send({ status: false, msg: "email is mandatory" })
        requestBody.email = email.toLowerCase()
        let emailCheck = await userModel.findOne({ email: email })
        if (emailCheck) return res.status(409).send({ status: false, msg: "email is already used " })
        if (!password) return res.status(400).send({ status: false, msg: "password is mandatory" })

        let createdUser = await userModel.create(req.body);
       let accountCreated = await userAccount.create({ userId: createdUser._id })
       
       await userModel.findOneAndUpdate({_id:createdUser._id},{accountId:accountCreated._id})
        return res.status(201).send({ status: true, message: createdUser })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.register = register;