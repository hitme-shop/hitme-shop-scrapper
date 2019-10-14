
const catCol = require("../../models/categories/")

const getUniqueArrayOfObject = (array) => {
   return [...new Set(array.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
}

exports.getMatchedCategory = async (title) => {
   let keys = title.toLowerCase().split(" ")
   let matched = []; try {
      for (let key of keys) {
         let filedsToSelect = "mCat sCat cat -_id";
         let docRes = await catCol.findOne({ keywords: key }, filedsToSelect)
         if (docRes !== null) matched.push(docRes)
      }
   } catch (error) { console.log(error) }
   return getUniqueArrayOfObject(matched)
}
