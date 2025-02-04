const express = require("express");
const eventoController = require("../controllers/evento");
const md_auth = require("../middleware/authenticate");


const api = express.Router();

// Crear un evento
api.post("/nuevoevento/:id_club", [md_auth.asureAuth], eventoController.crearEvento);
api.patch("/updateevento/:id", [md_auth.asureAuth], eventoController.modificarEvento);
api.get("/evento/:id", [md_auth.asureAuth], eventoController.obtenerEventoPorId);
api.get("/:id_club/eventos", [md_auth.asureAuth], eventoController.obtenerEventos);
api.delete("/deleteevento/:id", [md_auth.asureAuth], eventoController.deleteEvento);

module.exports = api;