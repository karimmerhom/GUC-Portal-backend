const express = require('express')
const cors = require('cors')
const allRoutes = require('express-list-endpoints')
const bodyParser = require('body-parser')

const app = express()

const courses = require('./api/routers/courses.router')
const departments = require('./api/routers/departments.router')
const faculties = require('./api/routers/faculties.router')
const locations = require('./api/routers/locations.router')
const account = require('./api/routers/account.router')
const leaves = require('./api/routers/leaves.router')
const slots = require('./api/routers/slots.router')
const hodFunctionalities = require('./api/routers/hodFunctionalities.router')
const courseInstructorFunctionalities = require('./api/routers/courseInstructorFunctionalities.router')
const slotLinking = require('./api/routers/slotLinking.router')
const attendance = require('./api/routers/attendace.router')
const replacementsRequests = require('./api/routers/replacementsRequests.router')
const changeDayOff = require('./api/routers/changeDayOff.router')

const { connectDB } = require('./config/dbConfig')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
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
app.use('/changeDayOff', changeDayOff)
app.use('/slots', slots)
app.use('/courses', courses)
app.use('/departments', departments)
app.use('/faculties', faculties)
app.use('/locations', locations)
app.use('/account', account)
app.use('/hodFunctionalities', hodFunctionalities)
app.use('/courseInstructorFunctionalities', courseInstructorFunctionalities)
app.use('/slotLinking', slotLinking)
app.use('/attendance', attendance)
app.use('/leaves', leaves)
app.use('/hodFunctionalities', hodFunctionalities)
app.use('/replacementsRequests', replacementsRequests)
app.use('/explore', explore)
app.get('/hello', (req, res) => {
  console.log('hello world')
  return res.json({ msg: 'hello' })
})
app.use((req, res) => {
  res.status(404).send({ err: 'No such url' })
})
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
connectDB()
const port = 3000
app.listen(port, () => console.log(`Server up and running on ${port}`))
