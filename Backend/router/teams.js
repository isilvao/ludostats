const express = require('express')
const diegoController = require('../controllers/teams')
const api = express.Router()


api.get('/club/:club_id/usuario/:usuario_id', diegoController.obtenerInfoClubYRol);

api.get('/equipo/:equipo_id/usuario/:usuario_id', diegoController.obtenerInfoEquipoYRol);

module.exports = api