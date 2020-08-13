const extremePackage = require('../../models/extremePackage.model')
const regularPackage = require('../../models/regularPackage.model')
const purchasedPackage = require('../../models/purchasedPackages.model')
const { packageStatus, packageType } = require('../constants/TBH.enum')
const errorCodes = require('../constants/errorCodes')
const { deductPoints, addPoints } = require('../helpers/helpers')

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

const createPackage = async (req, res) => {
  try {
    const body = req.body
    const name = req.body.packageName
    const Type = req.body.packageType

    delete body.packageType
<<<<<<< HEAD
    if (Type === 'regular') {
      delete body.packageType
      const found = await regularPackage.findOne({
        where: {
          packageName: name,
        },
=======
    if (Type === packageType.REGULAR) {
      
      delete body.packageType
      const found = await regularPackage.findOne({where: {
        packageName: name
      }},)
 
      if(!found)
      {
      await regularPackage.create(body)
      return res.json({
        code: errorCodes.success ,
>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0
      })

      if (!found) {
        await regularPackage.create(body)
        return res.json({
          code: 7000,
        })
      }
    }
<<<<<<< HEAD
    if (Type === 'extreme') {
      delete body.packageType
      const found = await extremePackage.findOne({
        where: {
          packageName: name,
        },
=======
    
    }
    if (Type === packageType.EXTREME) {
      delete body.packageType
      const found = await extremePackage.findOne({where: {
        packageName: name,
      }},)
      if(!found)
      {
      await extremePackage.create(body)
      return res.json({
        code: errorCodes.success ,
>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0
      })
      if (!found) {
        await extremePackage.create(body)
        return res.json({
          code: 7000,
        })
      }
    }
<<<<<<< HEAD
    return res.json({ code: 7006, error: 'name already exists' })
=======
  }
  return res.json({ code: errorCodes.nameExists , error: "name already exists" })
>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const editPackage = async (req, res) => {
  try {
    const body = req.body
    const id = req.body.id
    delete body.id
    const Type = req.body.packageType
    if (Type === packageType.REGULAR ) {
      delete body.packageType
      await regularPackage.update(body, {
        where: {
          id: id,
        },
      })

      return res.json({
        code: errorCodes.success,
      })
    }
    if (Type === packageType.EXTREME ) {
      delete body.packageType
      await extremePackage.update(body, {
        where: {
          id: id,
        },
      })

      return res.json({
        code: errorCodes.success,
      })
    }
    return res.json({ code: errorCodes.invalidId , error: "id does not exist" })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const purchasePackage = async (req, res) => {
  try {
    const Type = req.body.packageType
    const Id = req.body.packageId
    const accountId = req.body.Account.id
    const r = await addPoints(accountId, Type, Id)
    return res.json(r)
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const cancelPackage = async (req, res) => {
  try {
    const body = req.body
    const bodyId = req.body.Id
    body.status = packageStatus.CANCELED
    await purchasedPackage.update(body, { where: { id: purchased.id } })
    return res.json({
      code: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const viewPackage = async (req, res) => {
  try {
    const body = req.body
    const id = req.body.id
    delete body.id
    const Type = req.body.packageType
    if (Type === packageType.REGULAR ) {
      delete body.packageType
      const packageFound = await regularPackage.findOne({
        where: {
          id: parseInt(id),
        },
      })
      if (packageFound) return res.json({ package: packageFound, code: errorCodes.success })
    }
    if (Type === packageType.EXTREME ) {
      const packageFound = await extremePackage.findOne({
        where: {
          id: parseInt(id),
        },
      })
      if (packageFound) return res.json({ package: packageFound, code:errorCodes.success })
    }
    return res.json({ statusCode: errorCodes.invalidPackage , error: 'package not found' })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const viewAllRegularPackages = async (req, res) => {
  try {
    const packagesFound1 = await regularPackage.findAll({})
    return res.json({ package: packagesFound1, code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const viewAllExtremePackages = async (req, res) => {
  try {
    const packagesFound2 = await extremePackage.findAll({})
    return res.json({ package: packagesFound2, code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const viewMyPackages = async (req, res) => {
  try {
    const purchasedPackages = await purchasedPackage.findAll({})
    return res.json({ purchasedPackages: purchasedPackages, code: 7000 })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const deletePackage = async (req, res) => {
  try {
    const body = req.body
    const id = req.body.id
    delete body.id
    const Type = req.body.packageType
<<<<<<< HEAD
    if (Type === 'regular') {
=======

    if (Type === packageType.REGULAR ) {
>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0
      delete body.packageType
      const packageFound = await regularPackage.findOne({
        where: {
          id: parseInt(id),
        },
      })
<<<<<<< HEAD
      if (packageFound) {
        packageFound.destroy()
        if (packageFound)
          return res.json({
            code: 7000,
          })
      }
    }
    if (Type === 'extreme') {
=======
      if(packageFound){
      packageFound.destroy()
      if(packageFound)
      return res.json({
        code: errorCodes.success,
      })
    }
  }
    if (Type === packageType.EXTREME ) {

>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0
      const packageFound = await extremePackage.findOne({
        where: {
          id: parseInt(id),
        },
      })
      if (packageFound) {
        packageFound.destroy()

        return res.json({
          code: errorCodes.success,
        })
      }
    }
<<<<<<< HEAD
    return res.json({ statusCode: 7001, error: 'package not found' })
  } catch (exception) {
    console.log(exception + '  jjjjjjjjj')
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
=======
    return res.json({ statusCode:errorCodes.invalidPackage , error: 'package not found' })

  } catch (exception) {
   
    return res.json({ code: errorCodes.unknown, error: "Something went wrong" })
>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0
  }
}

module.exports = {
  createPackage,
  purchasePackage,
  cancelPackage,
  createPackage,
  editPackage,
  viewPackage,
  viewMyPackages,
  deletePackage,
<<<<<<< HEAD
=======
  viewAllExtremePackages,
  viewAllRegularPackages
>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0
}
