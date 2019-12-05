/** PACKAGE IMPORTS */
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

/** Routers */
const priyoShop = require('./routes/priyoshop/')
const ajkerdeal = require("./routes/ajkerdeal/")
const pickaboo = require("./routes/pickaboo/")
const search = require('./routes/search/')
const daraz = require("./routes/daraz/")

const phones = require('./routes/others/phones')
const categories = require('./routes/categories/')

/** APP INSTANCE */
const app = express()

/** MIDDLEWARES */
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))

/** ROUTES */
app.use(express.static("public"))
app.use("/v1/priyoshop", priyoShop)
app.use("/v1/ajkerdeal", ajkerdeal)
app.use("/v1/pickaboo", pickaboo)
app.use("/v1/daraz", daraz)
app.use("/v1/search", search)
app.use("/v1/phones", phones)
app.use("/v1/categories", categories)

/** exporting app */
module.exports = app