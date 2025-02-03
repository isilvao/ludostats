const express = require('express')
const estadisticasController = require('../controllers/estadistica')
const md_auth = require('../middleware/authenticate')
const md_stats = require('../middleware/statsValidation')

const api = express.Router()

api.get('/misestadisticas', [md_auth.asureAuth, md_stats.validateDeportista], estadisticasController.getMyEstadisticas) // id del usuario
api.post('/:id_tipoEstadistica/:id_usuario', [md_auth.asureAuth, md_stats.validateAuthorizedUser], estadisticasController.createEstadistica) // id del usuario
api.patch('editarestadistica/:id_estadistica', [md_auth.asureAuth, md_stats.validateAuthorizedUser], estadisticasController.updateEstadistica) // id del usuario
api.delete('eliminarestadistica/:id_estadistica', [md_auth.asureAuth, md_stats.validateAuthorizedUser], estadisticasController.deleteEstadistica) // id del usuario


module.exports = api