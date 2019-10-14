/** PACKAGE IMPORTS */
const express = require('express')
const router = express.Router()

const catController = require("../../controllers/categories/")

/** Categories */
router.route("/")
   .get(catController.getCategories)

router.route("/:title")
   .get(catController.getCategoryFromTitle)

router.route("/:whichCat/:catName")
   .get(catController.getCategory)
   .put(catController.updateCategory)
   .post(catController.createCategory)
   .delete(catController.deleteCategory)

module.exports = router