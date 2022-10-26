const authorModel = require("../models/authorModel")
const validation = require("../validator/validation")
const jwt = require('jsonwebtoken')


const createAuthor = async function (req, res) {
    try {
        let data = req.body
        const { fname, lname, title, email, password } = data;

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is mandatory" })

        if (!fname) return res.status(400).send({ status: false, msg: "First Name is Mandatory" })
        if (!validation.isValidName(fname)) return res.status(400).send({ status: false, msg: "Invalid Fname, available characters ( A-Z, a-z ) with minimum 2 characters" })

        if (!lname) return res.status(400).send({ status: false, msg: "Last Name is Mandatory" })
        if (!validation.isValidName(lname)) return res.status(400).send({ status: false, msg: "Invalid Lname, available characters ( A-Z, a-z ) with minimum 2 characters" })

        if (!title) return res.status(400).send({ status: false, msg: "Title is Mandatory" })
        if (!validation.isEnum(title)) return res.status(400).send({ status: false, msg: 'Invalid Title ,available titles ( Mr, Mrs, Miss)' })

        if (!email) return res.status(400).send({ status: false, msg: "Email is Mandatory" })

        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, msg: "Invalid email format" })

        const emailExist = await authorModel.findOne({ email: email })
        if (emailExist) return res.status(400).send({ status: false, msg: `${email.trim()} email Already Exist ` })

        if (!password) return res.status(400).send({ status: false, msg: "password is Mandatory" })
        if (!validation.isValidPassword(password)) return res.status(400).send({ status: false, msg: "Minimum 8 characters including ( a-z, A-Z, 0-9, special character- !@#$%^&* )" })

        const authorData = await authorModel.create(data)
        return res.status(201).send({ status: true, data: authorData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


const login = async function (req, res) {
    try {
        const data = req.body;
        const { email, password } = data;

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Login credentials missing!!" })

        if (!email) return res.status(400).send({ status: false, msg: "Email is Mandatory" })
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, msg: "Invalid email format" })

        if (!password) return res.status(400).send({ status: false, msg: "password is Mandatory" })
        if (!validation.isValidPassword(password)) return res.status(400).send({ status: false, msg: "Minimum 8 characters including ( a-z, A-Z, 0-9, special character- !@#$%^&* )" })

        const author = await authorModel.findOne({ email: email, password: password })

        if (!author) return res.status(401).send({ status: false, msg: "Invalid Credentials!!" })

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

module.exports.createAuthor = createAuthor;
module.exports.login = login;