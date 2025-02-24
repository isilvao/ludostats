const express = require('express')
const estadisticasController = require('../controllers/estadistica')
const md_auth = require('../middleware/authenticate')
const md_stats = require('../middleware/statsValidation')

const api = express.Router()

api.get('/misestadisticas/:id_team/:id_user', estadisticasController.getMyEstadisticas) // id del usuario
/**
api.post('/nuevaestadistica/:id_tipoestadistica/:id_usuario', [md_auth.asureAuth, md_stats.validateCoachOrGerenteByStatType, md_stats.validateUserInClubFromStatType], estadisticasController.createEstadistica) // id del usuario
api.patch('/editarestadistica/:id_estadistica', [md_auth.asureAuth, md_stats.validateCoachOrGerenteByStatType], estadisticasController.updateEstadistica) // id del usuario
api.delete('/eliminarestadistica/:id_estadistica', [md_auth.asureAuth, md_stats.validateCoachOrGerenteByStatType], estadisticasController.deleteEstadistica) // id del usuario
 *
*/
api.post('/nuevaestadistica/:id_team/:id_tipoestadistica/:id_usuario', estadisticasController.createEstadistica) // id del usuario
api.patch('/editarestadistica/:id_estadistica', estadisticasController.updateEstadistica) // id del usuario
api.delete('/eliminarestadistica/:id_estadistica', estadisticasController.deleteEstadistica) // id del usuario
api.get('/estadisticas/:id_tipoestadistica', estadisticasController.getAllEstadisticas) // id del usuario
api.get('/estadisticas/:id_tipoestadistica/:id_team', estadisticasController.getAllEstadisticasInTeam) // id del usuario

api.get('/diagramaBarrasEstadisticaPorEquipo/:id_tipoestadistica/:id_team', estadisticasController.diagramaBarrasEstadisticaPorEquipo) // id del usuario
api.get('/diagramaBarrasEstadisticaPorClub/:id_tipoestadistica/', estadisticasController.diagramaBarrasEstadisticaPorClub) // id del usuario
api.get('/diagramaUsuariosPorEquipo/:id_team', estadisticasController.diagramaUsuariosDeEquipos) // id del usuario
api.get('/diagramaUsuariosPorClub/:id_club', estadisticasController.diagramaUsuariosDeClubes) // id del usuario

module.exports = api