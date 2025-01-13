const express = require('express')
const userController = require('../controllers/user')
const md_auth = require('../middleware/authenticate')

const api = express.Router()

api.get('/user/me', [md_auth.asureAuth],userController.getMe)
api.get('/users', [md_auth.asureAuth], userController.getUsers)

module.exports = api