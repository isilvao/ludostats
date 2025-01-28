const express = require('express');
const usuariosEquiposController = require('../controllers/usuariosEquipos');

const api = express.Router();

api.post('/usuarios-equipos', usuariosEquiposController.crearUsuarioEquipo);
api.patch('/usuarios-equipos/:id', usuariosEquiposController.modificarUsuarioEquipo);
api.delete('/usuarios-equipos/:id', usuariosEquiposController.borrarUsuarioEquipo);

module.exports = api;