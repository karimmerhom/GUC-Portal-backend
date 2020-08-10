const extremePackage = require("../../models/extremePackage.model")
const regularPackage = require("../../models/regularPackage.model")
const purchasedPackage = require("../../models/purchasedPackages.model")
const { packageStatus } = require("../constants/TBH.enum")
const errorCodes = require("../constants/errorCodes")

const createPackage = async (req, res) => {
  try {
    const body = req.body
    const Type = req.body.packageType
    if (Type === "regular") {
      delete body.packageType
      await regularPackage.create(body)
      return res.json({
        code: success,
      })
    }
    if (Type === "extreme") {
      delete body.packageType
      await extremePackage.create(body)
      return res.json({
        code: success,
      })
    }
  } catch (exception) {
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
  }
}

module.exports = {
  createPackage,
  purchasePackage,

}
