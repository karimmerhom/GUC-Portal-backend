const express = require('express')
const cors = require('cors')
const passport = require('passport')
const allRoutes = require('express-list-endpoints')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

const { populate_admins } = require('./config/populateAdmins')
const { populate_users } = require('./config/populateUser')

const app = express()

const account = require('./api/routers/account.router')
const booking = require('./api/routers/booking.router')
const room = require('./api/routers/room.router')
const pricing = require('./api/routers/pricing.router')

// import db configuration
const sequelize = require('./config/DBConfig')

app.use(
  fileUpload({
    createParentPath: true,
  })
)
// add other middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// init middleware
app.use(passport.initialize())

// test postgres connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to postgres')
  })
  .catch((err) => {
    console.error('Unable to connect to postgres', err)
  })

const explore = (req, res) => {
  const routes = allRoutes(app)
  const result = {
    ServiceList: [],
  }
  routes.forEach((route) => {
    const name = route.path.split('/')[5]
    result.ServiceList.push({
      Service: {
        name,
        fullUrl: `${route.path}`,
      },
    })
  })
  return res.json(result)
}

app.use('/tbhapp/accounts', account)
app.use('/tbhapp/room', room)
app.use('/tbhapp/booking', booking)
app.use('/tbhapp/pricing', pricing)

app.use('/tbhapp/explore', explore)

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
  res.header('Access-Control-Allow-Origin', 'GET, POST, OPTIONS')
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
  .then(() => {
    if (eraseDatabaseOnSync) {
      populate_admins()
      populate_users()
    }
  })
  .catch((error) => console.log('Could not sync models with database', error))

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server up and running on ${port}`))
