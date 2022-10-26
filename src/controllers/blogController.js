const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const mongoose = require("mongoose")
const moment = require('moment')
const ObjectId = mongoose.Types.ObjectId
const validation = require("../validator/validation")

let time = moment().format()

//Create Blogs

const createBlogs = async function (req, res) {
    try {
        let data = req.body
        let { title, body, authorId, tags, category, subcategory, isPublished } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "blog is manadatory" })

        if (!authorId) return res.status(400).send({ msg: "id is mandatory" })
        const id = await authorModel.findById(authorId)
        if (!id) return res.status(404).send({ status: false, msg: "no Author is present for this Id" })

        if (validation.isValidString(title) == false) return res.status(400).send({ status: false, msg: "Title is required and should be String " })

        if (validation.isValidString(body) == false) return res.status(400).send({ status: false, msg: "Body is required and should be String " })

        if (tags) { if (validation.isValidForArray(tags) == false) return res.status(400).send({ status: false, msg: "Tag is required and should be (String or Array of String)" }) }

        if (validation.isValidForArray(category) == false) return res.status(400).send({ status: false, msg: "Category is required and should be (String or Array of String)" })

        if (subcategory) { if (validation.isValidForArray(subcategory) == false) return res.status(400).send({ status: false, msg: "Subcategory is required and should be (String or Array of String)" }) }

        if (isPublished) {
            if (validation.Boolean(isPublished) == false) return res.status(400).send({ status: false, msg: "isPublished should be true or false" })
        }

        if (isPublished == true) { req.body.publishedAt = time }
        const blogCreated = await blogModel.create(data)
        return res.status(201).send({ status: true, data: blogCreated })
    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}


//get blogs by query params

const getBlogs = async function (req, res) {
    try {

        let { authorId, category, tags, subcategory } = req.query
        let filterQuery = { isDeleted: false, isPublished: true }

        if (Object.keys(req.query).length > 0) {

            if (authorId && authorId.trim() !== "") {
                if (!ObjectId.isValid(authorId.trim())) return res.status(400).send({ status: false, msg: "AuthorId is not valid" })
                filterQuery.authorId = authorId.trim()
            }


            if (category && category.trim() !== "") { filterQuery.category = category.trim() }


            if (tags && tags.trim() !== "") { filterQuery.tags = tags.trim() }


            if (subcategory && subcategory.trim() !== "") { filterQuery.subcategory = subcategory.trim() }

            const result = await blogModel.find(filterQuery)
            if (result.length == 0) return res.status(404).send({ status: false, msg: "no data found" })

            return res.status(200).send({ status: true, data: result })
        } else {
            let result = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }] })
            if (result.lenght == 0) return res.status(404).send({ status: false, msg: "no data found" })

            return res.status(200).send({ status: true, data: result })


        }

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


//deleteBlogs by blogId in path Params

const deleteBlogsByParam = async function (req, res) {
    try {
        let blogId = req.params.blogId

        await blogModel.findByIdAndUpdate(blogId, { isDeleted: true, deletedAt: moment() }, { new: true })
        return res.status(200).send({ status: false, msg: "Deleted successfully" })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//update Blogs by data in request body 

const updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let data = req.body
        let { title, body, tags, subcategory } = data;


        // console.log(title, body, tags, subcategory);
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Please provide blog details to update" });

        let temp1 = { isPublished: true, publishedAt: time }
        let temp2 = {}

        if (title) {
            if (validation.isValidString(title) == false) return res.status(400).send({ status: false, msg: "Title is required and should be String " })
            temp1.title = validation.isValidString(title)
        }

        if (body) {
            if (validation.isValidString(body) == false) return res.status(400).send({ status: false, msg: "Body is required and should be String" })
            temp1.body = validation.isValidString(body)
        }

        if (tags) {
            if (validation.isValidForArray(tags) == false) return res.status(400).send({ status: false, msg: "Tag is required and should be (String or Array of String)" })
            temp2.tags = validation.isValidForArray(tags)
        }

        if (subcategory) {
            if (validation.isValidForArray(subcategory) == false) return res.status(400).send({ status: false, msg: "Subcategory is required and should be (String or Array of String)" })
            temp2.subcategory = validation.isValidForArray(subcategory)
        }

        const updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: temp1, $addToSet: temp2 }, { new: true })

        return res.status(200).send({ status: true, data: updatedBlog });
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
};

//  deleteBlogs by Qyery Params


let deleteBlogsByQuery = async function (req, res) {

 try{
    let data = req.query
    let { authorId, category, tags, subcategory, isPublished } = data

    if (Object.keys(data).length === 0) { return res.status(400).send({ status: false, msg: "Please apply filter" }) }

    let filterQuery = {}
    filterQuery.isDeleted = false
    filterQuery.authorId = req.decodedToken.authorId;

    if (authorId && authorId.trim() !== "") { filterQuery.authorId = authorId.trim() }

    if (category && category.trim() !== "") { filterQuery.category = category.trim() }

    if (tags && tags.trim() !== "") { filterQuery.tags = tags.trim() }

    if (subcategory && subcategory.trim() !== "") { filterQuery.subcategory = subcategory.trim() }

    if (isPublished && isPublished.trim() !== "") { filterQuery.isPublished = Boolean(isPublished) }
    //console.log(filterQuery)


    let filtered = await blogModel.find(filterQuery)
    if (filtered.length === 0) { return res.status(403).send({ status: "false", msg: "No such blog found or user not authorized" }) }

    await blogModel.updateMany(filterQuery, { isDeleted: true, deletedAt: time }, { new: true })
    return res.status(200).send({ status: true, msg: "Deleted successfully" })

}
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}

module.exports = { createBlogs, getBlogs, deleteBlogsByParam, deleteBlogsByQuery, updateBlog }

