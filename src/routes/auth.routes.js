const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

router.post('/login', authController.login.bind(authController))
router.get('/logout', authController.logout.bind(authController))

module.exports = router
