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

api.patch('/user2/:id', userController.updatePassword)

api.delete('/user/:id', [md_auth.asureAuth], userController.deleteUser)
api.get('/user/email', userController.getUserByEmail);

// Ruta para crear una invitación (requiere autenticación)
api.post('/invitaciones', userController.generarInvitacion);

// Ruta para verificar una invitación por ID
api.get('/invitaciones/:id', userController.verificarInvitacion);

// Ruta para marcar una invitación como usada
api.patch('/invitaciones/:id/usar',  userController.marcarInvitacionUsada);

// Ruta para eliminar una invitación
api.delete('/invitaciones/:id', userController.eliminarInvitacion);

module.exports = api