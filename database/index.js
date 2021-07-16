const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose) 

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true, useFindAndModify: false,
  useCreateIndex: true, useUnifiedTopology: true
})

const urls = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: Number
})
urls.plugin(AutoIncrement, { inc_field: "short_url" })
const Model = mongoose.model('urls', urls) 

module.exports = Model