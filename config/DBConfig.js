//Import the mongoose module
const { default: Axios } = require('axios')
const mongoose = require('mongoose')
const { mongoURI } = require('./keys')
const { populateAccounts } = require('../config/populate')

const connectDB = async () => {
  const uri = mongoURI
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('MongoDB Connected…')
      //populateAccounts()
      console.log('MongoDB populated...')
    })
    .catch((err) => console.log(err))
}

module.exports = { connectDB }
