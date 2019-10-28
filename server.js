const app = require('./app')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: '.env' })

try {
   mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
   });
   console.log('db connected');

} catch (error) { console.log('DB Connection error'); }

/** starting server */
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

/** Background Scrapper */
//const scrapper = require("./scrapper/")
//scrapper.test()
//scrapper.mainLoop()