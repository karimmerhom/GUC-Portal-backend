const purchasedPackage = require('../../models/purchasedPackages.model')
const extremePackage = require('../../models/extremePackage.model')
const regularPackage = require('../../models/regularPackage.model')
const errorCodes = require('../constants/errorCodes')
const { packageStatus } = require('../constants/TBH.enum')

const generateOTP = async () => {
  let text = ''
  const possible = 'abcdefghijkmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 8; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const deductPoints = async (accountId , points) => {
  const purchase = await purchasedPackage.findAll({where : {accountId : accountId}})
  if(!purchase){
    return ({error:"account did not purchase any packages"})
  }
  const activePackages = purchase.filter(account => account.status === 'active' && account.packageType === 'regular')
  let total = 0
  for(package of activePackages){
    total += parseInt(package.totalPoints)
  }
  if(total<points){
    return ({error : "not enough points to be deducted"})
  }
  activePackages.sort(function(a, b) {
    var dateA = new Date(a.expiryDate), dateB = new Date(b.expiryDate);
    return dateA - dateB;
});
  for(package of activePackages){
    const availablePoints = parseInt(package.totalPoints) - parseInt(package.usedPoints)
    if(availablePoints>points){
      console.log(availablePoints + "  " + points);
      purchasedPackage.update({usedPoints: parseInt(package.usedPoints) + parseInt(points)},{where :{ id : package.id}})

      break
    }
    purchasedPackage.update({usedPoints: parseInt(package.totalPoints) },{where :{ id : package.id}})
    purchasedPackage.update({status: "expired" },{where :{ id : package.id}})

    points -= availablePoints
  }
  return ({error:"success"})





}

const refund = async (accountId , points) => {
  const purchase = await purchasedPackage.findAll({where : {accountId : accountId}})
  if(!purchase){
    return ({error:"account did not purchase any packages"})
  }
  const activePackages = purchase.filter(account => account.status === 'active' && account.packageType === 'regular')
  let total = 0
  for(package of activePackages){
    total += parseInt(package.totalPoints)
  }
  if(total<points){
    return ({error : "not enough points to be deducted"})
  }
  activePackages.sort(function(a, b) {
    var dateA = new Date(a.expiryDate), dateB = new Date(b.expiryDate);
    return dateA - dateB;
});
  for(package of activePackages){
    const availablePoints = parseInt(package.totalPoints) - parseInt(package.usedPoints)
    if(availablePoints>points){
      console.log(availablePoints + "  " + points);
      purchasedPackage.update({usedPoints: parseInt(package.usedPoints) + parseInt(points)},{where :{ id : package.id}})
      // package.usedPoints = parseInt(package.usedPoints) + parseInt(points)
      break
    }
    purchasedPackage.update({usedPoints: parseInt(package.totalPoints) , status : "expired" },{where :{ id : package.id}})

    // package.usedPoints = parseInt(package.totalPoints)
    points -= availablePoints
  }
  return ({error:"success"})

}

const addPoints = async (accountId , packageType , packageId) => {
  try{
    const body = {}
    body.packageType = packageType
    body.accountId = accountId
    body.packageId = packageId
    if (body.packageType === 'regular') {
      const packageBody = await regularPackage.findByPk(packageId)
      body.totalPoints = packageBody.points
      body.usedPoints = 0
      body.purchaseDate = new Date()
      body.expiryDate = body.purchaseDate.addDays(packageBody.expiryDuration)
      body.status = packageStatus.PENDING

      await purchasedPackage.create(body)
      return ({
        code: errorCodes.success,
      })
    }
    if (Type === 'extreme') {
      const packageBody = await extremePackage.findByPk(Id)
      body.purchaseDate = new Date()
      body.expiryDate = body.purchaseDate.addDays(packageBody.expiryDuration)
      body.status = packageStatus.PENDING
      await purchasedPackage.create(body)
      return ({
        code: errorCodes.success,
      })
    }

    return ({
      code: errorCodes.unknown,
      error: 'Package Type not found',
    })
  } catch (exception) {
    console.log(exception)
    return ({ code: errorCodes.unknown, error: 'Something went wrong' })
  }

}

module.exports = {
  generateOTP,
  deductPoints,
  addPoints, 
}
