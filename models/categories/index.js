const mongoose = require('mongoose')

const categoriesSchema = new mongoose.Schema({
   mCat: String,
   sCat: String,
   cat: {
      type: String,
      unique: true,
      required: [true, "Category name is required!"]
   },
   keywords: Array
})

const Categories = mongoose.model('Categories', categoriesSchema)

module.exports = Categories