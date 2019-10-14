/** PACKAGE IMPORTS */
const express = require('express')
const router = express.Router()

const picka = require('../../controllers/pickaboo/')

/** ajkerdeal routes */
router.route("/").get(picka.scrap)
router.route("/:action").get(picka.actions)

module.exports = router