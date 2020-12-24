const errorCodes = require('../api/constants/errorCodes')
const accoundtsModel = require('../models/account.model')
const coursesModel = require('../models/courses.model')
const bcrypt = require('bcryptjs')
const facultysModel = require('../models/faculty.model')

const populateAccounts = async () => {
  const saltKey = bcrypt.genSaltSync(10)
  let password = 'Pass123'
  let hashed_pass = bcrypt.hashSync(password, saltKey)

  await accoundtsModel.create({
    academicId: 'hr-1',
    firstName: 'Youssef',
    lastName: 'Fahmy',
    phoneNumber: '01215336634',
    type: 'HR',
    email: 'youssef@gmail.com',
    daysOff: 'saturday',
    gender: 'male',
    salary: 1000,
    office: 'c7-204',
    department: 'MET',
    password: hashed_pass,
  })

  await accoundtsModel.create({
    academicId: 'ac-4',
    firstName: 'Heba',
    lastName: 'ElMougy',
    phoneNumber: '01215336635',
    type: 'academic member',
    memberType: 'course coordinator',
    email: 'heba@gmail.com',
    daysOff: 'saturday',
    gender: 'male',
    salary: 1000,
    office: 'c7-204',
    department: 'MET',
    password: hashed_pass,
  })

  await accoundtsModel.create({
    academicId: 'ac-1',
    firstName: 'mervat',
    lastName: 'aboelkheer',
    phoneNumber: '01231336634',
    type: 'academic member',
    memberType: 'course instructor',
    email: 'mervat@hotmail.com',
    daysOff: 'saturday',
    gender: 'male',
    salary: 1000,
    office: 'c7-204',
    department: 'MET',
    password: hashed_pass,
  })

  await accoundtsModel.create({
    academicId: 'ac-2',
    firstName: 'mohamed',
    lastName: 'ashry',
    phoneNumber: '01231336635',
    type: 'academic member',
    memberType: 'academic member',
    email: 'fady@hotmail.com',
    daysOff: 'saturday',
    gender: 'male',
    salary: 1000,
    office: 'c7-204',
    department: 'MET',
    password: hashed_pass,
  })

  await accoundtsModel.create({
    academicId: 'ac-5',
    firstName: 'nourhan',
    lastName: 'mahmoud',
    phoneNumber: '01231336635',
    type: 'academic member',
    memberType: 'academic member',
    email: 'nourhan@hotmail.com',
    daysOff: 'saturday',
    gender: 'male',
    salary: 1000,
    office: 'c7-204',
    department: 'MET',
    password: hashed_pass,
  })

  await accoundtsModel.create({
    academicId: 'ac-3',
    firstName: 'slim',
    lastName: 'abdelnaher',
    phoneNumber: '01231236635',
    type: 'academic member',
    memberType: 'head of department',
    email: 'fady@hotmail.com',
    daysOff: 'saturday',
    gender: 'male',
    salary: 1000,
    office: 'c7-204',
    department: 'MET',
    password: hashed_pass,
  })

  return { code: errorCodes.success }
}
const populateFac = async () => {
  await facultysModel.create({ name: 'Engineering' })
  await facultysModel.create({ name: 'Pharmacy' })
}

const populateDep = async () => {
  await facultysModel.create({ name: 'Engineering', faculty: 'DMET' })
  await facultysModel.create({ name: 'Pharmacy', faculty: 'MET' })
}

const populateCourses = async () => {
  await coursesModel.create({
    courseId: 'dmet504',
    courseName: 'graphics',
    creditHours: 4,
    department: 'DMET',
  })
  await coursesModel.create({
    courseId: 'csen701',
    courseName: 'embedded',
    creditHours: 4,
    department: 'MET',
  })
  await coursesModel.create({
    courseId: 'csen702',
    courseName: 'microprocessors',
    creditHours: 4,
    department: 'MET',
  })
  await coursesModel.create({
    courseId: 'csen704',
    courseName: 'advanced lab',
    creditHours: 4,
    department: 'MET',
  })
}

module.exports = { populateAccounts }
