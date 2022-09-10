const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const loginController = require("../controllers/loginController")
const authMiddleware = require("../authMiddleware/authentication")



router.post("/authors", authorController.createAuthor) // to create authors

router.post("/blogs", authMiddleware.authenticate, authMiddleware.authorisation, blogController.createBlogs) // to create blogs

router.get("/blogs", authMiddleware.authenticate, blogController.getBlogs) // to finding blogs

router.delete("/blogs/:blogId", authMiddleware.authenticate, authMiddleware.authorisation, blogController.deleteBlogsByParam) // to deleting blogs by param

router.delete("/blogs", authMiddleware.authenticate, authMiddleware.authorisation, blogController.deleteBlogsByQuery) // to deleting blogs by query

router.put("/blogs/:blogId", authMiddleware.authenticate, authMiddleware.authorisation, blogController.updateBlog) // to updating blogs by param

// phase - 2

router.post("/login", loginController.login) // to login , authentication and authoriztion 

module.exports = router;