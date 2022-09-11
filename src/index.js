const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./routes/route.js');
const app = express();
const moment = require("moment")

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true })); // -->  it is not mandatory

mongoose.connect("mongodb+srv://TarunKumar123:xLcX9W1SI9646ftM@cluster1.tpwtwiv.mongodb.net/Project_1", {
    useNewUrlParser: true  
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use(
    function (req, res, next) {
        let time = moment().format("DD/MM/YYYY hh:mm:ss a")
        let url = req.url
        console.log("url : " + url, " time : " + time);
        next();
    }
);

app.use('/', route);// -->  url starts from ' / '

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
