const mongoose = require("mongoose")

// function isValidName(name) {
//     var isValid = /^([a-zA-Z])+$/
//     return isValid.test(name);
// }
// function isValidEmail(email) {
//     var isValid = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//     return isValid.test(email);
// }

// ^ Assert the start of the string
// (?![0-9.]) Negative lookahead to assert that the string does not start with [0-9.]
// (?!.*[0-9.]$) Negative lookahead to assert that the string does not end with [0-9.]
// (?!.*\d_) Negative lookahead to assert that the string does not contain a digit followed by an underscore
// (?!.*_\d) Negative lookahead to assert that the string does not contain an underscore followed by a digit
// [a-zA-Z0-9_]+ Match what is specified in the character class one or more times. You can add to the character class what you would allow to match, for example also add a .
// $ Assert the end of the string

const authorSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true,
        trim: true
        // validate: [isValidName, "Enter a valid Fname"]
    },
    lname: {
        type: String,
        required: true,
        trim: true
        // validate: [isValidName, "Enter a valid Lname"]
    },
    title: {
        type: String,
        required: true,
        trim: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
        // validate: [isValidEmail, "Enter a valid Email"]
    },
    password: {
        type: String,
        required: true,
        trim: true
    }

}, { timestamps: true })//


module.exports = mongoose.model('Author', authorSchema) //authors