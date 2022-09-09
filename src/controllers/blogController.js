const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId //check whether the format or objectid is of 24 digit or not

const isValid = function (value) { //function to check entered data is valid or not

    if (typeof value == "string") {
        if (value.trim() === "") {
            return false
        } else { return true }
    } else { return false }
}

const isValidForArray = function (value) {      //function to check entered data in array is valid or not
    console.log(value);

    const newArr = []
    if (typeof value === "string") {
        newArr.push(value.trim())
        return newArr
    }

    else if (Array.isArray(value)) {
        console.log(value);

        for (let i = 0; i < value.length; i++) {    //example :-   ["ghfgh","   ",56444,"freendon 1947,"ghhgf"]
            if (typeof (value[i]) == "string") {
                if (value[i].trim() !== "") {
                    newArr.push(value[i].trim())
                    console.log(value[i].trim())
                }
            }
            else { return false }
        }
        if (newArr.length == 0) { return false }
        // console.log(newArr);

        else { return newArr }
    }
    else { return false }
}

// ----------------------------------------------------- createBlogs by body-----------done  done------------------------------------------

const createBlogs = async function (req, res) {
    try {
        let blog = req.body
        let tags = blog.tags
        const authorId = req.body.authorId
        console.log(tags);

        tags = isValidForArray(tags)
        blog.tags = tags
        console.log(tags);

        if (tags == false) return res.status(400).send({ status: false, msg: "Tag is required" })
        console.log(tags);

        if (Object.keys(blog).length == 0) return res.status(400).send({ status: false, msg: "blog is manadatory" })
        if (!authorId) return res.status(400).send({ msg: "id is mandatory" })
        const id = await authorModel.findById(authorId)
        if (!id) return res.status(404).send({ status: false, msg: "no Author is present for this Id" })
        const blogData = await blogModel.create(blog)
        return res.status(201).send({ status: true, data: blogData })
    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}


// --------------------------------------------------- get Blogs by query--------------- done --done----------------------------------

const getBlogs = async function (req, res) {
    try {
        const q = req.query // it gives an object
        const temp = req.savedTemp

        const result = await blogModel.find(temp).find({ isDeleted: true, isPublished: true })//.count()
        if (result.length == 0) return res.status(404).send({ status: false, msg: "no data found" })

        return res.status(200).send({ status: true, data: result })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


// --------------------------------------- deleteBlogs by param -------- done ---------------------------

const deleteBlogsByParam = async function (req, res) {
    try {
        const blogId = req.params.blogId

        await blogModel.findByIdAndUpdate(blogId, { isDeleted: true, deletedAt: Date.now() }, { new: true })
        return res.status(200).send()
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

// ---------------------------------------------- update Blogs by body ------------- done ----done-------------------------

const updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        //Check object id is in correct format or not!!

        if (!ObjectId.isValid(blogId)) return res.status(400).send({ status: false, msg: "Blog id is invalid" })

        let requestBody = req.body;

        if (Object.keys(requestBody).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide blog details to update" });
        }

        let { title, body, tags, subcategory } = requestBody
        // console.log(tags);

        //check the entered data in body is valid string or not!!
        if (!isValid(title)) return res.status(400).send({ status: false, msg: "title in wrong format" })
        if (!isValid(body)) return res.status(400).send({ status: false, msg: "body in wrong format" })
        if (tags) {
            tags = isValidForArray(tags)
            console.log("tags - " + tags);

            if (tags == false) { return res.status(400).send({ status: false, msg: "Tag is required and must be in String or Array of String" }) }
        }

        if (subcategory) {
            subcategory = isValidForArray(subcategory)
            if (subcategory == false) { return res.status(400).send({ status: false, msg: "Subcategory is required and must be in String or Array of String" }) }
        }


        let blog = await blogModel.findOne({ _id: blogId, isDeleted: true })//.select({isDeleted:1,_id:0})
        // console.log(blog);
        if (!blog) { return res.status(404).send({ status: false, msg: "No such blog present in DB or is already deleted" }) }

        //updates the blog by using the given data in body

        const updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            {
                title: title,
                body: body,
                $addToSet: { tags: tags, subcategory: subcategory },
                isPublished: true,
                publishedAt: new Date()
            },
            { new: true });

        return res.status(200).send({ status: true, data: updatedBlog });


    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

};

// --------------------------------------- deleteBlogs by Qyery ---------- done --done-----------------------


let deleteBlogsByQuery = async function (req, res) {
    try {

        const temp = req.savedTemp

        const toBeDeleted = await blogModel.find(temp).select({ isDeleted: 1, _id: 0 })

        if (toBeDeleted.length == 0) return res.status(404).send({ status: false, msg: "no data found" })

        for (let i = 0; i < toBeDeleted.length; i++) {
            if (toBeDeleted[i].isDeleted == false) {
                temp.isDeleted = false
            }
        }
        if (temp.isDeleted != false) return res.status(404).send({ status: false, msg: "already Deleted" })

        await blogModel.updateMany(temp, { isDeleted: true, deletedAt: Date.now() }, { new: true })
        return res.status(200).send()
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.createBlogs = createBlogs
module.exports.getBlogs = getBlogs
module.exports.deleteBlogsByParam = deleteBlogsByParam
module.exports.deleteBlogsByQuery = deleteBlogsByQuery
module.exports.updateBlog = updateBlog
module.exports.isValid = isValid
module.exports.isValidForArray = isValidForArray