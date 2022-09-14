const mongoose = require("mongoose")


const authorSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true,
        trim: true,
        uppercase:true
    },
    lname: {
        type: String,
        required: true,
        trim: true,
        uppercase:true
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
    },
    password: {
        type: String,
        required: true,
        trim: true
    }

}, { timestamps: true })


module.exports = mongoose.model('Author', authorSchema) //authors