const express = require("express");
const eventoController = require("../controllers/evento");
const md_auth = require("../middleware/authenticate");
const md_club = require("../middleware/clubValidations");


const api = express.Router();

// Crear un evento
/**
api.get("/evento/:id", [md_auth.asureAuth], eventoController.obtenerEventoPorId);
api.get("/:id_club/eventos", [md_auth.asureAuth], eventoController.obtenerEventos);
api.post("/nuevoevento/:id_club", [md_auth.asureAuth, md_club.validateAdminOrGerenteInClub], eventoController.crearEvento);
api.patch("/updateevento/:id", [md_auth.asureAuth, md_club.validateAdminOrGerenteInClub], eventoController.modificarEvento);
api.delete("/deleteevento/:id", [md_auth.asureAuth, md_club.validateAdminOrGerenteInClub], eventoController.deleteEvento);
 *
 */
api.get("/evento/:id", eventoController.obtenerEventoPorId);
api.get("/eventos/:id_club", eventoController.obtenerEventos);
api.post("/nuevoevento/:id_club", eventoController.crearEvento);
api.patch("/updateevento/:id", eventoController.modificarEvento);
api.delete("/deleteevento/:id", eventoController.deleteEvento);

/////////////////////////////////////////
///////////EVENTO DEPENDENCIAS/////

// 📌 Crear evento con dependencias
api.post('/evento', eventoController.crearEventoConDependencias);

// 📌 Obtener eventos por club
api.get('/eventos/club/:club_id', eventoController.obtenerEventosPorClub);

// 📌 Obtener eventos por equipo
api.get('/eventos/equipo/:equipo_id', eventoController.obtenerEventosPorEquipo);


// 📌 Obtener eventos cercanos para un club (pasado y futuro)
api.get('/eventos/club/cercanos/:club_id', eventoController.obtenerEventosCercanosPorClub);

// 📌 Obtener eventos cercanos para un equipo (pasado y futuro)
api.get('/eventos/equipo/cercanos/:equipo_id', eventoController.obtenerEventosCercanosPorEquipo);


module.exports = api;