
const PickabooScrapper = require("../scrapper/pickaboo/")
const Store = require("../store/")
const fs = require('fs')

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

const before = (TIME, UNIT = SECOND) => {
   let diff = Date.now() - new Date(TIME).getTime()
   if (UNIT === SECOND) diff /= 1000
   else if (UNIT === MINUTE) diff /= (1000 * 60)
   else if (UNIT === HOUR) diff /= (1000 * 60 * 60)
   return Math.round(diff)
}

const scrapPickaboo = async () => {

   console.log("\nScrapping Pickaboo...");

   /** Initializing puppeteer */
   const { page, browser } = await puppeteer.goto(websites.PICKABOO.URL)

   let ps = new PickabooScrapper(page)
   let products = await ps.getMainCategories()
   console.log(products);

   /** Closing browser */
   await browser.close()

   console.log("Saving scrap log...");
   //await axios.post(`${API}/scrapper-logs`, scrapLog)
   console.log("|==== DONE ====|\n");
}

exports.test = async () => {

   await sleep(3, SECOND)

   /** Initializing Scrap Log */
   let scrapLog = {
      website: websites.PICKABOO,
      startedAt: new Date()
   }

   /** Initializing puppeteer */
   //const { page, browser } = await puppeteer.goto(websites.PICKABOO.URL)

   /** Instance of Pickaboo Scrapper class */
   //let ps = new PickabooScrapper(page)

   /** Getting all the categories includes main and sub category */
   /** [ name:"Xiaomi",url:"pickaboo/xiaomi.html"] */
   //let allCategories = await ps.getAllCategories()

   /** Storing log of how many categories */
   /** { total:64, cats: 50, sCats:10, mCats:4} */
   //scrapLog.categories = allCategories.log

   /** Getting all the unique products of all categories */
   //let allProducts = await ps.getAllProducts(allCategories.data)

   /** Stroting how many products of which section */
   /** { total:920, hotDeals:5, homePage:50, category:930} */
   //scrapLog.products = allProducts.log


   //let allSliders = await ps.getAllSliders()
   //console.log(allSliders);

   //scrapLog.sliders = allSliders.log

   let proObjects = fs.readFileSync("./products.json", "utf-8")
   let allProducts = JSON.parse(proObjects)

   let store = new Store(allProducts)
   let storeRes = await store.saveProducts()
   scrapLog.store = {}, scrapLog.store.product = storeRes.log

   /** Saving the ending time of scrapping */
   scrapLog.endedAt = new Date()

   console.log(scrapLog);

   /** Closing browser */
   //await browser.close()

}

const scrapDaraz = async () => {
   console.log("\nScrapping Daraz...");

   console.log("Saving scrap log...");

   console.log("|==== DONE ====|\n");
}

const scrapAjkerDeal = async () => {
   console.log("\nScrapping Ajkerdeal...");

   console.log("Saving scrap log...");

   console.log("|==== DONE ====|\n");
}

const scrapPriyoshop = async () => {
   console.log("\nScrapping Priyoshop...");

   console.log("Saving scrap log...");

   console.log("|==== DONE ====|\n");
}

/** Module Imports */
const axios = require('axios')
const puppeteer = require("../src/js/puppeteer")
const pickaboo = require("../scrapper/pickaboo/")
const websites = require("../src/js/websites")

const API = process.env.API



exports.mainLoop = async () => {
   while (true) {
      var res = await axios.get(`${API}/scrapper-configs/latest`), config = res.data
      var lastScrapped = res.data.lastScrapped
      console.log("\nScrap in Every : " + config.scrapEvery.time + " " + config.scrapEvery.unit + "");
      console.log(`Last Scrapped Before : ${before(lastScrapped, config.scrapEvery.unit)} ${config.scrapEvery.unit}\n`);
      if (config.running && before(lastScrapped, config.scrapEvery.unit) >= config.scrapEvery.time) {
         console.log("\n|=======================|");
         console.log('|==Scrap staring');
         await scrapPickaboo()

         await scrapDaraz()

         await scrapAjkerDeal()

         await scrapPriyoshop()

         console.log('|==Scrapp done');
         console.log("|=======================|\n");

         await axios.patch(`${API}/scrapper-configs/${res.data._id}`, { lastScrapped: new Date() })
      }
      else {
         console.log(`\nNot Running or Scrapped less than ${before(lastScrapped, config.scrapEvery.unit)} ${config.scrapEvery.unit} \n`);
      }

      //console.log(`\nSleeping for 1 ${MINUTE}\n`);
      await sleep(3, SECOND)
   }
}


// if (before(lastScrapped, SECOND) > 10) {

//    let logRes = await axios.get(`${API}/scrapper-logs/ended/ALL`)

//    /********************************************************************* */
//    if (logRes.data[websites.PICKABOO.NAME] === null) await scrapPickaboo()
//    else if (before(logRes.data[websites.PICKABOO.NAME].endedAt, MINUTE) > 1) { await scrapPickaboo() }
//    else { console.log(`\n${websites.PICKABOO.NAME} scrapped less than a minute\n`) }
//    /********************************************************************* */


//    /********************************************************************* */
//    if (logRes.data[websites.DARAZ.NAME] === null) await scrapDaraz()
//    else if (before(logRes.data[websites.DARAZ.NAME].endedAt, MINUTE) > 1) { await scrapDaraz() }
//    else { console.log(`\n${websites.DARAZ.NAME} scrapped less than a minute\n`) }
//    /********************************************************************* */


//    /********************************************************************* */
//    if (logRes.data[websites.AJKERDEAL.NAME] === null) await scrapAjkerDeal()
//    else if (before(logRes.data[websites.AJKERDEAL.NAME].endedAt, MINUTE) > 1) { await scrapAjkerDeal() }
//    else { console.log(`\n${websites.AJKERDEAL.NAME} scrapped less than a minute\n`) }
//    /********************************************************************* */


//    /********************************************************************* */
//    if (logRes.data[websites.PRIYOSHOP.NAME] === null) await scrapPriyoshop()
//    else if (before(logRes.data[websites.PRIYOSHOP.NAME].endedAt, MINUTE) > 1) { await scrapPriyoshop() }
//    else { console.log(`\n${websites.PRIYOSHOP.NAME} scrapped less than a minute\n`) }
//    /********************************************************************* */

//    lastScrapped = new Date()

// }

// /** Reset everything */
// console.log("\nLast Scrapped : ", lastScrapped.toLocaleTimeString());

// console.log('Sleeping for 9 Second\n');
// /** Sleeping for certain time */
// await sleep(9, SECOND)