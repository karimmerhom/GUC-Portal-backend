const Sequelize = require('sequelize')
const keys = require('./keys')

// Connecting to local database
// const sequelize = new Sequelize('TBH', 'postgres', 'postgres', {
//   host: 'localhost',
//   dialect: 'postgres',
// })
// Connecting to online database
const sequelize = new Sequelize(keys.postgresURI)

module.exports = sequelize
    