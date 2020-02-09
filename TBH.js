const express = require('express')
const cors = require('cors')
const passport = require('passport')
const allRoutes = require('express-list-endpoints')

const app = express()

const account = require('./api/routers/account.router')
const booking = require('./api/routers/booking.router')
const package = require('./api/routers/package.router')

// import db configuration
const sequelize = require('./config/DBConfig')

// init middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(passport.initialize())

// test postgres connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to postgres')
  })
  .catch(err => {
    console.error('Unable to connect to postgres', err)
  })

const explore = (req, res) => {
  const routes = allRoutes(app)
  const result = {
    ServiceList: []
  }
  routes.forEach(route => {
    const name = route.path.split('/')[5]
    result.ServiceList.push({
      Service: {
        name,
        fullUrl: `${route.path}`
      }
    })
  })
  return res.json(result)
}

app.use('/api/accounts', account)
app.use('/api/bookings', booking)
app.use('/api/packages', package)
app.use('/explore', explore)

app.use((req, res) => {
  res.status(404).send({ err: 'No such url' })
})

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'))
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//   })
// }

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, X-Auth-Token, Accept'
  )
  next()
})

const eraseDatabaseOnSync = false
sequelize
  .sync({ force: eraseDatabaseOnSync })
  .then(() => console.log('Synced models with database'))
  .then(() => {})
  .catch(error => console.log('Could not sync models with database', error))

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server up and running on ${port}`))
