const {initPuppeteer} = require('../src/js/puppeteer')
const {autoScroll} = require('../src/js/auto-scroll')

const SITE_URL = "https://www.daraz.com.bd/"

const fs = require('fs')

exports.scrap = async () => {

   let data = []

   /** INITIALIZING PUPPERTEER */
   const {page,browser} = await initPuppeteer(SITE_URL)

   page.on('error',( error ) => {
      console.log(error.message);
      if( error.message === 'Page crashed!'){
         page.reload()
      }
   })

   /** Scrolling to load all the resources */
   //await autoScroll(page)

   // let categories = await page.$$eval('.lzd-site-menu-root-item',
   //    catListItems => catListItems.map(
   //       catListItem => catListItem.firstChild.nextSibling.innerText))

   let subCats = await page.$$eval('.lzd-site-menu-sub-item',
      x => x.map(y => {
         return {
            name: y.children[0].firstChild.nextSibling.innerHTML,
            url: y.firstChild.nextSibling.href
         }
      })
   )

   for (let cat of subCats) {
      console.log('Going to => ' , cat.url);

      try {
         await page.goto(cat.url, {waitUntil: 'networkidle2',timeout:0})
      } catch (error) {
         return 'error';
      }
     

      console.log('Scrapping...');
      let products = await page.$$eval('.c5TXIP',
         x => x.map(y => {
            let url = y.querySelector('.cRjKsc').firstChild.href
            let title = y.querySelector('.c16H9d').firstChild.innerHTML
            let salePrice,originalPrice,discount,rated=''
            let t = y.querySelector('.c3gUW0 span');t?salePrice=t.innerHTML:''
            t= y.querySelector('.c1-B2V .c13VH6');t?originalPrice=t.innerHTML:''
            t= y.querySelector('.c1hkC1');t?discount=t.innerHTML:''
            t= y.querySelector('.c3XbGJ');t?rated=t.innerHTML:''
            t=y.querySelector('.c1ZEkM ');t?image=t.src:''
            return {title,url,salePrice,originalPrice,discount,rated}
         }))
      console.log('===Done===');
      fs.appendFileSync('C:\\Users\\RKAnik\\Desktop\\daraz.json',JSON.stringify(products))
      data.push(products)
   }

   // let grandCats = await page.$$eval('.lzd-site-menu-grand-item',
   //    x => x.map(y => {
   //       return {
   //          name: y.children[0].firstChild.nextSibling.innerHTML,
   //          url: y.firstChild.nextSibling.href
   //       }
   //    }))

   /** Closing the browser */
   browser.close()

   /** returning result object */
   return data

}