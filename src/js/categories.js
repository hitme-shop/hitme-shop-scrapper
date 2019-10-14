
const fs = require('fs');
var oCategoriesJson = fs.readFileSync('./data/oCategories.json', 'utf-8');
var oCategories = JSON.parse(oCategoriesJson);

exports.getCategory = (title) => {
   title = title.toLowerCase();
   titleKeys = title.split(" ")
}

exports.categories = ( req , res ) => {

   
}