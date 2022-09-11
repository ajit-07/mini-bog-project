const authorModel = require("../models/authorModel")

function isValidName(value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    var isValid = /^([a-zA-Z]){2,15}$/
    // console.log(value.trim());
    return isValid.test(value.trim());
}

function isEnum(value) {
    if (typeof value !== "string") { return false }
    else {
        let titles = ["Mr", "Mrs", "Miss"]
        for (let i = 0; i < titles.length; i++) {
            if (titles[i] == value.trim()) { return true }
        }
        return false
    }
}

function isValidEmail(value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    else {
        var isValid = /[a-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}/;
        // console.log(value.trim());
        return isValid.test(value.trim());
    }
}

function isValidPassword(value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    else {
        let isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        return isValid.test(value);
    }
}



// ----------------------------------------------------- create Author ------ done -----------------------------------------------


const createAuthor = async function (req, res) {
    try {
        const data = req.body
        const { fname, lname, title, email, password } = data
        //console.log(fname, lname, title, email, password);

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is mandatory" })

        if (!fname) return res.status(400).send({ status: false, msg: "fname is Mandatory" })
        if (!isValidName(fname)) return res.status(400).send({ status: false, msg: "Invalid Fname, available characters ( A-Z, a-z ) with minimum 2 characters" })

        if (!lname) return res.status(400).send({ status: false, msg: "lname is Mandatory" })
        if (!isValidName(lname)) return res.status(400).send({ status: false, msg: "Invalid Lname, available characters ( A-Z, a-z ) with minimum 2 characters" })

        if (!title) return res.status(400).send({ status: false, msg: "title is Mandatory" })
        if (!isEnum(title)) return res.status(400).send({ status: false, msg: 'Invalid Title ,available tiltes ( Mr, Mrs, Miss)' })

        if (!email) return res.status(400).send({ status: false, msg: "email is Mandatory" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: "Invalid Email" })
        const emailExist = await authorModel.findOne({ email: email })
        if (emailExist) return res.status(400).send({ status: false, msg: "Email Already Exist" })

        if (!password) return res.status(400).send({ status: false, msg: "password is Mandatory" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, msg: "Minimum 8 characters including ( a-z, A-Z, 0-9, special character- !@#$%^&* )" })

        const authorData = await authorModel.create(data)
        return res.status(201).send({ status: true, data: authorData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createAuthor = createAuthor