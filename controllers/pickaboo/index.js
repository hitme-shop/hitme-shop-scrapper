
const { initPuppeteer } = require('../../src/js/puppeteer')
const pickaboo = require("../../scrapper/pickaboo/")
const store = require("../../store/store")
const SITE_URL = "https://www.pickaboo.com/"

const { categories } = require("../../models/categories/")

exports.test = async (req, res) => {
   //let id = "5da36eb76b42002af4687532"
   //let docRes = await categories.findOne({ _id: id })
   res.json('Test')
}
exports.testPost = async (req, res) => {
   let id = "5da36eb76b42002af4687535"
   let docRes = await categories.updateOne({ _id: id }, { $addToSet: { keywords: req.body } })
   res.json(docRes)
}

exports.scrapAssortSave = async (_, res) => {
   try {
      let { page, browser } = await initPuppeteer(SITE_URL)
      let hotDeals = await pickaboo.hotDeals(page)
      let sliders = await pickaboo.sliders(page)
      let homeProducts = await pickaboo.products(page)
      let allProducts = hotDeals.concat(homeProducts)
      await browser.close()
      await store.saveSliderImages(sliders)
      let products = await store.getPassedAndInreviewProducts(allProducts)
      await store.savePassedProducts(products.passedProducts)
      await store.saveInReviewProducts(products.inReview)
      res.json({ error: false, message: "Data successfully scrapped and saved to the database!" })
   } catch (error) {
      res.status(500).json({ status: 'error', message: error.message })
   }
}

exports.scrap = async (req, res) => {
   try {

      let { page, browser } = await initPuppeteer(SITE_URL)
      let hotDeals = await pickaboo.hotDeals(page)
      let sliders = await pickaboo.sliders(page)
      let products = await pickaboo.products(page)

      let passedProducts = []
      let inReview = []

      products = products.concat(hotDeals)

      for (let pro of products) {
         let cats = await categorySubs.getMatchedCategory(pro.title)
         if (cats.length === 1) {
            let cat = cats[0]
            pro.mCat = cat.mCat, pro.sCat = cat.sCat, pro.cat = cat.cat
            passedProducts.push(pro)
         } else if (cats.length > 1) {
            pro.cats = cats
            inReview.push(pro)
         } else {
            inReview.push(pro)
         }
      }
      await browser.close()
      res.json({ products: passedProducts, sliders, inReview })
   } catch (error) {
      res.status(500).json({ status: 'error', message: error.message })
   }
}

exports.actions = (req, res) => {
   res.json({ status: "success", message: 'Response has recieved actions' })
}
