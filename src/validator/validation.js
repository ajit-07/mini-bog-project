function isValidName(value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    var isValid = /^([a-zA-Z]){2,15}$/
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


const isValidString = function (value) { //function to check entered data is valid or not

    if (typeof value == "string") {
        if (value.trim() === "") {
            //console.log(value.trim())
            return false
        } else { return value.trim() }
    } else { return false }
}

const isValidForArray = function (value) {      //function to check entered data in array is valid or not
    //console.log("value in isValidForArray function - " + value);
    if (typeof value == "string") { return isValidString(value) }
    const newArr = []
    if (Array.isArray(value)) {
        // console.log(value);
        for (let i = 0; i < value.length; i++) {    //example :-   ["ghfgh","   ",56444,"freendon 1947,"ghhgf"]
            if (typeof (value[i]) == "string") {
                if (value[i].trim() !== "") {
                    newArr.push(value[i].trim())
                } else { return false }
            }
            else { return false }
        }
        // console.log(newArr)
        return newArr
    }
    else { return false }
}

function Boolean(value) {
    if (value == true || value == false) { return true }
    return false
}



module.exports.isValidName=isValidName
module.exports.isEnum=isEnum
module.exports.isValidEmail=isValidEmail
module.exports.isValidPassword=isValidPassword
module.exports.isValidString=isValidString
module.exports.Boolean=Boolean
module.exports.isValidForArray=isValidForArray
