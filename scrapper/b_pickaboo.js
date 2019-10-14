const puppeteer = require('puppeteer')
const pickaboo = "https://www.pickaboo.com/"

exports.scrapData = async () => {

   /** INITIALIZING PUPPETEER */
   const browser = await puppeteer.launch({ headless: false })
   const page = await browser.newPage()
   await page.goto(pickaboo, { waitUntil: 'networkidle2' })
   await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' })

   /** EVALUATING PAGE */
   let data = await page.evaluate( async () => {
      try {
         var data = {navbar:{categories:[]},content:[],hotDeals:[]}

         /** GET ALL CATEROGIRIE LINKS FROM NAVBAR */
         $('.menu-item-vbox').each((linkI, link) => {
            let category={name:'',subs:[]};
            category.name=$(link).find('h5').find('a').text().trim().toLowerCase()
            category.url=$(link).find('h5').find('a').attr('href')
            $(link).find('.list-text > li').each( ( liI , subC ) => {
               let subName = $(subC).find('a').text()
               let subUrl = $(subC).find('a').attr('href')
               category.subs.push({name:subName,url:subUrl})
            })
            data.navbar.categories.push(category)
         })

         /** GET HOT DEALS */
         $('.syn-view > .product-item').each( (hotI , hotPro) => {
            let url = $(hotPro).find('.syn-product-image > a').attr('href')
            let image = $(hotPro).find('.syn-product-image > a > img').attr('src')
            let price = $(hotPro).find('.syn-product-price').text()
            let netPrice = ""; if (price.split("৳").length > 2) netPrice = price.split("৳")[2].split(',').join('')
            price = price.split('৳')[1].split(',').join('')
            let title = $(hotPro).find('.syn-product-name > a > span').text()
            let rating = $(hotPro).find('.mobile-rating > p').text()
            data.hotDeals.push({title,url,image,price,rating,netPrice})
         })

         /** GET HOME PAGE CATEGORY BOX DATAS */
         $('.syn-homepage-category').each((i, el) => {
            let category = $(el).find('.syn-category-header > h3').text()
            let url = $(el).find('.syn-button-viewall > a').attr('href')
            let products = []; $(el).find('.syn-product').each((proI, pro) => {
               let title = $(pro).find('.syn-product-name > span > a').attr('title')
               let url = $(pro).find('.syn-product-name > span > a').attr('href')
               let rating = $(pro).find('.amount-mobile').text()
               let price = $(pro).find('.syn-product-price').text().replace(/\r?\n|\r/g, '').replace(/\t/g, '')
               let netPrice = ""; if (price.split("৳").length > 2) netPrice = price.split("৳")[2].split(',').join('')
               price = price.split('৳')[1].split(',').join('')
               let image = $(pro).find('.product-image > img').attr('data-original')
               products.push({ title, url, rating, price, image, netPrice })
            });
            data.content.push({ category, url, products })
         })

         //await page.goto("https://www.pickaboo.com/mobile-phone/smartphone.html")

         /** RETURNING DATA OBJECT */
         //console.log(data);
         return data
      } catch (err) { return err }
   })

   /** CLOSING HEADLESS BROWSER */
   await browser.close()

   /** RETURNING DATA OBJECT */
   return data
}