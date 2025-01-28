const express = require('express');
const usuariosEquiposController = require('../controllers/usuariosEquipos');

const api = express.Router();

api.post('/usuarios-equipos', usuariosEquiposController.crearUsuariosEquipos);
api.patch('/usuarios-equipos/:id', usuariosEquiposController.modificarUsuariosEquipos);
api.delete('/usuarios-equipos/:id', usuariosEquiposController.borrarUsuariosEquipos);

module.exports = api;