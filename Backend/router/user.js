const express = require('express')
const multiparty = require('connect-multiparty')
const userController = require('../controllers/user')
const md_auth = require('../middleware/authenticate')

const api = express.Router()
const md_upload = multiparty({uploadDir: './uploads/usersFoto'})


api.get('/user/me', [md_auth.asureAuth],userController.getMe)
api.get('/users', [md_auth.asureAuth], userController.getUsers)
api.post('/user', [md_auth.asureAuth, md_upload], userController.createUser)
api.patch('/user/:id', [md_auth.asureAuth, md_upload], userController.updateUser)
api.delete('/user/:id', [md_auth.asureAuth], userController.deleteUser)
api.get('/user/email', userController.getUserByEmail);

//api.get('/user/:correo', [md_auth.asureAuth], userController.getUserByEmail)

module.exports = api