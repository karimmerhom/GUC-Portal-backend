const errorCodes = require('../api/constants/errorCodes')
const accoundtsModel = require('../models/account.model')
const coursesModel = require('../models/courses.model')

const populateAccounts = async () => {
  const saltKey = bcrypt.genSaltSync(10)
  let password = 'Youssef123'
  let hashed_pass = bcrypt.hashSync(password, saltKey)
  await accoundtsModel.create({
    firstName: 'Youssef',
    lastName: 'Fahmy',
    phoneNumber: '01215336634',
    type: 'HR',
    email: 'youssef@hotmail.com',
    daysOff: 'saturday',
    gender: 'male',
    salary: 1000,
    office: 'c7-204',
    department: 'MET',
    password: hashed_pass,
  })

  await accoundtsModel.create({
    firstName: 'Shadi',
    lastName: 'Nakhla',
    phoneNumber: '01215336635',
    type: 'Academic Member',
    memberType: 'Course coordinator',
    email: 'shadi@hotmail.com',
    daysOff: 'saturday',
    gender: 'male',
    salary: 1000,
    office: 'c7-204',
    department: 'MET',
    password: hashed_pass,
  })

  await accoundtsModel.create({
    firstName: 'karim',
    lastName: 'ebrahim',
    phoneNumber: '01231336634',
    type: 'Academic Member',
    memberType: 'Course instructor',
    email: 'karim@hotmail.com',
    daysOff: 'saturday',
    gender: 'male',
    salary: 1000,
    office: 'c7-204',
    department: 'MET',
    password: hashed_pass,
  })

  await accoundtsModel.create({
    firstName: 'fady',
    lastName: 'samir',
    phoneNumber: '01231336635',
    type: 'Academic Member',
    memberType: 'Academic member',
    email: 'fady@hotmail.com',
    daysOff: 'saturday',
    gender: 'male',
    salary: 1000,
    office: 'c7-204',
    department: 'MET',
    password: hashed_pass,
  })
  // await accoundtsModel.create({
  //   Account: {
  //     firstName: 'Shadi',
  //     lastName: 'Nakhla',
  //     phoneNumber: '01215336635',
  //     type: 'Academic Member',
  //     memberType: 'Course coordinator',
  //     email: 'shadi@hotmail.com',
  //     daysOff: 'saturday',
  //     gender: 'male',
  //     salary: 1000,
  //     office: 'c7-204',
  //     department: 'MET',
  //   },
  // })
  return { code: errorCodes.success }
}
const populateCourses = async () => {
  await coursesModel.create({
    courseId: 'csen702',
    courseName: 'microprocessors',
    creditHours: 4,
    department: 'MET',
  })
  await coursesModel.create({
    courseId: 'csen701',
    courseName: 'embedded',
    creditHours: 4,
    department: 'MET',
  })
}
module.exports = { populate }
