const userModel = require("../models/user");



let register = async (req, res) => {
    try {
        let requestBody = req.body;
        const { name, email, password } = requestBody;

        if (Object.keys(requestBody).length == 0) return res.send({ status: 400, message: "Enter some data to create user" ,successData:{}})

        if (!name) return res.send({ status: 400, message: "name is mandatory",successData:""})
        if (!email) return res.send({ status: 400, message: "email is mandatory",successData:""})
        requestBody.email = email.toLowerCase()
        let emailCheck = await userModel.findOne({ email: email })
        if (emailCheck) return res.send({ status: 400, message: "email is already used",successData:""})
        if (!password) return res.send({ status: 400, message: "password is mandatory",successData:""})

        let createdUser = await userModel.create(req.body);
       
        return res.send({ status: true, message: "createdUser" ,successData:{
            createdUser
        }})
    }
    catch (err) {
        return res.send({ status: 400, message: "Internal server error. Please try again later."})
    }
}

module.exports.register = register;