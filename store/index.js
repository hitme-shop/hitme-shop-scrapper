
/** Sleep function to delay code execution */
const SECOND = "Second", MINUTE = "Minute", HOUR = "Hour"
const sleep = (VALUE, UNIT = 'MILLI_SECOND', ) => {
   return new Promise((resolve, reject) => {
      try {
         if (UNIT === SECOND) VALUE *= 1000
         else if (UNIT === MINUTE) VALUE *= (1000 * 60)
         else if (UNIT === HOUR) VALUE *= (1000 * 60 * 60)
         setTimeout(() => { resolve() }, VALUE)
      } catch (error) { reject({ error: true, message: error.message }) }
   })
} /** End of sleep */

const proCollection = require('../models/products/')
const excludes = require("../models/categories/excludes")
const { categories } = require("../models/categories/")
const { keysInReview } = require("../models/categories/")

class Store {

   constructor(products) { this.products = products }

   getUniqueArrayOfObject(array) {
      return [...new Set(array.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
   }

   async insert(product) {
      try {
         await proCollection.init()
         let res = await proCollection.create(product)
         return { error: false, status: 'Inserted', data: res }
      } catch (error) {
         if (error.message.includes('duplicate key')) {
            return { error: true, duplicate: true, message: error.message }
         }
      }
   }

   async getCategory(tags) {
      let matched = [];
      for (let key of tags) {
         if (await excludes.countDocuments({ key }).limit(1) === 0) {
            let filedsToSelect = "mCat sCat cat -_id";
            let docRes = await categories.findOne({ keywords: key }, filedsToSelect)
            if (docRes !== null) matched.push(docRes)
         }
      }
      return this.getUniqueArrayOfObject(matched)
   }

   async saveKeysInReview(keys, conditions) {
      if (await keysInReview.countDocuments(conditions).limit(1) === 0) {
         let data = { ...conditions }; data.keywords = keys
         console.log("  Keys created for review");
         await keysInReview.init()
         let createRes = await keysInReview.create(data)
         return createRes
      } else {
         console.log("  Keys updated");
         let updateRes = await keysInReview.updateOne(conditions, { $addToSet: { keywords: keys } })
         return updateRes
      }
   }

   async saveProducts() {

      let log = {
         total: this.products.length,
         saved: 0,
         duplicate: 0,
         inReview: 0,
         compared: 0
      }

      /** Main loop for per product iteration */
      for (let pro of this.products) {

         console.log(`\nProduct : ${pro.title}`);
         pro.tags = pro.title.toLowerCase().split(" ")

         let catRes = await this.getCategory(pro.tags)
         if (catRes.length === 0 || catRes.length > 1) {
            log.inReview += 1
            console.log('  |-Has to save in review-|');
            /** Has to save in review */
         } else {

            let cat = catRes[0]; pro.mCat = cat.mCat, pro.sCat = cat.sCat, pro.cat = cat.cat

            let createRes = await this.insert(pro)
            if (!createRes.error) {
               log.saved += 1
               console.log(`  |-${createRes.status}-|`);
               await this.saveKeysInReview(pro.tags, cat)
            } else {
               log.duplicate += 1
               console.log('  |--DUPLICATE--|');
            }

         }
         await sleep(0.5, SECOND)
      }
      return { error: fale, status: "OK", log }
   }

}

module.exports = Store