const extremePackage = require("../../models/extremePackage.model")
const regularPackage = require("../../models/regularPackage.model")
const purchasedPackage = require("../../models/purchasedPackages.model")
const { packageStatus } = require("../constants/TBH.enum")
const errorCodes = require("../constants/errorCodes")
const extremePackage = require("../../models/extremePackage.model")
const regularPackage = require("../../models/regularPackage.model")
const errorCodes = require("../constants/errorCodes")


const createPackage = async (req, res) => {
  try {
    const body = req.body
    const Type = req.body.packageType
    if (Type === "regular") {
      delete body.packageType
      await regularPackage.create(body)
      return res.json({
        code: 7000,
      })
    }
    if (Type === "extreme") {
      delete body.packageType
      await extremePackage.create(body)
      return res.json({
        code: 7000,
      })
    }
  } catch (exception) {
    console.log(exception + "  jjjjjjjjj")
    return res.json({ code: errorCodes.unknown, error: "Something went wrong" })
  }
}

const editPackage = async (req, res) => {
  try {
    const body = req.body
    const id = req.body.id
    delete body.id
    const Type = req.body.packageType
    if (Type === "regular") {
      delete body.packageType
      await regularPackage.update(body, {
        where: {
          id: id,
        },
      })

      return res.json({
        code: 7000,
      })
    }
    if (Type === "extreme") {
      delete body.packageType
      await extremePackage.update(body, {
        where: {
          id: id,
        },
      })

      return res.json({
        code: 7000,
      })
    }
  } catch (exception) {
    console.log(exception + "  jjjjjjjjj")
    return res.json({ code: errorCodes.unknown, error: "Something went wrong" })
  }
}

const purchasePackage = async (req, res) => {
  try {
    const body = req.body
    const Type = req.body.packageType
    const Id = req.body.packageId
    
    if (Type === "regular") {
      const packageBody = await regularPackage.findByPk(Id)
      body.totalPoints = packageBody.points
      body.usedPoints = 0
      body.purchaseDate = Date.now()
      body.status = packageStatus.PENDING
      delete body.packageType
     
      // await purchasedPackage.create(body)
      return res.json({
        code: success,
      })
    }
    if (Type === "extreme") {
    
      const packageBody = await regularPackage.findByPk(Id)
      body.purchaseDate = Date.now()
      body.status = packageStatus.PENDING
      delete body.packageType
      await purchasedPackage.create(body)
      return res.json({
        code: success,
      })
    }
    else {
     
      return res.json({ code: errorCodes.unknown, error: "Something went wrong" })
    }
  } catch (exception) {
        console.log(exception);
        return res.json({ code: errorCodes.unknown, error: "Something went wrong" })
  }}

const viewPackage = async (req, res) => {
  try {
    const body = req.body
    const id = req.body.id
    delete body.id
    const Type = req.body.packageType
    if (Type === "regular") {
      delete body.packageType
      const packageFound = await regularPackage.findOne({
        where: {
          id: parseInt(id),
        },
      })
      if(packageFound)
      return res.json({package: packageFound,
        code: 7000,
      })
    }
    if (Type === "extreme") {

      const packageFound = await extremePackage.findOne({
          where: {
            id: parseInt(id),
          },
        })
        if(packageFound)
        return res.json({package: packageFound,
          code: 7000,
        })
    }
    return res.json({ statusCode: 7001, error: 'package not found' })

  } catch (exception) {
    console.log(exception + "  jjjjjjjjj")
    return res.json({ code: errorCodes.unknown, error: "Something went wrong" })
  }
}

const viewAllPackages = async (req, res) => {
  try {
    const packagesFound1 = await regularPackage.findAll({})
    const packagesFound2 = await extremePackage.findAll({})
    const packagesFound = packagesFound1.concat(packagesFound2);
    return res.json({package: packagesFound,
          code: 7000,
        })
  } catch (exception) {
    console.log(exception + "  jjjjjjjjj")
    return res.json({ code: errorCodes.unknown, error: "Something went wrong" })
  }
}

module.exports = {
  createPackage,
  purchasePackage,

  createPackage,
  editPackage,
  viewPackage,
  viewAllPackages
}
