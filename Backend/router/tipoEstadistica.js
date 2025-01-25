const express = require('express')
const tipoEstadisticasController = require('../controllers/tipoEstadistica')
const md_auth = require('../middleware/authenticate')
const md_tpEsta = require('../middleware/tipoEstadisticasValidations')

const api = express.Router()

api.get('/:id_club/tipoestadisticas', [md_auth.asureAuth,md_tpEsta.validateAuthorizedUser], tipoEstadisticasController.getTipoEstadisticas) // id del club
api.post('/:id_club/newtipoestadistica', [md_auth.asureAuth,md_tpEsta.validateAuthorizedUser], tipoEstadisticasController.createTipoEstadistica) // id del club
api.patch('/:id_club/updatetipoestadistica/:id_tipoestadistica', [md_auth.asureAuth,md_tpEsta.validateAuthorizedUser, md_tpEsta.validateStadisticForClub], tipoEstadisticasController.updateTipoEstadistica) // id del club y del tipo de estadistica
api.delete('/:id_club/deletetipoestadistica/:id_tipoestadistica', [md_auth.asureAuth,md_tpEsta.validateAuthorizedUser, md_tpEsta.validateStadisticForClub], tipoEstadisticasController.deleteTipoEstadistica) // id del club y del tipo de estadistica

module.exports = api