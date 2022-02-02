const mongoose = require('mongoose')
const homes = require('./models/homeSchema')
const agents = require('./models/agentSchema')
const axios = require('axios')

//const res = require('./dev-data/immoScout')

let link = 'https://rest-api.immoscout24.ch/v4/en/properties?l=3827&s=1&t=2&inp=2'

mongoose
  .connect(
    'mongodb+srv://tondeMoon:T2bSJN7zck4qWy9@cluster0.k1gks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('mongo connected')
  })
  .catch((err) => {
    console.log('mongo not connected')
  })
;(async () => {
  const header = {
    'is24-meta-pagesize': 100,
  }

  let res = await axios.get(link, { headers: header })

  const coll = await agents.find()

  const dataStructured = await res.map((item) => ({
    id: item.id,
    type: item.propertyCategoryId === 1 ? 'APARTMENTS' : 'HOUSE',
    title: item.title,
    images: item.images.map((el) =>
      el.url.replace('{width}', 1024).replace('{height}', 768).replace('{resizemode}', 3).replace('{quality}', 90)
    ),
    agent: coll.filter((el) => el.companyId === item.companyId)[0],
    agencyReference: item.agency && item.reference ? item.agency.reference : '',
    availableFrom: item.availableFromFormatted,
    adress: item.street || '',
    country: `${item.cityName},${item.state}`,
    coords: `${item.latitude},${item.longitude}`,
    floor: item.attributesSize && index.attributesSize.floor ? index.attributesSize.floor : '',
    square: item.surfaceUsable || '',
    livingSq: item.surfaceLiving || '',
    rooms: item.numberOfRooms || '',
    area: item.surfaceProperty || '',
    desc: item.shortDescription,
    price: item.normalizedPrice || '',
    currency: item.priceUnitId === 2 ? 'CHF' : item.priceUnitId,
    created: item.lastPublished,
    modified: item.lastModified,
    link: `https://www.immoscout24.ch${item.propertyUrl}`,
    source: 'Immoscout24',
  }))

  const agentsBase = await res.map((item) => ({
    accountId: item.accountId,
    companyId: item.companyId,
    companyName: item?.agency?.companyName1 || '',
    fullName: `${item?.agency?.firstName || ''} ${item?.agency?.lastName || ''}`.trim(),
    gender: item?.agency?.gender || '',
    city: item?.agency?.companyCity || '',
    street: item?.agency?.companyStreet || '',
    businessPhone: item?.agency?.companyPhoneBusiness || '',
    mobilePhone: item?.agency?.companyPhoneMobile || '',
    logoImage: item?.agency?.logoUrl || '',
  }))

  const agentsNoDuplicate = agentsBase.filter((v, i, a) => a.findIndex((t) => t.accountId === v.accountId) === i)

  homes
    .insertMany(dataStructured)
    .then(() => {
      console.log('homes saved')
    })
    .catch((err) => {
      console.log('homes not saved', err)
    })

  agents
    .insertMany(agentsNoDuplicate)
    .then(() => {
      console.log('agents saved')
    })
    .catch((err) => {
      console.log('agents not saved', err)
    })
})()
