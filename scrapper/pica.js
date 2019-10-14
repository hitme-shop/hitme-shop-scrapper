const puppeteer = require('puppeteer')

exports.scrapData = async () => {

   const browser = await puppeteer.launch({
      headless: false,devtools: true,
      executablePath:`C:\\Users\\RKAnik\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome.exe`
   })
   const page = await browser.newPage();
   await page.goto('https://www.pickaboo.com/', {
      waitUntil: 'networkidle2',
      timeout: 0
   })
   let categories = await page.$$eval('.em-menu-link', links => links.map(link => {
      return {url: link.href,name: link.innerText}
   }))
   let result = {}
   for (let category of categories) {
      await page.goto(category.url)

      let subCategories = await page.$$eval('.main-parent-category',
         cats => cats.map(cat => {
            return {
               url: cat.firstChild.href,
               name: cat.firstChild.innerText
            }
         }))

      for (let subCategory of subCategories) {
         await page.goto(subCategory.url)
         let products = await page.$$eval('.product-item',
            products => products.map(pro => {
               let image = pro.querySelector('.product-image img').src
               let title = pro.querySelector('.product-name a').innerText
               let url = pro.querySelector('.product-name a').href
               let rating = pro.querySelector('.ratings span a').innerText
               let salePrice, originalPrice = ''
               if (pro.querySelector('.special-price span.price') !== null) {
                  salePrice = pro.querySelector('.special-price span.price').innerText
                  originalPrice = pro.querySelector('.old-price span.price').innerText
               } else {
                  salePrice = originalPrice = pro.querySelector('.regular-price span.price').innerText
               }
               return {title,image,url,rating,salePrice,originalPrice}
            })
         )
         if (result[category.name]) {
            result[category.name][subCategory.name] = products
         } else {
            result[category.name] = {}
            result[category.name][subCategory.name] = products
         }
      }
   }
   browser.close();
   return result
}