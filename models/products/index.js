const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
   title:{
      type:String,
      unique:true,
      required:[true,'A title is required!']
   },
   src:String,
   url:{
      type:String,
      unique:true
   },
   sPrice:Number,
   oPrice:Number,
   rating:{type:Number,default:0},
   ratingCount:{type:Number,default:0},
   discount:{type:String,default:"0"},
   brand:{
      name:String,
      url:String
   },
   availability:{type:String,default:"AVAILABLE"},
   categories:{
      mCategory:{
         name:String,
         url:{type:String,default:null}
      },
      subCategory:{
         name:String,
         url:{type:String,default:null}
      },
      category:{
         name:String,
         url:{type:String,default:null}
      }
   },
   flag:{type:String,default:'none'},
   website:{type:String,required:[true,'A website link in required']},
   shop:{type:String,default:'unknown'},
   createdAt:{ type: Date, default: Date.now },
   updatedAt:{ type: Date, default: Date.now }
   
})

const Product = mongoose.model('Product',productSchema)

module.exports = Product