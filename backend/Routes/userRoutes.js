const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe, logoutUser } = require('../Cotroller/userController')
const {protect, isLoggedIn} = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.post('/logout', isLoggedIn, logoutUser)
router.get('/me', isLoggedIn, getMe)
// router.get('/', getAllUsers)

module.exports = router