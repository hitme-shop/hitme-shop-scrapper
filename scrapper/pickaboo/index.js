const cheerio = require('cheerio')
const helper = require('../helper/helper')

exports.mCategories = async (page) => {
   let cats = await page.$$eval('.em-menu-link', a => a.map(b => {
      return { name: b.innerText.toLowerCase(), url: b.href }
   }))
   return { results: cats.length, data: cats }
}

exports.covers = async (page) => {
   return await page.$$eval('.img-banner .banner-img', x => x.map(y => {
      return { image: y.children[0].src, url: y.href }
   }))
}

exports.categories = async (page) => {
   let cats = await page.$$eval('.list-text li', x => x.map(_ => {
      return { name: _.firstChild.innerText.toLowerCase(), url: _.firstChild.href }
   }))
   return { results: cats.length, data: cats }
}

exports.subCategories = async (page) => {
   let $ = cheerio.load(await page.content())
   let subCats = []
   $('.menu-item-depth-3').each((__, _) => {
      let name = $(_).find('h5 a span').text()
      let url = $(_).find('h5 a').attr('href')
      subCats.push({ name, url })
   }); $('.syn-subcategory-list').each((__, _) => {
      let names = subCats.map(c => c.name); names = [...new Set(names)]
      let cat = { name: $(_).text(), url: page.url() + $(_).parent().attr('href') }
      if (!names.includes(cat.name)) subCats.push(cat)
   })
   return { results: subCats.length, data: subCats }
}

exports.sliders = async page => await page.$$eval(".owl-item .item a", x => x.map(y => {
   return {
      url: y.href, src: y.querySelector('img').getAttribute('data-src') || y.querySelector('img').src
   }
}
))

exports.hotDeals = async page => {
   let $ = cheerio.load(await page.content()), deals = []
   $('.syn-view > .product-item').each((__, _) => {
      let url = $(_).find('.syn-product-image > a').attr('href')
      let src = $(_).find('.syn-product-image > a > img').attr('src')

      let sPrice = $(_).find('.syn-product-price').text().replace(/\r?\n|\r|\t/g, '')
      let price = sPrice, oPrice = 0; sPrice = parseInt(sPrice.split('৳')[1].split(',').join(''))
      if (price.split('৳')[2]) oPrice = parseInt(price.split('৳')[2].split(',').join('')); else oPrice = sPrice

      let title = $(_).find('.syn-product-name > a > span').text().split(".").join("")
      let rating = parseInt($(_).find('.mobile-rating > p').text().split('/')[0].trim())
      let ratingCount = parseFloat($(_).find('.ratings > .amount > a').text().split('(')[1].split(')')[0])

      let discount = (((oPrice - sPrice) / oPrice) * 100).toFixed(2) * 1

      deals.push({
         title, src, url, rating, ratingCount,
         flag: "Hot Deals", sPrice, oPrice, discount
      })
   })
   return { results: deals.length, data: deals }
}

exports.products = async page => {

   let $ = cheerio.load(await page.content()), products = []
   $('.syn-product').each((__, _) => {

      let src = $(_).find('.product-image > img').attr('data-original')
      let title = $(_).find('.syn-product-name > span > a').text().replace(/\r?\n|\r|\t/g, '').split(".").join("")
      let url = $(_).find('.syn-product-name > span > a').attr('href')

      let sPrice = $(_).find('.syn-product-price').text().replace(/\r?\n|\r|\t/g, '')
      let price = sPrice, oPrice = 0
      sPrice = parseInt(sPrice.split('৳')[1].split(',').join(''))
      if (price.split('৳')[2]) oPrice = parseInt(price.split('৳')[2].split(',').join('')); else oPrice = sPrice

      let discount = ((oPrice - sPrice) / oPrice * 100).toFixed(2) * 1

      let rating = parseFloat($(_).find('.mobile-rating > p.amount-mobile').text().split('/')[0].trim())
      let ratingCount = parseFloat($(_).find('.ratings > .amount > a').text().split('(')[1].split(')')[0])

      products.push({
         title, src, url, rating, ratingCount,
         flag: "Home", sPrice, oPrice, discount
      })
   })

   return {
      results: products.length,
      data: products
   }
}

exports.create = (data) => {
   Products.insertMany(data).then((result) => {
      console.log('inserted');
      return result
   }).catch((err) => {
      console.log(err);
      return { message: 'Error', data: err }
   });

}

exports.mCatProducts = async (page /*, mCategory, aCategories */) => {
   let $ = cheerio.load(await page.content())
   let products = []
   $('.product-item').each((__, _) => {

      let title = $(_).find('.product-name > a').text().trim()
      let url = $(_).find('.product-name > a').attr('href')
      let src = $(_).find('.product-image > img').attr('src')
      let rating = parseFloat($(_).find('.amount-mobile').text().split('/')[0].trim())
      let ratingCount = parseInt($(_).find('.ratings > .amount > a').text().split("(")[1].split(')')[0])

      let spPriceEl = $(_).find('.special-price > .price')
      let sPrice = oPrice = 0;
      if (spPriceEl.text() !== '') {
         sPrice = helper.formatTk(spPriceEl.text())
         oPrice = helper.formatTk($(_).find('.old-price > .price').text())
      } else { sPrice = oPrice = helper.formatTk($(_).find('.regular-price > .price').text()) }

      let discount = helper.calcDiscount(oPrice, sPrice)
      //let website = page.url(), shop = "Unknown", availability = "AVAILABLE", flag = 'mCategory'

      // let categories = {
      //    mCategory, subCategory: { name: null, url: null },
      //    category: helper.getCategory(title, aCategories)
      // }
      // let brand = categories.category

      products.push({
         title, url, src, rating, ratingCount, sPrice, oPrice, discount
      })

   })
   return products
}