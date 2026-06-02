const express = require('express')
const { requireAuth } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const planner = require('../controllers/plannerController')

const router = express.Router()
router.use(requireAuth)

router.get('/savings-goals', planner.listSavingsGoals)
router.post('/savings-goals', planner.savingsValidations.create, validate, planner.createSavingsGoal)
router.patch('/savings-goals/:id', planner.savingsValidations.update, validate, planner.updateSavingsGoal)
router.delete('/savings-goals/:id', planner.savingsValidations.id, validate, planner.deleteSavingsGoal)

router.get('/recurring', planner.listRecurring)
router.post('/recurring', planner.recurringValidations.create, validate, planner.createRecurring)
router.patch('/recurring/:id', planner.recurringValidations.update, validate, planner.updateRecurring)
router.delete('/recurring/:id', planner.recurringValidations.id, validate, planner.deleteRecurring)

router.get('/bills', planner.listBills)
router.post('/bills', planner.billValidations.create, validate, planner.createBill)
router.patch('/bills/:id', planner.billValidations.update, validate, planner.updateBill)
router.delete('/bills/:id', planner.billValidations.id, validate, planner.deleteBill)

module.exports = router
