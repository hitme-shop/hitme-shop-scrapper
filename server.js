const app = require('./app')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: '.env' })

//const catCollection = require("./models/categories/")

// const fs = require('fs');
// let oCategoriesJson = fs.readFileSync("./data/outputCategories.json", 'utf-8');
// let oCategories = JSON.parse(oCategoriesJson)

try {
   mongoose.connect('mongodb://localhost:27017/hitme-shop', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
   });

   // console.log('connected');

   // catCollection.insertMany(oCategories, (error, doc) => {
   //    if (error) console.log(error);
   // })

} catch (error) {
   console.log('DB Connection error');
}

// try {
//    mongoose.connect(
//       process.env.DATABASE, {
//       useNewUrlParser: true,
//       useFindAndModify: false,
//       useUnifiedTopology: true,
//       useCreateIndex: true
//    }); console.log('Database connected');
// }
// catch (error) { console.log('Database conection ERROR!') }

// const fs = require('fs');
// let oCategoriesJson = fs.readFileSync("./data/oCategories.json", 'utf-8');
// let oCategories = JSON.parse(oCategoriesJson)

// let categories = []
// oCategories.forEach(mCat => {
//    mCat.subCats.forEach(sCat => {
//       sCat.cats.forEach(cat => {
//          categories.push({
//             mCat: mCat.name,
//             sCat: sCat.name,
//             cat: cat.name,
//             keywords: cat.keywords
//          })
//       })
//    })
// })

// fs.writeFileSync("./data/outputCategories.json", JSON.stringify(categories));

/** starting server */
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))