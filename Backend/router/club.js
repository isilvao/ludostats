const express = require('express')
const multiparty = require('connect-multiparty')
const clubController = require('../controllers/club')
const md_auth = require('../middleware/authenticate')
const md_club = require('../middleware/clubValidations')
const upload = require("../middleware/upload");

const api = express.Router()
const md_upload = multiparty({ uploadDir: './uploads/clubLogo' })


api.get('/misclubes', clubController.buscarMisClubes) // id de cualquier usuario
api.get('/misclubesgerente/:user_id', clubController.buscarMisClubesGerente) // id de un gerente


api.post("/newclub", [md_auth.asureAuth, upload.single("logo")], clubController.createClub);
//api.patch('/updateclub/:id_club', [md_auth.asureAuth, md_upload, md_club.validateGerenteInClub], clubController.updateClub) // id del club
api.patch('/updateclub/:id_club', clubController.actualizarClub) // id del club

api.delete('/deleteclub/:id_club', [md_auth.asureAuth, md_club.validateGerenteInClub], clubController.deleteClub) // id del club y del gerente

// Ruta para encontrar un club por su ID
api.get('/club/:id', clubController.encontrarClubPorId);

// Ruta para encontrar un club por la ID de un equipo
api.get('/club/equipo/:id', clubController.encontrarClubPorEquipoId);

//api.patch("/club_logo/:id", upload.single("logo"), clubController.actualizarClub);
api.patch("/club_logo/:id", upload.single("logo"), clubController.actualizarClubLogo);

api.get('/club/users/:id_club', clubController.getUsersByClub);

module.exports = api;
