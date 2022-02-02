const mongoose = require('mongoose')

const homes = mongoose.Schema({
  id: Number,
  type: { type: String, enum: ['HOUSE', 'APARTMENTS'] },
  title: String,
  images: Array,
  agent: Object,
  agencyReference: String,
  availableFrom: String,
  adress: String,
  country: String,
  coords: String,
  floor: Number,
  square: Number,
  livingSq: Number,
  rooms: Number,
  area: Number,
  desc: String,
  price: Number,
  currency: String,
  created: String,
  modified: String,
  link: String,
  source: String,
})

module.exports = mongoose.model('homeCollection', homes)
