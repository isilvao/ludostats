const express = require('express')
const estadisticasController = require('../controllers/estadistica')
const md_auth = require('../middleware/authenticate')
const md_stats = require('../middleware/statsValidation')

const api = express.Router()

api.get('/misestadisticas', [md_auth.asureAuth], estadisticasController.getMyEstadisticas) // id del usuario
api.post('/nuevaestadistica/:id_tipoestadistica/:id_usuario', [md_auth.asureAuth, md_stats.validateCoachOrGerenteByStatType, md_stats.validateUserInClubFromStatType], estadisticasController.createEstadistica) // id del usuario
api.patch('/editarestadistica/:id_estadistica', [md_auth.asureAuth, md_stats.validateCoachOrGerenteByStatType], estadisticasController.updateEstadistica) // id del usuario
api.delete('/eliminarestadistica/:id_estadistica', [md_auth.asureAuth, md_stats.validateCoachOrGerenteByStatType], estadisticasController.deleteEstadistica) // id del usuario
api.get('/estadisticas/:id_tipoestadistica', [md_auth.asureAuth, md_stats.validateCoachOrGerenteOrAdminByStatType], estadisticasController.getAllEstadisticas) // id del usuario
api.get('/estadisticas/:id_tipoestadistica/:id_team', [md_auth.asureAuth, md_stats.validateCoachOrGerenteOrAdminByStatType], estadisticasController.getAllEstadisticasInTeam) // id del usuario

module.exports = api