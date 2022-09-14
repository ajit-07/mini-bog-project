const authorModel = require("../models/authorModel.js")
const jwt = require('jsonwebtoken')

const login = async function (req, res) {
    try {
        const requestBody = req.body; // it consist email and password

        if (!requestBody.email || !requestBody.password) { return res.status(400).send({ status: false, msg: "Credentials Missing" }) }
        const author = await authorModel.findOne(requestBody)

        if (!author) return res.status(400).send({ status: false, msg: "Invalid Credentials!!" })

        let payload = {
            authorId: author._id.toString(),
            topic: "bloggingWebsite"
        }

        let token = jwt.sign(payload, 'project-1-group-59');
        res.status(200).send({ status: true, msg: "Author logged in successfully", data: token })
    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}
module.exports.login = login;