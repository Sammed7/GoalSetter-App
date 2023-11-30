const express = require('express')
const router = express.Router()

const {getGoals, setGoal, updateGoal, deleteGoal} = require('../Cotroller/goalConreoller')
const {protect, isLoggedIn} = require('../middleware/authMiddleware')

router.route('/').get(isLoggedIn, getGoals).post(isLoggedIn, setGoal)
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal)



module.exports = router