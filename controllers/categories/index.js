
const catCollection = require('../../models/categories/')
const catSubs = require("./subs")

exports.getCategories = (req, res) => {
   let filedsToSelect = "mCat sCat cat keywords";
   catCollection.find({}, filedsToSelect, (err, colRes) => {
      if (err) { res.status(500).send({ status: 'error', data: err }) }
      else {
         res.send(colRes)
      }
   })
}

exports.getCategory = async (req, res) => {
   let query = {}; query[req.params.whichCat] = req.params.catName
   let filedsToSelect = "mCat sCat cat keywords -_id";
   let docRes = await catCollection.find(query, filedsToSelect);
   res.send(docRes)
}

exports.updateCategory = async (req, res) => {
   let conditions = {}; conditions[req.params.whichCat] = req.params.catName
   let docRes = await catCollection.update(conditions, { keywords: req.body })
   res.send(docRes)
}

exports.createCategory = async (req, res) => {
   try {
      let docRes = await catCollection.create(req.body)
      res.send(docRes)
   } catch (error) {
      res.status(500).send({ error: true, message: error.message })
   }
}

exports.deleteCategory = async (req, res) => {
   try {
      let docRes = await catCollection.findOneAndDelete({ cat: req.params.catName })
      res.send(docRes)
   } catch (error) {
      res.status(500).send({ error: true, message: error.message })
   }
}

exports.getCategoryFromTitle = async (req, res) => {
   if (req.params.title) {
      res.json(await catSubs.getMatchedCategory(req.params.title))
   } else {
      res.send('error')
   }
}