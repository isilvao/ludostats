const express = require('express')
const multiparty = require('connect-multiparty')
const clubController = require('../controllers/club')
const md_auth = require('../middleware/authenticate')
const md_clubOwn = require('../middleware/clubValidations')
const upload = require("../middleware/upload");

const api = express.Router()
const md_upload = multiparty({uploadDir: './uploads/clubLogo'})


api.get('/myclubs', [md_auth.asureAuth, md_clubOwn.validateAdmin], clubController.getClubs) // id del gerente
api.get('/misclubes', [md_auth.asureAuth], clubController.buscarMisClubes) // id de cualquier usuario



api.post('/newclub', [md_auth.asureAuth, md_upload, md_clubOwn.validateGerente], clubController.createClub) // id del gerente
api.patch('/updateclub/:id_club', [md_auth.asureAuth, md_upload, md_clubOwn.validateGerente, md_clubOwn.validateClubOwnership], clubController.updateClub) // id del club
api.delete('/deleteclub/:id_club', [md_auth.asureAuth, md_clubOwn.validateGerente, md_clubOwn.validateClubOwnership], clubController.deleteClub) // id del club y del gerente

// Ruta para encontrar un club por su ID
api.get('/club/:id', clubController.encontrarClubPorId);

// Ruta para encontrar un club por la ID de un equipo
api.get('/club/equipo/:id', clubController.encontrarClubPorEquipoId);




api.patch("/club_logo/:id", upload.single("logo"), clubController.actualizarClub);

module.exports = api;

module.exports = api
