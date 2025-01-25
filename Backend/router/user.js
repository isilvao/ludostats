const express = require('express')
const multiparty = require('connect-multiparty')
const userController = require('../controllers/user')
const md_auth = require('../middleware/authenticate')
const md_clubOwn = require('../middleware/clubValidations')
const md_user = require('../middleware/userValidation')

const api = express.Router()
const md_upload = multiparty({uploadDir: './uploads/usersFoto'})

// Personal Routes
api.get('/user/me', [md_auth.asureAuth],userController.getMe)
api.patch('/user/updateMe', [md_auth.asureAuth, md_upload], userController.updateMe)

// General Routes
api.get('/users', [md_auth.asureAuth], userController.getUsers)
api.post('/user', [md_auth.asureAuth, md_upload], userController.createUser)
api.patch('/user/:id', [md_auth.asureAuth, md_upload], userController.updateUser)
api.delete('/user/:id', [md_auth.asureAuth], userController.deleteUser)

// Club Routes
api.get('/:id_club/users', [md_auth.asureAuth, md_clubOwn.validateAdmin, md_clubOwn.validateAdminClubOwnership], userController.getUsersByClub)
api.post('/joinClub/:id_club', [md_auth.asureAuth], userController.userJoinsClub)

//Acudiente
api.get('/acudiente', [md_auth.asureAuth, md_user.validateChildOrFamily], userController.getMyAcudiente)
api.get('/children', [md_auth.asureAuth, md_user.validateChildOrFamily], userController.getMyChildren)

module.exports = api