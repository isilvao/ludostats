const express = require('express')
const tipoEstadisticasController = require('../controllers/tipoEstadistica')

const md_auth = require('../middleware/authenticate')
const md_clubs = require('../middleware/clubValidations')
const md_stats = require('../middleware/statsValidation')

const api = express.Router()

api.get('/tipoestadistica/club/:id_club', [md_auth.asureAuth, md_clubs.validateAdminOrGerenteOrCoachInClub], tipoEstadisticasController.getTipoEstadisticas) // id del club
api.post('/:id_club/newtipoestadistica', [md_auth.asureAuth,md_clubs.validateCoachOrGerenteInClub], tipoEstadisticasController.createTipoEstadistica) // id del club
api.patch('/:id_club/updatetipoestadistica/:id_tipoestadistica', [md_auth.asureAuth,md_clubs.validateCoachOrGerenteInClub, md_stats.validateStatTypeOnClub], tipoEstadisticasController.updateTipoEstadistica) // id del club y del tipo de estadistica
api.delete('/:id_club/deletetipoestadistica/:id_tipoestadistica', tipoEstadisticasController.deleteTipoEstadistica) // id del club y del tipo de estadistica
api.get('/tipoestadistica/equipo/:id_equipo', [md_auth.asureAuth], tipoEstadisticasController.getTypeStadisticByTeam) // id del tipo de estadistica

module.exports = api