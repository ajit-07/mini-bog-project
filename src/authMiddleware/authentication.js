const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId //check whether the format or objectid is of 24 digit or not

let token;


// ------------------------------------------- authentication --------------------------------------------------

const authenticate = function (req, res, next) {
    try {
        token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });


        jwt.verify(token, "project-1-group-59", function (err, decodedToken) {
            if (err) { return res.status(401).send({ status: false, msg: "token is invalid" }) }
            req.decodedToken = decodedToken
            next()
        });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}


// ------------------------------------------- authoriztion --------------------------------------------------

const authorisation = async function (req, res, next) {
    try {
//check authorization when data is coming from path params
        let userLoggedIn = req.decodedToken.authorId

        if (req.params.blogId) {
            let blogId = req.params.blogId
            if (!ObjectId.isValid(blogId.trim())) return res.status(400).send({ status: false, msg: "BlogId is not valid" })
            const userToBeModified = await blogModel.findById(blogId)

            if (!userToBeModified) return res.status(404).send({ status: false, msg: "No such Blog present" })

            if (userToBeModified.authorId.toString() !== userLoggedIn) return res.status(403).send({ status: false, msg: 'Access denied' })
            next()
        }

        if (req.query.authorId) {
 //check when the data is coming from query params           
            let authorId = req.query.authorId;
            if (!ObjectId.isValid(authorId.trim())) return res.status(400).send({ status: false, msg: "AuthorId is not valid" })
            if (authorId.toString() !== userLoggedIn) return res.status(403).send({ status: false, msg: 'Access denied' })
            next()
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports.authenticate = authenticate
module.exports.authorisation = authorisation
























        // else {  //this is for query
        //     //authorId for the logged-in user

        //     const temp = {}
        //     //console.log(q.category);

        //     if (q.category && q.category.trim() !== "") { temp.category = q.category.trim() }
        //     // this is for captital "authorid"
        //     if (q.authorid && q.authorid.trim() !== "") {
        //         if (!ObjectId.isValid(q.authorid.trim())) return res.status(400).send({ status: false, msg: "AuthorId is not valid" })
        //         temp.authorId = q.authorid.trim()
        //     }
        //     // this is for captital "authorId"
        //     if (q.authorId && q.authorId.trim() !== "") {
        //         if (!ObjectId.isValid(q.authorId.trim())) return res.status(400).send({ status: false, msg: "AuthorId is not valid" })
        //         temp.authorId = q.authorId.trim()
        //     }

        //     // this is for "tags"
        //     if (q.tags && q.tags.trim() !== "") { temp.tags = q.tags.trim() }
        //     // this is for "tag"
        //     if (q.tag && q.tag.trim() !== "") { temp.tag = q.tag.trim() }

        //     if (q.subcategory && q.subcategory.trim() !== "") { temp.subcategory = q.subcategory.trim() }

        //     if (q.unpublished && q.unpublished.trim() !== "") {
        //         if (q.unpublished.trim() == "false") {
        //             temp.isPublished = false
        //         } else { temp.isPublished = true }
        //     }
        //     if (Object.values(temp) == 0) return res.status(400).send({ status: false, msg: "please apply filter" })

        //     const userToBeModified = await blogModel.findOne(temp)
        //     //console.log("temp - " + userToBeModified);

        //     if (!userToBeModified) return res.status(403).send({ status: false, msg: 'Access denied' }) //Ma'am

        //     if (userToBeModified.authorId.toString() !== userLoggedIn) return res.status(403).send({ status: false, msg: 'Access denied' })
        //     req.savedTemp = temp
        //     next()
        // }





        



