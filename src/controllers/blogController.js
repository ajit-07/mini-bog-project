const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId //check whether the format or objectid is of 24 digit or not

const isValid = function (value) { //function to check entered data is valid or not

    if (typeof value == "string") {
        if (value.trim() === "") {
            console.log(value.trim());

            return false
        } else { return value.trim() }
    } else { return false }
}

const isValidForArray = function (value) {      //function to check entered data in array is valid or not
    console.log("value in isValidForArray function - " + value);
    if (typeof value == "string") { return isValid(value) }
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

function Date(value) {
    if (typeof value == Date) { return true }
    return false
}

// ----------------------------------------------------- create Blogs by body-----------done  done------------------------------------------

const createBlogs = async function (req, res) {
    try {
        let blog = req.body
        let { title, body, authorId, tags, category, subcategory, deletedAt, isDeleted, isPublished, publishedAt } = blog

        if (Object.keys(blog).length == 0) return res.status(400).send({ status: false, msg: "blog is manadatory" })

        if (isValid(title) == false) return res.status(400).send({ status: false, msg: "Title is required and should be String " })

        if (isValid(body) == false) return res.status(400).send({ status: false, msg: "Body is required and should be String " })

        if (!authorId) return res.status(400).send({ msg: "id is mandatory" })

        const id = await authorModel.findById(authorId)
        if (!id) return res.status(404).send({ status: false, msg: "no Author is present for this Id" })

        if (isValidForArray(tags) == false) return res.status(400).send({ status: false, msg: "Tag is required and should be (String or Array of String)" })

        if (isValidForArray(category) == false) return res.status(400).send({ status: false, msg: "Category is required and should be (String or Array of String)" })

        if (isValidForArray(subcategory) == false) return res.status(400).send({ status: false, msg: "Subcategory is required and should be (String or Array of String)" })

        if (Boolean(isDeleted) == false) return res.status(400).send({ status: false, msg: "isDeleted should be Boolean" })

        if (Boolean(isPublished) == false) return res.status(400).send({ status: false, msg: "isPublished should be Boolean" })

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
        const temp = {}

        if (q.category && q.category.trim() !== "") { temp.category = q.category.trim() }
        // this is for captital "authorid"
        // if (q.authorid && q.authorid.trim() !== "") {
        //     if (!ObjectId.isValid(q.authorid.trim())) return res.status(400).send({ status: false, msg: "AuthorId is not valid" })
        //     temp.authorId = q.authorid.trim()
        // }
        // this is for captital "authorId"
        if (q.authorId && q.authorId.trim() !== "") {
            if (!ObjectId.isValid(q.authorId.trim())) return res.status(400).send({ status: false, msg: "AuthorId is not valid" })
            temp.authorId = q.authorId.trim()
        }

        // this is for "tags"
        if (q.tags && q.tags.trim() !== "") { temp.tags = q.tags.trim() }
        // this is for "tag"
        if (q.tag && q.tag.trim() !== "") { temp.tags = q.tag.trim() }

        if (q.subcategory && q.subcategory.trim() !== "") { temp.subcategory = q.subcategory.trim() }

        // console.log(temp)
        // console.log(Object.values(temp))
        if (Object.values(temp) == 0) return res.status(400).send({ status: false, msg: "please apply filter" })

        const result = await blogModel.find(temp).find({ isDeleted: true, isPublished: true }).count()
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

        // if (!ObjectId.isValid(blogId)) return res.status(400).send({ status: false, msg: "Blog id is invalid" }) //already checked in autorization

        let requestBody = req.body;

        if (Object.keys(requestBody).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide blog details to update" });
        }

        let { title, body, tags, subcategory } = requestBody
        console.log(title, body, tags, subcategory);

        if (title) {
            if (isValid(title) == false) return res.status(400).send({ status: false, msg: "Title is required and should be String" })
        }
        // Title is required and should be String 
        if (body) {
            if (isValid(body) == false) return res.status(400).send({ status: false, msg: "Body is required and should be String" })
        }

        if (tags) {
            if (isValidForArray(tags) == false) return res.status(400).send({ status: false, msg: "Tag is required and should be (String or Array of String)" })
        }


        if (subcategory) {
            if (isValidForArray(subcategory) == false) return res.status(400).send({ status: false, msg: "Subcategory is required and should be (String or Array of String)" })
        }


        let blog = await blogModel.findOne({ _id: blogId, isDeleted: true })//.select({isDeleted:1,_id:0})
        // console.log(blog);
        if (!blog) { return res.status(404).send({ status: false, msg: "No such blog present in DB or is already deleted" }) }

        //updates the blog by using the given data in body
        
        title = isValid(title)
        body = isValid(body)
        tags = isValid(tags)
        subcategory = isValid(subcategory)
        
        console.log(title, body, tags, subcategory);
        const updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            {
                title: title,
                body: body,
                $addToSet: { tags: tags, subcategory: subcategory },
                isPublished: false,
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