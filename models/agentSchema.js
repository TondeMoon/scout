const mongoose = require('mongoose')

const agents = mongoose.Schema({
  companyId: Number,
  companyName: String,
  fullName: String,
  gender: String,
  city: String,
  street: String,
  businessPhone: String,
  mobilePhone: String,
  logoImage: String,
  website: String,
})

module.exports = mongoose.model('agentCollection', agents)
