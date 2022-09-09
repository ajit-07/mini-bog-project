const authorModel = require("../models/authorModel")

// ----------------------------------------------------- create Author ------ done -----------------------------------------------


// const createAuthor = async function (req, res) {
//     try {
//         const data = req.body
//         if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "credentials are manadatory" })
//         const authorData = await authorModel.create(data)
//         return res.status(201).send({ status: true, data: authorData })
//     }
//     catch (err) {
//         return res.status(500).send({ status: false, msg: err.message })
//     }
// }

// module.exports.createAuthor = createAuthor




function isValidName(name) {
    var isValid = /^([a-zA-Z]){2,}$/
    return isValid.test(name.trim());
}
function isValidEmail(email) {
    var isValid = /[a-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}/;
    // var isValid = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return isValid.test(email.trim());
}
function isValidPassword(password) {
    var isValid =  /^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#\$%\^&\*])(?=.{8,})/  // /^(?=.[a-zA-Z0-9])(?=.[!@#\$%\^&\*])(?=.{8,15})/;
    return isValid.test(password);
}


// ----------------------------------------------------- create Author ------ done -----------------------------------------------


const createAuthor = async function (req, res) {
    try {
        const data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "credentials are manadatory" })
        if (!isValidName(data.fname)) return res.status(400).send({ status: false, msg: "Invalid Fname" })
        if (!isValidName(data.lname)) return res.status(400).send({ status: false, msg: "Invalid Lname" })
        if (!isValidEmail(data.email)) return res.status(400).send({ status: false, msg: "Invalid Email" })
        const eMail = data.email
        const emailExist = await authorModel.findOne({ email: eMail })
        if (emailExist) return res.status(400).send({ status: false, msg: "Email Already Exist" })
        if (!isValidPassword(data.password)) return res.status(400).send({ status: false, msg: "Use strong Password" })
        const authorData = await authorModel.create(data)
        return res.status(201).send({ status: true, data: authorData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createAuthor = createAuthor