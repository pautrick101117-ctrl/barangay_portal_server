const express = require('express')
const router = express.Router()
const { register, login } = require('../controller/controller.js')

// Correct routing
router.post('/register', register)
router.post('/login', login)

module.exports = router
