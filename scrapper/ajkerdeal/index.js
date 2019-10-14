
const cheerio = require('cheerio'); var $
const { capitalizeFirstLetter } = require('../helper/helper')

const getCategory = (root) => {
    let cats = []; $(root).each((__, _) => {
        cats.push({ name: $(_).text(), url: $(_).attr('href') })
    }); return { error: false, results: cats.length, data: cats }
}

exports.loadPageContent = async (page) => { $ = cheerio.load(await page.content()) }
exports.mCategories = () => { return getCategory('.title-category-span > a') }
exports.subCategories = () => { return getCategory('.title-subcategory-span > a') }
exports.categories = () => { return getCategory('.title-subsubcategory-span > a') }

exports.hotDeals = () => {
    let deals = []; $('.hot-product-flash-deal').each((__, _) => {
        let url = $(_).find('a').attr('href'), splittedUrl = url.split("/")
        let title = splittedUrl[splittedUrl.length - 1].split("-").join(" ")
        title = capitalizeFirstLetter(title)
        let src = $(_).find('a > .crazy-deal > img').attr('src')
        let sPrice = $(_).find('.price-text').text().replace('৳', '') * 1
        let discount = $(_).find('.percentage-amount-new').text() * 1
        let oPrice = Math.round(sPrice * (100 / discount))
        deals.push({ title, url, src, sPrice, oPrice, discount })
    })
    return deals
}

exports.getProducts = async (page) => {
    let items = []; let $ = cheerio.load(await page.content())
    $('.deal-info-container').each((__, _) => {
        let src = $(_).find('.deal-image-container > a > .deal_image').attr('src')
        let title = $(_).find('.deal-title-container > h1 > a').text()
        let oPrice = $(_).find('.deal-price-container').text().replace(/৳|-|,/g, '').replace('/', '') * 1
        let url = $(_).find('.deal-image-container > a').attr('href')
        let rating = $(_).find(' span.diamond-yellow > span').attr('style').replace(/width:|px;/g, "") * 1
        items.push({
            title, src, url, oPrice, sPrice: oPrice, rating,
            ratingCount: 0, discount: 0
        })
    }); return items
}

/*
exports.mCatProducts = async (page) => {
    return await getProducts( page )
}

exports.subCatProducts = async (page) => {
    return await getProducts( page )
}

exports.catProducts = async (page) => {
    return await getProducts( page )
}
*/