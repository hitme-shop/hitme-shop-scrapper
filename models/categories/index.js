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

exports.categories = mongoose.model('categories', categoriesSchema)
exports.keysInReview = mongoose.model('keys-in-reviews', categoriesSchema)