
const { initPuppeteer } = require('../../src/js/puppeteer')
const pickaboo = require("../../scrapper/pickaboo/")
const categorySubs = require("../../controllers/categories/subs")

const SITE_URL = "https://www.pickaboo.com/"

exports.scrap = async (req, res) => {
   try {

      let { page, browser } = await initPuppeteer(SITE_URL)
      //let hotDeals = await pickaboo.hotDeals(page)
      //let sliders = await pickaboo.sliders(page)
      let products = await pickaboo.products(page)


      for (let pro of products.data) {
         let cats = await categorySubs.getMatchedCategory(pro.title)
         // if (cats.length === 1) {
         //    cats[0].title = pro.title
         //    console.log(cats[0]);
         // } else 
         if (cats.length > 1) {
            console.log("");
            console.log(cats);
            console.log("");
         } 
         // else {
         //    console.log("empty");
         // }
      }

      await browser.close()

      res.json(products)

   } catch (error) {
      res.status(500).json({ status: 'error', message: error.message })
   }
}

exports.actions = (req, res) => {
   res.json({ status: "success", message: 'Response has recieved actions' })
}
