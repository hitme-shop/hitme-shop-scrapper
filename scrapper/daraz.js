const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const { scrollToElement } = require('../src/js/auto-scroll')

const siteUrl = "https://www.daraz.com.bd/"

const { queryCategories , formatTk , calcDiscount } = require('./helper/helper')

exports.subCategories = async ( page ) => {
   let subCategories = await queryCategories(page,'.lzd-site-menu-sub-item',{remove:true,child:'.lzd-site-menu-grand'})
   return {error:false,results:subCategories.length,data:subCategories}
}

exports.categories = async ( page ) => {
   let categories = await queryCategories(page,'.lzd-site-menu-grand-item',{remove:false})
   return {error:false,results:categories.length,data:categories}
}

exports.fsUrl = async ( page ) => {
   let $ = cheerio.load( await page.content() )
   return "https:"+$('a.card-fs-content-button').attr('href')
}

exports.flashSale = async ( page  ) => {
   let $ = cheerio.load( await page.content() )
   let deals=[]; $('.flash-sale-body > div:first-child > .item-list-content > a')
   .each( async (__,_) => {
      let url = "https:"+$(_).attr('href')
      let title = $(_).find('.sale-title').text()
      let src = $(_).find('img.image').attr('src')
      let sPrice = formatTk($(_).find('.sale-price').text())
      let oPrice = formatTk($(_).find('.origin-price-value').text())
      let discount = calcDiscount( oPrice , sPrice )
      let rating = ratingCount = 0
      let flag = 'flashSale', website = siteUrl, shop = "Unknown"
      let mCategories=subCategories=categories=brand={name:null,url:null}
      let availability = $(_).find('.pg-text').text().toUpperCase()
      deals.push({
         title,url,src,sPrice,oPrice,discount,rating,ratingCount,brand,availability,
         flag,website,shop,categories:{mCategories,subCategories,categories}
      })
   });return {error:false,results:deals.length,data:deals}
}

exports.justForYou = async ( page  ) => {
   let $ = cheerio.load( await page.content() )
   let products = []
   $('.card-jfy-li-content').each( (__,_) => {

      let url = "https:"+$(_).attr('href').split('?')[0]
      let titile = $(_).find('.card-jfy-title > span.title').text()
      let src = $(_).find('.card-jfy-image > .image').attr('src')

      let sPrice = formatTk($(_).find('.hp-mod-price-first-line > .price').text())
      let oPrice = formatTk($(_).find('.hp-mod-price-second-line > .hp-mod-price-text > .price').text())

      let rating = ($(_).find('.card-jfy-rating-layer').attr('style').replace(/width|%|:/g,'').trim()*1).toFixed(2)*1
      let ratingCount = $(_).find('.card-jfy-ratings-comment').text().replace('(','').replace(')','')*1

      let discount = calcDiscount( oPrice , sPrice )
      let mCategories = subCategories = categories = brand = { name:null, url:null }
      let availability = 'AVAILABLE' , website = siteUrl , shop = 'Unknown' , flag = 'Just for you'

      products.push({
         titile,url,src,sPrice,oPrice,discount,rating,ratingCount,
         categories:{mCategories,subCategories,categories},brand,
         availability,website,shop,flag
      })
   })
   return{error:false,results:products.length,data:products}
}

exports.productsSubCategories = async ( page , sub ) => {
   return await page.evaluate( async ( sub ) => {

      function revealImage(el,time){return new Promise((rs,rj)=>{
         setTimeout(() => {el.scrollIntoView();el.click();rs()},time)})}
      
      let proDivs = Array.from(document.querySelectorAll('.c5TXIP'))

      let products = [] ;
      for( pDiv of proDivs ){

         pDiv.style.cssText="border:2px solid red;opacity:0.5"
         await revealImage(pDiv.querySelector('.cRjKsc'),150)

         const text=(q)=>{return pDiv.querySelector(q).innerText}

         let title = text('.c16H9d a')
         let url = pDiv.querySelector('.c16H9d a').href
         let sPrice = text('.c3gUW0 span.c13VH6').replace(/৳|,/g,'').trim()*1
         let oPrice = pDiv.querySelector('.c1-B2V').innerText
         oPrice===""?oPrice=sPrice:oPrice=oPrice.replace(/৳|,/g,'').trim()*1
         let discount = ((oPrice-sPrice)/oPrice*100).toFixed(2)*1

         let rating = pDiv.querySelectorAll('.c3EEAg').length
         let ratingCount=0,rcEl=pDiv.querySelector('span.c3XbGJ')
         rcEl===null?ratingCount=0:ratingCount=rcEl.innerText.replace('(','').replace(')','')*1

         let mCategories = categories = brand = {name:null, url:null}
         let subCategories = sub

         let website = "https://www.daraz.com.bd/",shop = 'Unknown',availability='AVAILABLE'
         let flag = 'subCategories'

         const getImage=()=>{return pDiv.querySelector('.cRjKsc > a > img').src}

         let src='';try{src=getImage()}catch (error) {
            await revealImage(pDiv.querySelector('.cRjKsc'),1500)
            src = getImage()
         }

         products.push({
            title,src,url,sPrice,oPrice,discount,rating,ratingCount,
            categories:{mCategories,subCategories,categories},brand,
            website,shop,availability,flag
         })
      }
      return products
   },sub)
}

exports.getProducts = async ( page ) => {

   return await page.evaluate( async () => {

      function revealImage(el,time){return new Promise((rs,rj)=>{
         setTimeout(() => {el.scrollIntoView();el.click();rs()},time)})}
      
      let proDivs = Array.from(document.querySelectorAll('.c5TXIP'))

      let products = [] ;
      for( pDiv of proDivs ){

         pDiv.style.cssText="border:2px solid red;opacity:0.5"
         await revealImage(pDiv.querySelector('.cRjKsc'),150)

         const text=(q)=>{return pDiv.querySelector(q).innerText}

         let title = text('.c16H9d a')
         let url = pDiv.querySelector('.c16H9d a').href
         let sPrice = text('.c3gUW0 span.c13VH6').replace(/৳|,/g,'').trim()*1
         let oPrice = pDiv.querySelector('.c1-B2V').innerText
         oPrice===""?oPrice=sPrice:oPrice=oPrice.replace(/৳|,/g,'').trim()*1
         let discount = ((oPrice-sPrice)/oPrice*100).toFixed(2)*1

         let rating = pDiv.querySelectorAll('.c3EEAg').length
         let ratingCount=0,rcEl=pDiv.querySelector('span.c3XbGJ')
         rcEl===null?ratingCount=0:ratingCount=rcEl.innerText.replace('(','').replace(')','')*1

         const getImage=()=>{return pDiv.querySelector('.cRjKsc > a > img').src}

         let src='';try{src=getImage()}catch (error) {
            await revealImage(pDiv.querySelector('.cRjKsc'),1500)
            src = getImage()
         }

         products.push({title,src,url,sPrice,oPrice,discount,rating,ratingCount})
      }
      return products
   })
}