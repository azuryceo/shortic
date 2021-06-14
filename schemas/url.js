const mongoose = require('mongoose')

const urlSchema = mongoose.Schema({
  _id: String,
  original: String
}, { timestamps: true })

module.exports = mongoose.model('url', urlSchema, 'url')